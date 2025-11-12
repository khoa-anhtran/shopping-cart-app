const jsonServer = require('json-server')
const path = require('node:path')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jose = require('jose')
const passport = require('passport')
const passportAzureAd = require('passport-azure-ad')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { nanoid } = require('nanoid');
const { error } = require('node:console');

const SECRET = 'dev_secret_change_me';
const JWT_REFRESH_SECRET = 'refresh_secret_change_me';
const ACCESS_TTL = '10s';
const REFRESH_TTL = '30d';

const API_AUDIENCE = "api://e695dd6d-99a5-49f8-92bf-6cf2558fbbb7";
const ISSUER_HOST = "https://login.microsoftonline.com/khoa88108gmail.onmicrosoft.com";

const authConfig = {
  credentials: {
    tenantID: "3b2316d2-2ac9-4a2a-9d81-5ede099d8bc2",
    clientID: "3641fc9d-2752-4e3e-9d1b-3e012410ed0a"
  },
  metadata: {
    authority: "login.microsoftonline.com",
    discovery: ".well-known/openid-configuration",
    version: "v2.0"
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: true,
    loggingLevel: "info",
    loggingNoPII: true,
  },
}

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.db = router.db

server.use(middlewares)
server.use(jsonServer.bodyParser);
server.use(cookieParser())

const bearerStrategy = new passportAzureAd.BearerStrategy({
  // Use COMMON + v2 metadata (not a fixed tenant)
  identityMetadata:
    'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',

  // Do NOT hard-code issuer for multi-tenant
  validateIssuer: false,              // or supply your own issuer validation fn
  issuer: undefined,                  // remove the fixed issuer

  clientID: authConfig.credentials.clientID, // your API app's Application (client) ID

  // Passport-AAD checks `aud` against clientID.
  // If your tokens target an App ID URI, ensure the SPA requests a scope that maps to this clientID.
  audience: authConfig.credentials.clientID,

  passReqToCallback: true,
  loggingLevel: 'warn',
  loggingNoPII: true,
}, (req, token, done) => {

  if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
    return done(new Error('Unauthorized'), null, "No delegated or app permission claims found");
  }

  const name =
    token.name ??
    (token.given_name && token.family_name ? `${token.given_name} ${token.family_name}` : undefined);
  const email =
    (Array.isArray(token.emails) ? token.emails[0] : undefined) ??
    token.email ??
    token.preferred_username;

  return done(null, { sub: token.sub, tid: token.tid, name, email }, token);
});


function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_TTL });
}

const signRefresh = (payload) => {
  // include a unique jti for rotation and revocation
  const jti = nanoid();
  const token = jwt.sign({ ...payload, jti }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
  return { token, jti };
};

function revokeRefreshToken(db, jti) {
  const rt = dbFind(db, 'refreshTokens', t => t.jti === jti);
  if (rt) rt.revoked = true;
  dbWrite(db);
}

async function verifyMsAccessTokenMiddleware(req, res, next) {
  passport.authenticate('oauth-bearer', {
    session: false
  }, (err, user, info) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }

    if (!user) {
      // If no user object found, send a 401 response.
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (info) {
      // access token payload will be available in req.authInfo downstream
      req.authInfo = info;
      return next();
    }
  });
}

async function verifyMsAccessToken(token, audience) {
  const { iss, tid, aud } = jose.decodeJwt(token)
  if (!iss || !tid) throw new Error("bad_token");

  // Pick metadata URL by version
  const metadataUrl = `https://login.microsoftonline.com/${tid}/.well-known/openid-configuration`

  // Fetch jwks_uri from metadata (Node 18+ has global fetch; otherwise install 'undici')
  const metadata = await (await fetch(metadataUrl)).json();
  const jwksUri = metadata.jwks_uri;

  const jwks = jose.createRemoteJWKSet(new URL(jwksUri));

  // IMPORTANT: issuer must equal the token's iss exactly
  const { payload } = await jose.jwtVerify(token, jwks, {
    issuer: iss,
    audience,            // e.g., "api://<API_CLIENT_ID>" for v2 or your App ID URI for v1
    algorithms: ["RS256"]
  });

  return payload;
}

async function authMiddleware(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return passport.authenticate('oauth-bearer', { session: false }, (err, user, info) => {
      if (err) return res.status(401).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "Unauthenticated" });
      req.user = user;          // you get { sub, tid, name, email }
      req.authInfo = info;      // full token claims if needed
      next();
    })(req, res, next);
  }
}

// --- Lowdb helpers (works for both v1 chain API and v3 .data API) ----
function dbGet(db, collection) {
  // v1: db.get('users'), v3: db.data.users
  return db.get ? db.get(collection) : db.data[collection];
}
function dbWrite(db) {
  return db.write ? db.write() : require('fs').writeFileSync('db.json', JSON.stringify(db.data, null, 2));
}
function dbFind(db, collection, predicate) {
  if (db.get) {
    return db.get(collection).find(predicate).value();
  }
  // v3 manual find
  return db.data[collection].find(predicate);
}
function dbPush(db, collection, value) {
  if (db.get) {
    return db.get(collection).push(value).write();
  }
  db.data[collection].push(value);
  return dbWrite(db);
}
function dbMaxId(db, collection) {
  const arr = db.get ? db.get(collection).value() : db.data[collection];
  if (!arr.length) return 0;
  return Math.max(...arr.map((x) => Number(x.id) || 0));
}

// custom routes
server.post('/auth/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const re = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

  if (!email.match(re))
    return res.status(400).json({ message: 'email is not valid' });

  const db = router.db;
  const existing = dbFind(db, 'users', (u) => u.email === email);
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const id = dbMaxId(db, 'users') + 1;
  const hashed = bcrypt.hashSync(password, 10);
  const user = { id, email, password: hashed };

  dbPush(db, 'users', user);
  dbPush(db, 'carts', { id, items: {} });

  const accessToken = signToken({ id, email });
  const { token: refreshToken, jti } = signRefresh({ id: user.id, email })

  dbPush(db, 'refreshTokens', { id: jti, jti, userId: user.id, revoked: false });

  // set HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,          // set true in HTTPS; for localhost you can set false while developing
    sameSite: 'lax',       // or 'strict'
    path: '/auth/refresh',      // cookie sent only to refresh endpoint
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.status(201).json({ accessToken, user: { id, email: user.email } });
});

server.post('/auth/signin', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

  const db = router.db;
  const user = dbFind(db, 'users', (u) => u.email === email);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Wrong password' });

  const accessToken = signToken({ id: user.id, email });
  const { token: refreshToken, jti } = signRefresh({ id: user.id, email })

  dbPush(db, 'refreshTokens', { id: jti, jti, userId: user.id, revoked: false });

  // set HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,          // set true in HTTPS; for localhost you can set false while developing
    sameSite: 'none',       // or 'strict' | 'lax'
    path: '/auth/refresh',      // cookie sent only to refresh endpoint
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.json({ accessToken, user: { id: user.id, email: user.email } });
});

server.post('/auth/refresh', (req, res) => {
  const db = router.db
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: 'Missing refresh token' });

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET); // {id, email, jti, iat, exp}
    const isRefreshValid = !dbFind(db, 'refreshTokens', t => t.jti === decoded.jti).revoked

    if (!isRefreshValid) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    revokeRefreshToken(db, decoded.jti);

    const accessToken = signToken({ id: decoded.id, email: decoded.email });

    const { token: newRefresh, jti } = signRefresh({ id: decoded.id, email: decoded.email });
    dbPush(db, 'refreshTokens', { id: jti, jti, userId: decoded.id, revoked: false });

    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.json({ accessToken, user: { id: decoded.id, email: decoded.email } });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// POST /logout -> revoke current refresh token and clear cookie
server.post('/auth/logout', (req, res) => {
  const db = router.db
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      revokeRefreshToken(db, decoded.jti);
    } catch { /* ignore */ }
  }
  res.clearCookie('refreshToken', { path: '/auth/refresh' });
  res.status(204).end();
});

server.get('/auth/me', authMiddleware, (req, res) => {
  const db = router.db
  const user = req.user

  const existing = dbFind(db, 'users', (u) => u.email === user.email);

  if (existing)
    return res.status(200).json({ userId: existing.id })
  else {
    const id = dbMaxId(db, 'users') + 1;
    const myUser = { id, email: user.email, password: "" };
    dbPush(db, 'users', myUser);
    dbPush(db, 'carts', { id, items: {} });

    return res.status(200).json({ userId: existing.id })
  }
})

server.use(cors({
  origin: ['http://localhost:4173', 'http://localhost:5173'], // no "*"
  credentials: true,                 // allow cookies/Authorization
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

server.use((req, res, next) => {
  const delay = 1000 + Math.random() * 1200; // 300–1500ms
  setTimeout(() => {
    // 10% chance to simulate network error:
    if (Math.random() < 0.1) return res.status(503).json({ message: "Temporary outage" });
    next();
  }, delay);
});

server.use(passport.initialize());

passport.use(bearerStrategy);

// auth routes
server.use('/api/carts', authMiddleware);

server.use('/api', router)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`[API] json-server 0.17 running at http://localhost:${PORT}`)
})

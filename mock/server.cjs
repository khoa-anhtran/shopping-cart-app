const jsonServer = require('json-server')
const path = require('node:path')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { nanoid } = require('nanoid');

const SECRET = 'dev_secret_change_me';
const JWT_REFRESH_SECRET = 'refresh_secret_change_me';
const ACCESS_TTL = '10m';
const REFRESH_TTL = '30d';

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.db = router.db

server.use(middlewares)
server.use(jsonServer.bodyParser);
server.use(cookieParser())

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

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid or expired token' });
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
    sameSite: 'lax',       // or 'strict'
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

// auth routes
server.use('/api/carts', authMiddleware);

server.use('/api', router)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`[API] json-server 0.17 running at http://localhost:${PORT}`)
})

import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { selectAuthRTStatus, selectAuthStatus } from './pages/auth/selectors'
import { accessTokenRefreshRequested, userLogoutRequested } from './pages/auth/actions'
import RequireGuest from './routes/RequireGuest'
import RequireAuth from './routes/RequireAuth'
import { ErrorBoundary } from 'react-error-boundary'
import SimpleErrorPage from './pages/layout/SimpleErrorPage'
import LoadingSpinner from './components/LoadingSpinner'
import { notify } from './utils/helpers'

const Products = lazy(() => import('./pages/products/Products'))
const Header = lazy(() => import('./pages/layout/Header'))
const Cart = lazy(() => import('./pages/cart/Cart'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup'
} as const

const ErrorFallback = ({ error }: { error: Error }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
  </div>
)

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const kicked = useRef(false);

  const status = useSelector(selectAuthStatus);
  const rts = useSelector(selectAuthRTStatus)


  // Kick off refresh exactly once when app starts idle
  useEffect(() => {
    if (status === "idle" && !kicked.current) {
      dispatch(accessTokenRefreshRequested());
      kicked.current = true;
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (rts === "expired") {
      notify({ status: "failed", error: "Your session is expired, please login again" })
      dispatch(userLogoutRequested())
      navigate(ROUTES.HOME)
    }
  }, [rts, dispatch, navigate])

  if (status === "loading")
    return <LoadingSpinner overlay size={'lg'} label='Loading'></LoadingSpinner>

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner overlay size={'lg'} label='Loading ...'></LoadingSpinner>}>
        <Routes>
          <Route element={<RequireGuest />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Register />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path={ROUTES.HOME} element={<Home />} />
          </Route>
          <Route
            path="*"
            element={
              <SimpleErrorPage
                status={404}
                title="Page not found"
                message="The page you're looking for doesn't exist."
                homeHref="/"
              />
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>

  )
}

function Home() {
  return <>
    <Header></Header>
    <Products />
    <Cart />
  </>
}


export default App

import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { lazy, Suspense, useCallback, useEffect, useEffectEvent, useRef, useTransition } from 'react'
import RequireGuest from './routes/RequireGuest'
import RequireAuth from './routes/RequireAuth'
import { ErrorBoundary } from 'react-error-boundary'
import SimpleErrorPage from './pages/layout/SimpleErrorPage'
import LoadingSpinner from './components/LoadingSpinner'
import { notify } from './utils/helpers'
import useUserInfo from './hooks/useUserInfo'
import { useSelector } from 'react-redux'
import { selectToken } from './pages/auth/selectors'
import { ROUTES } from './constants/routes'
import { STATUS } from './constants/api'
import Loading from './pages/layout/Loading'
import ErrorFallback from './pages/layout/ErrorFallback'

const Products = lazy(() => import('./pages/products/Products'))
const Header = lazy(() => import('./pages/layout/Header'))
const Cart = lazy(() => import('./pages/cart/Cart'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

function App() {
  const navigate = useNavigate()
  const kicked = useRef(false);
  const token = useSelector(selectToken)

  const [isLoading, startTransition] = useTransition()

  const { refreshAction, logOut } = useUserInfo()

  // useEffect(() => {
  //   if (!kicked.current) {
  //     console.log(token)
  //     if (!token) {
  //       logOut().then(() => {
  //         notify({ status: "failed", message: "Your session is expired, please login again" })
  //       })
  //     }
  //   }
  // }, [token])

  if (isLoading)
    return <LoadingSpinner overlay size={'lg'} label='Loading'></LoadingSpinner>

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner overlay size={'lg'} label='Loading'></LoadingSpinner>}>
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
      <Loading />
    </ErrorBoundary>

  )
}

function Home() {
  return <>
    <Header></Header>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Products />
    </ErrorBoundary>
    <Cart />
  </>
}


export default App

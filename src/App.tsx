import './App.css'
import { Outlet, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RequireGuest from './routes/RequireGuest'
import RequireAuth from './routes/RequireAuth'
import { ErrorBoundary } from 'react-error-boundary'
import SimpleErrorPage from './pages/layout/SimpleErrorPage'
import LoadingSpinner from './components/LoadingSpinner'
import { ROUTES } from './constants/routes'
import Loading from './pages/layout/Loading'
import ErrorFallback from './pages/layout/ErrorFallback'
import { useAppStart } from './hooks/useAppStart'
import CartProvider from './providers/CartProvider'

const Products = lazy(() => import('./pages/products/Products'))
const Header = lazy(() => import('./pages/layout/Header'))
const Cart = lazy(() => import('./pages/cart/Cart'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

function App() {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSpinner overlay size={'lg'} label='Loading'></LoadingSpinner>}>
        <Routes>
          <Route element={<StartAppBoot />}>
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
          </Route>
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
    <CartProvider>
      <Cart />
    </CartProvider>
  </>
}

const StartAppBoot = () => {
  useAppStart()

  return <Outlet />
}

export default App

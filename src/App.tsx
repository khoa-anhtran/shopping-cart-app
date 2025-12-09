import './App.css'
import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RequireGuest from './routes/RequireGuest'
import RequireAuth from './routes/RequireAuth'
import { ErrorBoundary } from 'react-error-boundary'
import SimpleErrorPage from './pages/error/SimpleErrorPage'
import { ROUTES } from './constants/routes'
import ErrorFallback from './pages/error/ErrorFallback'
import { Spin } from 'antd'
import { Loading } from './pages/loading'

const Products = lazy(() => import('./pages/products/Products'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Checkout = lazy(() => import('./pages/checkout'))
const ProductDetails = lazy(() => import('./pages/product-details'))
const StartAppBoot = lazy(() => import('./pages/home/StartAppBoot'))

const ProductLayout = lazy(() => import('./layout/ProductLayout'))
const CheckoutLayout = lazy(() => import('./layout/CheckoutLayout'))

function App() {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Spin spinning={true} fullscreen />}>
        <Routes>
          <Route element={<StartAppBoot />}>
            <Route element={<RequireGuest />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Register />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route element={<ProductLayout />}>
                <Route path={ROUTES.HOME} element={<Products />} />
                <Route path={`${ROUTES.PRODUCTS}/:categoryId`} element={<Products />} />
                <Route path={`${ROUTES.PRODUCTS}/:categoryId/:productId`} element={<ProductDetails />} />
              </Route>
              <Route element={<CheckoutLayout />}>
                <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
              </Route>
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

export default App

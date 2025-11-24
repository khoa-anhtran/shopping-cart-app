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
import ProductDetailsModal from './pages/products/components/ProductDetailsModal'
import { ConfigProvider } from 'antd'
import { useMediaQuery } from 'react-responsive'
import useTheme from './hooks/useTheme'

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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const { theme } = useTheme()

  return <>
    <ConfigProvider theme={{
      components: {
        Segmented: {
          itemSelectedBg: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.1)",
          itemSelectedColor: theme === "dark" ? "rgba(255,255,255,1)" : "rgba(0,0,0,0.88)",
          trackBg: theme === "dark" ? "rgba(255,255,255,0.1)" : "#f5f5f5",
          itemColor: theme === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.65)",
          itemHoverBg: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.06)",
          itemHoverColor: theme === "dark" ? "rgba(255,255,255,1)" : "rgba(0,0,0,0.88)",
        }
      }
    }}>
      <Header></Header>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Products />
        <ProductDetailsModal />
      </ErrorBoundary>
      <CartProvider>
        <Cart />
      </CartProvider>
    </ConfigProvider >

  </>
}

const StartAppBoot = () => {
  useAppStart()

  return <Outlet />
}

export default App

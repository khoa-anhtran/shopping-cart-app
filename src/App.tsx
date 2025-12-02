import './App.css'
import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RequireGuest from './routes/RequireGuest'
import RequireAuth from './routes/RequireAuth'
import { ErrorBoundary } from 'react-error-boundary'
import SimpleErrorPage from './pages/layout/SimpleErrorPage'
import LoadingSpinner from './components/LoadingSpinner'
import { ROUTES } from './constants/routes'
import Loading from './pages/layout/Loading'
import ErrorFallback from './pages/layout/ErrorFallback'

const Home = lazy(() => import('./pages/layout/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Checkout = lazy(() => import('./pages/checkout/Checkout'))
const StartAppBoot = lazy(() => import('./pages/layout/StartAppBoot'))

const MainLayout = lazy(() => import('./pages/layout/MainLayout'))

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
              <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={<Home />} />
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

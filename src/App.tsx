import { useDispatch, useSelector } from 'react-redux'
import './App.css'
// import Header from './component/Header'
// import CartView from './features/cart/CartView'
// import ProductsView from './features/products/ProductsView'
// import MyConfirmDialog from './features/ui/MyConfirmDialog'
// import MyStatusOverlay from './features/ui/MyStatusOverlay'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { JSX, useEffect } from 'react'
import { fetchProductsRequested } from './pages/products/actions'
import { selectProducts, selectProductsError, selectProductsStatus } from './pages/products/selectors'
import { selectCart, selectCartError, selectCartStatus } from './pages/cart/selectors'
import { fetchCartRequested } from './pages/cart/actions'
import Products from './pages/products/Products'
import Header from './pages/layout/Header'
import Cart from './pages/cart/Cart'
import { ToastContainer } from 'react-toast'
import Login from './pages/auth/Login'
import { selectAuth } from './pages/auth/selectors'
import Register from './pages/auth/Register'
// import LoginView from './features/auth/LoginView'
// import { selectAuth } from './features/auth/authSlice'
// import RegisterView from './features/auth/RegisterView'

function App() {

  return (
    <>
      <Routes>
        <Route path="*" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
    </>
  )
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const userId = useSelector(selectAuth)?.userId

  if (!userId) return <Navigate to="/login" replace />
  return children
}

function Home() {
  return <>
    <Header></Header>
    <Products />
    <Cart />
  </>
}


export default App

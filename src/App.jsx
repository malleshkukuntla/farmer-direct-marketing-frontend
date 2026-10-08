import { Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './auth'

import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import Products from './pages/Products'
import SelectProduct from './pages/SelectProduct'
import PlaceOrder from './pages/PlaceOrder'
import MyOrders from './pages/MyOrders'
import FarmerDashboard from './pages/FarmerDashboard'
import AddProduct from './pages/AddProduct'
import MyProducts from './pages/MyProducts'
import EditProduct from './pages/EditProduct'
import DeleteProduct from './pages/DeleteProduct'
import FarmerOrders from './pages/FarmerOrders'
import UpdateOrderStatus from './pages/UpdateOrderStatus'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Farmers from './pages/Farmers'
import Customers from './pages/Customers'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'

// Only lets the right type of user open a page
function Protected({ role, children }) {
  const user = getUser()
  if (!user || user.role !== role) {
    return <Navigate to={role === 'admin' ? '/admin-login' : '/'} replace />
  }
  return children
}

const C = (el) => <Protected role="customer">{el}</Protected>
const F = (el) => <Protected role="farmer">{el}</Protected>
const A = (el) => <Protected role="admin">{el}</Protected>

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/customer-dashboard" element={C(<CustomerDashboard />)} />
      <Route path="/products" element={C(<Products mode="view" />)} />
      <Route path="/select-products" element={C(<Products mode="select" />)} />
      <Route path="/select-product/:id" element={C(<SelectProduct />)} />
      <Route path="/place-order/:id" element={C(<PlaceOrder />)} />
      <Route path="/my-orders" element={C(<MyOrders />)} />

      <Route path="/farmer-dashboard" element={F(<FarmerDashboard />)} />
      <Route path="/add-product" element={F(<AddProduct />)} />
      <Route path="/my-products" element={F(<MyProducts />)} />
      <Route path="/edit-product/:id" element={F(<EditProduct />)} />
      <Route path="/delete-product/:id" element={F(<DeleteProduct />)} />
      <Route path="/farmer-orders" element={F(<FarmerOrders />)} />
      <Route path="/update-order-status" element={F(<UpdateOrderStatus />)} />

      <Route path="/admin-dashboard" element={A(<AdminDashboard />)} />
      <Route path="/farmers" element={A(<Farmers />)} />
      <Route path="/customers" element={A(<Customers />)} />
      <Route path="/admin-products" element={A(<AdminProducts />)} />
      <Route path="/admin-orders" element={A(<AdminOrders />)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

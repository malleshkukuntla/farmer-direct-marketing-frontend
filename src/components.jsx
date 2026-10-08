import { useState, useEffect } from 'react'
import { loadPhoto } from './productImages'
import { NavLink, useNavigate } from 'react-router-dom'
import { getUser, logout } from './auth'
import { money } from './api'

export const customerLinks = [
  { label: 'Dashboard', to: '/customer-dashboard' },
  { label: 'View Products', to: '/products' },
  { label: 'Select Products', to: '/select-products' },
  { label: 'My Orders', to: '/my-orders' },
]

export const farmerLinks = [
  { label: 'Dashboard', to: '/farmer-dashboard' },
  { label: 'Add Product', to: '/add-product' },
  { label: 'My Products', to: '/my-products' },
  { label: 'Customer Orders', to: '/farmer-orders' },
  { label: 'Order Status', to: '/update-order-status' },
]

export const adminLinks = [
  { label: 'Dashboard', to: '/admin-dashboard' },
  { label: 'Farmers', to: '/farmers' },
  { label: 'Customers', to: '/customers' },
  { label: 'Products', to: '/admin-products' },
  { label: 'Orders', to: '/admin-orders' },
]

export const CATEGORIES = ['Fruits', 'Vegetables', 'Grains', 'Pulses', 'Spices', 'Other']

// Sidebar + page area used by every dashboard page
export function Layout({ links, title, children }) {
  const navigate = useNavigate()
  const user = getUser()
  const handleLogout = () => {
    logout()
    navigate(title === 'Admin' ? '/admin-login' : '/')
  }
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">Farmer Direct Market</div>
        <div className="role-tag">{title}: {user ? user.name : ''}</div>
        <nav>
          {links.map((l) => (
            <NavLink key={l.label} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="content">{children}</main>
    </div>
  )
}

export function Alert({ type, text }) {
  if (!text) return null
  return <div className={'alert ' + type}>{text}</div>
}

// Shows the product image; falls back to a generic image if it fails to load
export function ProductImg({ src, alt, className }) {
  const [photo, setPhoto] = useState(null)
  const [failed, setFailed] = useState(false)
  const fallback = (src || '/images/generic.svg').replace('.jpg', '.svg')

  useEffect(() => {
    let alive = true
    setFailed(false)
    loadPhoto(alt).then((url) => {
      if (alive) setPhoto(url)
    })
    return () => {
      alive = false
    }
  }, [alt])

  return (
    <img
      className={className || 'p-img'}
      src={failed || !photo ? fallback : photo}
      alt={alt}
      onError={() => setFailed(true)}
    />
  )
}
  

export function StatusBadge({ status }) {
  return <span className={'badge ' + status}>{status}</span>
}

// Form used by both Add Product and Edit Product
export function ProductForm({ initial, onSubmit, label, busy }) {
  const [f, setF] = useState(initial)
  const [err, setErr] = useState('')
  const change = (e) => setF({ ...f, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const q = Number(f.quantity)
    const pr = Number(f.price)
    if (!f.name.trim()) return setErr('Product name is required')
    if (!f.category) return setErr('Please select a category')
    if (f.quantity === '' || !Number.isInteger(q) || q < 0) return setErr('Enter a valid quantity')
    if (f.price === '' || !(pr > 0)) return setErr('Enter a valid price greater than 0')
    setErr('')
    onSubmit({ name: f.name.trim(), description: f.description, category: f.category, quantity: q, price: pr })
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <Alert type="error" text={err} />
      <label>Product Name</label>
      <input name="name" value={f.name} onChange={change} placeholder="e.g. Mango" />
      <label>Description</label>
      <textarea name="description" value={f.description} onChange={change} rows="3" placeholder="Short description" />
      <label>Category</label>
      <select name="category" value={f.category} onChange={change}>
        <option value="">-- Select category --</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="row">
        <div>
          <label>Quantity</label>
          <input name="quantity" type="number" min="0" value={f.quantity} onChange={change} />
        </div>
        <div>
          <label>Price (per unit)</label>
          <input name="price" type="number" min="0" step="0.01" value={f.price} onChange={change} />
        </div>
      </div>
      <p className="muted small">The product image is chosen automatically from the product name.</p>
      <button className="btn" disabled={busy}>{busy ? 'Please wait...' : label}</button>
    </form>
  )
}

// Order card shown to the farmer (has customer delivery details)
export function FarmerOrderCard({ o, children }) {
  return (
    <div className="card order">
      <ProductImg src={o.productImage} alt={o.productName} className="o-img" />
      <div className="o-body">
        <div className="o-head">
          <h3>{o.productName}</h3>
          <StatusBadge status={o.status} />
        </div>
        <p><b>Order ID:</b> #{o.id} &nbsp; <b>Date:</b> {o.orderDate}</p>
        <p><b>Quantity:</b> {o.quantity} &nbsp; <b>Price:</b> {money(o.price)} &nbsp; <b>Total:</b> {money(o.totalPrice)}</p>
        <div className="box">
          <b>Customer:</b> {o.customerName} ({o.customerPhone})<br />
          <b>Village:</b> {o.customerVillage} &nbsp; <b>Mandal:</b> {o.customerMandal}<br />
          <b>District:</b> {o.customerDistrict} &nbsp; <b>State:</b> {o.customerState}
        </div>
        {children}
      </div>
    </div>
  )
}

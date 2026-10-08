import { Link } from 'react-router-dom'
import { Layout, customerLinks } from '../components'
import { getUser } from '../auth'

export default function CustomerDashboard() {
  const user = getUser()
  return (
    <Layout links={customerLinks} title="Customer">
      <h1>Welcome, {user.name}</h1>
      <p className="muted">Buy fresh products directly from farmers.</p>
      <div className="stat-grid">
        <Link to="/products" className="card stat">
          <div className="num">Products</div>
          <div className="lbl">View Products</div>
        </Link>
        <Link to="/select-products" className="card stat">
          <div className="num">Select</div>
          <div className="lbl">Select Products</div>
        </Link>
        <Link to="/my-orders" className="card stat">
          <div className="num">Orders</div>
          <div className="lbl">My Orders</div>
        </Link>
      </div>
      <div className="panel light">
        <b>Your delivery location:</b> {user.village}, {user.mandal}, {user.district}, {user.state}
      </div>
    </Layout>
  )
}

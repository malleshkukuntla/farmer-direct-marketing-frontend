import { Layout, farmerLinks, Alert } from '../components'
import { useFetch } from '../hooks'
import { getUser } from '../auth'

export default function FarmerDashboard() {
  const user = getUser()
  const products = useFetch('/products?farmerId=' + user.id)
  const orders = useFetch('/orders?farmerId=' + user.id)
  const count = (s) => orders.data.filter((o) => o.status === s).length

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>Welcome, {user.name}</h1>
      <Alert type="error" text={products.error || orders.error} />
      <div className="stat-grid">
        <div className="card stat"><div className="num">{products.data.length}</div><div className="lbl">Total Products</div></div>
        <div className="card stat"><div className="num">{orders.data.length}</div><div className="lbl">Customer Orders</div></div>
        <div className="card stat"><div className="num">{count('PENDING')}</div><div className="lbl">Pending Orders</div></div>
        <div className="card stat"><div className="num">{count('ACCEPTED')}</div><div className="lbl">Accepted Orders</div></div>
      </div>
      <div className="panel light">
        <p><b>Your location (shown to customers):</b> {user.village}, {user.mandal}, {user.district}, {user.state}</p>
        <p><b>Tip:</b> Check Customer Orders regularly and accept or reject pending orders in Order Status.</p>
      </div>
    </Layout>
  )
}

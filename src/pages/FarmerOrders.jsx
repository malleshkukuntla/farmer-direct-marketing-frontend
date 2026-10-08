import { getUser } from '../auth'
import { Layout, farmerLinks, FarmerOrderCard, Alert } from '../components'
import { useFetch } from '../hooks'

export default function FarmerOrders() {
  const user = getUser()
  const { data, loading, error } = useFetch('/orders?farmerId=' + user.id)

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>Customer Orders</h1>
      <Alert type="error" text={error} />
      {loading && <p>Loading...</p>}
      {!loading && !error && data.length === 0 && <p className="muted">No orders yet.</p>}
      {data.map((o) => <FarmerOrderCard key={o.id} o={o} />)}
    </Layout>
  )
}

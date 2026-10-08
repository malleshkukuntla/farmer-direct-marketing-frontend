import { useState } from 'react'
import api, { errMsg } from '../api'
import { getUser } from '../auth'
import { Layout, farmerLinks, FarmerOrderCard, Alert } from '../components'
import { useFetch } from '../hooks'

export default function UpdateOrderStatus() {
  const user = getUser()
  const { data, loading, error, reload } = useFetch('/orders?farmerId=' + user.id)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const update = async (o, status) => {
    setMsg('')
    setErr('')
    try {
      await api.put('/orders/' + o.id + '/status', null, { params: { farmerId: user.id, status } })
      setMsg('Order #' + o.id + ' is now ' + status)
      reload()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>Order Status</h1>
      <p className="muted">Accept or reject pending orders. Customers cancel their own orders.</p>
      <Alert type="error" text={error || err} />
      <Alert type="success" text={msg} />
      {loading && <p>Loading...</p>}
      {!loading && !error && data.length === 0 && <p className="muted">No orders yet.</p>}
      {data.map((o) => (
        <FarmerOrderCard key={o.id} o={o}>
          {o.status === 'PENDING' && (
            <div className="actions">
              <button className="btn" onClick={() => update(o, 'ACCEPTED')}>Accept</button>
              <button className="btn danger" onClick={() => update(o, 'REJECTED')}>Reject</button>
            </div>
          )}
        </FarmerOrderCard>
      ))}
    </Layout>
  )
}

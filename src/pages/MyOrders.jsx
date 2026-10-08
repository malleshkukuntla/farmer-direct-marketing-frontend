import { useState } from 'react'
import api, { errMsg, money } from '../api'
import { getUser } from '../auth'
import { Layout, customerLinks, ProductImg, StatusBadge, Alert } from '../components'
import { useFetch } from '../hooks'

export default function MyOrders() {
  const user = getUser()
  const { data, loading, error, reload } = useFetch('/orders?customerId=' + user.id)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const cancel = async (o) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setMsg('')
    setErr('')
    try {
      await api.put('/orders/' + o.id + '/cancel', null, { params: { customerId: user.id } })
      setMsg('Order #' + o.id + ' has been cancelled and the stock was restored.')
      reload()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  return (
    <Layout links={customerLinks} title="Customer">
      <h1>My Orders</h1>
      <Alert type="error" text={error || err} />
      <Alert type="success" text={msg} />
      {loading && <p>Loading...</p>}
      {!loading && !error && data.length === 0 && <p className="muted">You have not placed any orders yet.</p>}
      {data.map((o) => (
        <div className="card order" key={o.id}>
          <ProductImg src={o.productImage} alt={o.productName} className="o-img" />
          <div className="o-body">
            <div className="o-head">
              <h3>{o.productName}</h3>
              <StatusBadge status={o.status} />
            </div>
            <p><b>Order ID:</b> #{o.id} &nbsp; <b>Date:</b> {o.orderDate}</p>
            <p><b>Quantity:</b> {o.quantity} &nbsp; <b>Price:</b> {money(o.price)} &nbsp; <b>Total:</b> {money(o.totalPrice)}</p>
            <div className="box">
              <b>Farmer:</b> {o.farmerName}<br />
              <b>Farmer location:</b> {o.farmerLocation}
            </div>
            {o.status === 'PENDING' && (
              <div className="actions">
                <button className="btn danger" onClick={() => cancel(o)}>Cancel Order</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </Layout>
  )
}

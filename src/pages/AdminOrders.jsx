import { useState } from 'react'
import api, { errMsg, money } from '../api'
import { Layout, adminLinks, ProductImg, StatusBadge, Alert } from '../components'
import { useFetch } from '../hooks'

export default function AdminOrders() {
  const { data, loading, error, reload } = useFetch('/orders')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const remove = async (o) => {
    if (!window.confirm('Delete order #' + o.id + '?')) return
    setMsg('')
    setErr('')
    try {
      await api.delete('/admin/orders/' + o.id)
      setMsg('Order deleted')
      reload()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  return (
    <Layout links={adminLinks} title="Admin">
      <h1>Manage Orders</h1>
      <Alert type="error" text={error || err} />
      <Alert type="success" text={msg} />
      {loading && <p>Loading...</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Image</th><th>Customer &rarr; Farmer &rarr; Product</th><th>Quantity</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td><ProductImg src={o.productImage} alt={o.productName} className="t-img" /></td>
                <td className="flow">
                  <b>Customer:</b> {o.customerName}<br />
                  <b>Farmer:</b> {o.farmerName}<br />
                  <b>Product:</b> {o.productName}
                </td>
                <td>{o.quantity}</td><td>{money(o.totalPrice)}</td><td>{o.orderDate}</td>
                <td><StatusBadge status={o.status} /></td>
                <td><button className="btn small danger" onClick={() => remove(o)}>Delete</button></td>
              </tr>
            ))}
            {!loading && data.length === 0 && <tr><td colSpan="8">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

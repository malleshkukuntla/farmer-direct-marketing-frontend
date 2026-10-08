import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import api, { errMsg, money } from '../api'
import { getUser } from '../auth'
import { Layout, customerLinks, ProductImg, Alert } from '../components'
import { useFetch } from '../hooks'

export default function PlaceOrder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const user = getUser()
  const qty = state && state.quantity
  const { data: p, loading, error } = useFetch('/products/' + id, null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  // opened directly without choosing a quantity -> go back to the selection page
  if (!qty) return <Navigate to={'/select-product/' + id} replace />

  const confirm = async () => {
    setBusy(true)
    setMsg('')
    try {
      await api.post('/orders', { customerId: user.id, productId: Number(id), quantity: qty })
      navigate('/my-orders')
    } catch (e) {
      setMsg(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout links={customerLinks} title="Customer">
      <h1>Place Order</h1>
      <Alert type="error" text={error || msg} />
      {loading && <p>Loading...</p>}
      {p && (
        <div className="card order">
          <ProductImg src={p.image} alt={p.name} className="o-img" />
          <div className="o-body">
            <h3>{p.name}</h3>
            <p><b>Farmer:</b> {p.farmerName} ({p.farmerLocation})</p>
            <p><b>Quantity:</b> {qty} &nbsp; <b>Price:</b> {money(p.price)}</p>
            <p className="price">Total Price: {money(p.price * qty)}</p>
            <div className="box">
              <b>Delivery location:</b><br />
              {user.village}, {user.mandal}, {user.district}, {user.state}
            </div>
            <div className="actions">
              <button className="btn" onClick={confirm} disabled={busy}>{busy ? 'Placing...' : 'Confirm Order'}</button>
              <button className="btn outline" onClick={() => navigate('/select-product/' + id)}>Back</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

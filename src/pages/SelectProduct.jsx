import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout, customerLinks, ProductImg, Alert } from '../components'
import { useFetch } from '../hooks'
import { money } from '../api'

export default function SelectProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: p, loading, error } = useFetch('/products/' + id, null)
  const [qty, setQty] = useState(1)
  const [msg, setMsg] = useState('')

  const total = p ? p.price * (Number(qty) || 0) : 0

  const go = () => {
    const q = Number(qty)
    if (!Number.isInteger(q) || q <= 0) {
      setMsg('Quantity must be at least 1')
      return
    }
    if (q > p.quantity) {
      setMsg('Only ' + p.quantity + ' available')
      return
    }
    navigate('/place-order/' + id, { state: { quantity: q } })
  }

  return (
    <Layout links={customerLinks} title="Customer">
      <h1>Select Product</h1>
      <Alert type="error" text={error} />
      {loading && <p>Loading...</p>}
      {p && (
        <div className="card order">
          <ProductImg src={p.image} alt={p.name} className="o-img" />
          <div className="o-body">
            <h3>{p.name}</h3>
            <span className="tag">{p.category}</span>
            <p className="muted">{p.description}</p>
            <p><b>Price:</b> {money(p.price)}</p>
            <p><b>Available quantity:</b> {p.quantity}</p>
            <p><b>Farmer:</b> {p.farmerName}</p>
            <p><b>Farmer location:</b> {p.farmerLocation}</p>
            <div className="form" style={{ maxWidth: 260 }}>
              <label>Quantity</label>
              <input type="number" min="1" max={p.quantity} value={qty} onChange={(e) => { setQty(e.target.value); setMsg('') }} />
            </div>
            <p className="price">Total Price: {money(total)}</p>
            <Alert type="error" text={msg} />
            <div className="actions">
              <button className="btn" onClick={go} disabled={p.quantity <= 0}>Place Order</button>
              <button className="btn outline" onClick={() => navigate('/products')}>Back</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

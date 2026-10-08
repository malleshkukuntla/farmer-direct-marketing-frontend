import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { errMsg, money } from '../api'
import { getUser } from '../auth'
import { Layout, farmerLinks, ProductImg, Alert } from '../components'
import { useFetch } from '../hooks'

export default function DeleteProduct() {
  const { id } = useParams()
  const user = getUser()
  const navigate = useNavigate()
  const { data: p, loading, error } = useFetch('/products/' + id, null)
  const [err, setErr] = useState('')

  const remove = async () => {
    setErr('')
    try {
      await api.delete('/products/' + id, { params: { farmerId: user.id } })
      navigate('/my-products')
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  const notMine = p && p.farmerId !== user.id

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>Delete Product</h1>
      <Alert type="error" text={error || err || (notMine ? 'You can delete only your own products' : '')} />
      {loading && <p>Loading...</p>}
      {p && !notMine && (
        <div className="card order">
          <ProductImg src={p.image} alt={p.name} className="o-img" />
          <div className="o-body">
            <h3>{p.name}</h3>
            <p>{p.category} | Quantity: {p.quantity} | {money(p.price)}</p>
            <div className="alert error">Are you sure you want to delete this product? This cannot be undone.</div>
            <div className="actions">
              <button className="btn danger" onClick={remove}>Yes, Delete</button>
              <button className="btn outline" onClick={() => navigate('/my-products')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

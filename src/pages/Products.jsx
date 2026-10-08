import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, customerLinks, ProductImg, Alert } from '../components'
import { useFetch } from '../hooks'
import { money } from '../api'

export default function Products({ mode }) {
  const navigate = useNavigate()
  const { data, loading, error } = useFetch('/products')
  const [search, setSearch] = useState('')
  const list = data.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <Layout links={customerLinks} title="Customer">
      <h1>{mode === 'select' ? 'Select Products' : 'View Products'}</h1>
      <input className="search" placeholder="Search products by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <Alert type="error" text={error} />
      {loading && <p>Loading...</p>}
      {!loading && !error && list.length === 0 && <p className="muted">No products found.</p>}
      <div className="grid">
        {list.map((p) => (
          <div className="card product" key={p.id}>
            <ProductImg src={p.image} alt={p.name} />
            <div className="p-body">
              <h3>{p.name}</h3>
              <span className="tag">{p.category}</span>
              <p className="muted">{p.description}</p>
              <p className="price">{money(p.price)}</p>
              <p><b>Available:</b> {p.quantity}</p>
              <p><b>Farmer:</b> {p.farmerName}</p>
              <p><b>Location:</b> {p.farmerLocation}</p>
              <div className="actions">
                <button className="btn" disabled={p.quantity <= 0} onClick={() => navigate('/select-product/' + p.id)}>
                  {p.quantity <= 0 ? 'Out of stock' : 'Select Product'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

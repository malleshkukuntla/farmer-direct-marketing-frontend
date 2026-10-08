import { useNavigate } from 'react-router-dom'
import { getUser } from '../auth'
import { money } from '../api'
import { Layout, farmerLinks, ProductImg, Alert } from '../components'
import { useFetch } from '../hooks'

export default function MyProducts() {
  const user = getUser()
  const navigate = useNavigate()
  const { data, loading, error } = useFetch('/products?farmerId=' + user.id)

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>My Products</h1>
      <Alert type="error" text={error} />
      {loading && <p>Loading...</p>}
      {!loading && !error && data.length === 0 && <p className="muted">You have not added any products yet.</p>}
      <div className="grid">
        {data.map((p) => (
          <div className="card product" key={p.id}>
            <ProductImg src={p.image} alt={p.name} />
            <div className="p-body">
              <h3>{p.name}</h3>
              <span className="tag">{p.category}</span>
              <p className="muted">{p.description}</p>
              <p><b>Quantity:</b> {p.quantity}</p>
              <p className="price">{money(p.price)}</p>
              <div className="actions">
                <button className="btn small" onClick={() => navigate('/edit-product/' + p.id)}>Edit</button>
                <button className="btn small danger" onClick={() => navigate('/delete-product/' + p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

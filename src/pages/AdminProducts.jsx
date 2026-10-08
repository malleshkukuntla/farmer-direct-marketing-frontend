import { useState } from 'react'
import api, { errMsg, money } from '../api'
import { Layout, adminLinks, ProductImg, Alert } from '../components'
import { useFetch } from '../hooks'

export default function AdminProducts() {
  const { data, loading, error, reload } = useFetch('/products')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const remove = async (p) => {
    if (!window.confirm('Delete product ' + p.name + '?')) return
    setMsg('')
    setErr('')
    try {
      await api.delete('/admin/products/' + p.id)
      setMsg('Product deleted')
      reload()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  return (
    <Layout links={adminLinks} title="Admin">
      <h1>Manage Products</h1>
      <Alert type="error" text={error || err} />
      <Alert type="success" text={msg} />
      {loading && <p>Loading...</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Quantity</th><th>Farmer</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td><ProductImg src={p.image} alt={p.name} className="t-img" /></td>
                <td>{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.quantity}</td><td>{p.farmerName}</td>
                <td><button className="btn small danger" onClick={() => remove(p)}>Delete</button></td>
              </tr>
            ))}
            {!loading && data.length === 0 && <tr><td colSpan="7">No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

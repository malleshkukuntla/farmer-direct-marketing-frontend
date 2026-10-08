import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { errMsg } from '../api'
import { getUser } from '../auth'
import { Layout, farmerLinks, ProductForm, Alert } from '../components'
import { useFetch } from '../hooks'

export default function EditProduct() {
  const { id } = useParams()
  const user = getUser()
  const navigate = useNavigate()
  const { data: p, loading, error } = useFetch('/products/' + id, null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async (values) => {
    setBusy(true)
    setErr('')
    try {
      await api.put('/products/' + id, { ...values, farmerId: user.id })
      navigate('/my-products')
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  const notMine = p && p.farmerId !== user.id

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>Edit Product</h1>
      <Alert type="error" text={error || err || (notMine ? 'You can edit only your own products' : '')} />
      {loading && <p>Loading...</p>}
      {p && !notMine && (
        <ProductForm
          initial={{ name: p.name, description: p.description || '', category: p.category, quantity: p.quantity, price: p.price }}
          onSubmit={save}
          label="Save Changes"
          busy={busy}
        />
      )}
    </Layout>
  )
}

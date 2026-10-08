import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errMsg } from '../api'
import { getUser } from '../auth'
import { Layout, farmerLinks, ProductForm, Alert } from '../components'

export default function AddProduct() {
  const user = getUser()
  const navigate = useNavigate()
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async (values) => {
    setBusy(true)
    setErr('')
    try {
      await api.post('/products', { ...values, farmerId: user.id })
      navigate('/my-products')
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout links={farmerLinks} title="Farmer">
      <h1>Add Product</h1>
      <Alert type="error" text={err} />
      <ProductForm initial={{ name: '', description: '', category: '', quantity: '', price: '' }} onSubmit={save} label="Add Product" busy={busy} />
    </Layout>
  )
}

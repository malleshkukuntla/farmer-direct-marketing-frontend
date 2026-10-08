import { Link } from 'react-router-dom'
import { Layout, adminLinks, Alert } from '../components'
import { useFetch } from '../hooks'

export default function AdminDashboard() {
  const { data, error } = useFetch('/admin/stats', {})
  const items = [
    { label: 'Total Farmers', key: 'farmers', to: '/farmers' },
    { label: 'Total Customers', key: 'customers', to: '/customers' },
    { label: 'Total Products', key: 'products', to: '/admin-products' },
    { label: 'Total Orders', key: 'orders', to: '/admin-orders' },
  ]
  return (
    <Layout links={adminLinks} title="Admin">
      <h1>Admin Dashboard</h1>
      <Alert type="error" text={error} />
      <div className="stat-grid">
        {items.map((i) => (
          <Link key={i.key} to={i.to} className="card stat">
            <div className="num">{data[i.key] ?? 0}</div>
            <div className="lbl">{i.label}</div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

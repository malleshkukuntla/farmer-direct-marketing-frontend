import { useState } from 'react'
import api, { errMsg } from '../api'
import { Layout, adminLinks, Alert } from '../components'
import { useFetch } from '../hooks'

export default function Customers() {
  const { data, loading, error, reload } = useFetch('/customers')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const remove = async (u) => {
    if (!window.confirm('Delete Customer ' + u.name + '?')) return
    setMsg('')
    setErr('')
    try {
      await api.delete('/admin/customers/' + u.id)
      setMsg('Customer deleted')
      reload()
    } catch (e) {
      setErr(errMsg(e))
    }
  }

  return (
    <Layout links={adminLinks} title="Admin">
      <h1>Manage Customers</h1>
      <Alert type="error" text={error || err} />
      <Alert type="success" text={msg} />
      {loading && <p>Loading...</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Mobile</th><th>Email</th><th>State</th><th>District</th><th>Mandal</th><th>Village</th><th>Action</th></tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td><td>{u.name}</td><td>{u.mobile}</td><td>{u.email}</td>
                <td>{u.state}</td><td>{u.district}</td><td>{u.mandal}</td><td>{u.village}</td>
                <td><button className="btn small danger" onClick={() => remove(u)}>Delete</button></td>
              </tr>
            ))}
            {!loading && data.length === 0 && <tr><td colSpan="9">No records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

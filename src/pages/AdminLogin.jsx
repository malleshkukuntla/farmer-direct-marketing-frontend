import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errMsg } from '../api'
import { setUser } from '../auth'
import { Alert } from '../components'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Please enter username and password')
      return
    }
    try {
      const res = await api.post('/auth/login', { role: 'admin', email: username, password })
      setUser(res.data)
      navigate('/admin-dashboard')
    } catch (err) {
      setError(errMsg(err))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Admin Login</h1>
        <p className="sub">Farmer Direct Marketing System</p>
        <form className="form" onSubmit={submit}>
          <Alert type="error" text={error} />
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn">Login</button>
        </form>
        <div className="links"><Link to="/">Back to main login</Link></div>
      </div>
    </div>
  )
}

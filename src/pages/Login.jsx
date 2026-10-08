import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errMsg } from '../api'
import { setUser } from '../auth'
import { Alert } from '../components'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { role, email, password })
      setUser(res.data)
      navigate('/' + role + '-dashboard')
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Farmer Direct Marketing</h1>
        <p className="sub">Fresh from the farm, straight to you</p>
        <div className="role-switch">
          {['customer', 'farmer', 'admin'].map((r) => (
            <button type="button" key={r} className={role === r ? 'on' : ''} onClick={() => setRole(r)}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <form className="form" onSubmit={submit}>
          <Alert type="error" text={error} />
          <label>{role === 'admin' ? 'Admin Username' : 'Email'}</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === 'admin' ? 'admin' : 'you@example.com'} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login as ' + role}</button>
        </form>
        <div className="links">
          New here? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}

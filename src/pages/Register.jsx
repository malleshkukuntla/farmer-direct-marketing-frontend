import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errMsg } from '../api'
import { Alert } from '../components'

const empty = { name: '', mobile: '', email: '', password: '', state: '', district: '', mandal: '', village: '' }

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('customer')
  const [f, setF] = useState(empty)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value })

  const validate = () => {
    if (!f.name.trim()) return 'Name is required'
    if (!/^[A-Za-z ]+$/.test(f.name.trim())) return 'Name must contain only letters and spaces'
    if (!/^\d{10}$/.test(f.mobile.trim())) return 'Mobile number must be exactly 10 digits'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) return 'Enter a valid email address'
    if (f.password.length < 6) return 'Password must be at least 6 characters'
    if (!f.state.trim()) return 'State is required'
    if (!f.district.trim()) return 'District is required'
    if (!f.mandal.trim()) return 'Mandal is required'
    if (!f.village.trim()) return 'Village is required'
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    setSuccess('')
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/' + role + 's/register', f)
      setSuccess('Registration successful! Redirecting to login...')
      setF(empty)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <h1>Create Account</h1>
        <p className="sub">Register as a customer or a farmer</p>
        <div className="role-switch">
          <button type="button" className={role === 'customer' ? 'on' : ''} onClick={() => setRole('customer')}>Customer</button>
          <button type="button" className={role === 'farmer' ? 'on' : ''} onClick={() => setRole('farmer')}>Farmer</button>
        </div>
        <form className="form" onSubmit={submit}>
          <Alert type="error" text={error} />
          <Alert type="success" text={success} />
          <div className="row">
            <div><label>Name</label><input name="name" value={f.name} onChange={change} /></div>
            <div><label>Mobile Number</label><input name="mobile" value={f.mobile} onChange={change} maxLength="10" /></div>
          </div>
          <div className="row">
            <div><label>Email</label><input name="email" value={f.email} onChange={change} /></div>
            <div><label>Password</label><input name="password" type="password" value={f.password} onChange={change} /></div>
          </div>
          <div className="row">
            <div><label>State</label><input name="state" value={f.state} onChange={change} /></div>
            <div><label>District</label><input name="district" value={f.district} onChange={change} /></div>
          </div>
          <div className="row">
            <div><label>Mandal</label><input name="mandal" value={f.mandal} onChange={change} /></div>
            <div><label>Village</label><input name="village" value={f.village} onChange={change} /></div>
          </div>
          <button className="btn" disabled={loading}>{loading ? 'Please wait...' : 'Register as ' + role}</button>
        </form>
        <div className="links">
          Already registered? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  )
}

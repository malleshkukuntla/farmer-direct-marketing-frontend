import axios from 'axios'

const api = axios.create({ baseURL: '/api' })
export default api

// Converts any error into a simple message for the user
export function errMsg(err) {
  const res = err.response
  if (res && res.data && res.data.message) return res.data.message
  if (!res || [500, 502, 503, 504].includes(res.status)) {
    return 'Cannot connect to the server. Please make sure the backend is running.'
  }
  return 'Something went wrong. Please try again.'
}

export const money = (n) => '\u20B9' + Number(n || 0).toFixed(2)

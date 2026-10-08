export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}
export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}
export function logout() {
  localStorage.removeItem('user')
}

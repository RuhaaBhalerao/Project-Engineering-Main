import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:4000/api' })

// Response interceptor to handle 401 Unauthorized (token expiry)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response ? error.response.status : null
    if (status === 401) {
      // Clear local storage and notify app of session end
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new CustomEvent('sessionExpired'))
      // Redirect to root (login)
      try { window.location = '/' } catch (e) {}
    }
    return Promise.reject(error)
  }
)

export default api

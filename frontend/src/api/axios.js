import axios from 'axios'
import { useAuthStore} from '../store/authStore';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',

})

// Runs before every request: attaches the JWT if the user is logged in
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Runs on every response: if the token is expired/invalid, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only log out if we actually had a token (avoids loops on the login page)
      if (useAuthStore.getState().token) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
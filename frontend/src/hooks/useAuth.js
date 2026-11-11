import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { loginRequest, registerRequest } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { ROLE_HOME } from '../constants/roles'

// Shared success behavior: save to store + redirect by role
function useAuthSuccess() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  return (data) => {
    login(data)
    navigate(ROLE_HOME[data.role] || '/login', { replace: true })
  }
}

export function useLogin() {
  const onAuthSuccess = useAuthSuccess()
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: onAuthSuccess,
  })
}

export function useRegister() {
  const onAuthSuccess = useAuthSuccess()
  return useMutation({
    mutationFn: registerRequest,
    onSuccess: onAuthSuccess,
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return () => {
    logout()
    navigate('/login', { replace: true })
  }
}
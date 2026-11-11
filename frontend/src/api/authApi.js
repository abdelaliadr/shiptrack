import api from './axios'


export const loginRequest = (credentials) =>
    api.post('/auth/login', credentials).then((res) => res.data)

export const registerRequest = (data) =>
    api.post('/auth/login', data).then((res) => res.data)
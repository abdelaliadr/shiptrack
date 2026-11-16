import api from './axios'

// BUSINESS
export const getMyShipments = () =>
  api.get('/shipments/my').then((res) => res.data)

export const createShipment = (data) =>
  api.post('/shipments', data).then((res) => res.data)

// PUBLIC
export const getShipmentById = (id) =>
  api.get(`/shipments/${id}`).then((res) => res.data)

// AGENT
export const getAssignedShipments = () =>
  api.get('/shipments/assigned').then((res) => res.data)

export const updateShipmentStatus = ({ id, ...body }) =>
  api.patch(`/shipments/${id}/status`, body).then((res) => res.data)

// ADMIN
export const getAllShipments = () =>
  api.get('/shipments/all').then((res) => res.data)

export const assignAgent = ({ id, agentId }) =>
  api.patch(`/shipments/${id}/assign`, { agentId }).then((res) => res.data)
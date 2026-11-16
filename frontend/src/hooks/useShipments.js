import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMyShipments,
  createShipment,
  getShipmentById,
  getAssignedShipments,
  updateShipmentStatus,
  getAllShipments,
  assignAgent,
} from '../api/shipmentApi'

// Queries
export const useMyShipments = () =>
  useQuery({ queryKey: ['myShipments'], queryFn: getMyShipments })

export const useShipment = (id) =>
  useQuery({
    queryKey: ['shipment', id],
    queryFn: () => getShipmentById(id),
  })

export const useAssignedShipments = () =>
  useQuery({ queryKey: ['assignedShipments'], queryFn: getAssignedShipments })

export const useAllShipments = () =>
  useQuery({ queryKey: ['allShipments'], queryFn: getAllShipments })

// Mutations
export function useCreateShipment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myShipments'] })
    },
  })
}

export function useUpdateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateShipmentStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shipment', String(variables.id)] })
      queryClient.invalidateQueries({ queryKey: ['assignedShipments'] })
      queryClient.invalidateQueries({ queryKey: ['allShipments'] })
    },
  })
}

export function useAssignAgent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: assignAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allShipments'] })
    },
  })
}
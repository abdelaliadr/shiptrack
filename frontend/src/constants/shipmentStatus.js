export const STATUS_LIST = [
  'PENDING',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
]

// Tailwind classes for the badge
export const STATUS_STYLES = {
  PENDING: 'bg-gray-100 text-gray-700',
  PICKED_UP: 'bg-blue-100 text-blue-700',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
}

// Hex colors for the Recharts bars
export const STATUS_COLORS = {
  PENDING: '#9ca3af',
  PICKED_UP: '#3b82f6',
  IN_TRANSIT: '#eab308',
  OUT_FOR_DELIVERY: '#f97316',
  DELIVERED: '#22c55e',
  FAILED: '#ef4444',
}
import { STATUS_STYLES } from '../constants/shipmentStatus'

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {status.replaceAll('_', ' ')}
    </span>
  )
}
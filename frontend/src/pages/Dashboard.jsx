
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Loader from '../components/Loader'

import { useMyShipments } from '../hooks/useShipments'
import { STATUS_LIST, STATUS_COLORS } from '../constants/shipmentStatus'

const IN_TRANSIT_STATUSES = ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY']

function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}

function CustomBar(props) {
  const { x, y, width, height, payload } = props

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={8}
      ry={8}
      fill={STATUS_COLORS[payload.status]}
    />
  )
}

export default function Dashboard() {
  const { data: shipments, isLoading, isError } = useMyShipments()

  if (isLoading) return <Loader fullScreen={true} />
  if (isError) return <p className="error-text">Could not load your dashboard.</p>

  const countOf = (status) =>
    shipments.filter((s) => s.status === status).length

  const stats = [
    { label: 'Total shipments', value: shipments.length },
    { label: 'Pending', value: countOf('PENDING') },
    {
      label: 'In transit',
      value: shipments.filter((s) =>
        IN_TRANSIT_STATUSES.includes(s.status)
      ).length,
    },
    { label: 'Delivered', value: countOf('DELIVERED') },
  ]

  const chartData = STATUS_LIST.map((status) => ({
    name: status.replaceAll('_', ' '),
    status,
    count: countOf(status),
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="card">
        <h2 className="font-bold mb-4 text-center">Shipments by status</h2>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar
                dataKey="count"
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useMyShipments } from '../hooks/useShipments'
import StatusBadge from '../components/StatusBadge'
import { format } from 'date-fns'
import Loader from '../components/Loader'

export default function MyShipments() {
  const { data: shipments, isLoading, isError } = useMyShipments()

  if (isLoading) return <Loader fullScreen={true} />
  if (isError) return <p className="error-text">Could not load your shipments.</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My shipments</h1>
        <Link to="/shipments/new" className="btn-primary">New shipment</Link>
      </div>

      {shipments.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-lg font-semibold mb-1">No shipments yet</p>
          <p className="text-muted mb-6">Create your first shipment to start tracking it.</p>
          <Link to="/shipments/new" className="btn-primary">Create a shipment</Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-muted border-b border-line">
                <th className="pb-3 font-semibold">Code</th>
                <th className="pb-3 font-semibold">Receiver</th>
                <th className="pb-3 font-semibold">City</th>
                <th className="pb-3 font-semibold">Weight</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Created</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="py-3 text-muted">#{s.id}</td>
                  <td className="py-3 font-semibold">{s.receiverName}</td>
                  <td className="py-3 text-muted">{s.receiverCity}</td>
                  <td className="py-3 text-muted">{s.weightKg} kg</td>
                  <td className="py-3"><StatusBadge status={s.status} /></td>
                  <td className="py-3 text-muted">
                    {format(new Date(s.createdAt).toLocaleDateString(), 'dd/MM/yyyy')}
                  </td>
                  <td className="py-3 text-left">
                    <Link to={`/track/${s.id}`} className="text-brand font-semibold hover:underline">
                      Track
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
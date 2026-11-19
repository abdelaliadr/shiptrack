import { Fragment } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useShipment } from '../hooks/useShipments'
import { STATUS_LIST } from '../constants/shipmentStatus'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeLine'
import PublicHeader from '../components/PublicHeader'
import Loader from '../components/Loader'

// The happy-path steps (FAILED is not a step, it is handled separately)
const STEPS = STATUS_LIST.filter((s) => s !== 'FAILED')

function Stepper({ status }) {
  const currentIndex = STEPS.indexOf(status)

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex
        return (
          <Fragment key={step}>
            <div className="flex flex-col items-center w-20">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  done ? 'bg-brand text-white' : 'bg-brand-soft text-muted'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className="text-[11px] text-center mt-2 font-semibold text-muted leading-tight">
                {step.replaceAll('_', ' ')}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mt-4 ${
                  i < currentIndex ? 'bg-brand' : 'bg-line'
                }`}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default function TrackingPage() {
  const { id } = useParams()
  const { data: shipment, isLoading, isError } = useShipment(id)

  if (isLoading) return <Loader fullScreen={true} />

  if (isError) {
    return (
      <div className="min-h-screen">
        <PublicHeader />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="card text-center py-16">
            <p className="text-lg font-bold mb-1">Shipment not found</p>
            <p className="text-muted mb-6">
              We could not find a shipment with ID #{id}. Check the number and try again.
            </p>
            <Link to="/track" className="btn-primary">
              Search again
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PublicHeader />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Details */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Shipment #{shipment.id}</h1>
            <StatusBadge status={shipment.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Route</p>
              <p className="font-semibold">
                {shipment.senderCity} → {shipment.receiverCity}
              </p>
            </div>
            <div>
              <p className="text-muted">Receiver</p>
              <p className="font-semibold">{shipment.receiverName}</p>
            </div>
            <div>
              <p className="text-muted">Weight</p>
              <p className="font-semibold">{shipment.weightKg} kg</p>
            </div>
            <div>
              <p className="text-muted">Created</p>
              <p className="font-semibold">
                {new Date(shipment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="card">
          {shipment.status === 'FAILED' ? (
            <div className="bg-red-50 text-red-700 rounded-2xl p-4 text-sm font-semibold">
              Delivery failed. Check the latest update below for the reason.
            </div>
          ) : (
            <Stepper status={shipment.status} />
          )}
        </div>

        {/* Timeline */}
        <div className="card">
          <h2 className="font-bold mb-4">Tracking history</h2>
          <TrackingTimeline events={shipment.events} />
        </div>
      </div>
    </div>
  )
}
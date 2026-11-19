import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader'

export default function TrackSearch() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = ({ id }) => navigate(`/track/${id.trim()}`)

  return (
    <div className="min-h-screen">
      <PublicHeader />

      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-2">Track your shipment</h1>
        <p className="text-muted mb-8">
          Enter your shipment number to see where your package is.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="card text-left">
          <label className="label">Shipment ID</label>
          <input
            className="input"
            placeholder="e.g. 12"
            {...register('id', {
              required: 'Please enter a shipment ID',
              pattern: { value: /^\d+$/, message: 'The ID must be a number' },
            })}
          />
          {errors.id && <p className="error-text">{errors.id.message}</p>}

          <button type="submit" className="btn-primary w-full mt-4">
            Track
          </button>
        </form>
      </div>
    </div>
  )
}
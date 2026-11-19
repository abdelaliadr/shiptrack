import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCreateShipment } from '../hooks/useShipments'

// Small helper so the 8 text fields don't repeat the same markup
function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="error-text">{error.message}</p>}
    </div>
  )
}

const required = (name) => ({ required: `${name} is required` })
const phoneRules = {
  ...required('Phone'),
  pattern: { value: /^[0-9]+$/, message: 'Phone must contain only numbers' },
}

export default function CreateShipment() {
  const navigate = useNavigate()
  const mutation = useCreateShipment()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (formData) => {
    mutation.mutate(
      { ...formData, weightKg: Number(formData.weightKg) },
      { onSuccess: () => navigate('/shipments') }
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">New shipment</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sender */}
        <div className="card">
          <h2 className="font-bold mb-4">Sender</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" error={errors.senderName}>
              <input className="input" {...register('senderName', required('Name'))} />
            </Field>
            <Field label="Phone" error={errors.senderPhone}>
              <input inputMode="numeric" className="input" {...register('senderPhone', phoneRules)} />
            </Field>
            <Field label="Address" error={errors.senderAddress}>
              <input className="input" {...register('senderAddress', required('Address'))} />
            </Field>
            <Field label="City" error={errors.senderCity}>
              <input className="input" {...register('senderCity', required('City'))} />
            </Field>
          </div>
        </div>

        {/* Receiver */}
        <div className="card">
          <h2 className="font-bold mb-4">Receiver</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" error={errors.receiverName}>
              <input className="input" {...register('receiverName', required('Name'))} />
            </Field>
            <Field label="Phone" error={errors.receiverPhone}>
              <input inputMode="numeric" className="input" {...register('receiverPhone', phoneRules)} />
            </Field>
            <Field label="Address" error={errors.receiverAddress}>
              <input className="input" {...register('receiverAddress', required('Address'))} />
            </Field>
            <Field label="City" error={errors.receiverCity}>
              <input className="input" {...register('receiverCity', required('City'))} />
            </Field>
          </div>
        </div>

        {/* Package */}
        <div className="card">
          <h2 className="font-bold mb-4">Package</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Weight (kg)" error={errors.weightKg}>
              <input
                type="number"
                step="0.1"
                className="input"
                {...register('weightKg', {
                  required: 'Weight is required',
                  min: { value: 0.1, message: 'Weight must be greater than 0' },
                })}
              />
            </Field>
            <Field label="Description" error={errors.description}>
              <input className="input" {...register('description')} />
            </Field>
          </div>
        </div>

        {mutation.isError && (
          <p className="error-text">Could not create the shipment. Please try again.</p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Creating...' : 'Create shipment'}
          </button>
          <button type="button" onClick={() => navigate('/shipments')} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
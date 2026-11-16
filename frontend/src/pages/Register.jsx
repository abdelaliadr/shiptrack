import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useAuth'

export default function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { role: 'BUSINESS' },
  })

  const mutation = useRegister()
  
  const onSubmit = (formData) => {
    mutation.mutate(formData)
  }

  // Show the backend's message if it sent one (e.g. "Email already registered")
  const errorMessage =
    mutation.error?.response?.data?.message ||
    'Registration failed. This email may already be registered.'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-muted mb-6">Join Shiptrack to manage deliveries</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">Full name</label>
            <input
              type="text"
              className="input"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input" {...register('phone')} />
          </div>

          {/* Role */}
          <div>
            <label className="label">I am a</label>
            <select className="input" {...register('role')}>
              <option value="BUSINESS">Business (I ship packages)</option>
              <option value="AGENT">Delivery agent</option>
            </select>
          </div>

          {/* Error from the backend */}
          {mutation.isError && <p className="error-text">{errorMessage}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary w-full"
          >
            {mutation.isPending ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-muted mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
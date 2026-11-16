import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'


export default function Login() {

    const {
        register,
        handleSubmit,
        formState: { errors},
    } = useForm()

    // useMutation = for requests that change data (POST, PATCH, DELETE)
    const mutation = useLogin()

    const onSubmit = (formData) => {
        mutation.mutate(formData)
    }

    return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="card w-full max-w-md p-8">
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-muted mb-6">Log in to your Shiptrack account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label">Password</label>
          <input type="password" className="input" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        {mutation.isError && (
          <p className="error-text">Invalid email or password. Please try again.</p>
        )}

        <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
          {mutation.isPending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-muted mt-6 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand font-semibold hover:underline">Register</Link>
      </p>
    </div>
  </div>
)
}
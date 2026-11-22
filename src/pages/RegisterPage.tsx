import { Link } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-5 block text-center text-2xl font-bold text-white"
        >
          Pingg<span className="text-crimson">!</span>
        </Link>
        <RegisterForm />
      </div>
    </main>
  )
}

export default RegisterPage

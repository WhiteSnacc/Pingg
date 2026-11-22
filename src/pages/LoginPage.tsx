import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-5 block text-center text-2xl font-bold text-white"
        >
          Pingg<span className="text-crimson">!</span>
        </Link>
        <LoginForm />
      </div>
    </main>
  )
}

export default LoginPage

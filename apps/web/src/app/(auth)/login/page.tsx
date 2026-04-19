import { AdminLoginForm } from '@/components/auth/AdminLoginForm'

export default function LoginPage() {
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>
      <AdminLoginForm />
    </div>
  )
}

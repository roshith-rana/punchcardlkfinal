import { SuperadminLoginForm } from '@/components/auth/SuperadminLoginForm'

export default function SuperadminLoginPage() {
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Superadmin Login</h1>
      <SuperadminLoginForm />
    </div>
  )
}

import { StaffLoginForm } from '@/components/auth/StaffLoginForm'

export default function StaffLoginPage() {
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Staff Login</h1>
      <StaffLoginForm />
    </div>
  )
}

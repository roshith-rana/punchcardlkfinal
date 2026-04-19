'use client'

import { useState } from 'react'
import { loginAdmin } from '@/actions/auth'

type LoginMode = 'password' | 'pin'

export function StaffLoginForm() {
  const [mode, setMode] = useState<LoginMode>('password')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await loginAdmin(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
            mode === 'password'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => setMode('pin')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-t border-b border-r ${
            mode === 'pin'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          PIN Login
        </button>
      </div>

      {mode === 'password' && (
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border sm:text-sm"
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      )}

      {mode === 'pin' && (
        <div className="space-y-4">
          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              PIN login is coming in Phase 3. Please use email & password for now.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode('password')}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Switch to Password Login
          </button>
        </div>
      )}
    </div>
  )
}

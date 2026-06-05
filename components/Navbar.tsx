"use client"

import { authClient } from "@/lib/auth-client"

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              FreelanceHub
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="/skills" className="text-gray-700 hover:text-blue-600">
              Skills
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="/jobs" className="text-gray-700 hover:text-blue-600">
              Jobs
            </a>
          </div>

          {isPending ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-medium">
                {user.name}
              </span>
              <button
                type="button"
                onClick={() => authClient.signOut()}
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Log in
              </a>
              <a
                href="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

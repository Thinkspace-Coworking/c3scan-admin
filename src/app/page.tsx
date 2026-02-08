import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="font-bold text-black text-2xl">C3</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">C3Scan</h1>
        <p className="text-gray-500 mb-8">Digital mailroom management platform</p>

        <div className="space-y-3">
          <Link
            href="/admin"
            className="block w-full bg-[#0F172A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/app"
            className="block w-full bg-white text-gray-900 border border-gray-200 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Customer Portal
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          © 2026 C3Scan.io
        </p>
      </div>
    </div>
  )
}

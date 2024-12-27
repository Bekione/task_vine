'use client'

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">You&apos;re offline</h1>
      <p className="text-gray-600 mb-4">Please check your internet connection</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 rounded-sm bg-gradient-to-r from-gradient-from to-gradient-to hover:opacity-90 text-white"
      >
        Try again
      </button>
    </div>
  )
} 
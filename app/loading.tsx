export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

import { auth, currentUser } from '@clerk/nextjs/server'

export default async function GetUserIdPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600">Not signed in</h1>
          <p className="mt-4">Please sign in first</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">Your Clerk User ID</h1>
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
          <code className="text-lg font-mono break-all">{userId}</code>
        </div>
        <h2 className="text-xl font-bold mb-2">Your Email</h2>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <code className="font-mono">{user.emailAddresses[0]?.emailAddress}</code>
        </div>
        <h2 className="text-xl font-bold mb-2 mt-4">Your Name</h2>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <code className="font-mono">{user.firstName} {user.lastName}</code>
        </div>
      </div>
    </div>
  )
}

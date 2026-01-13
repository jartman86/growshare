import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get the Clerk user ID from environment or command line
  const clerkId = process.argv[2]

  if (!clerkId) {
    console.error('Usage: npm run reset-user <clerkId>')
    console.error('Example: npm run reset-user user_2abc123xyz')
    process.exit(1)
  }

  console.log(`Looking for user with Clerk ID: ${clerkId}`)

  const user = await prisma.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    console.log('User not found - nothing to delete')
    process.exit(0)
  }

  console.log(`Found user: ${user.email} (ID: ${user.id})`)
  console.log('Deleting user and all related records...')

  await prisma.user.delete({
    where: { id: user.id },
  })

  console.log('✅ User deleted successfully!')
  console.log('Now visit /api/auth/sync to create your account with a username')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

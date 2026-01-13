import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const clerkId = 'user_38A2mCg3uQ3fOlHlNROhp2o0aa6'
  const username = 'jartman86'

  console.log(`Updating username for Clerk ID: ${clerkId}`)

  const user = await prisma.user.update({
    where: { clerkId },
    data: { username },
  })

  console.log('✅ Username updated successfully!')
  console.log(`User: ${user.email}`)
  console.log(`Username: ${user.username}`)
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

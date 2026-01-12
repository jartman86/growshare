// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: 'user_38A2mCg3uQ3fOlHlNROhp2o0aa6' },
    })

    if (user) {
      console.log('✅ User found in database!')
      console.log('ID:', user.id)
      console.log('Clerk ID:', user.clerkId)
      console.log('Email:', user.email)
      console.log('Name:', user.firstName, user.lastName)
      console.log('Role:', user.role)
      console.log('Status:', user.status)
    } else {
      console.log('❌ User NOT found in database')
      console.log('The user with Clerk ID user_38A2mCg3uQ3fOlHlNROhp2o0aa6 does not exist')
    }
  } catch (error) {
    console.error('❌ Error checking user:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()

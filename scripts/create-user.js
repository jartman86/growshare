const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createUser() {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: 'user_38A2mCg3uQ3fOlHlNROhp2o0aa6',
        email: 'james@extremeresilience.net',
        firstName: 'Jim',
        lastName: 'Artman',
        role: ['GROWER'],
        status: 'ACTIVE',
        totalPoints: 0,
        level: 1,
      },
    })

    console.log('✅ User created successfully!')
    console.log('ID:', user.id)
    console.log('Clerk ID:', user.clerkId)
    console.log('Email:', user.email)
    console.log('Name:', user.firstName, user.lastName)
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('✅ User already exists in database!')
    } else {
      console.error('❌ Error creating user:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createUser()

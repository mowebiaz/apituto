//import { connect } from "@/lib/db"
import User from '@/app/lib/modals/user'
import connect from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'

const ObjectId = require('mongoose').Types.ObjectId

export const GET = async () => {
  try {
    await connect()
    const users = await User.find()
    return new NextResponse(JSON.stringify(users), { status: 200 })
  } catch (error: any) {
    return new NextResponse('Error fetching users' + error.message, {
      status: 500,
    })
  }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    await connect()
    const newUser = new User(body)
    await newUser.save()
    return new NextResponse(
      JSON.stringify({ message: 'User created successfully', user: newUser }),
      { status: 201 }
    )
  } catch (error: any) {
    return new NextResponse('Error creating user' + error.message, {
      status: 500,
    })
  }
}

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json()
    const { userId, newUsername } = body
    await connect()

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: 'ID or newUsername not found' }),
        {
          status: 400,
        }
      )
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid User id' }), {
        status: 400,
      })
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    )

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          message: 'User not found in dB',
        }),
        { status: 400 }
      )
    }

    return new NextResponse(
      JSON.stringify({
        message: 'User updated successfully',
        user: updatedUser,
      }),
      { status: 200 }
    )
  } catch (error: any) {
    return new NextResponse('Error updating user' + error.message, {
      status: 500,
    })
  }
}

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: 'ID not found' }), {
        status: 400,
      })
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid User id' }), {
        status: 400,
      })
    }

    await connect()
    const deletedUser = await User.findByIdAndDelete(new Types.ObjectId(userId))

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({
          message: 'User not found in dB',
        }),
        { status: 400 }
      )
    }

    return new NextResponse(
      JSON.stringify({
        message: 'User deleted successfully',
        user: deletedUser,
      }),
      { status: 200 }
    )

  } catch (error: any) {
    return new NextResponse('Error deleting user' + error.message, {
      status: 500,
    })
  }
}



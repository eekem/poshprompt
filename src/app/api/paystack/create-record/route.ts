import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, email, packageId, prompts, reference } = await request.json()

    if (!userId || !amount || !email || !packageId || !prompts || !reference) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating payment record with reference:', reference)

    // Create a pending payment record
    try {
      await prisma.payment.create({
        data: {
          userId,
          amount,
          currency: 'USD',
          status: 'pending',
          reference,
          metadata: {
            userId,
            packageId,
            prompts
          },
          promptsPurchased: prompts
        }
      })
      console.log('Payment record created successfully')
    } catch (error) {
      console.error('Error creating payment record:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create payment record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { reference }
    })

  } catch (error) {
    console.error('Create record error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

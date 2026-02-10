import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, email, packageId, prompts } = await request.json()

    if (!userId || !amount || !email || !packageId || !prompts) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const reference = `poshprompt_${userId}_${Date.now()}`

    console.log('Creating payment record with reference:', reference)

    // Create a pending payment record first
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
      throw error
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents and ensure integer
        email: email,
        reference: reference,
        currency: 'USD', // Explicitly set currency to USD
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      })
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status) {
      console.error('Paystack initialization error:', paystackData)
      // Delete the pending payment record if Paystack fails
      await prisma.payment.delete({
        where: { reference }
      })
      return NextResponse.json(
        { success: false, error: 'Failed to initialize payment' },
        { status: 500 }
      )
    }

    // Paystack generates its own reference, so we need to update our record
    const paystackReference = paystackData.data.reference
    
    // Update our payment record with Paystack's reference
    await prisma.payment.update({
      where: { reference },
      data: {
        paystackReference: paystackReference,
        reference: paystackReference // Use Paystack's reference as the primary one
      }
    })

    console.log('Payment record updated with Paystack reference:', paystackReference)

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
        access_code: paystackData.data.access_code
      }
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

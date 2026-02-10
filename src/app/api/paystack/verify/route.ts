import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    console.log('Verification request received for reference:', reference)

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Reference is required' },
        { status: 400 }
      )
    }

    // First, try to find by our reference
    let paymentRecord = await prisma.payment.findUnique({
      where: { reference }
    })

    // If not found, try to find by paystackReference
    if (!paymentRecord) {
      paymentRecord = await prisma.payment.findFirst({
        where: { paystackReference: reference }
      })
      console.log('Looking for paystackReference, found:', paymentRecord ? 'Yes' : 'No')
    }

    // If still not found, this is likely a new Paystack reference
    // Let's find the most recent pending payment and update it
    if (!paymentRecord) {
      console.log('Payment record not found, looking for most recent pending payment')
      
      // Get the most recent pending payment (within last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      paymentRecord = await prisma.payment.findFirst({
        where: {
          status: 'pending',
          createdAt: {
            gte: fiveMinutesAgo
          }
        },
        orderBy: { createdAt: 'desc' }
      })
      
      if (paymentRecord) {
        console.log('Found recent pending payment, updating with Paystack reference')
        // Update the record with Paystack's reference
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: { paystackReference: reference }
        })
        console.log('Updated payment record with Paystack reference:', reference)
      }
    }

    console.log('Payment record found:', paymentRecord ? 'Yes' : 'No')

    if (!paymentRecord) {
      // Try to find all payment records to debug
      const allPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
      console.log('Recent payment records:', allPayments.map(p => ({ 
        reference: p.reference, 
        paystackReference: p.paystackReference, 
        status: p.status, 
        createdAt: p.createdAt 
      })))
      
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      )
    }

    if (paymentRecord.status === 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment already verified' },
        { status: 400 }
      )
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status || paystackData.data.status !== 'success') {
      console.error('Payment verification failed:', paystackData)
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    const { data } = paystackData

    // Extract user and package information from our database record
    const metadata = paymentRecord.metadata as any
    const userId = metadata?.userId
    const promptCount = paymentRecord.promptsPurchased

    console.log('Extracted data from database:', { userId, prompts: promptCount })

    if (!userId || !promptCount) {
      console.error('Invalid metadata in payment record:', paymentRecord.metadata)
      return NextResponse.json(
        { success: false, error: 'Invalid payment metadata' },
        { status: 400 }
      )
    }

    // Update user's prompt count
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        prompts: {
          increment: promptCount
        }
      }
    })

    // Update the payment record to success
    await prisma.payment.update({
      where: { id: paymentRecord.id }, // Use ID instead of reference
      data: {
        status: 'success',
        paystackReference: data.reference,
        amount: data.amount / 100, // Convert from cents to USD
        currency: 'USD'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Payment verified and prompts added successfully',
        promptsAdded: promptCount,
        newPromptCount: updatedUser.prompts,
        transaction: {
          reference: data.reference,
          amount: data.amount / 100, // Convert from cents to USD
          currency: 'USD',
          paidAt: data.paid_at
        }
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle Paystack webhook callbacks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`)
    }

    // Verify the transaction
    const verificationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference })
    })

    const verificationData = await verificationResponse.json()

    if (verificationData.success) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/success?reference=${reference}`)
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`)
    }

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`)
  }
}

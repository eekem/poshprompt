'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/use-auth'
import { PACKAGES, Package } from '@/app/lib/packages'

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onTopUpComplete: (amount: number) => void
}

export default function TopUpModal({ isOpen, onClose, onTopUpComplete }: TopUpModalProps) {
  const { user } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [completedPackage, setCompletedPackage] = useState<Package | null>(null)

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg)
    setError(null)
    setPaymentStatus('idle')
  }

  const handlePayment = async () => {
    if (!selectedPackage || !user) return

    setIsLoading(true)
    setError(null)
    setPaymentStatus('processing')

    try {
      // Create a pending payment record first
      const reference = `poshprompt_${user.id}_${Date.now()}`
      
      const response = await fetch('/api/paystack/create-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: selectedPackage.price,
          email: user.email,
          packageId: selectedPackage.id,
          prompts: selectedPackage.prompts,
          reference: reference,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment record')
      }

      // Open Paystack inline payment directly
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: user.email,
        amount: Math.round(selectedPackage.price * 100), // Convert to cents and ensure integer
        reference: reference, // Use our reference
        currency: 'USD',
        callback: function(response: any) {
          console.log('Paystack callback response:', response)
          console.log('Reference from Paystack:', response.reference)
          // Verify payment with backend
          fetch('/api/paystack/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reference: response.reference,
            }),
          })
          .then(verifyResponse => verifyResponse.json())
          .then(verifyData => {
            if (verifyData.success) {
              setPaymentStatus('success')
              setCompletedPackage(selectedPackage)
              onTopUpComplete(selectedPackage.prompts)
              // Auto-close after showing success state
              setTimeout(() => {
                onClose()
                // Reset state after closing
                setPaymentStatus('idle')
                setCompletedPackage(null)
                setSelectedPackage(null)
              }, 3000)
            } else {
              setPaymentStatus('failed')
              setError('Payment verification failed. Please contact support.')
            }
          })
          .catch(error => {
            console.error('Verification error:', error)
            setPaymentStatus('failed')
            setError('Payment verification failed. Please contact support.')
          })
          .finally(() => {
            setIsLoading(false)
          })
        },
        onClose: function() {
          console.log('Paystack payment closed')
          setIsLoading(false)
          setPaymentStatus('idle')
        },
      })

      handler.openIframe()

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Success State */}
      {paymentStatus === 'success' && completedPackage && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full mb-4 sm:mb-6">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-green-500">check_circle</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Payment Successful!</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            {completedPackage.prompts} prompts have been added to your account
          </p>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h4 className="font-semibold text-white">{completedPackage.name}</h4>
                <p className="text-sm text-gray-400">{completedPackage.prompts} prompts added</p>
              </div>
              <div className="text-green-500 font-bold text-xl">
                +{completedPackage.prompts}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">This window will close automatically...</p>
        </div>
      )}

      {/* Processing State */}
      {paymentStatus === 'processing' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full mb-4 sm:mb-6">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary animate-spin">refresh</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Processing Payment</h3>
          <p className="text-gray-400 text-sm sm:text-base">Please wait while we process your payment...</p>
        </div>
      )}

      {/* Failed State */}
      {paymentStatus === 'failed' && (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full mb-4 sm:mb-6">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-red-500">error</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Payment Failed</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            {error || 'Something went wrong with your payment'}
          </p>
          <button
            onClick={() => setPaymentStatus('idle')}
            className="w-full py-3 bg-primary hover:bg-yellow-500 text-black font-bold rounded-lg transition-transform active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Normal State (Package Selection) */}
      {paymentStatus === 'idle' && (
        <>
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full mb-3 sm:mb-4">
              <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">add_circle</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Top Up Prompts</h3>
            <p className="text-gray-400 text-sm sm:text-base">Choose a package to get more prompts for challenges</p>
          </div>

          {/* Package Selection */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg)}
                className={`w-full p-3 sm:p-4 rounded-xl border transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(245,159,10,0.2)]'
                    : 'bg-surface-dark border-[#332a1e] hover:border-[#493b22]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-left">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <h4 className="font-semibold text-white text-sm sm:text-base">{pkg.name}</h4>
                        {pkg.popular && (
                          <span className="px-1.5 sm:px-2 py-0.5 bg-primary text-black text-xs font-bold rounded-full">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400">{pkg.prompts} prompts</p>
                      {pkg.description && (
                        <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-bold text-primary">
                      {pkg.currency === 'USD' ? '$' : ''}{pkg.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${pkg.pricePerPrompt.toFixed(3)} per prompt
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Package Summary */}
          {selectedPackage && (
            <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">{selectedPackage.name}</h4>
                  <p className="text-xs text-gray-400">
                    {selectedPackage.prompts} prompts • {selectedPackage.currency === 'USD' ? '$' : ''}{selectedPackage.price}
                  </p>
                </div>
                <div className="text-primary font-bold text-lg">
                  {selectedPackage.currency === 'USD' ? '$' : ''}{selectedPackage.price}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-400 text-lg mt-0.5">error</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-surface-dark border border-[#332a1e] text-gray-400 font-medium rounded-lg hover:bg-[#2a2620] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedPackage || isLoading}
              className="w-full sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-primary hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-transform active:scale-95 shadow-[0_0_15px_rgba(245,159,10,0.3)] text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">lock</span>
                  <span>
                    {selectedPackage 
                      ? `Pay ${selectedPackage.currency === 'USD' ? '$' : ''}${selectedPackage.price}` 
                      : 'Select Package'
                    }
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-surface-dark/50 rounded-lg border border-[#332a1e]">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">security</span>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-white mb-1">Secure Payment</h5>
                <p className="text-xs text-gray-400">
                  All transactions are encrypted and secure. Your payment information is protected with industry-standard security through Paystack. Payments processed in USD.
                </p>
              </div>
            </div>
          </div>

          {/* Paystack Badge */}
          <div className="mt-3 sm:mt-4 flex justify-center">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>Powered by</span>
              <span className="font-semibold text-green-500">Paystack</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlanSelection from '@/components/PlanSelection'
import FiatCheckout from '@/components/FiatCheckout'
import CryptoCheckout from '@/components/CryptoCheckout'
import PaymentSuccess from '@/components/PaymentSuccess'

interface Plan {
  id: string
  name: string
  level: string
  price: number
  coins: number
  features: string[]
  popular?: boolean
  custom?: boolean
}

type ViewState = 'selection' | 'payment-method' | 'checkout' | 'crypto-checkout' | 'success'

export default function BuyCoinsPage() {
  const router = useRouter()
  const [viewState, setViewState] = useState<ViewState>('selection')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [transactionId, setTransactionId] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'fiat' | 'crypto'>('fiat')

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setViewState('payment-method')
  }

  const handlePaymentMethodSelect = (method: 'fiat' | 'crypto') => {
    setPaymentMethod(method)
    if (method === 'fiat') {
      setViewState('checkout')
    } else {
      setViewState('crypto-checkout')
    }
  }

  const handlePaymentComplete = (txId: string) => {
    setTransactionId(txId)
    setViewState('success')
  }

  const handleCancel = () => {
    if (viewState === 'checkout' || viewState === 'crypto-checkout') {
      setViewState('payment-method')
    } else {
      setViewState('selection')
      setSelectedPlan(null)
    }
  }

  const handleGoToArena = () => {
    router.push('/dashboard/challenges/arena')
  }

  const handleViewDashboard = () => {
    router.push('/dashboard')
  }

  const transactionFee = selectedPlan ? selectedPlan.price * 0.029 : 0 // 2.9% transaction fee

  return (
    <div className="min-h-screen bg-mesh">
      {/* Page Header */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-2 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">monetization_on</span> PoshCoins Store
          </div>
          <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] mb-3">
            {viewState === 'selection' && 'Buy PoshCoins'}
            {viewState === 'payment-method' && 'Choose Payment Method'}
            {viewState === 'checkout' && 'Fiat Payment'}
            {viewState === 'crypto-checkout' && 'Crypto Payment'}
            {viewState === 'success' && 'Purchase Complete'}
          </h1>
          <p className="text-[#bab09c] text-base font-normal leading-normal">
            {viewState === 'selection' && 'Choose the perfect coin bundle to unlock premium features and dominate the arena.'}
            {viewState === 'payment-method' && 'Select your preferred payment method to complete the purchase.'}
            {viewState === 'checkout' && 'Complete your purchase securely with our payment processor.'}
            {viewState === 'crypto-checkout' && 'Pay using cryptocurrency on the Tron network.'}
            {viewState === 'success' && 'Your PoshCoins have been added to your account successfully.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-8">
        {viewState === 'selection' && (
          <div className="max-w-7xl mx-auto">
            <PlanSelection 
              onPlanSelect={handlePlanSelect}
              selectedPlan={selectedPlan}
            />
          </div>
        )}

        {viewState === 'payment-method' && selectedPlan && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fiat Payment Option */}
              <div 
                onClick={() => handlePaymentMethodSelect('fiat')}
                className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-xl p-6 sm:p-8 cursor-pointer hover:border-primary/50 transition-all group"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-2xl">credit_card</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">Card Payment</h3>
                    <p className="text-[#bab09c] text-sm mb-4">Pay with debit/credit card via Paystack</p>
                    <div className="flex items-center gap-2 text-xs text-[#bab09c]">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>Secure & Fast</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Crypto Payment Option */}
              <div 
                onClick={() => handlePaymentMethodSelect('crypto')}
                className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-xl p-6 sm:p-8 cursor-pointer hover:border-primary/50 transition-all group"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-2xl">currency_bitcoin</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">Cryptocurrency</h3>
                    <p className="text-[#bab09c] text-sm mb-4">Pay with USDT on Tron Network (TRC-20)</p>
                    <div className="flex items-center gap-2 text-xs text-[#bab09c]">
                      <span className="material-symbols-outlined text-xs">bolt</span>
                      <span>Low Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={handleCancel}
                className="text-[#bab09c] hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors mx-auto"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to bundle selection
              </button>
            </div>
          </div>
        )}

        {viewState === 'checkout' && selectedPlan && (
          <FiatCheckout
            orderItem={{
              name: selectedPlan.name,
              description: `${selectedPlan.coins.toLocaleString()} PoshCoins - ${selectedPlan.level}`,
              price: selectedPlan.price
            }}
            transactionFee={transactionFee}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        )}

        {viewState === 'crypto-checkout' && selectedPlan && (
          <CryptoCheckout
            amount={selectedPlan.price}
            currency="USD"
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        )}

        {viewState === 'success' && selectedPlan && (
          <PaymentSuccess
            coinsAdded={selectedPlan.coins}
            newBalance={5420 + selectedPlan.coins} // Example current balance + new coins
            transactionId={transactionId}
            paymentMethod={paymentMethod === 'fiat' ? 'Paystack' : 'Tron Network (USDT)'}
            onGoToArena={handleGoToArena}
            onViewDashboard={handleViewDashboard}
          />
        )}
      </div>
    </div>
  )
}

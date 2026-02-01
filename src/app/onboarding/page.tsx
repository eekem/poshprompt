'use client'

import React, { useState } from 'react'
import PlanSelection from '@/components/PlanSelection'
import CryptoCheckout from '@/components/CryptoCheckout'
import FiatCheckout from '@/components/FiatCheckout'
import PaymentSuccess from '@/components/PaymentSuccess'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

type OnboardingStep = 'plan-selection' | 'payment-method' | 'crypto-checkout' | 'fiat-checkout' | 'success'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('plan-selection')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat' | null>(null)
  const [transactionId, setTransactionId] = useState<string>('')

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setCurrentStep('payment-method')
  }

  const handlePaymentMethodSelect = (method: 'crypto' | 'fiat') => {
    setPaymentMethod(method)
    if (method === 'crypto') {
      setCurrentStep('crypto-checkout')
    } else {
      setCurrentStep('fiat-checkout')
    }
  }

  const handlePaymentComplete = (id: string) => {
    setTransactionId(id)
    setCurrentStep('success')
  }

  const handleCancel = () => {
    if (currentStep === 'crypto-checkout' || currentStep === 'fiat-checkout') {
      setCurrentStep('payment-method')
    } else if (currentStep === 'payment-method') {
      setCurrentStep('plan-selection')
      setSelectedPlan(null)
    }
  }

  const handleGoToAdmin = () => {
    // Navigate to admin dashboard
    window.location.href = '/admin'
  }

  const handleGoToArena = () => {
    // Navigate to arena
    window.location.href = '/arena'
  }

  const handleViewDashboard = () => {
    // Navigate to user dashboard
    window.location.href = '/dashboard'
  }

  const renderPaymentMethodSelection = () => (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-white mb-3">
            Choose Payment Method
          </h1>
          <p className="text-[#bab09c] text-base sm:text-lg max-w-2xl">
            Select your preferred payment method to complete the purchase of {selectedPlan?.coins} {selectedPlan?.coins === 1 ? 'Coin' : 'Coins'}.
          </p>
        </div>
      </div>

      {/* Section: Payment Method */}
      <div className="bg-surface-dark/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-border-dark">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="h-6 w-1 bg-primary rounded-full"></div>
          <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Choose Payment Method</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Fiat Option */}
          <div 
            className="relative group cursor-pointer"
            onClick={() => handlePaymentMethodSelect('fiat')}
          >
            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border-2 border-[#544c3b] bg-surface-dark/40 hover:border-primary hover:ring-1 hover:ring-primary transition-all">
              <div className="bg-[#27231b] size-12 sm:size-14 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[24px] sm:text-[32px]">credit_card</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-white font-bold text-base sm:text-lg">Pay with Fiat</h4>
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 flex-shrink-0">check_circle</span>
                </div>
                <p className="text-[#bab09c] text-sm mb-3 sm:mb-4 leading-relaxed">Secure payment via Visa, Mastercard, or Bank Transfer (Global Support).</p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-[#27231b] rounded border border-[#544c3b] text-[10px] font-bold uppercase text-[#bab09c]">Visa</div>
                  <div className="px-2 py-1 bg-[#27231b] rounded border border-[#544c3b] text-[10px] font-bold uppercase text-[#bab09c]">Mastercard</div>
                  <div className="px-2 py-1 bg-[#27231b] rounded border border-[#544c3b] text-[10px] font-bold uppercase text-[#bab09c]">Wire</div>
                </div>
              </div>
            </div>
          </div>

          {/* Crypto Option */}
          <div 
            className="relative group cursor-pointer"
            onClick={() => handlePaymentMethodSelect('crypto')}
          >
            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border-2 border-[#544c3b] bg-surface-dark/40 hover:border-primary hover:ring-1 hover:ring-primary transition-all">
              <div className="bg-[#27231b] size-12 sm:size-14 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[24px] sm:text-[32px]">currency_bitcoin</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-white font-bold text-base sm:text-lg">Pay with Crypto</h4>
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 flex-shrink-0">check_circle</span>
                </div>
                <p className="text-[#bab09c] text-sm mb-3 sm:mb-4 leading-relaxed">Low fees via TRX or USDT (TRC-20). Instant processing and anonymity.</p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-[#27231b] rounded border border-[#544c3b] text-[10px] font-bold uppercase text-[#bab09c]">TRX</div>
                  <div className="px-2 py-1 bg-[#27231b] rounded border border-[#544c3b] text-[10px] font-bold uppercase text-[#bab09c]">USDT</div>
                  <div className="px-2 py-1 bg-[#27231b] rounded border border-[#544c3b] text-[10px] font-bold uppercase text-[#bab09c]">TRC-20</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Footer */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#393328] flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-center">
            <p className="text-[#bab09c] text-sm">You are purchasing</p>
            <p className="text-white text-xl sm:text-2xl font-black">{selectedPlan?.coins} Coins <span className="text-primary">(${selectedPlan?.price}.00)</span></p>
          </div>
          <button 
            onClick={handleCancel}
            className="w-full sm:w-auto sm:flex-1 sm:min-w-[240px] px-6 sm:px-8 py-3 sm:py-4 bg-[#27231b] text-white rounded-xl font-bold text-base sm:text-lg transition-all hover:bg-[#393328]"
          >
            Back to Plan Selection
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh pt-30">
      <Header />
      
      <main className="flex-1">
        {currentStep === 'plan-selection' && (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-white mb-3">
                  Welcome to PoshPrompt
                </h1>
                <p className="text-[#bab09c] text-base sm:text-lg max-w-2xl">
                  Choose your perfect plan to start competing in premium AI prompt engineering competitions and win substantial rewards.
                </p>
              </div>
            </div>
            
            <PlanSelection 
              onPlanSelect={handlePlanSelect}
              selectedPlan={selectedPlan}
            />
          </div>
        )}

        {currentStep === 'payment-method' && renderPaymentMethodSelection()}

        {currentStep === 'crypto-checkout' && selectedPlan && (
          <CryptoCheckout
            amount={selectedPlan.price}
            currency="TRX"
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 'fiat-checkout' && selectedPlan && (
          <FiatCheckout
            orderItem={{
              name: selectedPlan.name,
              description: `${selectedPlan.coins} PoshCoins`,
              price: selectedPlan.price
            }}
            transactionFee={1.50}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleCancel}
          />
        )}

        {currentStep === 'success' && selectedPlan && (
          <div className="bg-background-dark text-white font-display min-h-screen relative overflow-x-hidden">
            <PaymentSuccess
              coinsAdded={selectedPlan.coins}
              newBalance={selectedPlan.coins + 10000} // Assuming starting balance of 10,000
              transactionId={transactionId}
              paymentMethod={paymentMethod === 'crypto' ? 'TRX Network' : '•••• 4242'}
              onGoToAdmin={handleGoToAdmin}
              onGoToArena={handleGoToArena}
              onViewDashboard={handleViewDashboard}
            />
          </div>
        )}
      </main>
      
      {currentStep !== 'success' && <Footer />}
    </div>
  )
}

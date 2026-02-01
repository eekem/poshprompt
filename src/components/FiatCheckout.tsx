'use client'

import React, { useState } from 'react'

interface OrderItem {
  name: string
  description: string
  price: number
}

interface FiatCheckoutProps {
  orderItem: OrderItem
  transactionFee: number
  onPaymentComplete: (transactionId: string) => void
  onCancel: () => void
}

export default function FiatCheckout({ orderItem, transactionFee, onPaymentComplete, onCancel }: FiatCheckoutProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const totalAmount = orderItem.price + transactionFee

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + ' / ' + v.slice(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentComplete('PSK-' + Date.now())
    }, 3000)
  }

  return (
    <div className="min-h-screen pt-30 bg-mesh">
      {/* Page Heading */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col gap-2 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">lock</span> Secure Transaction
          </div>
          <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] mb-3">Finalize Your Purchase</h1>
          <p className="text-[#bab09c] text-base font-normal leading-normal">Get instant access to premium AI prompt rewards and credits.</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
          {/* Left Pane: Order Summary */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="bg-surface-dark/40 backdrop-blur-xl p-6 sm:p-8 rounded-xl border border-border-dark shadow-sm">
              <h2 className="text-white text-xl sm:text-[22px] font-bold leading-tight mb-4 sm:mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_cart</span> Order Summary
              </h2>
              
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                <div className="size-12 sm:size-16 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(242,185,13,0.3)] shrink-0">
                  <span className="material-symbols-outlined text-white text-2xl sm:text-3xl">token</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-base sm:text-lg">{orderItem.name}</p>
                  <p className="text-[#bab09c] text-sm">{orderItem.description}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#393328]">
                  <p className="text-[#bab09c] text-sm">Bundle Price</p>
                  <p className="text-white text-sm font-medium">${orderItem.price.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#393328]">
                  <p className="text-[#bab09c] text-sm">Transaction Fee (Paystack)</p>
                  <p className="text-white text-sm font-medium">${transactionFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center pt-3 sm:pt-4">
                  <p className="text-white text-base sm:text-lg font-bold">Total Amount</p>
                  <p className="text-primary text-xl sm:text-2xl font-black leading-tight">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 px-2">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-500 mt-0.5 shrink-0">verified</span>
                <div>
                  <p className="text-white text-sm font-bold">Instant Delivery</p>
                  <p className="text-[#bab09c] text-xs">PoshCoins are credited to your account immediately after confirmation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-500 mt-0.5 shrink-0">help</span>
                <div>
                  <p className="text-white text-sm font-bold">Need help?</p>
                  <p className="text-[#bab09c] text-xs">Contact support@poshprompt.ai for billing inquiries.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Paystack Payment Modal Integration */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-xl shadow-2xl overflow-hidden border border-primary/20 shadow-primary/5">
              {/* Paystack Simulation Header */}
              <div className="bg-[#27231b] p-4 sm:p-6 border-b border-[#544c3b] flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#bab09c]">Secure Payment Portal</span>
                  <span className="text-white font-bold text-sm sm:text-base">Paystack Checkout</span>
                </div>
                <img 
                  alt="Paystack" 
                  className="h-5 sm:h-6 grayscale dark:invert shrink-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPlPEUDA0jfvUzUaBoKEHT7Wk3cL1QXS0QVW1PRlQWcBPAcFbKLAl26zd3l107mYDHsNyEmwztd2EECBLOpBmS-OeLrbE4yrnTf2Vd_jIG1coGzIC7FesUkRyu-kn5E3sjtI5HaKrkOlOx7qcEDlyqUmzmpymhCB4zXBAZ537m0bBGB1clp1BKJ4iym4q5Ou29vBNJgbAxOxtMDQxIlh8-qSVFiFyDtpSVyuu9uMKxLhjetDil4i7sXyMXTtvijE5StyXcBMG5Lod4"
                />
              </div>

              <div className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                {/* Card Selection */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-[#bab09c] uppercase tracking-widest">Card Details</label>
                  
                  {/* Card Number */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#bab09c] text-sm sm:text-base">credit_card</span>
                    </div>
                    <input 
                      className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#27231b] border border-[#544c3b] rounded-lg text-white placeholder:text-[#bab09c]/60 focus:ring-primary focus:border-primary transition-all text-base sm:text-lg" 
                      placeholder="0000 0000 0000 0000" 
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Expiry */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[#bab09c] text-sm">calendar_month</span>
                      </div>
                      <input 
                        className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#27231b] border border-[#544c3b] rounded-lg text-white placeholder:text-[#bab09c]/60 focus:ring-primary focus:border-primary transition-all text-base sm:text-lg" 
                        placeholder="MM / YY" 
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength={7}
                      />
                    </div>

                    {/* CVV */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[#bab09c] text-sm">lock</span>
                      </div>
                      <input 
                        className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#27231b] border border-[#544c3b] rounded-lg text-white placeholder:text-[#bab09c]/60 focus:ring-primary focus:border-primary transition-all text-base sm:text-lg" 
                        placeholder="CVV" 
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing || !cardNumber || !expiry || !cvv}
                  className="w-full bg-primary hover:bg-primary/90 text-background-dark font-black text-base sm:text-lg py-4 sm:py-5 rounded-lg shadow-[0_10px_30px_rgba(242,185,13,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Authorize Payment'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>

                {/* Trust Footer */}
                <div className="pt-4 sm:pt-6 border-t border-[#393328] flex flex-col items-center gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 opacity-60 text-center sm:text-left">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] sm:text-[14px]">shield</span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase">PCI-DSS Compliant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px] sm:text-[14px]">lock</span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase">256-bit SSL Secure</span>
                    </div>
                  </div>
                  <p className="text-[#bab09c] text-[10px] sm:text-[11px] text-center max-w-sm leading-relaxed">
                    Your payment details are processed securely and never stored on our servers. 
                    By clicking 'Authorize Payment', you agree to the Terms of Service.
                  </p>
                </div>
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <button 
                onClick={onCancel}
                className="text-[#bab09c] hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Cancel and return to selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

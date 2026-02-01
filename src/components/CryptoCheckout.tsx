'use client'

import React, { useState, useEffect } from 'react'

interface CryptoCheckoutProps {
  amount: number
  currency: string
  onPaymentComplete: (transactionId: string) => void
  onCancel: () => void
}

export default function CryptoCheckout({ amount, currency, onPaymentComplete, onCancel }: CryptoCheckoutProps) {
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'processing' | 'completed'>('waiting')
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + Math.random() * 5
      })
      setTimeLeft(prev => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyAddress = () => {
    navigator.clipboard.writeText('T9yD8S6e625z9sW5t6p1z89e6S5e625z9s')
  }

  const handleCheckTransaction = () => {
    // Simulate transaction check
    setPaymentStatus('processing')
    setTimeout(() => {
      setPaymentStatus('completed')
      onPaymentComplete('TRX-' + Date.now())
    }, 3000)
  }

  return (
    <div className="min-h-screen pt-30 bg-mesh">
      {/* Page Heading */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">Finalize Your Entry</h1>
          <p className="text-[#bab09c] text-base sm:text-lg font-normal max-w-2xl mx-auto">
            Secure your spot in the <span className="text-primary font-semibold">Premium AI Challenge</span>. 
            Complete your payment via Tron Network (TRC-20) to unlock access.
          </p>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Left Side: QR and Status */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-xl p-6 sm:p-8 w-full flex flex-col items-center">
              <div className="relative group mb-6 sm:mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-3 sm:p-4 rounded-lg">
                  <img 
                    alt="Payment QR Code" 
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArXxmYbcwfrrewaWlPqzdLJWOr3KM_IUnixC3IPRFmO6hn_JTE12-RHWvluPA_uRPgvY_ICJ2S_TJe5dRn_JLqMyKaJm5HR45UwRfN8Et0JoNhGCCyrOSRlcJoPBeVob42_DsyfY96E_21vkZevf-Q8_TeHMh-mYbxLL2l82GnUE2iLfxtdAePyknjJRL47lxp5yPSsjrew9tUB-P7vnphudQOw3iqmuezeOe2fTcM4Lf3U0T8aknpcc2yr6AZCDV-h4vuRDzJI6po"
                  />
                </div>
              </div>
              
              <div className="w-full">
                <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                  <span className="material-symbols-outlined text-primary text-lg sm:text-xl spinner-pulse">sync</span>
                  <span className="text-[#bab09b] text-sm font-medium text-primary uppercase tracking-widest">
                    {paymentStatus === 'waiting' ? 'Waiting for Payment' : 
                     paymentStatus === 'processing' ? 'Processing Payment' : 'Payment Completed'}
                  </span>
                </div>
                <div className="bg-[#27231b] rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between text-xs text-[#bab09b] mb-2 uppercase tracking-tighter font-bold">
                    <span>Blockchain Sync</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#393328] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-700" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-[#bab09b] mt-2 sm:mt-3 leading-tight text-center italic">
                    Scanned block #64,921,802...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Details and Forms */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            {/* Payment Summary Card */}
            <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                <div>
                  <p className="text-sm text-[#bab09b] uppercase font-bold tracking-widest mb-1">Entry Fee</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {amount.toFixed(2)} <span className="text-primary">{currency}</span>
                  </h3>
                  <p className="text-sm text-[#bab09b] mt-1">≈ {(amount * 0.143).toFixed(2)} USDT (TRC-20)</p>
                </div>
                <div className="bg-[#27231b] px-3 py-1 rounded border border-[#3a3327] flex items-center gap-2 self-start">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-white uppercase">Tron Mainnet</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#bab09b] text-sm font-medium">Deposit Address (TRC-20 Only)</label>
                  <div className="flex items-stretch">
                    <input 
                      className="bg-[#27231b] border border-[#544c3b] border-r-0 rounded-l-lg text-white text-sm w-full py-2.5 sm:py-3 px-3 sm:px-4 focus:ring-0 focus:border-primary text-xs sm:text-sm" 
                      readOnly 
                      type="text" 
                      value="T9yD8S6e625z9sW5t6p1z89e6S5e625z9s"
                    />
                    <button 
                      onClick={copyAddress}
                      className="bg-primary hover:bg-orange-500 text-black px-3 sm:px-4 rounded-r-lg flex items-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm sm:text-base">content_copy</span>
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#bab09b] mt-1 italic flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    Funds sent via other networks (ERC20/BEP20) will be lost.
                  </p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#27231b] border border-[#544c3b] p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm sm:text-base">schedule</span>
                </div>
                <div>
                  <p className="text-xs text-[#bab09b]">Expires In</p>
                  <p className="text-sm font-bold text-white">{formatTime(timeLeft)}</p>
                </div>
              </div>
              <div className="bg-[#27231b] border border-[#544c3b] p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm sm:text-base">shield</span>
                </div>
                <div>
                  <p className="text-xs text-[#bab09b]">Escrow</p>
                  <p className="text-sm font-bold text-white">Verified</p>
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className="flex flex-col gap-3 mt-2 sm:mt-4">
              <button 
                onClick={handleCheckTransaction}
                disabled={paymentStatus === 'processing'}
                className="w-full py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {paymentStatus === 'processing' ? 'Checking...' : 'Check Transaction on TronScan'}
                <span className="material-symbols-outlined text-sm sm:text-base">open_in_new</span>
              </button>
              <div className="flex justify-between px-2">
                <button onClick={onCancel} className="text-xs text-[#bab09b] hover:text-white transition-colors">
                  Cancel
                </button>
                <a className="text-xs text-[#bab09b] hover:text-white transition-colors" href="#">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

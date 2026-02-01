'use client'

import React from 'react'

interface PaymentSuccessProps {
  coinsAdded: number
  newBalance: number
  transactionId: string
  paymentMethod: string
  onGoToAdmin?: () => void
  onGoToArena?: () => void
  onViewDashboard?: () => void
}

export default function PaymentSuccess({ 
  coinsAdded, 
  newBalance, 
  transactionId, 
  paymentMethod,
  onGoToAdmin,
  onGoToArena,
  onViewDashboard
}: PaymentSuccessProps) {
  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId)
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Subtle Golden Particle Background Effect */}
      <div className="fixed inset-0 pointer-events-none particle-bg"></div>
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
      
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-[560px] w-full flex flex-col items-center">
          {/* Large Amber Checkmark Component */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[40px] sm:blur-[60px] rounded-full"></div>
            <div className="relative size-24 sm:size-32 rounded-xl sm:rounded-full border-4 border-primary flex items-center justify-center golden-glow">
              <span className="material-symbols-outlined text-[60px] sm:text-[80px] text-primary" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
            </div>
          </div>

          {/* Headline Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-white tracking-tight text-3xl sm:text-4xl md:text-[48px] font-bold leading-tight mb-2">Payment Successful!</h1>
            <p className="text-white/60 text-base sm:text-lg">Your account has been credited. You're ready to dominate the arena.</p>
          </div>

          {/* Balance Stats Card */}
          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 backdrop-blur-sm golden-glow">
            <div className="flex flex-col items-center gap-2 mb-4 sm:mb-6">
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest">PoshCoins Added</p>
              <p className="text-primary tracking-tight text-4xl sm:text-5xl font-bold leading-tight">+{coinsAdded.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-[#0bda19] font-medium text-sm px-2 py-0.5 bg-[#0bda19]/10 rounded-full mt-1">
                <span className="material-symbols-outlined text-[14px] sm:text-[16px]">trending_up</span>
                <span className="text-xs sm:text-sm">COMPLETED</span>
              </div>
            </div>

            {/* Description List Container */}
            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex justify-between items-center">
                <p className="text-white/50 text-sm font-normal">New Total Balance</p>
                <p className="text-white text-sm sm:text-base font-bold text-right">{newBalance.toLocaleString()} PoshCoins</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white/50 text-sm font-normal">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-white/80 text-xs sm:text-sm font-mono text-right truncate max-w-[120px] sm:max-w-none">#{transactionId}</p>
                  <span 
                    onClick={copyTransactionId}
                    className="material-symbols-outlined text-[14px] sm:text-[16px] text-white/30 cursor-pointer hover:text-white transition-colors shrink-0"
                  >
                    content_copy
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white/50 text-sm font-normal">Payment Method</p>
                <p className="text-white text-xs sm:text-sm text-right">{paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3 sm:gap-4">
            
            {onGoToArena && (
              <button 
                onClick={onGoToArena}
                className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-background-dark text-base sm:text-lg font-bold rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Back to Arena
              </button>
            )}
            
            {onViewDashboard && (
              <button 
                onClick={onViewDashboard}
                className="w-full h-12 sm:h-14 bg-[#27231b] hover:bg-[#393328] text-white text-sm sm:text-base font-semibold rounded-lg transition-all border border-[#544c3b]"
              >
                View Dashboard
              </button>
            )}
          </div>

          {/* Secondary Link */}
          <a className="mt-6 sm:mt-8 text-white/40 hover:text-white transition-colors text-sm underline underline-offset-4 decoration-white/20" href="#">
            Download Receipt (PDF)
          </a>
        </div>
      </div>

      {/* Footer Decoration / Images */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8 lg:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <div className="aspect-[16/6] sm:aspect-auto sm:aspect-square lg:aspect-[16/6] rounded-xl overflow-hidden border border-white/5">
            <div 
              className="w-full h-full bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBB2cM5DgvSxZR1oAE8OB980sUsDYEFC7BpHOxzLQoMg_I5T7PLKaR2nefyQtrVauolQPFyUxmZil09EwLke4y8-5b5ZDoL7PTm33sEo1V9AsXV8KhJpU6FHzybH3_31XMUMoMlLAlLtoJr_tGIzn15cP3p30jfTPoiqdvhJYaZCCKjg_bHru121eu47SPB5vOs38qby5gbz5rPcfNLJDtTaEwtRIGMr3B7F0EkBoxf7_XWeG93x_OIOZw1l1dvNB57UcMH-mHBpDyK")' }}
            ></div>
          </div>
          <div className="aspect-[16/6] sm:aspect-auto sm:aspect-square lg:aspect-[16/6] rounded-xl overflow-hidden border border-white/5">
            <div 
              className="w-full h-full bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAyBrKxMPT95-P-6Oz5Tgb82Q4FjPCLOSgebwqVECl_QoTkAv_2fkjHLTUVQmEXnABPwcnIwIG7xgu0yKrf-hXLSg5wxkdDT2G6mRBRNhADPNff1ZjfrD9f2OcQjysP17di_ftzuyzvV-fdQWZQfYTPXv_MWW7IV3uaXzdYyVyQuCjnnr2hHy2_H9JCVAS6CnJdkpNnC4A77F6ypeSrwRTNTKjAlry2q0hNlhU7VHj_EyxyZmt9vE0iR98VOdZ7kymgFhPXHVNEldY")' }}
            ></div>
          </div>
          <div className="aspect-[16/6] sm:aspect-auto sm:aspect-square lg:aspect-[16/6] rounded-xl overflow-hidden border border-white/5">
            <div 
              className="w-full h-full bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPvHyuWvJcmN9LbJ1eA6nm-FFhLn5mDftGj9bubaSBoIkN9eNfwDDTzAYui4bQFN2FdGjcQym-Z5_TL5EMzp1VgUPYct6V-1C3IKBEUcXoESYJ-oxUbHoHdUgesL-0GTXTZTEElDpTOfc_E2Xac0KUYMEAApBcKwfcL_13nlIUaXy2crIUqZ_-m448z-vfdxsaDdd64dWnYMDnMWm0Hu8JTehO0fT5zxn9HzLVXe5rcAd7yjP-p05aPmzDMGLircG1g9R0yjmpL8d")' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

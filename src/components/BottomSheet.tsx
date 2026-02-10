'use client'

import React, { useEffect } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop with fade transition */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Bottom Sheet Content with slide-up transition */}
      <div className="absolute bottom-0 left-0 right-0 bg-background-dark border-t border-[#332a1e] rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 pb-4 border-b border-[#332a1e]">
            <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="overflow-y-auto max-h-[75vh] px-4 sm:px-6 pb-6">
          {children}
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { useEffect } from 'react'

type ToastProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border-2"
      style={{
        background: type === 'success' 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
        borderColor: type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
      }}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-6 h-6 text-white" />
      ) : (
        <XCircle className="w-6 h-6 text-white" />
      )}
      <p className="text-white font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  )
}

type ToastContainerProps = {
  toast: { message: string; type: 'success' | 'error' } | null
  onClose: () => void
}

export function ToastContainer({ toast, onClose }: ToastContainerProps) {
  return (
    <AnimatePresence>
      {toast && <Toast message={toast.message} type={toast.type} onClose={onClose} />}
    </AnimatePresence>
  )
}

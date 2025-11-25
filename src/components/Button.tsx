'use client'

import { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform'
  
  const variants = {
    primary: 'bg-white text-primary-600 hover:bg-gray-50 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary text-white hover:bg-secondary-700 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-primary-600 backdrop-blur-sm',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

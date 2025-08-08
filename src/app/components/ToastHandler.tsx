'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Toast } from './Toast'

interface ToastHandlerProps {
  type: 'error' | 'success' | 'info'
  message: string
  replacePath: string
  duration?: number
}

export function ToastHandler({ type, message, replacePath, duration = 5000 }: ToastHandlerProps) {
  const router = useRouter()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      setVisible(false)
      router.replace(replacePath)
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, replacePath, router])

  const handleClose = () => {
    setVisible(false)
    router.replace(replacePath)
  }

  if (!visible || !message) return null

  return <Toast type={type} message={message} duration={duration} onClose={handleClose} />
}

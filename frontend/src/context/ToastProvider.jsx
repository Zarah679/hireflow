import { useState } from 'react'
import ToastContext from './ToastContext.js'
import ToastViewport from '../components/ToastViewport.jsx'

let nextToastId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function dismissToast(toastId) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId))
  }

  function showToast(message, type = 'success') {
    const toastId = nextToastId
    nextToastId += 1

    setToasts((currentToasts) => [
      ...currentToasts,
      { id: toastId, message, type },
    ])

    window.setTimeout(() => dismissToast(toastId), 3500)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

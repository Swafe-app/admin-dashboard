import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/store/adminSlice'
import { useTypeDispatch } from '@/store/hooks'

const useInactiveTimeout = (active: boolean, activeTimout: number) => {
  const router = useRouter()
  const dispatch = useTypeDispatch()
  const inactiveIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>()

  useEffect(() => {
    if (activeTimout === 0 || !active) {
      // Clear the interval when the user is not active
      if (inactiveIntervalRef.current) {
        clearInterval(inactiveIntervalRef.current)
      }
      if (!localStorage.getItem('swafe-admin')) {
        router.push('/login')
      }
      return () => true
    }

    if (!localStorage.getItem('swafe-admin')) {
      dispatch(logout())
    }

    // Clear the previous interval, if any
    if (inactiveIntervalRef.current) {
      clearInterval(inactiveIntervalRef.current)
    }

    // Create a new interval to check for inactivity every minute
    inactiveIntervalRef.current = setInterval(() => {
      // Calculate the inactive time in milliseconds
      const diffMs = Date.now() - activeTimout
      // Calculate the inactive time in minutes
      const minute = Math.floor(diffMs / 60000)

      if (minute >= 5) {
        dispatch(logout())
        clearInterval(inactiveIntervalRef.current)
      }
    }, 60000)

    // Clean up the interval on component unmount
    return () => {
      if (inactiveIntervalRef.current) {
        clearInterval(inactiveIntervalRef.current)
      }
    }
  }, [active, activeTimout])
}

export default useInactiveTimeout

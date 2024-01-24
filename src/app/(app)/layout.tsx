'use client'

import React, { useCallback, useEffect } from 'react'
import RequireLogin from '@/components/RequireLogin/RequireLogin'
import throttle from '@/helpers/throttle'
import useTokenRefresh from '@/hooks/useTokenRefresh'
import useInactiveTimeout from '@/hooks/useInactiveTimeout'
import { useTypeDispatch, useTypeSelector } from '@/store/hooks'
import { setActiveTimout } from '@/store/adminSlice'


export default function RootLayout({ children, }: { children: React.ReactNode }) {
  const { active, activeTimout, JwtTimeout } = useTypeSelector(state => state.admin)
  const dispatch = useTypeDispatch()

  const handleActiveTimeout = useCallback(
    throttle(() => {
      dispatch(setActiveTimout(Date.now()))
    }, 1000),
    []
  )

  useEffect(() => {
    handleActiveTimeout()
  }, [])

  // Get the auth token every x minuts
  useTokenRefresh(JwtTimeout, active)
  useInactiveTimeout(active, activeTimout)

  return (
    <RequireLogin>
      <div onMouseMove={handleActiveTimeout}>
        {children}
      </div>
    </RequireLogin>
  )
}

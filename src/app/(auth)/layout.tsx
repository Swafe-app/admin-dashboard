'use client'

import { resolveAdmin } from '@/store/adminSlice'
import { useTypeDispatch, useTypeSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useTypeDispatch()
  const { active } = useTypeSelector(state => state.admin)

  useEffect(() => {
    if (localStorage.getItem('swafe-admin') || active) {
      dispatch(resolveAdmin())
      router.push('/')
    }
  }, [router, active])

  return children
}

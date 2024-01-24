'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { resolveAdmin } from '@/store/adminSlice'
import { useTypeDispatch, useTypeSelector } from '@/store/hooks'

function RequireLogin({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useTypeDispatch()
  const { active } = useTypeSelector(state => state.admin)
  
  useEffect(() => {
    if (!localStorage.getItem('swafe-admin')) {
      router.push('/login')
    } else {
      dispatch(resolveAdmin())
    }
  }, [dispatch, router])

  return active && children
}

export default RequireLogin

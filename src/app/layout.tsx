'use client'

import React, { useEffect } from 'react'
import { ThemeProvider } from '@mui/material'
import '@/app/globals.css'
import theme from '@/app/theme'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/services/queryClient'
import { Provider } from 'react-redux'
import { setupStore } from '@/store/reducer'

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="fr">
      <head>
        <title>Panel Administrateur Swafe</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Provider store={setupStore()}>
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}

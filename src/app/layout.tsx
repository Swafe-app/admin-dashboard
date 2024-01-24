import React from 'react'
import '@/app/globals.css'

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <title>Panel Administrateur Swafe</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

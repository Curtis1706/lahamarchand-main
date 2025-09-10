import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProviderWrapper } from "@/components/session-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "LAHA MARCHAND - Plateforme Gabon",
  description: "Plateforme de gestion du marché du livre et des œuvres intellectuelles au Gabon",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                   <SessionProviderWrapper>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </SessionProviderWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

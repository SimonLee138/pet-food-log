import { Bell, Home, Search, User } from "lucide-react"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const navItems = [
  { label: "Home", icon: Home, active: true },
  { label: "Search", icon: Search, active: false },
  { label: "Alerts", icon: Bell, active: false },
  { label: "Profile", icon: User, active: false },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          {children}

          <nav
            aria-label="Mobile navigation"
            className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur-sm md:hidden"
          >
            <div className="mx-auto flex max-w-md items-center justify-around px-3 py-2">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  type="button"
                  className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </ThemeProvider>
      </body>
    </html>
  )
}

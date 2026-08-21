"use client"

import { Bell, Home, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Food Record", href: "/food-record/create", icon: Search },
  { label: "Log Table", href: "/log-table", icon: Bell },
  { label: "Profile", href: "/#", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur-sm md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-3 py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={label}
              href={href}
              className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

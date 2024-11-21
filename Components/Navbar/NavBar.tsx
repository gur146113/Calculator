"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { calculators } from "@/lib/calculators"

export function Navbar() {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-[calc(100vh-3.5rem)]">
      <div className="space-y-4 py-4">
        {calculators.map((calculator) => (
          <Link key={calculator.route} href={calculator.route} passHref>
            <Button
              variant={pathname === calculator.route ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === calculator.route && "bg-muted font-semibold"
              )}
            >
              <calculator.icon className="mr-2 h-4 w-4" />
              {calculator.name}
            </Button>
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}


"use client"

import { Navbar } from "@/Components/Navbar/NavBar"
import { SettingsMenu } from "@/components/settings/SettingsMenu"
import React, { useState, useEffect } from "react"
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <html lang="en" className={theme}>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex h-screen">
          <aside className="w-64 border-r bg-gray-100 dark:bg-gray-800">
            <div className="flex h-14 items-center border-b px-4">
              <h1 className="text-lg font-semibold">Calculators</h1>
              <div className="ml-auto">
                <SettingsMenu toggleTheme={toggleTheme} />
              </div>
            </div>
            <Navbar />
          </aside>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <Toaster/>
        </div>
      </body>
    </html>
  )
}


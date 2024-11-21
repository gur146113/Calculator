"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clipboard, ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type HistoryItem = {
  expression: string
  result: string
}

const MAX_DISPLAY_LENGTH = 12

export default function AdvancedCalculator() {
  const [display, setDisplay] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(true)
  const [decimalPoints, setDecimalPoints] = useState("2")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem("calculatorHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("calculatorHistory", JSON.stringify(history))
  }, [history])

  const formatNumber = (num: number): string => {
    if (num.toString().length > MAX_DISPLAY_LENGTH) {
      return num.toExponential(parseInt(decimalPoints)).toString()
    }
    return num.toFixed(parseInt(decimalPoints))
  }

  const safeEval = (expr: string): number => {
    if (expr.trim() === "") return 0;
    expr = expr.replace(/\*\*/g, "Math.pow");
    expr = expr.replace(/e/g, "Math.E");
    const sandboxFunc = new Function('return ' + expr);
    try {
      const result = sandboxFunc();
      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid result");
      }
      return result;
    } catch (error) {
      throw new Error("Calculation error");
    }
  }

  const calculateResult = useCallback(() => {
    if (display.trim() === "") {
      setDisplay("")
      return;
    }
    try {
      const result = safeEval(display)
      const formattedResult = formatNumber(result)
      setHistory((prev) => [{ expression: display, result: formattedResult }, ...prev].slice(0, 10))
      setDisplay(formattedResult)
    } catch (error) {
      setDisplay("Error")
    }
  }, [display, decimalPoints])

  const handleInput = useCallback((value: string) => {
    if (value === "C") {
      setDisplay("")
    } else if (value === "=") {
      calculateResult()
    } else if (value === "⌫") {
      setDisplay(prev => prev.slice(0, -1))
    } else {
      setDisplay(prev => {
        if (prev.length >= MAX_DISPLAY_LENGTH) return prev
        return prev + value
      })
    }
    inputRef.current?.focus()
  }, [calculateResult])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Implement a toast notification here if desired
  }

  const buttons = [
    "C", "(", ")", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "e", "=",
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[95vw] lg:max-w-6xl mx-auto">
      <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Input
              ref={inputRef}
              type="text"
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
              className="text-right text-3xl lg:text-4xl font-bold flex-grow mr-2 bg-white dark:bg-gray-700"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  calculateResult()
                }
              }}
            />
            <Select value={decimalPoints} onValueChange={setDecimalPoints}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Decimals" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} {n === 1 ? "decimal" : "decimals"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button) => (
              <Button
                key={button}
                onClick={() => handleInput(button)}
                className={cn(
                  "p-4 text-xl lg:text-2xl h-16 lg:h-20 rounded-xl transition-all duration-200 ease-in-out",
                  button === "C" && "bg-red-500 hover:bg-red-600 text-white",
                  button === "=" && "bg-green-500 hover:bg-green-600 text-white",
                  isNaN(Number(button)) && button !== "C" && button !== "=" && "bg-blue-100 text-black dark:text-white dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600",
                  !isNaN(Number(button)) && "bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                {button}
              </Button>
            ))}
          </div>
          <Button
            className="w-full mt-6 text-lg"
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </CardContent>
      </Card>
      {showHistory && (
        <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">History</h2>
            <ScrollArea className="h-[400px] lg:h-[500px] pr-4">
              {history.map((item, index) => (
                <div key={index} className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.expression}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(item.expression)}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg lg:text-xl font-semibold">{item.result}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(item.result)}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


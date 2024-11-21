
"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clipboard, ChevronDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type Currency = {
  code: string
  symbol: string
  name: string
}

type HistoryItem = {
  loanAmount: number
  interestRate: number
  loanTerm: number
  propertyTax: number
  insurance: number
  monthlyPayment: number
  currency: Currency
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
]

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(200000)
  const [interestRate, setInterestRate] = useState<number>(3.5)
  const [loanTerm, setLoanTerm] = useState<number>(30)
  const [propertyTax, setPropertyTax] = useState<number>(0)
  const [insurance, setInsurance] = useState<number>(0)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(true)
  const [decimalPoints, setDecimalPoints] = useState("2")
  const [currency, setCurrency] = useState<Currency>(currencies[0])

  useEffect(() => {
    const savedHistory = localStorage.getItem("mortgageCalculatorHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("mortgageCalculatorHistory", JSON.stringify(history))
  }, [history])

  const calculateMortgage = useCallback(() => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    const monthlyMortgagePayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalMonthlyPayment = monthlyMortgagePayment + (propertyTax + insurance) / 12

    setMonthlyPayment(totalMonthlyPayment)
    setHistory((prev) => [
      { loanAmount, interestRate, loanTerm, propertyTax, insurance, monthlyPayment: totalMonthlyPayment, currency },
      ...prev
    ].slice(0, 10))
  }, [loanAmount, interestRate, loanTerm, propertyTax, insurance, currency])

  const formatCurrency = (value: number, currencyObj: Currency = currency): string => {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: currencyObj.code,
      minimumFractionDigits: parseInt(decimalPoints),
      maximumFractionDigits: parseInt(decimalPoints),
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Implement a toast notification here if desired
  }
return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[95vw] lg:max-w-6xl mx-auto">
      <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Mortgage Calculator</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency.code} onValueChange={(value) => setCurrency(currencies.find(c => c.code === value) || currencies[0])}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="text-right text-lg font-bold bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="text-right text-lg font-bold bg-white dark:bg-gray-700"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="text-right text-lg font-bold bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="propertyTax">Annual Property Tax</Label>
              <Input
                id="propertyTax"
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(Number(e.target.value))}
                className="text-right text-lg font-bold bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="insurance">Annual Insurance</Label>
              <Input
                id="insurance"
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(Number(e.target.value))}
                className="text-right text-lg font-bold bg-white dark:bg-gray-700"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Decimal Points</Label>
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
            <Button
              onClick={calculateMortgage}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-xl p-6"
            >
              Calculate
            </Button>
          </div>
          <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
            <Label>Monthly Payment</Label>

Guri, [11/21/24 2:12 PM]
<div className="text-3xl font-bold text-right">
              {formatCurrency(monthlyPayment)}
            </div>
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
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Calculation History</h2>
            <ScrollArea className="h-[400px] lg:h-[500px] pr-4">
              {history.map((item, index) => (
                <div key={index} className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Currency:</span>
                      <span>{item.currency.symbol} - {item.currency.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Loan Amount:</span>
                      <span>{formatCurrency(item.loanAmount, item.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Interest Rate:</span>
                      <span>{item.interestRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Loan Term:</span>
                      <span>{item.loanTerm} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Property Tax:</span>
                      <span>{formatCurrency(item.propertyTax, item.currency)}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Insurance:</span>
                      <span>{formatCurrency(item.insurance, item.currency)}/year</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-semibold">Monthly Payment:</span>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{formatCurrency(item.monthlyPayment, item.currency)}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(formatCurrency(item.monthlyPayment, item.currency))}
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
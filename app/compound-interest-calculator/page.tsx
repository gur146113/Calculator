"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [compounds, setCompounds] = useState<string>("1"); // Default: Annually
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convert rate to decimal
    const t = parseFloat(time);
    const n = parseFloat(compounds);

    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n)) {
      alert("Please enter valid numbers.");
      return;
    }

    // Compound interest formula: A = P(1 + r/n)^(nt)
    const A = P * Math.pow(1 + r / n, n * t);
    const CI = A - P;

    const calculation = `Principal: ${P}, Rate: ${rate}%, Time: ${time} years, Compounds/year: ${compounds}, Interest: ${CI.toFixed(
      2
    )}, Total Amount: ${A.toFixed(2)}`;
    setResult(`Compound Interest: ${CI.toFixed(2)}, Total Amount: ${A.toFixed(2)}`);
    addToHistory(calculation);
  };

  const addToHistory = (calculation: string) => {
    setHistory((prevHistory) => [calculation, ...prevHistory]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Premium Compound Interest Calculator
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Use this premium tool to calculate compound interest on your investments or savings. Easily track your calculations and optimize your financial planning!
          </p>
          <div className="space-y-4">
            {/* Principal Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Principal Amount (₹)
              </Label>
              <Input
                type="number"
                placeholder="Enter the principal amount"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Rate Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Annual Interest Rate (%)
              </Label>
              <Input
                type="number"
                placeholder="Enter the interest rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Time Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time (Years)
              </Label>
              <Input
                type="number"
                placeholder="Enter the time in years"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Compounds Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Compounds per Year
              </Label>
              <Input
                type="number"
                placeholder="Enter compounds per year (e.g., 12 for monthly)"
                value={compounds}
                onChange={(e) => setCompounds(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={calculateCompoundInterest}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Calculate Compound Interest
              </Button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 text-center">
              {result}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="w-full max-w-md shadow-lg mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Calculation History</h3>
            <Button
              variant="ghost"
              onClick={clearHistory}
              className="text-red-500 hover:text-red-600 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Clear History
            </Button>
          </div>
          {history.length > 0 ? (
            <ScrollArea className="max-h-64">
              <ul className="space-y-2">
                {history.map((entry, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded p-2"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No calculations yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

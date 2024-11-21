"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const tipPercent = parseFloat(tipPercentage);

    if (isNaN(bill) || isNaN(tipPercent)) {
      alert("Please enter valid numbers for both fields.");
      return;
    }

    const calculatedTip = (bill * tipPercent) / 100;
    const calculatedTotal = bill + calculatedTip;

    setTipAmount(calculatedTip);
    setTotalAmount(calculatedTotal);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-gray-50 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Tip Calculator</h2>
          <div className="space-y-4">
            {/* Bill Amount Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bill Amount
              </Label>
              <Input
                type="number"
                placeholder="Enter your bill amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Tip Percentage Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tip Percentage (%)
              </Label>
              <Input
                type="number"
                placeholder="Enter tip percentage"
                value={tipPercentage}
                onChange={(e) => setTipPercentage(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Calculate Button */}
            <Button onClick={calculateTip} className="w-full bg-blue-500 hover:bg-blue-600">
              Calculate Tip
            </Button>
          </div>

          {/* Results */}
          {tipAmount !== null && totalAmount !== null && (
            <div className="mt-6 space-y-4">
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Tip Amount: <span className="font-bold">{tipAmount.toFixed(2)}</span>
              </div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Total Amount: <span className="font-bold">{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

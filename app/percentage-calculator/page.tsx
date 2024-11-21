"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

export default function EnhancedPercentageCalculator() {
  const [number, setNumber] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = (calculation: string) => {
    setHistory((prevHistory) => [calculation, ...prevHistory]);
  };

  const calculatePercentage = () => {
    const num = parseFloat(number);
    const perc = parseFloat(percentage);

    if (isNaN(num) || isNaN(perc)) {
      alert("Please enter valid numbers.");
      return;
    }

    const calculatedValue = (num * perc) / 100;
    const calculation = `${perc}% of ${num} = ${calculatedValue}`;
    setResult(calculation);
    addToHistory(calculation);
  };

  const calculatePercentageOfTotal = () => {
    const num = parseFloat(number);
    const perc = parseFloat(percentage);

    if (isNaN(num) || isNaN(perc) || perc === 0) {
      alert("Please enter valid numbers, and the total must not be 0.");
      return;
    }

    const calculatedPercentage = (num / perc) * 100;
    const calculation = `${num} is ${calculatedPercentage}% of ${perc}`;
    setResult(calculation);
    addToHistory(calculation);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Enhanced Percentage Calculator
          </h2>
          <div className="space-y-4">
            {/* Number Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter a Number
              </Label>
              <Input
                type="number"
                placeholder="Enter the number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Percentage Input */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Percentage or Total
              </Label>
              <Input
                type="number"
                placeholder="Enter the percentage or total"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={calculatePercentage}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Calculate Percentage
              </Button>
              <Button
                onClick={calculatePercentageOfTotal}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Calculate Percentage of Total
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

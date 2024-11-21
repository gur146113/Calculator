"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DateCalculator() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      alert("Please enter both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());

    const years = Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25));
    const months = Math.floor((timeDiff % (1000 * 3600 * 24 * 365.25)) / (1000 * 3600 * 24 * 30.4375));
    const days = Math.floor((timeDiff % (1000 * 3600 * 24 * 30.4375)) / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setResult(
      `Difference: ${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`
    );
  };

  const clearFields = () => {
    setStartDate("");
    setEndDate("");
    setResult("");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Date Difference Calculator
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Calculate the difference between two dates in years, months, days, hours, minutes, and seconds.
          </p>

          <div className="space-y-4">
            {/* Start Date */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e, "start")}
                className="w-full"
              />
            </div>

            {/* End Date */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(e, "end")}
                className="w-full"
              />
            </div>

            {/* Calculate Button */}
            <Button className="w-full" onClick={calculateDateDifference}>
              Calculate Difference
            </Button>

            {/* Result */}
            {result && (
              <div className="mt-4 text-lg text-center font-medium text-gray-700 dark:text-gray-300">
                {result}
              </div>
            )}

            {/* Clear Button */}
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={clearFields}
            >
              Clear Fields
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

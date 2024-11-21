"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AgeCalculator() {
  const [dob, setDob] = useState<string | null>(null);
  const [ageDetails, setAgeDetails] = useState<{
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (dob) {
      const workerCode = `
        self.onmessage = function (e) {
          const dob = new Date(e.data.dob);
          const now = new Date();
          const diffMs = now - dob;

          const seconds = Math.floor(diffMs / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);
          const weeks = Math.floor(days / 7);
          const years = Math.floor(days / 365.25);
          const months = Math.floor(years * 12);

          self.postMessage({
            years,
            months,
            weeks,
            days,
            hours,
            minutes,
            seconds,
          });
        };
      `;

      const workerBlob = new Blob([workerCode], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(workerBlob));

      worker.postMessage({ dob });
      worker.onmessage = (event) => {
        setAgeDetails(event.data);
        worker.terminate();
      };
    }
  }, [dob]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[95vw] lg:max-w-6xl mx-auto">
      <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">Age Calculator</h2>
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </Label>
              <input
                type="date"
                className="w-full px-3 py-2 border dark:bg-blue-950 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {dob && (
        <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Your Age</h2>
            <div className="space-y-4">
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Years:</span> {ageDetails.years}
              </div>
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Months:</span> {ageDetails.months}
              </div>
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Weeks:</span> {ageDetails.weeks}
              </div>
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Days:</span> {ageDetails.days}
              </div>
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Hours:</span> {ageDetails.hours}
              </div>
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Minutes:</span> {ageDetails.minutes}
              </div>
              <div className="text-lg font-medium">
                <span className="text-gray-700 dark:text-gray-300">Seconds:</span> {ageDetails.seconds}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

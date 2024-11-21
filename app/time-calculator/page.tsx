"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const TimeCalculator = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [addedTime, setAddedTime] = useState("");
  const [subtractedTime, setSubtractedTime] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateTimeDifference = () => {
    try {
      const [startHours, startMinutes, startSeconds] = startTime
        .split(":")
        .map((part) => parseInt(part));
      const [endHours, endMinutes, endSeconds] = endTime
        .split(":")
        .map((part) => parseInt(part));

      if (
        isNaN(startHours) ||
        isNaN(startMinutes) ||
        isNaN(startSeconds) ||
        isNaN(endHours) ||
        isNaN(endMinutes) ||
        isNaN(endSeconds)
      ) {
        throw new Error("Invalid time format. Please use HH:MM:SS.");
      }

      const startTimeInSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
      const endTimeInSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

      const timeDiffInSeconds = endTimeInSeconds - startTimeInSeconds;

      if (timeDiffInSeconds < 0) {
        throw new Error("End time cannot be earlier than start time.");
      }

      const hours = Math.floor(timeDiffInSeconds / 3600);
      const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
      const seconds = timeDiffInSeconds % 60;

      setResult(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
      setError(null);
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  const addTime = () => {
    try {
      const [hoursToAdd, minutesToAdd, secondsToAdd] = addedTime
        .split(":")
        .map((part) => parseInt(part));

      if (
        isNaN(hoursToAdd) ||
        isNaN(minutesToAdd) ||
        isNaN(secondsToAdd)
      ) {
        throw new Error("Invalid time format. Please use HH:MM:SS.");
      }

      const [currentHours, currentMinutes, currentSeconds] = startTime
        .split(":")
        .map((part) => parseInt(part));

      if (isNaN(currentHours) || isNaN(currentMinutes) || isNaN(currentSeconds)) {
        throw new Error("Invalid start time format. Please use HH:MM:SS.");
      }

      let newSeconds = currentSeconds + secondsToAdd;
      let newMinutes = currentMinutes + minutesToAdd + Math.floor(newSeconds / 60);
      let newHours = currentHours + hoursToAdd + Math.floor(newMinutes / 60);

      newSeconds %= 60;
      newMinutes %= 60;
      newHours %= 24;

      setResult(`${newHours}:${newMinutes}:${newSeconds}`);
      setError(null);
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  const subtractTime = () => {
    try {
      const [hoursToSubtract, minutesToSubtract, secondsToSubtract] = subtractedTime
        .split(":")
        .map((part) => parseInt(part));

      if (
        isNaN(hoursToSubtract) ||
        isNaN(minutesToSubtract) ||
        isNaN(secondsToSubtract)
      ) {
        throw new Error("Invalid time format. Please use HH:MM:SS.");
      }

      const [currentHours, currentMinutes, currentSeconds] = startTime
        .split(":")
        .map((part) => parseInt(part));

      if (isNaN(currentHours) || isNaN(currentMinutes) || isNaN(currentSeconds)) {
        throw new Error("Invalid start time format. Please use HH:MM:SS.");
      }

      let newSeconds = currentSeconds - secondsToSubtract;
      let newMinutes = currentMinutes - minutesToSubtract;
      let newHours = currentHours - hoursToSubtract;

      if (newSeconds < 0) {
        newSeconds += 60;
        newMinutes -= 1;
      }
      if (newMinutes < 0) {
        newMinutes += 60;
        newHours -= 1;
      }
      if (newHours < 0) {
        newHours += 24;
      }

      setResult(`${newHours}:${newMinutes}:${newSeconds}`);
      setError(null);
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card className="w-full shadow-lg p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">Time Calculator</h2>
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time (HH:MM:SS)
              </Label>
              <Input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Enter start time"
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time (HH:MM:SS)
              </Label>
              <Input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Enter end time"
                className="w-full"
              />
            </div>

            <Button onClick={calculateTimeDifference} className="w-full mt-4">
              Calculate Time Difference
            </Button>

            {error && (
              <div className="mt-4 text-red-500 font-semibold">{error}</div>
            )}

            {result && (
              <div className="mt-4 text-green-500 font-semibold">
                <p>Time Difference: {result}</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-bold text-lg">Add Time</h3>
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Time (HH:MM:SS)
                </Label>
                <Input
                  type="text"
                  value={addedTime}
                  onChange={(e) => setAddedTime(e.target.value)}
                  placeholder="Enter time to add"
                  className="w-full"
                />
              </div>
              <Button onClick={addTime} className="w-full mt-4">
                Add Time
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-lg">Subtract Time</h3>
              <div>
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtract Time (HH:MM:SS)
                </Label>
                <Input
                  type="text"
                  value={subtractedTime}
                  onChange={(e) => setSubtractedTime(e.target.value)}
                  placeholder="Enter time to subtract"
                  className="w-full"
                />
              </div>
              <Button onClick={subtractTime} className="w-full mt-4">
                Subtract Time
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeCalculator;

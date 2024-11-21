"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

// GPA scales mapping (for 8, 4, and 10 point scales)
const scaleMappings = {
  8: {
    "A+": 8.0,
    "A": 7.0,
    "B+": 6.0,
    "B": 5.0,
    "C+": 4.0,
    "C": 3.0,
    "D": 2.0,
    "F": 0.0,
  },
  4: {
    "A+": 4.0,
    "A": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "C+": 2.3,
    "C": 2.0,
    "D": 1.0,
    "F": 0.0,
  },
  10: {
    "A+": 10.0,
    "A": 9.0,
    "B+": 8.0,
    "B": 7.0,
    "C+": 6.0,
    "C": 5.0,
    "D": 4.0,
    "F": 0.0,
  },
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<{ name: string; grade: string; credits: string }[]>([]);
  const [gpa, setGPA] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [scale, setScale] = useState<number>(4); // Default scale is 4
  const [isPercentageMode, setIsPercentageMode] = useState<boolean>(false);
  const [percentile, setPercentile] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<string | null>(null);

  const addCourse = () => {
    setCourses([...courses, { name: "", grade: "A", credits: "3" }]);
  };

  const handleCourseChange = (
    index: number,
    field: "name" | "grade" | "credits",
    value: string
  ) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    for (let course of courses) {
      const gradePoints = scaleMappings[scale][course.grade];
      const credits = parseFloat(course.credits);
      if (!gradePoints || isNaN(credits)) continue;

      totalCredits += credits;
      totalPoints += gradePoints * credits;
    }

    if (totalCredits === 0) {
      alert("Please enter valid course details.");
      return;
    }

    const calculatedGPA = totalPoints / totalCredits;
    const result = `Total Credits: ${totalCredits}, GPA: ${calculatedGPA.toFixed(2)}`;
    setGPA(`Your GPA is: ${calculatedGPA.toFixed(2)}`);
    addToHistory(result);
  };

  const addToHistory = (result: string) => {
    setHistory([result, ...history]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // GPA to Percentile Conversion (for 4 and 10 scale)
  const gpaToPercentile = (gpa: number): string => {
    if (scale === 4) {
      return ((gpa / 4.0) * 100).toFixed(2) + "%";
    } else if (scale === 10) {
      return ((gpa / 10.0) * 100).toFixed(2) + "%";
    }
    return "Not supported for 8-point scale";
  };

  // Percentile to GPA Conversion (for 4 and 10 scale)
  const percentileToGPA = (percentile: number): number => {
    if (scale === 4) {
      return (percentile / 100) * 4;
    } else if (scale === 10) {
      return (percentile / 100) * 10;
    }
    return 0;
  };

  // Percentile Calculation
  const calculatePercentile = () => {
    if (gpa) {
      const gpaValue = parseFloat(gpa.split(" ")[2]);
      const calculatedPercentile = gpaToPercentile(gpaValue);
      setPercentile(`Your Percentile is: ${calculatedPercentile}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Premium GPA and Percentile Calculator
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Use this advanced GPA calculator to compute your GPA based on your courses, grades, and credits. Convert GPA to Percentile and track your progress with history!
          </p>

          <div className="space-y-4">
            {/* Scale Selector Dropdown */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade Scale</Label>
              <Select value={scale.toString()} onValueChange={(value) => setScale(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select grade scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4.0 Scale</SelectItem>
                  <SelectItem value="8">8.0 Scale</SelectItem>
                  <SelectItem value="10">10.0 Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course Inputs */}
            {courses.map((course, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Name</Label>
                  <Input
                    value={course.name}
                    onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</Label>
                  <Select value={course.grade} onValueChange={(value) => handleCourseChange(index, "grade", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C+">C+</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Credits</Label>
                  <Input
                    value={course.credits}
                    onChange={(e) => handleCourseChange(index, "credits", e.target.value)}
                    type="number"
                    className="w-full"
                  />
                </div>
              </div>
            ))}

            <Button className="w-full" onClick={addCourse}>Add Course</Button>

            <div className="mt-4 flex justify-center space-x-4">
              <Button className="w-1/2" onClick={calculateGPA}>Calculate GPA</Button>
              <Button className="w-1/2" variant="outline" onClick={clearHistory}>Clear History</Button>
            </div>

            <div className="mt-6 text-center">
              {gpa && <p className="font-medium text-lg text-gray-700 dark:text-gray-300">{gpa}</p>}
              {percentile && <p className="font-medium text-lg text-gray-700 dark:text-gray-300">{percentile}</p>}
            </div>
          </div>

          {/* Conversion and History Section */}
          <div className="mt-8">
            <Button onClick={calculatePercentile}>Calculate Percentile</Button>

            <div className="mt-4">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conversion: GPA to Percentile</Label>
              <Input
                type="number"
                value={percentage || ""}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Enter GPA or Percentile"
                className="w-full mt-2"
              />
              <Button onClick={() => setPercentile(gpaToPercentile(parseFloat(percentage || "0")))}>
                Convert GPA to Percentile
              </Button>
              <Button onClick={() => setGPA(`Your GPA is: ${percentileToGPA(parseFloat(percentage || "0")).toFixed(2)}`)}>
                Convert Percentile to GPA
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">History</h3>
              <ScrollArea className="mt-2 h-32 overflow-y-auto">
                <ul className="space-y-2">
                  {history.map((entry, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{entry}</span>
                      <Button
                        variant="link"
                        className="text-red-600"
                        onClick={() => {
                          const newHistory = [...history];
                          newHistory.splice(index, 1);
                          setHistory(newHistory);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Unit = "metric" | "imperial"
type Gender = "male" | "female"

interface BMICategory {
  name: string
  range: string
  color: string
}

const BMI_CATEGORIES: BMICategory[] = [
  { name: "Underweight", range: "< 18.5", color: "bg-blue-500" },
  { name: "Normal weight", range: "18.5 - 24.9", color: "bg-green-500" },
  { name: "Overweight", range: "25 - 29.9", color: "bg-yellow-500" },
  { name: "Obese", range: "≥ 30", color: "bg-red-500" },
]

export default function UltimateBMICalculator() {
  const [unit, setUnit] = useState<Unit>("metric")
  const [gender, setGender] = useState<Gender>("male")
  const [age, setAge] = useState(30)
  const [height, setHeight] = useState(unit === "metric" ? 170 : 67)
  const [weight, setWeight] = useState(unit === "metric" ? 70 : 154)
  const [bmi, setBMI] = useState(0)
  const [bodyFat, setBodyFat] = useState(0)

  const calculateBMI = useCallback(() => {
    let calculatedBMI: number
    if (unit === "metric") {
      calculatedBMI = weight / ((height / 100) ** 2)
    } else {
      calculatedBMI = (weight / (height ** 2)) * 703
    }
    setBMI(parseFloat(calculatedBMI.toFixed(1)))

    // Calculate body fat percentage using the BMI method
    const bodyFatPercentage = (1.20 * calculatedBMI) + (0.23 * age) - (10.8 * (gender === "male" ? 1 : 0)) - 5.4
    setBodyFat(parseFloat(bodyFatPercentage.toFixed(1)))
  }, [unit, height, weight, age, gender])

  useEffect(() => {
    calculateBMI()
  }, [calculateBMI])

  const getBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return BMI_CATEGORIES[0]
    if (bmi < 25) return BMI_CATEGORIES[1]
    if (bmi < 30) return BMI_CATEGORIES[2]
    return BMI_CATEGORIES[3]
  }

  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit !== unit) {
      setUnit(newUnit)
      if (newUnit === "metric") {
        setHeight(Math.round(height * 2.54))
        setWeight(Math.round(weight / 2.205))
      } else {
        setHeight(Math.round(height / 2.54))
        setWeight(Math.round(weight * 2.205))
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[95vw] lg:max-w-6xl mx-auto">
      <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">Ultimate BMI Calculator</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="unit-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit System</Label>
              <Select value={unit} onValueChange={(value: Unit) => handleUnitChange(value)}>
                <SelectTrigger id="unit-select" className="w-full">
                  <SelectValue placeholder="Select unit system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</Label>
              <RadioGroup value={gender} onValueChange={(value: Gender) => setGender(value)} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="age-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</Label>
              <Slider
                id="age-slider"
                value={[age]}
                onValueChange={(value) => setAge(value[0])}
                min={2}
                max={120}
                step={1}
                className="w-full"
              />
              <div className="mt-2 text-center">{age} years</div>
            </div>
            <div>
              <Label htmlFor="height-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height ({unit === "metric" ? "cm" : "in"})
              </Label>
              <Input
                id="height-input"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="weight-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight ({unit === "metric" ? "kg" : "lbs"})
              </Label>
              <Input
                id="weight-input"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full lg:w-[450px] shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">Your Results</h2>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold">{bmi}</div>
              <div className="text-xl mt-2">{getBMICategory(bmi).name}</div>
            </div>
            <div className="flex justify-between items-center">
              {BMI_CATEGORIES.map((category, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1/4 h-2 first:rounded-l-full last:rounded-r-full",
                    category.color,
                    getBMICategory(bmi).name === category.name ? "h-4" : ""
                  )}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {BMI_CATEGORIES.map((category, index) => (
                <div key={index} className="text-center">
                  <div className={cn("w-4 h-4 rounded-full mx-auto mb-2", category.color)} />
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{category.range}</div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Estimated Body Fat</div>
              <div className="text-4xl mt-2">{bodyFat}%</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>BMI and estimated body fat are simple ways to evaluate body composition, but they're not perfect. Other factors like muscle mass, bone density, and overall body composition also play important roles in determining health.</p>
              <p className="mt-2">Always consult with a healthcare professional for a comprehensive health assessment.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


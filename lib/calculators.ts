import { Calculator, Home, Percent, Scale, Clock, Car, Banknote, GraduationCap, Calendar, Utensils, DollarSign, PiggyBank, CalculatorIcon as ScientificCalculator, Baby, Building } from "lucide-react"

export const calculators = [
  { name: "Home", icon: Home, route: "/" },
  { name: "Calculator", icon: Calculator, route: "/calculator" },
  { name: "Mortgage", icon: Home, route: "/mortgage-calculator" },
  { name: "BMI", icon: Scale, route: "/bmi-calculator" },
  { name: "Loan", icon: Banknote, route: "/loan-calculator" },
  { name: "Time", icon: Clock, route: "/time-calculator" },
  { name: "Car Loan", icon: Car, route: "/car-loan-calculator" },
  { name: "Car Payment", icon: Car, route: "/car-payment-calculator" },
  { name: "Auto Loan", icon: Car, route: "/auto-loan-calculator" },
  { name: "Compound Interest", icon: Percent, route: "/compound-interest-calculator" },
  { name: "Percentage", icon: Percent, route: "/percentage-calculator" },
  { name: "GPA", icon: GraduationCap, route: "/gpa-calculator" },
  { name: "Date", icon: Calendar, route: "/date-calculator" },
  { name: "Cumulative Interest", icon: Percent, route: "/cumulative-interest-calculator" },
  { name: "Date to Date", icon: Calendar, route: "/date-to-date-calculator" },
  { name: "Calorie", icon: Utensils, route: "/calorie-calculator" },
  { name: "Payroll", icon: DollarSign, route: "/payroll-calculator" },
  { name: "Paycheck", icon: DollarSign, route: "/paycheck-calculator" },
  { name: "Tip", icon: DollarSign, route: "/tip-calculator" },
  { name: "Investment", icon: PiggyBank, route: "/investment-calculator" },
  { name: "Scientific", icon: ScientificCalculator, route: "/scientific-calculator" },
  { name: "Age", icon: Baby, route: "/age-calculator" },
  { name: "Concrete", icon: Building, route: "/concrete-calculator" },
]


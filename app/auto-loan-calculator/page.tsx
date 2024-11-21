"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
//import { Spinner } from "@/components/ui/spinner"; // Assuming you have a spinner component

// Web Worker Code (can be put in a separate file like 'worker.ts')
const workerCode = `
self.onmessage = function (e) {
  const { loanAmount, interestRate, loanTerm, downPayment, tradeInValue, salesTax } = e.data;

  const loanAmountAfterDownPayment = loanAmount - downPayment - tradeInValue;
  const loanAmountWithTax = loanAmountAfterDownPayment * (1 + salesTax / 100);
  const loanTermMonths = loanTerm * 12;

  // Monthly interest rate
  const monthlyInterestRate = interestRate / 100 / 12;

  // Calculate monthly payment using the loan amortization formula
  const monthlyPaymentCalc =
    (loanAmountWithTax * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

  const totalPaid = monthlyPaymentCalc * loanTermMonths;
  const totalInterest = totalPaid - loanAmountWithTax;

  // Generate amortization schedule
  const schedule = [];
  let balance = loanAmountWithTax;
  for (let month = 1; month <= loanTermMonths; month++) {
    const interestPayment = balance * monthlyInterestRate;
    const principalPayment = monthlyPaymentCalc - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month,
      principal: principalPayment.toFixed(2),
      interest: interestPayment.toFixed(2),
      totalPayment: monthlyPaymentCalc.toFixed(2),
      balance: balance.toFixed(2),
    });
  }

  postMessage({
    monthlyPayment: monthlyPaymentCalc.toFixed(2),
    totalLoanAmount: totalPaid.toFixed(2),
    totalInterestPaid: totalInterest.toFixed(2),
    amortizationSchedule: schedule,
  });
};
`;

const blob = new Blob([workerCode], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));

export default function AutoLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [salesTax, setSalesTax] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const calculateLoan = () => {
    // Input Validation
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setError("Please enter valid values for all fields.");
      return;
    }

    // Reset errors and loading state
    setError("");
    setLoading(true);

    worker.postMessage({
      loanAmount,
      interestRate,
      loanTerm,
      downPayment,
      tradeInValue,
      salesTax,
    });

    worker.onmessage = (e) => {
      const {
        monthlyPayment,
        totalLoanAmount,
        totalInterestPaid,
        amortizationSchedule,
      } = e.data;

      setMonthlyPayment(monthlyPayment);
      setTotalLoanAmount(totalLoanAmount);
      setTotalInterestPaid(totalInterestPaid);
      setAmortizationSchedule(amortizationSchedule);
      setLoading(false); // Stop loading when calculation is done
    };

    worker.onerror = (err) => {
      setError("An error occurred while calculating the loan.");
      setLoading(false);
    };
  };

  const clearFields = () => {
    setLoanAmount(0);
    setInterestRate(0);
    setLoanTerm(0);
    setDownPayment(0);
    setTradeInValue(0);
    setSalesTax(0);
    setMonthlyPayment(0);
    setTotalLoanAmount(0);
    setTotalInterestPaid(0);
    setAmortizationSchedule([]);
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Auto Loan Calculator</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Calculate your auto loan details including monthly payment, total loan amount, and amortization schedule.
          </p>

          {/* Error Message */}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {/* Loan Details */}
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loan Amount ($)</Label>
              <Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Rate (%)</Label>
              <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loan Term (Years)</Label>
              <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Down Payment ($)</Label>
              <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trade-In Value ($)</Label>
              <Input type="number" value={tradeInValue} onChange={(e) => setTradeInValue(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sales Tax (%)</Label>
              <Input type="number" value={salesTax} onChange={(e) => setSalesTax(Number(e.target.value))} className="w-full" />
            </div>

            {/* Calculate Button */}
            <Button className="w-full" onClick={calculateLoan} disabled={loading}>
              {loading ?"Loading..." : "Calculate Loan"}
            </Button>

            {/* Results */}
            {monthlyPayment && (
              <div className="mt-6 text-lg font-medium">
                <div>Monthly Payment: ${monthlyPayment}</div>
                <div>Total Loan Amount: ${totalLoanAmount}</div>
                <div>Total Interest Paid: ${totalInterestPaid}</div>
              </div>
            )}

            {/* Clear Button */}
            <Button variant="outline" className="mt-4 w-full" onClick={clearFields}>
              Clear Fields
            </Button>

            {/* Amortization Schedule */}
            {amortizationSchedule.length > 0 && (
              <div className="mt-6">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Principal ($)</TableCell>
                      <TableCell>Interest ($)</TableCell>
                      <TableCell>Total Payment ($)</TableCell>
                      <TableCell>Balance ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {amortizationSchedule.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.principal}</TableCell>
                        <TableCell>{row.interest}</TableCell>
                        <TableCell>{row.totalPayment}</TableCell>
                        <TableCell>{row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

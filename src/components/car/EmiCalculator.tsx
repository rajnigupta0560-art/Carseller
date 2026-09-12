import React, { useState, useMemo } from 'react';
import { calculateEmi, formatPrice, formatExactPrice } from '../../utils/formatters';
import { Calculator, BadgePercent, Calendar, Wallet } from 'lucide-react';

interface EmiCalculatorProps {
  carPrice: number;
  carTitle?: string;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({ carPrice, carTitle }) => {
  // Defaults: 20% down payment, 48 months tenure, 9.5% interest rate
  const defaultDownPayment = Math.round((carPrice * 0.2) / 10000) * 10000;
  const [downPayment, setDownPayment] = useState<number>(defaultDownPayment);
  const [tenureYears, setTenureYears] = useState<number>(4); // in years
  const [interestRate, setInterestRate] = useState<number>(9.5); // % p.a.

  const tenureMonths = tenureYears * 12;
  const loanAmount = Math.max(0, carPrice - downPayment);

  const { monthlyEmi, totalInterest, totalPayment } = useMemo(() => {
    return calculateEmi(loanAmount, interestRate, tenureMonths);
  }, [loanAmount, interestRate, tenureMonths]);

  // Down payment percentage
  const downPaymentPercent = Math.round((downPayment / carPrice) * 100);
  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 0;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              EMI & Loan Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize loan terms for {carTitle || 'this vehicle'}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <BadgePercent className="w-4 h-4" />
          <span>Low Interest from 8.75%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Down Payment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Down Payment ({downPaymentPercent}%)</span>
              </label>
              <span className="font-bold text-slate-900 dark:text-white font-mono text-base">
                {formatExactPrice(downPayment)}
              </span>
            </div>
            <input
              type="range"
              min={Math.round(carPrice * 0.1)}
              max={Math.round(carPrice * 0.7)}
              step={10000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              <span>Min: {formatPrice(Math.round(carPrice * 0.1))} (10%)</span>
              <span>Max: {formatPrice(Math.round(carPrice * 0.7))} (70%)</span>
            </div>
          </div>

          {/* Slider 2: Tenure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Loan Tenure: {tenureYears} Years ({tenureMonths} Months)</span>
              </label>
              <span className="font-bold text-slate-900 dark:text-white font-mono text-base">
                {tenureYears} Yrs
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className={`py-2 text-xs font-bold rounded-xl transition border cursor-pointer ${
                    tenureYears === yr
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  {yr} {yr === 1 ? 'Year' : 'Years'}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 3: Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Annual Interest Rate (% p.a.)</span>
              </label>
              <span className="font-bold text-slate-900 dark:text-white font-mono text-base">
                {interestRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={8.5}
              max={15.0}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              <span>Best: 8.50%</span>
              <span>Standard: 11.5%</span>
              <span>Max: 15.0%</span>
            </div>
          </div>
        </div>

        {/* Output Result Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Estimated Monthly Installment
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-4 font-heading text-white">
              {formatExactPrice(monthlyEmi)}
              <span className="text-xs font-medium text-slate-400"> / month</span>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1 mb-5">
              <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${principalPercent}%` }}
                  title={`Principal: ${principalPercent}%`}
                ></div>
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${interestPercent}%` }}
                  title={`Interest: ${interestPercent}%`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  Principal ({principalPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                  Interest ({interestPercent}%)
                </span>
              </div>
            </div>

            {/* Detailed summary rows */}
            <div className="space-y-2.5 text-xs border-t border-slate-700/80 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Price:</span>
                <span className="font-semibold text-white">{formatExactPrice(carPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Loan Principal:</span>
                <span className="font-semibold text-white">{formatExactPrice(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-semibold text-amber-300">{formatExactPrice(totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 pt-2 font-bold text-sm">
                <span className="text-slate-200">Total Loan Amount Paid:</span>
                <span className="text-white">{formatExactPrice(totalPayment)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
            <p className="text-[11px] text-slate-400">
              *Instant loan approval available with HDFC, ICICI, SBI & Axis Bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

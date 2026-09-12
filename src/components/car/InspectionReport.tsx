import React, { useState } from 'react';
import { InspectionCategory } from '../../types';
import { ShieldCheck, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface InspectionReportProps {
  score: number;
  categories: InspectionCategory[];
}

export const InspectionReport: React.FC<InspectionReportProps> = ({ score, categories }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleCategory = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const totalInspectedPoints = categories.reduce((acc, cat) => acc + cat.totalPoints, 0);
  const totalPassedPoints = categories.reduce((acc, cat) => acc + cat.passedPoints, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors duration-200">
      {/* Header with Certified Seal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex flex-col items-center justify-center font-black">
              <span className="text-xl font-heading leading-none">{score}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-0.5">/ 100</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                140+ Points Inspection Certificate
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 uppercase">
                Passed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified Non-Accidental • Structural Integrity Passed • No Flood Damage
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <span className="font-bold text-slate-800 dark:text-slate-200">{totalPassedPoints} of {totalInspectedPoints}</span> parameters checked & cleared
        </div>
      </div>

      {/* Categories Accordion */}
      <div className="space-y-3">
        {categories.map((category, idx) => {
          const isExpanded = expandedIndex === idx;
          const isFullPass = category.passedPoints === category.totalPoints;

          return (
            <div
              key={category.name}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleCategory(idx)}
                className="w-full flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isFullPass
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {isFullPass ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-heading">
                      {category.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {category.passedPoints}/{category.totalPoints} Checks Cleared
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {Math.round((category.passedPoints / category.totalPoints) * 100)}% Pass
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  )}
                </div>
              </button>

              {/* Items List */}
              {isExpanded && (
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-start justify-between gap-3 text-xs py-1.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        {item.status === 'Pass' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="text-slate-800 dark:text-slate-200 font-medium">{item.name}</span>
                          {item.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                          item.status === 'Pass'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Full 140+ checkpoint signed report available at showroom.</span>
        </span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
          Download Sample Certificate PDF
        </span>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { CarCard } from '../components/car/CarCard';
import { DEALERSHIP, TRUST_BADGES, POPULAR_BRANDS, HOME_FAQS } from '../config/dealership';
import { getWhatsAppGeneralUrl, formatPrice } from '../utils/formatters';
import {
  Search,
  ShieldCheck,
  Award,
  RotateCcw,
  FileCheck,
  BadgePercent,
  Car,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Sliders,
  Zap,
  Check,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { cars } = useInventory();
  const navigate = useNavigate();

  // Search Widget Mode Tab: 'buy' | 'sell' | 'emi'
  const [searchTab, setSearchTab] = useState<'buy' | 'sell' | 'emi'>('buy');

  // Quick search widget state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');

  // Quick sell hero mini inputs
  const [sellYear, setSellYear] = useState('2021');
  const [sellBrand, setSellBrand] = useState('Hyundai');
  const [sellKm, setSellKm] = useState('25000');

  // Quick EMI hero mini inputs
  const [emiBudget, setEmiBudget] = useState('15000');

  // Interactive Collections Tab
  const [collectionTab, setCollectionTab] = useState<'all' | 'lowKm' | 'suv' | 'automatic'>('all');

  // Interactive Homepage EMI Calculator state
  const [calcCarPrice, setCalcCarPrice] = useState<number>(1200000);
  const [calcDownPaymentPercent, setCalcDownPaymentPercent] = useState<number>(20);
  const [calcTenureYears, setCalcTenureYears] = useState<number>(5);
  const interestRateAnnual = 0.095; // 9.5%

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Filtered cars by collection
  const filteredCollectionCars = useMemo(() => {
    let result = cars.filter((c) => c.status === 'Available');
    if (collectionTab === 'lowKm') {
      result = result.filter((c) => c.km <= 25000);
    } else if (collectionTab === 'suv') {
      result = result.filter((c) => c.bodyType === 'SUV');
    } else if (collectionTab === 'automatic') {
      result = result.filter((c) => c.transmission === 'Automatic');
    }
    return result.slice(0, 6);
  }, [cars, collectionTab]);

  // Counts for category badges
  const suvCount = cars.filter((c) => c.bodyType === 'SUV' && c.status === 'Available').length;
  const sedanCount = cars.filter((c) => c.bodyType === 'Sedan' && c.status === 'Available').length;
  const hatchbackCount = cars.filter((c) => c.bodyType === 'Hatchback' && c.status === 'Available').length;
  const muvCount = cars.filter((c) => c.bodyType === 'MUV' && c.status === 'Available').length;

  const budgetUnder8Count = cars.filter((c) => c.price < 800000 && c.status === 'Available').length;
  const budget8To15Count = cars.filter((c) => c.price >= 800000 && c.price <= 1500000 && c.status === 'Available').length;
  const budget15To20Count = cars.filter((c) => c.price > 1500000 && c.price <= 2000000 && c.status === 'Available').length;
  const budgetAbove20Count = cars.filter((c) => c.price > 2000000 && c.status === 'Available').length;

  // EMI Calculator math
  const downPaymentAmount = Math.round((calcCarPrice * calcDownPaymentPercent) / 100);
  const principal = calcCarPrice - downPaymentAmount;
  const monthlyRate = interestRateAnnual / 12;
  const numberOfMonths = calcTenureYears * 12;
  const calculatedMonthlyEmi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1)
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedBodyType) params.append('body', selectedBodyType);
    if (selectedBudget) params.append('budget', selectedBudget);
    navigate(`/inventory?${params.toString()}`);
  };

  const handleHeroSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/sell-car?brand=${encodeURIComponent(sellBrand)}&year=${sellYear}&km=${sellKm}`);
  };

  const handleHeroEmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxPrice = Number(emiBudget) * 55; // rough max affordability
    navigate(`/inventory?maxPrice=${maxPrice}`);
  };

  const reviews = [
    {
      name: 'Aditya Verma',
      carBought: 'Hyundai Creta SX (O) Diesel',
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Outstanding transparency! The 140+ inspection report was 100% accurate. Smooth RC transfer within 12 days and doorstep test drive made the whole experience effortless.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Pooja Kulkarni',
      carBought: 'Tata Nexon Fearless MT',
      rating: 5,
      date: '1 month ago',
      comment:
        'Got the exact car I was searching for with low mileage and complete dealer service records. The low-interest loan was approved within 3 hours. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Sunil Mehta',
      carBought: 'Honda City ZX CVT',
      rating: 5,
      date: '1 month ago',
      comment:
        'I also sold my old Swift here through their instant valuation tool and got ₹35,000 more than competing platforms. Professional team and immediate bank payout.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. CINEMATIC LUXURY HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b0f19] text-white pt-10 pb-20 lg:pt-16 lg:pb-28">
        {/* Background Decorative Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-25">
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-600 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines & Multi-Tab Concierge Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Certified Pre-Owned Excellence • 140+ Points Check</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-heading leading-[1.12]">
                The Smarter Way to Buy & Sell Certified Cars.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Zero Worries.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Skip traditional dealer haggling and unverified repairs. Handpicked inventory with 1-Year Free Warranty, 5-Day Money-Back Guarantee, and doorstep test drives.
              </p>

              {/* INTERACTIVE MULTI-TAB CONCIERGE SEARCH CARD */}
              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 dark:border-slate-800 text-slate-900 dark:text-white transition-all">
                {/* Search Tabs Header */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSearchTab('buy')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      searchTab === 'buy'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Buy Certified</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchTab('sell')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      searchTab === 'sell'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Sell Instantly</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchTab('emi')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      searchTab === 'emi'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>By Monthly EMI</span>
                  </button>
                </div>

                {/* TAB 1: BUY USED CARS */}
                {searchTab === 'buy' && (
                  <form onSubmit={handleHeroSearch} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Brand Select */}
                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Select Brand
                        </label>
                        <select
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer mt-0.5 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                        >
                          <option value="">All Brands</option>
                          {POPULAR_BRANDS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Budget Range */}
                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Budget
                        </label>
                        <select
                          value={selectedBudget}
                          onChange={(e) => setSelectedBudget(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer mt-0.5 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                        >
                          <option value="">Any Budget</option>
                          <option value="under-8">Under ₹8 Lakh ({budgetUnder8Count})</option>
                          <option value="8-15">₹8 Lakh - ₹15 Lakh ({budget8To15Count})</option>
                          <option value="15-20">₹15 Lakh - ₹20 Lakh ({budget15To20Count})</option>
                          <option value="above-20">Above ₹20 Lakh ({budgetAbove20Count})</option>
                        </select>
                      </div>

                      {/* Body Style */}
                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Body Style
                        </label>
                        <select
                          value={selectedBodyType}
                          onChange={(e) => setSelectedBodyType(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer mt-0.5 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                        >
                          <option value="">All Body Styles</option>
                          <option value="SUV">SUV ({suvCount})</option>
                          <option value="Sedan">Sedan ({sedanCount})</option>
                          <option value="Hatchback">Hatchback ({hatchbackCount})</option>
                          <option value="MUV">MUV / 7-Seater ({muvCount})</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.99] transition cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search {cars.length} Certified Cars</span>
                    </button>
                  </form>
                )}

                {/* TAB 2: SELL YOUR CAR FAST */}
                {searchTab === 'sell' && (
                  <form onSubmit={handleHeroSellSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Registration Year
                        </label>
                        <select
                          value={sellYear}
                          onChange={(e) => setSellYear(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer mt-0.5 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                        >
                          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Car Make
                        </label>
                        <select
                          value={sellBrand}
                          onChange={(e) => setSellBrand(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer mt-0.5 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                        >
                          {POPULAR_BRANDS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Kilometers Run
                        </label>
                        <input
                          type="number"
                          step={5000}
                          value={sellKm}
                          onChange={(e) => setSellKm(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none mt-0.5"
                          placeholder="e.g. 25000"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-[0.99] transition cursor-pointer"
                    >
                      <span>Get Instant Valuation Estimate →</span>
                    </button>
                  </form>
                )}

                {/* TAB 3: SEARCH BY EMI */}
                {searchTab === 'emi' && (
                  <form onSubmit={handleHeroEmiSubmit} className="space-y-3">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Maximum Monthly EMI Target
                        </label>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                          ₹{Number(emiBudget).toLocaleString('en-IN')} / mo
                        </span>
                      </div>
                      <input
                        type="range"
                        min="8000"
                        max="50000"
                        step="1000"
                        value={emiBudget}
                        onChange={(e) => setEmiBudget(e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>₹8,000/mo</span>
                        <span>₹25,000/mo</span>
                        <span>₹50,000+/mo</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Find Cars Within ₹{Number(emiBudget).toLocaleString('en-IN')}/mo</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Popular Quick Category Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold text-[11px]">Trending:</span>
                <Link
                  to="/inventory?body=SUV"
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition text-[11px] font-medium"
                >
                  🚙 SUVs ({suvCount})
                </Link>
                <Link
                  to="/inventory?transmission=Automatic"
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition text-[11px] font-medium"
                >
                  ⚡ Automatics
                </Link>
                <Link
                  to="/inventory?budget=under-8"
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition text-[11px] font-medium"
                >
                  💰 Under ₹8 Lakh
                </Link>
                <Link
                  to="/sell-car"
                  className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/40 text-[11px] font-bold transition"
                >
                  Sell My Car →
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Flagship Car Showcase Card with Hotspots */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl p-4 sm:p-5 group">
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold flex items-center gap-1.5 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" />
                    <span>AutoTrust Certified #1</span>
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>98/100 Inspection Score</span>
                  </div>
                </div>

                {/* Car Showcase Image with subtle hover zoom */}
                <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                    alt="2023 Hyundai Creta SX (O)"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-white font-heading">
                        2023 Hyundai Creta SX (O)
                      </h3>
                      <p className="text-xs text-slate-300">18,500 km • Diesel • Automatic</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">All-Inclusive</span>
                      <span className="text-base font-black text-white font-mono">₹14.85 Lakh</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Hotspot Feature Cards */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-200 block">140+ Checks</span>
                    <span className="text-[9px] text-slate-400 block">Non-Accidental</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <RotateCcw className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-200 block">5-Day Return</span>
                    <span className="text-[9px] text-slate-400 block">100% Refund</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-200 block">1-Yr Warranty</span>
                    <span className="text-[9px] text-slate-400 block">Free Roadside</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Doorstep test drive available today</span>
                  <Link
                    to="/inventory/car-1"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                  >
                    <span>View Car Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FLOATING DEALERSHIP METRICS STRIP */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-slate-800/70 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 dark:border-slate-800 text-center shadow-xl">
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-white font-heading">{DEALERSHIP.carsSold}</div>
              <div className="text-xs text-slate-400 font-medium">Happy Drivers Served</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">140+ Checks</div>
              <div className="text-xs text-slate-400 font-medium">Certified Inspection</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-heading">1-Year Free</div>
              <div className="text-xs text-slate-400 font-medium">Comprehensive Warranty</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading flex items-center justify-center gap-1">
                <span>{DEALERSHIP.googleRating}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="text-xs text-slate-400 font-medium">{DEALERSHIP.googleReviewCount}+ Google Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY BODY STYLE & LIFESTYLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Explore by Category
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Find the Perfect Match for Your Lifestyle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From city commuters to adventure SUVs, every category is certified and ready for immediate delivery.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* SUVs */}
          <Link
            to="/inventory?body=SUV"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                SUVs & Crossovers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                High ground clearance, command view & rugged comfort.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>{suvCount} Available</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Sedans */}
          <Link
            to="/inventory?body=Sedan"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Executive Sedans
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Smooth highway cruising, premium rear legroom & boot space.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>{sedanCount} Available</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hatchbacks */}
          <Link
            to="/inventory?body=Hatchback"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                City Hatchbacks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Effortless parking, highest fuel mileage & low maintenance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>{hatchbackCount} Available</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* MUVs */}
          <Link
            to="/inventory?body=MUV"
            className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Family 7-Seaters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Spacious seating for full family vacations & road trips.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{muvCount} Available</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. SHOP BY BUDGET CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Tailored Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                Shop by Budget Segment
              </h2>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all price brackets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/inventory?budget=under-8"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition group"
            >
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Smart Saver</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                Under ₹8 Lakh
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {budgetUnder8Count} certified hatchbacks & compact sedans
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Browse cars</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/inventory?budget=8-15"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition group"
            >
              <span className="text-[11px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                Most Popular
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                ₹8 - ₹15 Lakh
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {budget8To15Count} mid-SUVs, premium sedans & automatics
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Browse cars</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/inventory?budget=15-20"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition group"
            >
              <span className="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                Premium Choice
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                ₹15 - ₹20 Lakh
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {budget15To20Count} top-trim SUVs, sunroofs & 4x4s
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Browse cars</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/inventory?budget=above-20"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition group"
            >
              <span className="text-[11px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                Luxury Segment
              </span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                Above ₹20 Lakh
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {budgetAbove20Count} luxury cruisers & flagship editions
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Browse cars</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CURATED CERTIFIED INVENTORY WITH INTERACTIVE COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Vehicles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Featured Certified Inventory
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Inspected, sanitized, and ready for immediate delivery with paperwork assistance.
            </p>
          </div>

          {/* Interactive Collection Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCollectionTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                collectionTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🔥 All Featured
            </button>
            <button
              onClick={() => setCollectionTab('lowKm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                collectionTab === 'lowKm'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ⭐ Low KM (&lt;25k)
            </button>
            <button
              onClick={() => setCollectionTab('suv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                collectionTab === 'suv'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🚙 SUVs
            </button>
            <button
              onClick={() => setCollectionTab('automatic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                collectionTab === 'automatic'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ⚡ Automatics
            </button>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCollectionCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="text-center mt-10 px-2">
          <Link
            to="/inventory"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition text-center max-w-full"
          >
            <span>Explore Entire Catalog with Live Filters ({cars.length} Cars)</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </section>

      {/* 6. THE 3-STEP "AUTOTRUST PURCHASE JOURNEY" */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 sm:py-20 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Transparent & 100% Risk-Free
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              How Buying From AutoTrust Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Three transparent steps to get behind the wheel without anxiety or dealership pressure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black font-heading flex items-center justify-center text-lg mb-5 shadow-md shadow-blue-600/20">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">
                Pick Online & Doorstep Test Drive
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse high-resolution 360° photo galleries and book an obligation-free doorstep test drive at your home or office.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Booking Lock-in</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black font-heading flex items-center justify-center text-lg mb-5 shadow-md shadow-indigo-600/20">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">
                140+ Points Certified Transparency
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Review verified diagnostic reports, paint thickness meters, service logs, and legal RTO clearance before paying a single rupee.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Non-Accidental Guarantee</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black font-heading flex items-center justify-center text-lg mb-5 shadow-md shadow-emerald-600/20">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mb-2">
                Drive Home with 5-Day Return
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Enjoy hassle-free free RC name transfer, 1-Year Comprehensive Warranty, and a 5-Day 100% Money-Back Policy.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" />
                <span>5-Day Full Money-Back</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE HOMEPAGE EMI & AFFORDABILITY CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Car Loan EMI Estimator
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-1">
                  Calculate Your Monthly Ownership Cost
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Adjust car price and loan duration to find comfortable monthly installments.
                </p>
              </div>

              {/* Slider 1: Car Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Vehicle Price</span>
                  <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                    {formatPrice(calcCarPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="400000"
                  max="3500000"
                  step="50000"
                  value={calcCarPrice}
                  onChange={(e) => setCalcCarPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹4 Lakh</span>
                  <span>₹20 Lakh</span>
                  <span>₹35 Lakh</span>
                </div>
              </div>

              {/* Slider 2: Down Payment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Down Payment ({calcDownPaymentPercent}%)
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {formatPrice(downPaymentAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={calcDownPaymentPercent}
                  onChange={(e) => setCalcDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Selector 3: Tenure */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Loan Tenure (Years)
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {[3, 4, 5, 6, 7].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setCalcTenureYears(year)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        calcTenureYears === year
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {year} Yrs
                    </button>
                  ))}
                </div>
              </div>

              {/* Banking Partners */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Instant Paperless Approval with Top Banks:
                </span>
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">HDFC Bank</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">ICICI Bank</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">State Bank of India</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Axis Bank</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Result Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div>
                <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">
                  Estimated Installment
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono mt-1">
                  ₹{calculatedMonthlyEmi.toLocaleString('en-IN')}
                  <span className="text-sm font-sans font-normal text-blue-200"> / month</span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-white/15 pt-4">
                <div className="flex justify-between text-blue-100">
                  <span>Loan Amount (Principal):</span>
                  <span className="font-mono font-bold text-white">{formatPrice(principal)}</span>
                </div>
                <div className="flex justify-between text-blue-100">
                  <span>Indicative Interest Rate:</span>
                  <span className="font-mono font-bold text-white">9.5% p.a.</span>
                </div>
                <div className="flex justify-between text-blue-100">
                  <span>Loan Duration:</span>
                  <span className="font-mono font-bold text-white">{calcTenureYears * 12} Months</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/inventory?maxPrice=${calcCarPrice}`)}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs sm:text-sm shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Find Certified Cars Near {formatPrice(calcCarPrice)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SELL YOUR CAR INSTANT VALUATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-blue-800/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Highest Market Value Guaranteed</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading leading-tight">
              Selling Your Old Car? Get Instant Valuation & Same-Day Bank Payout
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No endless phone calls or lowball dealers. Free doorstep evaluation, zero paperwork charge, and instant same-day bank payment directly to your account.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
              <Link
                to="/sell-car"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-400/20 active:scale-95 transition"
              >
                Get Free Online Valuation →
              </Link>
              <a
                href={getWhatsAppGeneralUrl('Hi AutoTrust, I want to sell my car. Can you give me an estimate?')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-xs transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Sell via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER TESTIMONIALS & GOOGLE BADGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Loved by 8,500+ Enthusiasts & Families
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-sm">
              G
            </div>
            <div className="text-left leading-none">
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-slate-900 dark:text-white">4.9</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                1,240+ Verified Reviews
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</h4>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{r.carBought}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about our certified warranty, inspection, and return guarantee.
          </p>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>Still have questions? </span>
          <a
            href={getWhatsAppGeneralUrl('Hi AutoTrust, I have a question about certified pre-owned cars.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Chat with our vehicle specialist on WhatsApp →
          </a>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { POPULAR_BRANDS } from '../config/dealership';
import { FuelType, TransmissionType, SellCarInquiry } from '../types';
import { formatPrice, getWhatsAppSellCarUrl } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Phone,
  User,
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

export const SellCarPage: React.FC = () => {
  const { submitSellCar } = useInventory();

  // Wizard Step (1: Vehicle Details, 2: Condition, 3: Seller Details, 4: Confirmed)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [brand, setBrand] = useState('Hyundai');
  const [model, setModel] = useState('Creta');
  const [year, setYear] = useState<number>(2021);
  const [km, setKm] = useState<number>(35000);
  const [fuel, setFuel] = useState<FuelType>('Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>('Manual');
  const [expectedPrice, setExpectedPrice] = useState<number>(950000);

  // Condition & History
  const [condition, setCondition] = useState<'Flawless' | 'Good' | 'Fair'>('Good');
  const [accidentHistory, setAccidentHistory] = useState<'No' | 'Minor Repaired' | 'Major'>('No');
  const [insuranceType, setInsuranceType] = useState<'Comprehensive' | 'Third Party' | 'Expired'>('Comprehensive');
  const [rtoState, setRtoState] = useState('MH-02 (Mumbai)');

  // Seller Details
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [preferredInspectionDate, setPreferredInspectionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [submittedLead, setSubmittedLead] = useState<SellCarInquiry | null>(null);

  // Dynamic Valuation Range Calculator
  const { minValuation, maxValuation } = React.useMemo(() => {
    const conditionFactor = condition === 'Flawless' ? 1.05 : condition === 'Good' ? 0.98 : 0.90;
    const kmDiscount = Math.min(0.15, (km / 100000) * 0.1);
    const estCenter = expectedPrice * conditionFactor * (1 - kmDiscount);
    const minVal = Math.round((estCenter * 0.95) / 10000) * 10000;
    const maxVal = Math.round((estCenter * 1.05) / 10000) * 10000;
    return { minValuation: minVal, maxValuation: maxVal };
  }, [expectedPrice, condition, km]);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !year || !km || !expectedPrice) return;
    setCurrentStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName.trim() || !phone.trim()) return;

    const leadData: Omit<SellCarInquiry, 'id' | 'createdAt' | 'status'> = {
      brand,
      model,
      year,
      km,
      fuel,
      transmission,
      expectedPrice,
      estimatedValuationMin: minValuation,
      estimatedValuationMax: maxValuation,
      condition,
      accidentHistory,
      insuranceType,
      rtoState,
      sellerName: sellerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      preferredInspectionDate,
    };

    const newId = submitSellCar(leadData);

    setSubmittedLead({
      ...leadData,
      id: newId,
      status: 'New',
      createdAt: new Date().toISOString(),
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.warn(e);
    }

    setCurrentStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Instant Quote & Same-Day Bank Payout</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
          Sell Your Car in 3 Easy Steps
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Get up to ₹50,000 more than trade-in dealers. Free doorstep evaluation and instant RTGS payment.
        </p>
      </div>

      {/* Progress Steps Header */}
      {currentStep !== 4 && (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={`p-2.5 rounded-xl transition ${
                currentStep === 1
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                  : currentStep > 1
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider">Step 1</span>
              <span>Vehicle Details</span>
            </div>

            <div
              className={`p-2.5 rounded-xl transition ${
                currentStep === 2
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                  : currentStep > 2
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider">Step 2</span>
              <span>Car Condition</span>
            </div>

            <div
              className={`p-2.5 rounded-xl transition ${
                currentStep === 3
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                  : 'text-slate-400 dark:text-slate-500 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider">Step 3</span>
              <span>Contact & Inspection</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-10 transition-colors duration-200">
        {/* STEP 1: VEHICLE DETAILS */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Step 1: Tell Us About Your Car
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Provide basic specifications of your vehicle</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Brand */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Make / Brand *</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                  <option value="Other">Other Brand</option>
                </select>
              </div>

              {/* Model */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Model & Variant *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Creta SX (O) or Dzire ZXi"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Registration Year */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Registration Year *</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* KM Driven */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Kilometers Driven *</label>
                <input
                  type="number"
                  step={1000}
                  min={1000}
                  required
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Fuel Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Fuel Type</label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value as FuelType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>

            {/* Expected Price */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Your Expected Selling Price (₹) *
                </label>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-base">
                  {formatPrice(expectedPrice)}
                </span>
              </div>
              <input
                type="range"
                min={200000}
                max={3500000}
                step={25000}
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span>₹2 Lakh</span>
                <span>₹15 Lakh</span>
                <span>₹35 Lakh+</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Continue to Condition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CAR CONDITION */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Step 2: Vehicle Condition & History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accurate condition reports help us offer the highest possible purchase price.
              </p>
            </div>

            {/* Overall Condition Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Overall Condition</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'Flawless', desc: 'No scratches or dents, showroom condition' },
                  { key: 'Good', desc: 'Minor scratches, regularly serviced' },
                  { key: 'Fair', desc: 'Visible dents/scratches, needs minor work' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCondition(item.key as any)}
                    className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                      condition === item.key
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">{item.key}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block leading-snug">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accident History */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Accident History</label>
                <select
                  value={accidentHistory}
                  onChange={(e) => setAccidentHistory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  <option value="No">No Major Accidents (Clean Chassis)</option>
                  <option value="Minor Repaired">Minor Bumper / Fender Repaired</option>
                  <option value="Major">Major Accidental Repair</option>
                </select>
              </div>

              {/* Insurance Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Insurance Status</label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  <option value="Comprehensive">Active Comprehensive Insurance</option>
                  <option value="Third Party">Third Party Only</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* RTO State */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">RTO Registration Code</label>
              <input
                type="text"
                value={rtoState}
                onChange={(e) => setRtoState(e.target.value)}
                placeholder="e.g. MH-02, DL-10, KA-03..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Photo Upload Preview box */}
            <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Upload Car Exterior / Interior Photos (Optional)
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                You can also share vehicle photos directly over WhatsApp during doorstep inspection.
              </p>
              <button
                type="button"
                onClick={() => alert('Photo upload simulated! Evaluators will also take HD photos during doorstep inspection.')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer"
              >
                <span>Browse Files</span>
              </button>
            </div>

            {/* Live Instant Valuation Badge */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  Estimated AutoTrust Purchase Offer:
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200 font-heading">
                  {formatPrice(minValuation)} - {formatPrice(maxValuation)}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl shadow-xs border border-emerald-200 dark:border-emerald-800">
                Instant Payout
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Continue to Contact</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SELLER DETAILS & INSPECTION */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                Step 3: Contact Details & Free Inspection
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where should our certified inspector come to evaluate the car?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Mobile / WhatsApp Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98200 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">City / Pincode *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Navi Mumbai, Thane"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Preferred Inspection Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Preferred Inspection Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    value={preferredInspectionDate}
                    onChange={(e) => setPreferredInspectionDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Summary preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white">Vehicle Summary:</div>
              <p>• {year} {brand} {model} ({fuel}, {transmission})</p>
              <p>• Mileage: {km.toLocaleString('en-IN')} km | Expected Price: {formatPrice(expectedPrice)}</p>
              <p>• Estimated Valuation Range: <strong className="text-emerald-700 dark:text-emerald-400">{formatPrice(minValuation)} - {formatPrice(maxValuation)}</strong></p>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
              >
                Submit & Get Best Offer
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: CELEBRATION & WHATSAPP GENERATOR */}
        {currentStep === 4 && submittedLead && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Request Registered: #{submittedLead.id}
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                Valuation Request Received!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you, <strong>{submittedLead.sellerName}</strong>. Our vehicle acquisition officer will reach out to you within 30 minutes to confirm your doorstep inspection.
              </p>
            </div>

            {/* Estimated valuation card */}
            <div className="max-w-md mx-auto bg-slate-900 dark:bg-slate-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Estimated Offer Range
              </span>
              <div className="text-3xl font-black text-white font-heading">
                {formatPrice(submittedLead.estimatedValuationMin)} - {formatPrice(submittedLead.estimatedValuationMax)}
              </div>
              <p className="text-xs text-slate-300">
                100% Free Doorstep Inspection • Same-day Instant Bank Transfer
              </p>
            </div>

            {/* Direct WhatsApp Summary CTA */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              <a
                href={getWhatsAppSellCarUrl(submittedLead)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Send Summary to Dealer on WhatsApp</span>
              </a>

              <Link
                to="/inventory"
                className="block w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Browse Certified Pre-Owned Cars Instead
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

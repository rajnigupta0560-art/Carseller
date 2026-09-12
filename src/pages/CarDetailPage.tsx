import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { EmiCalculator } from '../components/car/EmiCalculator';
import { InspectionReport } from '../components/car/InspectionReport';
import { TestDriveModal } from '../components/car/TestDriveModal';
import { CarCard } from '../components/car/CarCard';
import { formatPrice, formatExactPrice, formatKm, getWhatsAppCarInquiryUrl } from '../utils/formatters';
import { DEALERSHIP } from '../config/dealership';
import {
  ArrowLeft,
  ShieldCheck,
  Gauge,
  Fuel,
  GitCommit,
  UserCheck,
  CheckCircle2,
  Share2,
  MessageCircle,
  ChevronRight,
  Sparkles,
  MapPin,
  Car as CarIcon,
  Zap,
} from 'lucide-react';

export const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCarById, cars, showToast } = useInventory();

  const car = id ? getCarById(id) : undefined;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-heading">
          Vehicle Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The certified car you're looking for may have been sold or removed.
        </p>
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Inventory</span>
        </Link>
      </div>
    );
  }

  const isSold = car.status === 'Sold Out';
  const whatsappUrl = getWhatsAppCarInquiryUrl(car);

  // Similar cars (same body type or brand, excluding current)
  const similarCars = cars
    .filter((c) => c.id !== car.id && (c.bodyType === car.bodyType || c.brand === car.brand))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car.title,
        text: `Check out this certified ${car.title} for ${formatPrice(car.price)} on ${DEALERSHIP.name}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        <Link to="/inventory" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Inventory</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs">{car.title}</span>
      </nav>

      {/* Main Top Section: Gallery (Left) & Price/Specs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Interactive Image Gallery (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Display Image */}
          <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
            <img
              src={car.images[activeImageIndex] || car.images[0]}
              alt={car.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {isSold ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-lg uppercase">
                  Sold Out
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                    <span>AutoTrust Certified</span>
                  </span>
                  {car.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Featured Pick</span>
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Inspection Score Badge */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspection Score: <strong className="text-emerald-400">{car.inspectionScore}/100</strong></span>
            </div>
          </div>

          {/* Thumbnail Carousel */}
          <div className="grid grid-cols-4 gap-3">
            {car.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-blue-600 shadow-md scale-102 ring-2 ring-blue-500/20'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Assurance strip */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-blue-50/60 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl text-center text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">1-Year Warranty</span>
              <span className="text-blue-700/80 dark:text-slate-400 text-[11px]">Free Comprehensive</span>
            </div>
            <div className="space-y-0.5 border-x border-blue-200/60 dark:border-slate-800">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">5-Day Return</span>
              <span className="text-blue-700/80 dark:text-slate-400 text-[11px]">Money-back guarantee</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">Free RC Transfer</span>
              <span className="text-blue-700/80 dark:text-slate-400 text-[11px]">Paperwork handled</span>
            </div>
          </div>
        </div>

        {/* Right: Key Details & High-Converting CTAs (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6 transition-colors duration-200">
            {/* Title & Variant */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {car.brand} • {car.bodyType} • {car.year}
                </span>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Share Vehicle"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
                {car.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{car.variant}</p>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                  Fixed Fair Price
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-0.5">
                  {formatPrice(car.price)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Exact: {formatExactPrice(car.price)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-full block">
                  EMI from ₹{car.emiStarting.toLocaleString('en-IN')}/mo
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Zero Downpayment Plans</span>
              </div>
            </div>

            {/* Key Specs Matrix */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-750">
                <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold block">KM Driven</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatKm(car.km)}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-750">
                <Fuel className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold block">Fuel Type</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{car.fuel}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-750">
                <GitCommit className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold block">Transmission</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{car.transmission}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-750">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold block">Ownership</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{car.ownership}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-750">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold block">RTO Reg</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{car.rto.split(' ')[0]}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-750">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase font-bold block">Mileage</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{car.mileage}</strong>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Chat on WhatsApp (Get Video / Quote)</span>
              </a>

              <button
                type="button"
                onClick={() => setIsTestDriveOpen(true)}
                disabled={isSold}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition cursor-pointer"
              >
                <CarIcon className="w-5 h-5" />
                <span>{isSold ? 'Vehicle Already Sold' : 'Book Free Test Drive'}</span>
              </button>
            </div>

            {/* Inspection & Location Guarantee */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Available at Showroom: Andheri East, Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Home Test Drive available within 25 km radius</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Specs Table */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors duration-200">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          Complete Vehicle Specifications & History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Registration & RTO</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Registration Year:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.year}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">RTO Location:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.rto}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Insurance Status:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.insuranceValidity}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Ownership:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.ownership}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Engine & Transmission</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Engine Displacement:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.engineDisplacement || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Fuel Type:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.fuel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Transmission:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.transmission}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Certified Mileage:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.mileage}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Dimensions & Comfort</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Seating Capacity:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.seatingCapacity} Seater</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Body Type:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.bodyType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Color:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{car.color}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Total KM Run:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatKm(car.km)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Chips */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-3">
            Key Features & Equipment
          </h4>
          <div className="flex flex-wrap gap-2">
            {car.keyFeatures.map((feat, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-750 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-2">
            Vehicle Overview & Inspection Notes
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            {car.description}
          </p>
        </div>
      </section>

      {/* 140+ Points Inspection Report Accordion */}
      <InspectionReport score={car.inspectionScore} categories={car.inspectionCategories} />

      {/* EMI Calculator */}
      <EmiCalculator carPrice={car.price} carTitle={car.title} />

      {/* Similar Recommended Cars */}
      {similarCars.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Similar Certified Cars You Might Like
            </h3>
            <Link to="/inventory" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View Entire Inventory →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((sc) => (
              <CarCard key={sc.id} car={sc} />
            ))}
          </div>
        </section>
      )}

      {/* Test Drive Modal */}
      <TestDriveModal
        car={car}
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
      />
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../../types';
import { formatPrice, formatKm, getWhatsAppCarInquiryUrl } from '../../utils/formatters';

import {
  Gauge,
  Fuel,
  GitCommit,
  UserCheck,
  ShieldCheck,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface CarCardProps {
  car: Car;
  viewMode?: 'grid' | 'list';
}

export const CarCard: React.FC<CarCardProps> = ({ car, viewMode = 'grid' }) => {
  const isSold = car.status === 'Sold Out';
  const whatsappUrl = getWhatsAppCarInquiryUrl(car);

  if (viewMode === 'list') {
    return (
      <div
        className={`group bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-xl dark:hover:shadow-blue-900/20 hover:border-blue-200 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
          isSold ? 'opacity-75 grayscale-[20%]' : ''
        }`}
      >
        {/* Image side */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={car.images[0]}
            alt={car.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isSold ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md uppercase tracking-wider">
                Sold Out
              </span>
            ) : (
              <>
                {car.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Certified</span>
                  </span>
                )}
                {car.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </>
            )}
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
            {car.images.length} Photos
          </div>
        </div>

        {/* Content side */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {car.brand} • {car.bodyType}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition font-heading">
                  <Link to={`/inventory/${car.id}`}>{car.title}</Link>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{car.variant}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                  {formatPrice(car.price)}
                </div>
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  EMI from ₹{car.emiStarting.toLocaleString('en-IN')}/mo
                </div>
              </div>
            </div>

            {/* Spec Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                <Gauge className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="font-semibold">{formatKm(car.km)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                <Fuel className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="font-semibold">{car.fuel}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                <GitCommit className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="font-semibold">{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg">
                <UserCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="font-semibold">{car.ownership}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              RTO: <strong className="text-slate-700 dark:text-slate-300">{car.rto}</strong> • Score:{' '}
              <strong className="text-emerald-700 dark:text-emerald-400">{car.inspectionScore}/100</strong>
            </span>
            <div className="flex items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
              <Link
                to={`/inventory/${car.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-xl dark:hover:shadow-blue-900/20 hover:border-blue-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col overflow-hidden ${
        isSold ? 'opacity-80' : ''
      }`}
    >
      {/* Top Image Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={car.images[0]}
          alt={car.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isSold ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md uppercase tracking-wider">
              Sold Out
            </span>
          ) : (
            <>
              {car.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Certified</span>
                </span>
              )}
              {car.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm backdrop-blur-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured</span>
                </span>
              )}
            </>
          )}
        </div>

        {/* Inspection Score & Photo count */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-slate-200/60 dark:border-slate-800">
          Inspection: <span className="text-emerald-700 dark:text-emerald-400">{car.inspectionScore}/100</span>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
          {car.images.length} Photos
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Title */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>{car.year} • {car.brand}</span>
            <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-[11px]">{car.rto.split(' ')[0]}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition font-heading line-clamp-1">
            <Link to={`/inventory/${car.id}`}>{car.title}</Link>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{car.variant}</p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-3.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
              <Gauge className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate font-medium">{formatKm(car.km)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
              <Fuel className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate font-medium">{car.fuel}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
              <GitCommit className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate font-medium">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate font-medium">{car.ownership}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                {formatPrice(car.price)}
              </span>
              {car.originalPrice && car.originalPrice > car.price && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through ml-2">
                  {formatPrice(car.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
              EMI ~₹{car.emiStarting.toLocaleString('en-IN')}/mo
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold transition-all duration-150"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
            <Link
              to={`/inventory/${car.id}`}
              className="w-full inline-flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all duration-150"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

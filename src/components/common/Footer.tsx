import React from 'react';
import { Link } from 'react-router-dom';
import { DEALERSHIP } from '../../config/dealership';
import { getWhatsAppGeneralUrl } from '../../utils/formatters';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  RotateCcw,
  FileCheck,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-[#070a12] text-slate-300 pt-16 pb-12 border-t border-slate-800 dark:border-slate-850 w-full max-w-full overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 dark:border-slate-800/80 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">140+ Checkpoints</p>
              <p className="text-xs text-slate-400">Certified Inspection</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">1-Year Warranty</p>
              <p className="text-xs text-slate-400">Comprehensive coverage</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">5-Day Return</p>
              <p className="text-xs text-slate-400">Money back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Free RC Transfer</p>
              <p className="text-xs text-slate-400">Zero paperwork hassle</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white font-heading">
                Auto<span className="text-blue-500">Trust</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's premier certified pre-owned car dealership. Every car in our showroom comes with 140+ quality inspection checks, non-accidental guarantee, and verified paperwork.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Showroom Open Today: {DEALERSHIP.showroomHours}</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/inventory" className="hover:text-white transition">All Certified Cars</Link>
              </li>
              <li>
                <Link to="/inventory?body=SUV" className="hover:text-white transition">Pre-Owned SUVs</Link>
              </li>
              <li>
                <Link to="/inventory?body=Sedan" className="hover:text-white transition">Executive Sedans</Link>
              </li>
              <li>
                <Link to="/inventory?transmission=Automatic" className="hover:text-white transition">Automatic Cars</Link>
              </li>
              <li>
                <Link to="/sell-car" className="hover:text-white transition text-amber-400 font-semibold">Sell Your Car (Instant Valuation)</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-slate-400 text-slate-600 transition text-xs">Dealer Portal / Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Showroom Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                <span>{DEALERSHIP.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`tel:${DEALERSHIP.phoneRaw}`} className="hover:text-white">{DEALERSHIP.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`mailto:${DEALERSHIP.email}`} className="hover:text-white">{DEALERSHIP.email}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{DEALERSHIP.showroomHours}</span>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Concierge Box */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <MessageCircle className="w-4 h-4 fill-emerald-400" />
              <span>Instant WhatsApp Concierge</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have questions regarding vehicle history, trade-in value, or doorstep test drive? Ping our team directly.
            </p>
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Start WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {DEALERSHIP.name} {DEALERSHIP.tagline}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Inspection Standard ISO-9001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

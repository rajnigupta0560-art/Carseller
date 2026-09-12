import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DEALERSHIP } from '../../config/dealership';
import { getWhatsAppGeneralUrl } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import {
  Car,
  Search,
  MapPin,
  ChevronDown,
  Phone,
  Menu,
  X,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
} from 'lucide-react';

export const CITIES = [
  { name: 'Mumbai', state: 'MH', count: 4 },
  { name: 'Delhi NCR', state: 'DL/HR/UP', count: 3 },
  { name: 'Bengaluru', state: 'KA', count: 2 },
  { name: 'Hyderabad', state: 'TS', count: 1 },
  { name: 'Pune', state: 'MH', count: 1 },
  { name: 'Ahmedabad', state: 'GJ', count: 1 },
];

// Official vector WhatsApp Logo component
const WhatsAppLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.808.483 3.522 1.328 5.015L2.016 22l5.125-1.344a9.98 9.98 0 0 0 4.89 1.281h.004c5.531 0 10.031-4.496 10.031-10.031A10.007 10.007 0 0 0 12.031 2zm0 18.359h-.003a8.318 8.318 0 0 1-4.24-1.156l-.304-.18-3.153.827.842-3.073-.197-.314A8.32 8.32 0 0 1 3.672 12.03c0-4.609 3.75-8.359 8.359-8.359a8.324 8.324 0 0 1 5.914 2.453 8.32 8.32 0 0 1 2.45 5.906c0 4.609-3.75 8.359-8.364 8.359zm4.582-6.25c-.25-.125-1.48-.73-1.71-.813-.23-.082-.398-.125-.566.125-.168.25-.652.813-.8.98-.148.169-.297.188-.547.063-.25-.125-1.055-.39-2.01-1.242-.742-.664-1.242-1.484-1.39-1.734-.148-.25-.015-.387.11-.512.113-.113.25-.297.375-.445.125-.149.168-.25.25-.418.082-.168.043-.313-.02-.438-.062-.125-.566-1.363-.777-1.867-.203-.492-.41-.422-.566-.43-.145-.008-.313-.008-.48-.008-.169 0-.442.063-.672.313-.23.25-.883.863-.883 2.105 0 1.242.906 2.445 1.031 2.613.125.168 1.781 2.72 4.316 3.813.602.262 1.07.418 1.438.535.605.191 1.156.164 1.59.1.484-.07 1.48-.605 1.688-1.191.21-.586.21-1.09.148-1.191-.062-.102-.23-.164-.48-.29z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const buyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (buyDropdownRef.current && !buyDropdownRef.current.contains(event.target as Node)) {
        setBuyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCityDropdownOpen(false);
    setBuyDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Handle header search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inventory?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setMobileMenuOpen(false);
    } else {
      navigate('/inventory');
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setCityDropdownOpen(false);
    navigate(`/inventory?q=${encodeURIComponent(cityName)}`);
  };

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-2xs transition-colors duration-200">
      {/* MAIN HEADER BAR (No redundant top strip for clean luxury aesthetic) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-1.5 sm:gap-4 lg:gap-6">
          {/* LEFT: Brand Logo & City Selector */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0 min-w-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none shrink-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <Car className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                  <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-heading">
                    Auto<span className="text-blue-600 dark:text-blue-400">Trust</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 uppercase tracking-wider">
                    Certified
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5 sm:mt-1 hidden xs:block">
                  140+ Quality Checks
                </span>
              </div>
            </Link>

            {/* City Selector Pill */}
            <div className="relative shrink-0" ref={cityDropdownRef}>
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all focus:outline-none"
                aria-label="Choose city"
              >
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-bold truncate max-w-[58px] sm:max-w-none">{selectedCity}</span>
                <ChevronDown
                  className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${
                    cityDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* City Dropdown Menu */}
              {cityDropdownOpen && (
                <div className="animate-dropdown absolute left-0 mt-2 w-56 sm:w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    Select Your Region
                  </div>
                  <div className="py-1 space-y-0.5 max-h-64 overflow-y-auto">
                    {CITIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleCitySelect(c.name)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                          selectedCity === c.name
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{c.name} ({c.state})</span>
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {c.count} cars
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Desktop Global Search Bar */}
          <div className="flex-1 min-w-[200px] max-w-xs xl:max-w-sm hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder='Search "Creta", "SUV", "Petrol"...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                  className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions Popover */}
              {searchFocused && !searchQuery && (
                <div className="animate-dropdown absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 z-50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Hyundai Creta', 'Tata Nexon', 'Automatic SUV', 'Under ₹8 Lakh', 'Swift Dzire'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={() => {
                          setSearchQuery(term);
                          navigate(`/inventory?q=${encodeURIComponent(term)}`);
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Desktop Nav + Theme Switch + WhatsApp + CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-semibold">
              {/* Buy Used Cars Dropdown */}
              <div className="relative" ref={buyDropdownRef}>
                <button
                  type="button"
                  onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
                  className={`flex items-center gap-1 py-1 transition ${
                    isCurrent('/inventory')
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <span>Buy Cars</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                      buyDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {buyDropdownOpen && (
                  <div className="animate-dropdown absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-1.5 z-50">
                    <Link
                      to="/inventory"
                      onClick={() => setBuyDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <span>All Certified Cars</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    </Link>
                    <Link
                      to="/inventory?body=SUV"
                      onClick={() => setBuyDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <span>Certified SUVs</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">5+ Cars</span>
                    </Link>
                    <Link
                      to="/inventory?body=Sedan"
                      onClick={() => setBuyDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <span>Executive Sedans</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">3+ Cars</span>
                    </Link>
                    <Link
                      to="/inventory?transmission=Automatic"
                      onClick={() => setBuyDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <span>Automatic Cars</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">6+ Cars</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/#why-us"
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition py-1"
              >
                Why AutoTrust
              </Link>

              <Link
                to="/admin"
                className="text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition py-1 flex items-center gap-1"
                title="Dealer Portal Access"
              >
                <Lock className="w-3 h-3" />
                <span>Portal</span>
              </Link>
            </nav>

            {/* Dark/Night Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 shrink-0 cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Official WhatsApp Logo Button */}
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
              title="Chat with Dealership on WhatsApp"
              aria-label="WhatsApp"
            >
              <span className="absolute top-0 right-0 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-200 ring-1.5 ring-white dark:ring-slate-950"></span>
              </span>
              <WhatsAppLogo className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white" />
            </a>

            {/* Primary CTA: Sell Your Car Button (Desktop) */}
            <Link
              to="/sell-car"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-300 shrink-0" />
              <span>Sell Car</span>
              <ArrowRight className="w-3 h-3 text-slate-300 ml-0.5 shrink-0" />
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 md:hidden shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH ROW */}
        <div className="pb-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder='Search "Creta", "Automatic", "SUV"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* MOBILE SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="animate-drawer md:hidden border-t border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-lg px-3.5 sm:px-4 pt-4 pb-8 space-y-4 shadow-2xl max-w-full overflow-hidden">
          {/* Quick Theme Switch Banner inside mobile drawer */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Display Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs"
            >
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          {/* Quick Sell Car Banner */}
          <Link
            to="/sell-car"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md active:scale-98 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block leading-tight">
                  Sell Your Car in 30 Seconds
                </span>
                <span className="text-[11px] text-amber-100">Get Instant Online Valuation Offer</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white shrink-0" />
          </Link>

          {/* Category Quick Links */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Browse by Category
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>All Cars (10+)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </Link>
              <Link
                to="/inventory?body=SUV"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>SUVs</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </Link>
              <Link
                to="/inventory?body=Sedan"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>Executive Sedans</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </Link>
              <Link
                to="/inventory?transmission=Automatic"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <span>Automatics</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Region / Hub Switcher on Mobile */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Dealership Hub Location
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    handleCitySelect(c.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                    selectedCity === c.name
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Links */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>140+ Points Inspection Guarantee</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Dealer Admin Portal</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          {/* Direct Mobile Contact Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <a
              href={`tel:${DEALERSHIP.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Call Concierge: {DEALERSHIP.phone}</span>
            </a>

            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              <WhatsAppLogo className="w-4 h-4 fill-white" />
              <span>Chat with Concierge on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

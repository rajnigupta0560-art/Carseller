import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { CarCard } from '../components/car/CarCard';
import { POPULAR_BRANDS } from '../config/dealership';
import { FuelType, TransmissionType, BodyType, OwnershipType } from '../types';
import { formatPrice } from '../utils/formatters';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { cars } = useInventory();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const brandParam = searchParams.get('brand');
    return brandParam ? [brandParam] : [];
  });
  const [selectedFuels, setSelectedFuels] = useState<FuelType[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<TransmissionType[]>(() => {
    const trans = searchParams.get('transmission') as TransmissionType;
    return trans ? [trans] : [];
  });
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<BodyType[]>(() => {
    const body = searchParams.get('body') as BodyType;
    return body ? [body] : [];
  });
  const [selectedOwnership, setSelectedOwnership] = useState<OwnershipType[]>([]);
  
  // Budget slider (Max Price)
  const initialBudgetParam = searchParams.get('budget');
  const initialMaxPrice = initialBudgetParam === 'under-8' ? 800000 : 3000000;
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);

  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'year-new' | 'km-low'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL query parameters on mount or change
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam && !selectedBrands.includes(brandParam)) {
      setSelectedBrands([brandParam]);
    }
    const bodyParam = searchParams.get('body') as BodyType;
    if (bodyParam && !selectedBodyTypes.includes(bodyParam)) {
      setSelectedBodyTypes([bodyParam]);
    }
    const transParam = searchParams.get('transmission') as TransmissionType;
    if (transParam && !selectedTransmissions.includes(transParam)) {
      setSelectedTransmissions([transParam]);
    }
    const budgetParam = searchParams.get('budget');
    if (budgetParam === 'under-8') {
      setMaxPrice(800000);
    } else if (budgetParam === '8-15') {
      setMaxPrice(1500000);
    } else if (budgetParam === '15-20') {
      setMaxPrice(2000000);
    }
  }, [searchParams]);

  // Toggle helper
  const toggleItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  };

  // Reset all filters
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedBodyTypes([]);
    setSelectedOwnership([]);
    setMaxPrice(3000000);
    setAvailableOnly(false);
    setSearchParams({});
  };

  // Reactive Client-Side Filtering
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // 1. Search query (title, brand, model, variant, rto)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          car.title.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.variant.toLowerCase().includes(q) ||
          car.rto.toLowerCase().includes(q) ||
          car.fuel.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Status filter
      if (availableOnly && car.status !== 'Available') return false;

      // 3. Price filter
      if (car.price > maxPrice) return false;

      // 4. Brands filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) {
        return false;
      }

      // 5. Fuel filter
      if (selectedFuels.length > 0 && !selectedFuels.includes(car.fuel)) {
        return false;
      }

      // 6. Transmission filter
      if (selectedTransmissions.length > 0 && !selectedTransmissions.includes(car.transmission)) {
        return false;
      }

      // 7. Body Type filter
      if (selectedBodyTypes.length > 0 && !selectedBodyTypes.includes(car.bodyType)) {
        return false;
      }

      // 8. Ownership filter
      if (selectedOwnership.length > 0 && !selectedOwnership.includes(car.ownership)) {
        return false;
      }

      return true;
    });
  }, [
    cars,
    searchQuery,
    availableOnly,
    maxPrice,
    selectedBrands,
    selectedFuels,
    selectedTransmissions,
    selectedBodyTypes,
    selectedOwnership,
  ]);

  // Sorting
  const sortedCars = useMemo(() => {
    const list = [...filteredCars];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'year-new':
        return list.sort((a, b) => b.year - a.year);
      case 'km-low':
        return list.sort((a, b) => a.km - b.km);
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredCars, sortBy]);

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedBrands.length +
    selectedFuels.length +
    selectedTransmissions.length +
    selectedBodyTypes.length +
    selectedOwnership.length +
    (maxPrice < 3000000 ? 1 : 0) +
    (availableOnly ? 1 : 0);

  // Sidebar Filter Content
  const FilterContent = (
    <div className="space-y-6">
      {/* Search Input in Sidebar */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Search Model / Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="e.g. Creta, Swift, Sunroof..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">In-Stock Only</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Budget Slider */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Max Budget</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={500000}
          max={3000000}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>₹5 Lakh</span>
          <span>₹15 Lakh</span>
          <span>₹30 Lakh+</span>
        </div>
      </div>

      {/* Brands Selector */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Make / Brand
        </span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {POPULAR_BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span>{brand}</span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  ({cars.filter((c) => c.brand === brand).length})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Fuel Type Chips */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Fuel Type
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(['Petrol', 'Diesel', 'CNG', 'Hybrid'] as FuelType[]).map((fuel) => {
            const isSelected = selectedFuels.includes(fuel);
            return (
              <button
                key={fuel}
                type="button"
                onClick={() => setSelectedFuels(toggleItem(selectedFuels, fuel))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {fuel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission Selector */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Transmission
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {(['Automatic', 'Manual'] as TransmissionType[]).map((trans) => {
            const isSelected = selectedTransmissions.includes(trans);
            return (
              <button
                key={trans}
                type="button"
                onClick={() => setSelectedTransmissions(toggleItem(selectedTransmissions, trans))}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {trans}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Type */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Body Type
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {(['SUV', 'Sedan', 'Hatchback', 'MUV'] as BodyType[]).map((body) => {
            const isSelected = selectedBodyTypes.includes(body);
            return (
              <button
                key={body}
                type="button"
                onClick={() => setSelectedBodyTypes(toggleItem(selectedBodyTypes, body))}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {body}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ownership */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          Ownership
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {(['1st Owner', '2nd Owner'] as OwnershipType[]).map((own) => {
            const isSelected = selectedOwnership.includes(own);
            return (
              <button
                key={own}
                type="button"
                onClick={() => setSelectedOwnership(toggleItem(selectedOwnership, own))}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {own}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear All Filters Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={handleClearAll}
          className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFilterCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Banner */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Certified Pre-Owned Car Catalog
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing <strong className="text-slate-800 dark:text-slate-200">{sortedCars.length}</strong> of{' '}
              {cars.length} verified cars in stock.
            </p>
          </div>

          {/* Quick Search & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-white dark:bg-slate-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="km-low">KM: Lowest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedBrands.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {b}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrands(selectedBrands.filter((x) => x !== b))} />
              </span>
            ))}
            {selectedFuels.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {f}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFuels(selectedFuels.filter((x) => x !== f))} />
              </span>
            ))}
            {selectedTransmissions.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {t}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTransmissions(selectedTransmissions.filter((x) => x !== t))} />
              </span>
            ))}
            {selectedBodyTypes.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {b}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBodyTypes(selectedBodyTypes.filter((x) => x !== b))} />
              </span>
            ))}
            {maxPrice < 3000000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Max: {formatPrice(maxPrice)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(3000000)} />
              </span>
            )}
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline ml-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (col-span-3) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Filters</span>
            </h2>
            {activeFilterCount > 0 && (
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          {FilterContent}
        </aside>

        {/* Cars Results Grid (col-span-9) */}
        <main className="lg:col-span-9">
          {sortedCars.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading">
                No Certified Cars Match Your Search
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Try widening your budget range or clearing some brand/fuel filters to see more vehicles.
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {sortedCars.map((car) => (
                <CarCard key={car.id} car={car} viewMode="list" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCars.map((car) => (
                <CarCard key={car.id} car={car} viewMode="grid" />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Filter Vehicles</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {FilterContent}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                View {sortedCars.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

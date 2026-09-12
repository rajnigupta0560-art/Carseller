import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Car, FuelType, TransmissionType, BodyType, OwnershipType } from '../types';
import { formatPrice, formatKm } from '../utils/formatters';
import { POPULAR_BRANDS } from '../config/dealership';
import {
  Lock,
  Plus,
  Trash2,
  Edit2,
  Car as CarIcon,
  Calendar,
  DollarSign,
  RotateCcw,
  X,
  Eye,
  Search,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    cars,
    testDrives,
    sellCarLeads,
    addCar,
    updateCar,
    toggleCarStatus,
    deleteCar,
    resetToDefaultInventory,
    updateTestDriveStatus,
    updateSellCarStatus,
    showToast,
  } = useInventory();

  // Authentication Mock
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for seamless instant testing
  const [adminPin, setAdminPin] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'testDrives' | 'sellLeads'>('inventory');

  // Search & Filter within Admin
  const [adminSearch, setAdminSearch] = useState('');

  // Add Car Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Hyundai');
  const [newModel, setNewModel] = useState('');
  const [newVariant, setNewVariant] = useState('');
  const [newYear, setNewYear] = useState<number>(2023);
  const [newPrice, setNewPrice] = useState<number>(1250000);
  const [newKm, setNewKm] = useState<number>(18000);
  const [newFuel, setNewFuel] = useState<FuelType>('Petrol');
  const [newTransmission, setNewTransmission] = useState<TransmissionType>('Automatic');
  const [newBodyType, setNewBodyType] = useState<BodyType>('SUV');
  const [newOwnership, setNewOwnership] = useState<OwnershipType>('1st Owner');
  const [newRto, setNewRto] = useState('MH-02 (Mumbai)');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
  );
  const [newIsFeatured, setNewIsFeatured] = useState(true);

  // Inline Price Editing
  const [editingPriceCarId, setEditingPriceCarId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Metrics calculation
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.status === 'Available').length;
  const soldCars = cars.filter((c) => c.status === 'Sold Out').length;
  const totalInventoryValue = cars.reduce((acc, c) => acc + (c.status === 'Available' ? c.price : 0), 0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin === 'admin') {
      setIsAuthenticated(true);
      showToast('Welcome to Dealer Portal Dashboard', 'success');
    } else {
      showToast('Invalid PIN. Use "1234" for demo access.', 'error');
    }
  };

  const handleCreateCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter car title', 'error');
      return;
    }

    const calculatedEmi = Math.round((newPrice * 0.8 * 0.095) / 12);

    addCar({
      title: newTitle.trim(),
      brand: newBrand,
      model: newModel.trim() || newBrand,
      variant: newVariant.trim() || 'Top Trim',
      year: newYear,
      price: newPrice,
      originalPrice: Math.round(newPrice * 1.06),
      emiStarting: calculatedEmi,
      km: newKm,
      fuel: newFuel,
      transmission: newTransmission,
      ownership: newOwnership,
      bodyType: newBodyType,
      rto: newRto,
      insuranceValidity: 'Comprehensive valid till 2027',
      mileage: '18.0 kmpl',
      seatingCapacity: 5,
      color: 'Pearl White',
      isFeatured: newIsFeatured,
      isVerified: true,
      status: 'Available',
      images: [
        newImageUrl,
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      ],
      inspectionScore: 98,
      inspectionCategories: [
        {
          name: 'Engine & Mechanical',
          totalPoints: 35,
          passedPoints: 35,
          items: [{ name: 'Engine Compression & Drive', status: 'Pass' }],
        },
        {
          name: 'Chassis & Electronics',
          totalPoints: 30,
          passedPoints: 30,
          items: [{ name: 'Frame & Air Conditioning', status: 'Pass' }],
        },
      ],
      keyFeatures: ['Push Button Start', 'Touchscreen Infotainment', 'Reverse Camera'],
      description: `Certified single owner ${newTitle} inspected thoroughly under AutoTrust standards.`,
    });

    setIsAddModalOpen(false);
    // Reset inputs
    setNewTitle('');
    setNewModel('');
    setNewVariant('');
  };

  const startEditPrice = (car: Car) => {
    setEditingPriceCarId(car.id);
    setTempPrice(car.price);
  };

  const saveEditPrice = (id: string) => {
    if (tempPrice > 0) {
      updateCar(id, { price: tempPrice, emiStarting: Math.round((tempPrice * 0.8 * 0.095) / 12) });
    }
    setEditingPriceCarId(null);
  };

  const filteredAdminCars = cars.filter(
    (c) =>
      c.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      c.brand.toLowerCase().includes(adminSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(adminSearch.toLowerCase())
  );

  // If locked
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
              Dealer Portal Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter admin security PIN to manage inventory and view leads.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter PIN (Demo: 1234)"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
            >
              Unlock Dashboard
            </button>
          </form>

          <button
            onClick={() => setIsAuthenticated(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Quick 1-Click Demo Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 uppercase tracking-wider">
              Dealership Operations
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-heading mt-1">
            Dealer Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time control over showroom inventory, pricing, test drives, and purchase inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Car Listing</span>
          </button>

          <button
            onClick={resetToDefaultInventory}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            title="Reset to 10 demo certified cars"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo Cars</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Lock Dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Inventory</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">{totalCars} Cars</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{availableCars} Available • {soldCars} Sold</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Asset Value</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-heading">
            {formatPrice(totalInventoryValue)}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Ready for delivery</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Test Drive Bookings</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-heading">
            {testDrives.length} Leads
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Customer appointments</span>
        </div>

        <div className="bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Sell Car Leads</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-heading">
            {sellCarLeads.length} Submissions
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Purchase evaluations</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CarIcon className="w-4 h-4" />
          <span>Cars Inventory ({cars.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testDrives')}
          className={`pb-3 text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'testDrives'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Test Drive Requests ({testDrives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sellLeads')}
          className={`pb-3 text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'sellLeads'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Sell Car Inquiries ({sellCarLeads.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT TABLE */}
      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          {/* Search bar inside admin */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter by title, brand, or id..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredAdminCars.length} of {cars.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Specs</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAdminCars.map((car) => {
                  const isEditingPrice = editingPriceCarId === car.id;
                  return (
                    <tr key={car.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      {/* Car info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.images[0]}
                            alt={car.title}
                            className="w-14 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                              {car.title}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                              {car.rto} • ID: {car.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Specs */}
                      <td className="py-3.5 px-4 font-medium">
                        <div className="text-slate-900 dark:text-white">{car.year} • {formatKm(car.km)}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {car.fuel} • {car.transmission}
                        </div>
                      </td>

                      {/* Price (Inline Editable) */}
                      <td className="py-3.5 px-4">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              step={10000}
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-28 px-2 py-1 rounded border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                            />
                            <button
                              onClick={() => saveEditPrice(car.id)}
                              className="px-2 py-1 rounded bg-blue-600 text-white font-bold text-[10px]"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPriceCarId(null)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group">
                            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                              {formatPrice(car.price)}
                            </span>
                            <button
                              onClick={() => startEditPrice(car)}
                              className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 p-0.5 rounded transition opacity-60 group-hover:opacity-100"
                              title="Edit Price"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                          EMI: ₹{car.emiStarting.toLocaleString('en-IN')}/mo
                        </span>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleCarStatus(car.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition ${
                            car.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:hover:bg-emerald-900/60'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:hover:bg-rose-900/60'
                          }`}
                        >
                          {car.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(`/inventory/${car.id}`, '_blank')}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove "${car.title}"?`)) {
                                deleteCar(car.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                            title="Delete Car"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TEST DRIVE INQUIRIES */}
      {activeTab === 'testDrives' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Customer Test Drive Appointments
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{testDrives.length} total bookings</span>
          </div>

          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Car Requested</th>
                <th className="py-3 px-4">Appointment</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {testDrives.map((td) => (
                <tr key={td.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{td.customerName}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{td.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {td.carTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{td.preferredDate}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{td.preferredTimeSlot}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                      {td.locationType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={td.status}
                      onChange={(e) => updateTestDriveStatus(td.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://wa.me/${td.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                        td.customerName
                      )},%20this%20is%20AutoTrust%20regarding%20your%20test%20drive%20request.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition"
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SELL CAR LEADS */}
      {activeTab === 'sellLeads' && (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Sell Car Submissions & Valuation Requests
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{sellCarLeads.length} leads</span>
          </div>

          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Seller Info</th>
                <th className="py-3 px-4">Vehicle Offered</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Expected / Offer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sellCarLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{lead.sellerName}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{lead.phone} • {lead.city}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <div className="text-slate-800 dark:text-slate-200 font-bold">
                      {lead.year} {lead.brand} {lead.model}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatKm(lead.km)} • {lead.fuel} • {lead.transmission}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      {lead.condition}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">Accident: {lead.accidentHistory}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      Exp: {formatPrice(lead.expectedPrice)}
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      Est: {formatPrice(lead.estimatedValuationMin)} - {formatPrice(lead.estimatedValuationMax)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateSellCarStatus(lead.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
                    >
                      <option value="New">New</option>
                      <option value="Evaluation Scheduled">Evaluation Scheduled</option>
                      <option value="Inspected">Inspected</option>
                      <option value="Deal Closed">Deal Closed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                        lead.sellerName
                      )},%20this%20is%20AutoTrust%20regarding%20your%20${lead.brand}%20${lead.model}%20valuation.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition"
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* "ADD NEW CAR" MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-8">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-bold font-heading">Add Certified Car to Inventory</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCar} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Car Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023 Hyundai Creta SX (O) Turbo"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Make / Brand</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Creta"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Model Year</label>
                  <input
                    type="number"
                    min={2014}
                    max={2026}
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price (INR ₹) *</label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* KM */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Kilometers Run</label>
                  <input
                    type="number"
                    step={500}
                    value={newKm}
                    onChange={(e) => setNewKm(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Fuel */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fuel Type</label>
                  <select
                    value={newFuel}
                    onChange={(e) => setNewFuel(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Transmission</label>
                  <select
                    value={newTransmission}
                    onChange={(e) => setNewTransmission(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Body Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Body Type</label>
                  <select
                    value={newBodyType}
                    onChange={(e) => setNewBodyType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="MUV">MUV</option>
                  </select>
                </div>

                {/* Ownership */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ownership</label>
                  <select
                    value={newOwnership}
                    onChange={(e) => setNewOwnership(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100"
                  >
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                  </select>
                </div>

                {/* RTO */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">RTO Location</label>
                  <input
                    type="text"
                    value={newRto}
                    onChange={(e) => setNewRto(e.target.value)}
                    placeholder="e.g. MH-02 (Mumbai)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Image URL (Unsplash or direct URL)</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                  {newImageUrl && (
                    <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Featured Checkbox */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={newIsFeatured}
                    onChange={(e) => setNewIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="featuredToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mark as Featured on Homepage
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Publish Car Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

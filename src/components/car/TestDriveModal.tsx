import React, { useState } from 'react';
import { Car } from '../../types';
import { useInventory } from '../../context/InventoryContext';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Car as CarIcon,
  ShieldCheck,
  User,
  Phone,
} from 'lucide-react';

interface TestDriveModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({ car, isOpen, onClose }) => {
  const { submitTestDrive } = useInventory();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // Default tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [preferredDate, setPreferredDate] = useState(defaultDateStr);
  const [preferredSlot, setPreferredSlot] = useState<
    'Morning (10 AM - 1 PM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (4 PM - 7 PM)'
  >('Morning (10 AM - 1 PM)');
  const [locationType, setLocationType] = useState<'Dealership Showroom' | 'Doorstep Test Drive'>(
    'Doorstep Test Drive'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !preferredDate) return;

    submitTestDrive({
      carId: car.id,
      carTitle: car.title,
      customerName: name.trim(),
      phone: phone.trim(),
      preferredDate,
      preferredTimeSlot: preferredSlot,
      locationType,
      notes: notes.trim(),
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.warn(err);
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Schedule a Free Test Drive</h3>
              <p className="text-xs text-blue-100 line-clamp-1">{car.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                Booking Confirmed!
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>! We've scheduled your test drive for{' '}
                <strong>{car.title}</strong> on <strong>{preferredDate}</strong> ({preferredSlot}).
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Next Steps:</span>
              </div>
              <p>• Our representative will call you to confirm your location.</p>
              <p>• Valid Driving License required during test drive.</p>
              <p>• Zero obligation, 100% free experience.</p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              Done & Return to Car
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Location Type Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Test Drive Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLocationType('Doorstep Test Drive')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                    locationType === 'Doorstep Test Drive'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Doorstep at Home</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('Dealership Showroom')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                    locationType === 'Dealership Showroom'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <CarIcon className="w-3.5 h-3.5" />
                  <span>Showroom Visit</span>
                </button>
              </div>
            </div>

            {/* Customer Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Customer Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98200 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Preferred Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={defaultDateStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Time Window *</span>
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100"
                >
                  <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                  <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                </select>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Specific requests (optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Please bring documents for finance options..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 active:scale-[0.99] transition cursor-pointer"
            >
              Confirm Test Drive Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

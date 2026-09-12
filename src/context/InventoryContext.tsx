import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car, TestDriveInquiry, SellCarInquiry, FilterState } from '../types';
import { INITIAL_CARS } from '../data/initialCars';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface InventoryContextType {
  cars: Car[];
  testDrives: TestDriveInquiry[];
  sellCarLeads: SellCarInquiry[];
  toasts: ToastMessage[];
  addCar: (car: Omit<Car, 'id' | 'createdAt'>) => string;
  updateCar: (id: string, updates: Partial<Car>) => void;
  toggleCarStatus: (id: string) => void;
  deleteCar: (id: string) => void;
  resetToDefaultInventory: () => void;
  getCarById: (id: string) => Car | undefined;
  submitTestDrive: (inquiry: Omit<TestDriveInquiry, 'id' | 'createdAt' | 'status'>) => string;
  updateTestDriveStatus: (id: string, status: TestDriveInquiry['status']) => void;
  submitSellCar: (inquiry: Omit<SellCarInquiry, 'id' | 'createdAt' | 'status'>) => string;
  updateSellCarStatus: (id: string, status: SellCarInquiry['status']) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CARS: 'autotrust_inventory_v1',
  TEST_DRIVES: 'autotrust_test_drives_v1',
  SELL_LEADS: 'autotrust_sell_leads_v1',
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cars state with localStorage sync
  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CARS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load cars from localStorage', e);
    }
    return INITIAL_CARS;
  });

  // Test drive inquiries
  const [testDrives, setTestDrives] = useState<TestDriveInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEST_DRIVES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load test drives', e);
    }
    return [
      {
        id: 'td-demo-1',
        carId: 'creta-2022-diesel-at',
        carTitle: '2022 Hyundai Creta SX (O) 1.5 CRDi AT',
        customerName: 'Rahul Sharma',
        phone: '+91 98111 22334',
        preferredDate: '2026-03-15',
        preferredTimeSlot: 'Morning (10 AM - 1 PM)',
        locationType: 'Doorstep Test Drive',
        status: 'New',
        notes: 'Interested in financing options & home test drive.',
        createdAt: '2026-03-11T09:30:00.000Z',
      },
    ];
  });

  // Sell car leads
  const [sellCarLeads, setSellCarLeads] = useState<SellCarInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELL_LEADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load sell leads', e);
    }
    return [
      {
        id: 'sell-demo-1',
        brand: 'Honda',
        model: 'City',
        year: 2021,
        km: 24000,
        fuel: 'Petrol',
        transmission: 'Manual',
        expectedPrice: 950000,
        estimatedValuationMin: 910000,
        estimatedValuationMax: 960000,
        condition: 'Good',
        accidentHistory: 'No',
        insuranceType: 'Comprehensive',
        rtoState: 'MH-04',
        sellerName: 'Vikram Joshi',
        phone: '+91 98222 44556',
        city: 'Thane, Mumbai',
        preferredInspectionDate: '2026-03-16',
        status: 'Evaluation Scheduled',
        createdAt: '2026-03-11T14:00:00.000Z',
      },
    ];
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    } catch (e) {
      console.error('Failed to save cars', e);
    }
  }, [cars]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_DRIVES, JSON.stringify(testDrives));
    } catch (e) {
      console.error('Failed to save test drives', e);
    }
  }, [testDrives]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELL_LEADS, JSON.stringify(sellCarLeads));
    } catch (e) {
      console.error('Failed to save sell leads', e);
    }
  }, [sellCarLeads]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addCar = (carData: Omit<Car, 'id' | 'createdAt'>): string => {
    const id = `${carData.brand.toLowerCase()}-${carData.model.toLowerCase()}-${Date.now().toString(36)}`.replace(/\s+/g, '-');
    const newCar: Car = {
      ...carData,
      id,
      createdAt: new Date().toISOString(),
    };
    setCars((prev) => [newCar, ...prev]);
    showToast(`Car "${newCar.title}" added to inventory successfully!`, 'success');
    return id;
  };

  const updateCar = (id: string, updates: Partial<Car>) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Car details updated successfully!', 'success');
  };

  const toggleCarStatus = (id: string) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'Available' ? 'Sold Out' : 'Available';
          showToast(`Marked ${c.title} as ${newStatus}`, 'info');
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const deleteCar = (id: string) => {
    const car = cars.find((c) => c.id === id);
    setCars((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed "${car?.title || 'Car'}" from inventory`, 'info');
  };

  const resetToDefaultInventory = () => {
    setCars(INITIAL_CARS);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
    showToast('Reset inventory to default 10 certified cars.', 'info');
  };

  const getCarById = (id: string): Car | undefined => {
    return cars.find((c) => c.id === id);
  };

  const submitTestDrive = (inquiry: Omit<TestDriveInquiry, 'id' | 'createdAt' | 'status'>): string => {
    const id = `td-${Date.now().toString(36)}`;
    const newInquiry: TestDriveInquiry = {
      ...inquiry,
      id,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setTestDrives((prev) => [newInquiry, ...prev]);
    showToast('Test drive requested! Our concierge will call you within 15 minutes.', 'success');
    return id;
  };

  const updateTestDriveStatus = (id: string, status: TestDriveInquiry['status']) => {
    setTestDrives((prev) =>
      prev.map((td) => (td.id === id ? { ...td, status } : td))
    );
    showToast(`Test drive status updated to "${status}"`, 'info');
  };

  const submitSellCar = (inquiry: Omit<SellCarInquiry, 'id' | 'createdAt' | 'status'>): string => {
    const id = `sell-${Date.now().toString(36)}`;
    const newLead: SellCarInquiry = {
      ...inquiry,
      id,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setSellCarLeads((prev) => [newLead, ...prev]);
    showToast('Car valuation request submitted! Check your WhatsApp for inspection schedule.', 'success');
    return id;
  };

  const updateSellCarStatus = (id: string, status: SellCarInquiry['status']) => {
    setSellCarLeads((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast(`Sell request status updated to "${status}"`, 'info');
  };

  return (
    <InventoryContext.Provider
      value={{
        cars,
        testDrives,
        sellCarLeads,
        toasts,
        addCar,
        updateCar,
        toggleCarStatus,
        deleteCar,
        resetToDefaultInventory,
        getCarById,
        submitTestDrive,
        updateTestDriveStatus,
        submitSellCar,
        updateSellCarStatus,
        showToast,
        removeToast,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

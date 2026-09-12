export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MUV' | 'Coupe';
export type OwnershipType = '1st Owner' | '2nd Owner' | '3rd Owner';
export type CarStatus = 'Available' | 'Sold Out';

export interface InspectionCategory {
  name: string;
  totalPoints: number;
  passedPoints: number;
  items: {
    name: string;
    status: 'Pass' | 'Attention' | 'Fail';
    notes?: string;
  }[];
}

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number; // in INR
  originalPrice?: number;
  emiStarting: number; // in INR / month
  km: number;
  fuel: FuelType;
  transmission: TransmissionType;
  ownership: OwnershipType;
  bodyType: BodyType;
  rto: string;
  insuranceValidity: string;
  mileage: string; // e.g. "18.5 kmpl"
  engineDisplacement?: string; // e.g. "1493 cc"
  seatingCapacity: number;
  color: string;
  isFeatured: boolean;
  isVerified: boolean;
  status: CarStatus;
  images: string[];
  inspectionScore: number; // e.g. 98 out of 100
  inspectionCategories: InspectionCategory[];
  keyFeatures: string[];
  description: string;
  createdAt: string;
}

export interface TestDriveInquiry {
  id: string;
  carId: string;
  carTitle: string;
  customerName: string;
  phone: string;
  preferredDate: string;
  preferredTimeSlot: 'Morning (10 AM - 1 PM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (4 PM - 7 PM)';
  locationType: 'Dealership Showroom' | 'Doorstep Test Drive';
  notes?: string;
  status: 'New' | 'Contacted' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface SellCarInquiry {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuel: FuelType;
  transmission: TransmissionType;
  expectedPrice: number;
  estimatedValuationMin: number;
  estimatedValuationMax: number;
  condition: 'Flawless' | 'Good' | 'Fair';
  accidentHistory: 'No' | 'Minor Repaired' | 'Major';
  insuranceType: 'Comprehensive' | 'Third Party' | 'Expired';
  rtoState: string;
  sellerName: string;
  phone: string;
  city: string;
  preferredInspectionDate: string;
  status: 'New' | 'Evaluation Scheduled' | 'Inspected' | 'Deal Closed' | 'Rejected';
  createdAt: string;
}

export interface FilterState {
  search: string;
  brand: string[];
  fuel: FuelType[];
  transmission: TransmissionType[];
  bodyType: BodyType[];
  ownership: OwnershipType[];
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxKm: number;
  status: 'All' | 'Available' | 'Sold Out';
  sortBy: 'price-low' | 'price-high' | 'year-new' | 'km-low' | 'featured';
}

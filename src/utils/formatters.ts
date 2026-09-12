import type { Car, SellCarInquiry } from '../types';
import { DEALERSHIP } from '../config/dealership';

/**
 * Formats an amount in INR with Lakh/Cr notation (e.g. ₹14.85 Lakh)
 */
export function formatPrice(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats exact price in standard Indian number formatting (e.g. ₹14,85,000)
 */
export function formatExactPrice(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Formats kilometer reading with comma grouping (e.g. "28,500 km")
 */
export function formatKm(km: number): string {
  return `${km.toLocaleString('en-IN')} km`;
}

/**
 * Calculates Monthly EMI using standard amortization formula
 * P = Principal loan amount
 * annualRate = Annual interest rate in percentage (e.g. 9.5)
 * tenureMonths = Loan tenure in months (e.g. 60)
 */
export function calculateEmi(principal: number, annualRate: number, tenureMonths: number): {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
} {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;
  
  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    return { monthlyEmi: Math.round(emi), totalInterest: 0, totalPayment: principal };
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi: Math.round(monthlyEmi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
}

/**
 * Generates WhatsApp click-to-chat URL for a specific car
 */
export function getWhatsAppCarInquiryUrl(car: Car): string {
  const text = `Hi ${DEALERSHIP.name}, I'm interested in buying this certified pre-owned car:
🚗 *${car.title}*
💰 *Price:* ${formatPrice(car.price)} (${formatExactPrice(car.price)})
📅 *Year:* ${car.year} | *KM:* ${formatKm(car.km)}
⛽ *Fuel:* ${car.fuel} | *Transmission:* ${car.transmission}
🆔 *Ref ID:* ${car.id}

Could you please share more details or schedule a test drive for me?`;

  return `https://wa.me/${DEALERSHIP.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp URL for a Sell Car inquiry
 */
export function getWhatsAppSellCarUrl(lead: SellCarInquiry): string {
  const text = `Hi ${DEALERSHIP.name}, I want to sell my car! Here are the details:
🚗 *Vehicle:* ${lead.brand} ${lead.model} (${lead.year})
🛣️ *KM Driven:* ${formatKm(lead.km)}
⛽ *Fuel:* ${lead.fuel} | *Transmission:* ${lead.transmission}
⭐ *Condition:* ${lead.condition}
💵 *Expected Price:* ${formatPrice(lead.expectedPrice)}
📍 *Location:* ${lead.city}
👤 *Seller:* ${lead.sellerName} (${lead.phone})
Ref: #${lead.id}

Please evaluate and share your best purchase offer.`;

  return `https://wa.me/${DEALERSHIP.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates General concierge WhatsApp link
 */
export function getWhatsAppGeneralUrl(message?: string): string {
  const text = message || `Hi ${DEALERSHIP.name}, I would like to inquire about certified pre-owned cars in your inventory.`;
  return `https://wa.me/${DEALERSHIP.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

export interface Service {
  id: string;
  name: string;
  type: 'service' | 'product';
  price: number;
  duration: number; // minutes
  description: string;
}

export interface Professional {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  services: string[]; // service IDs
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte de Cabelo', type: 'service', price: 50, duration: 30, description: 'Corte masculino ou feminino' },
  { id: '2', name: 'Coloração', type: 'service', price: 120, duration: 60, description: 'Tintura completa' },
  { id: '3', name: 'Manicure', type: 'service', price: 35, duration: 45, description: 'Unhas das mãos' },
  { id: '4', name: 'Kit Tratamento Capilar', type: 'product', price: 89.90, duration: 0, description: 'Shampoo + Condicionador + Máscara' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: '1', name: 'Ana Silva', role: 'Cabeleireira', services: ['1', '2'] },
  { id: '2', name: 'Carlos Santos', role: 'Barbeiro', services: ['1'] },
  { id: '3', name: 'Maria Oliveira', role: 'Manicure', services: ['3'] },
];

export const DEFAULT_AVAILABILITY: Availability[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', enabled: true },
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', enabled: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', enabled: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', enabled: true },
  { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', enabled: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', enabled: true },
  { dayOfWeek: 0, startTime: '09:00', endTime: '13:00', enabled: false },
];

export function generateTimeSlots(start: string, end: string, intervalMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let current = startH * 60 + startM;
  const endMin = endH * 60 + endM;

  while (current < endMin) {
    const h = Math.floor(current / 60).toString().padStart(2, '0');
    const m = (current % 60).toString().padStart(2, '0');
    slots.push({ time: `${h}:${m}`, available: Math.random() > 0.3 });
    current += intervalMinutes;
  }
  return slots;
}

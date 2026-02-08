// API utility functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Room {
  id: string;
  number: string;
  name: string;
  room_type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'FAMILY';
  capacity: number;
  floor?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  notes?: string;
  created_at: string;
  updated_at: string;
  room_number?: string;
  room_name?: string;
}

// Rooms API
export async function fetchRooms(): Promise<Room[]> {
  const response = await fetch(`${API_BASE_URL}/api/rooms`);
  if (!response.ok) throw new Error('Failed to fetch rooms');
  return response.json();
}

export async function createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> {
  const response = await fetch(`${API_BASE_URL}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(room),
  });
  if (!response.ok) throw new Error('Failed to create room');
  return response.json();
}

// Reservations API
export async function fetchReservations(params?: {
  room_id?: string;
  status?: string;
}): Promise<Reservation[]> {
  const queryParams = new URLSearchParams(params as Record<string, string>);
  const response = await fetch(`${API_BASE_URL}/api/reservations?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch reservations');
  return response.json();
}

export async function fetchCalendarReservations(
  startDate: string,
  endDate: string
): Promise<Reservation[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/reservations/calendar?start_date=${startDate}&end_date=${endDate}`
  );
  if (!response.ok) throw new Error('Failed to fetch calendar reservations');
  return response.json();
}

export async function createReservation(
  reservation: Omit<Reservation, 'id' | 'status' | 'created_at' | 'updated_at' | 'room_number' | 'room_name'>
): Promise<Reservation> {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create reservation');
  }
  return response.json();
}

export async function updateReservation(
  id: string,
  updates: Partial<Omit<Reservation, 'id' | 'created_at' | 'updated_at'>>
): Promise<Reservation> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update reservation');
  return response.json();
}

export async function deleteReservation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete reservation');
}

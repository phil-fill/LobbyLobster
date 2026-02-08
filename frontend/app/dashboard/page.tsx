'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import ReservationModal from '@/components/calendar/ReservationModal';
import ReservationDetailModal from '@/components/calendar/ReservationDetailModal';
import {
  fetchRooms,
  fetchCalendarReservations,
  Room,
  Reservation,
} from '@/lib/api';
import { formatDate, addDays } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysToShow, setDaysToShow] = useState(14);
  
  // Modal state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentDate, daysToShow]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [roomsData, reservationsData] = await Promise.all([
        fetchRooms(),
        fetchCalendarReservations(
          formatDate(currentDate),
          formatDate(addDays(currentDate, daysToShow))
        ),
      ]);
      setRooms(roomsData);
      setReservations(reservationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (room: Room, date: Date) => {
    setSelectedRoom(room);
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setSelectedDate(null);
  };

  const handleReservationSuccess = () => {
    loadData(); // Reload calendar
  };

  const handleReservationClick = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowDetailModal(true);
  };

  const handleDetailModalClose = () => {
    setShowDetailModal(false);
    setSelectedReservationId(null);
  };

  const handleReservationUpdate = () => {
    loadData();
  };

  const goToPreviousPeriod = () => {
    setCurrentDate(addDays(currentDate, -daysToShow));
  };

  const goToNextPeriod = () => {
    setCurrentDate(addDays(currentDate, daysToShow));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateJump = (dateStr: string) => {
    if (dateStr) {
      setCurrentDate(new Date(dateStr));
    }
  };

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="bg-deep-slate text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🦞</div>
            <h1 className="text-2xl font-bold">LobbyLobster</h1>
          </div>
          <nav className="flex space-x-6">
            <a
              href="/dashboard"
              className="text-[#E63946] font-semibold transition-colors"
            >
              Calendar
            </a>
            <a
              href="/dashboard/rooms"
              className="hover:text-[#E63946] transition-colors"
            >
              Rooms
            </a>
            <a
              href="/dashboard/guests"
              className="hover:text-[#E63946] transition-colors"
            >
              Guests
            </a>
            <a href="/" className="hover:text-[#E63946] transition-colors">
              Home
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-deep-slate mb-2">
            Room Calendar
          </h2>
          <p className="text-deep-slate/70">
            View and manage room reservations at a glance
          </p>
        </div>

        {/* Calendar Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousPeriod}
              className="px-4 py-2 bg-white border border-gray-300 text-deep-slate rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] transition-colors font-semibold"
            >
              Today
            </button>
            <button
              onClick={goToNextPeriod}
              className="px-4 py-2 bg-white border border-gray-300 text-deep-slate rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-deep-slate">
              Days to show:
            </label>
            <select
              value={daysToShow}
              onChange={(e) => setDaysToShow(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-deep-slate whitespace-nowrap">
                Jump to:
              </label>
              <input
                type="date"
                onChange={(e) => handleDateJump(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#E63946] rounded"></div>
            <span className="text-deep-slate">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#457B9D] rounded"></div>
            <span className="text-deep-slate">Checked In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <span className="text-deep-slate">Checked Out</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-4">🦞</div>
              <div className="text-deep-slate font-semibold">
                Loading calendar...
              </div>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-deep-slate mb-2">
              No rooms yet
            </h3>
            <p className="text-deep-slate/70 mb-6">
              Add your first room to start managing reservations
            </p>
            <a
              href="/dashboard/rooms"
              className="inline-block px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] transition-colors font-semibold"
            >
              Go to Rooms
            </a>
          </div>
        ) : (
          <CalendarGrid
            rooms={rooms}
            reservations={reservations}
            startDate={currentDate}
            days={daysToShow}
            onCellClick={handleCellClick}
            onReservationClick={handleReservationClick}
          />
        )}
      </main>

      {/* Reservation Create Modal */}
      {showModal && (
        <ReservationModal
          room={selectedRoom}
          date={selectedDate}
          onClose={handleModalClose}
          onSuccess={handleReservationSuccess}
        />
      )}

      {/* Reservation Detail Modal */}
      {showDetailModal && selectedReservationId && (
        <ReservationDetailModal
          reservationId={selectedReservationId}
          onClose={handleDetailModalClose}
          onUpdate={handleReservationUpdate}
        />
      )}
    </div>
  );
}

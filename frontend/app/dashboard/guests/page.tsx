'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GuestDetailModal from '@/components/guests/GuestDetailModal';
import { fetchGuests, Guest } from '@/lib/api';
import { format } from 'date-fns';

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchGuests();
      setGuests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.guest_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.guest_company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGuestClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowDetailModal(true);
  };

  const handleModalClose = () => {
    setShowDetailModal(false);
    setSelectedGuest(null);
  };

  const handleGuestUpdate = () => {
    loadGuests();
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
            <Link
              href="/dashboard"
              className="hover:text-[#E63946] transition-colors"
            >
              Calendar
            </Link>
            <Link
              href="/dashboard/rooms"
              className="hover:text-[#E63946] transition-colors"
            >
              Rooms
            </Link>
            <Link
              href="/dashboard/guests"
              className="text-[#E63946] font-semibold transition-colors"
            >
              Guests
            </Link>
            <Link href="/" className="hover:text-[#E63946] transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-deep-slate mb-2">Guest Database</h2>
          <p className="text-deep-slate/70">
            View all guests who have stayed at your hotel
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#E63946]">
            <div className="text-2xl font-bold text-deep-slate">
              {guests.length}
            </div>
            <div className="text-sm text-deep-slate/70">Total Guests</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#457B9D]">
            <div className="text-2xl font-bold text-deep-slate">
              {guests.reduce((sum, g) => sum + g.total_stays, 0)}
            </div>
            <div className="text-sm text-deep-slate/70">Total Stays</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#457B9D]">
            <div className="text-2xl font-bold text-deep-slate">
              {guests.reduce((sum, g) => sum + g.total_nights, 0)}
            </div>
            <div className="text-sm text-deep-slate/70">Total Nights</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-4">🦞</div>
              <div className="text-deep-slate font-semibold">Loading guests...</div>
            </div>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-deep-slate mb-2">
              {searchQuery ? 'No guests found' : 'No guests yet'}
            </h3>
            <p className="text-deep-slate/70">
              {searchQuery
                ? 'Try a different search term'
                : 'Guests will appear here after their first reservation'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGuests.map((guest, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-[#E63946]"
              >
                {/* Guest Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-deep-slate mb-1">
                      {guest.guest_name}
                    </h3>
                    {guest.guest_company && (
                      <div className="text-sm text-deep-slate/60 mb-2">
                        🏢 {guest.guest_company}
                      </div>
                    )}
                    <div className="space-y-1 text-sm text-deep-slate/70">
                      {guest.guest_email && <div>📧 {guest.guest_email}</div>}
                      {guest.guest_phone && <div>📞 {guest.guest_phone}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#E63946]">
                      {guest.total_stays}
                    </div>
                    <div className="text-xs text-deep-slate/60">
                      {guest.total_stays === 1 ? 'stay' : 'stays'}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-b">
                  <div className="text-center">
                    <div className="font-semibold text-deep-slate">
                      {guest.total_nights}
                    </div>
                    <div className="text-xs text-deep-slate/60">nights</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-deep-slate text-sm">
                      {format(new Date(guest.first_visit), 'MMM yyyy')}
                    </div>
                    <div className="text-xs text-deep-slate/60">first visit</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-deep-slate text-sm">
                      {format(new Date(guest.last_visit), 'MMM yyyy')}
                    </div>
                    <div className="text-xs text-deep-slate/60">last visit</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleGuestClick(guest)}
                    className="w-full px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] transition-colors font-semibold text-sm"
                  >
                    View Full Profile & Edit
                  </button>
                </div>

                {/* Reservation History Preview */}
                {selectedGuest === guest && false && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-semibold text-deep-slate mb-2">
                      Reservation History
                    </div>
                    {guest.reservations.map((res) => (
                      <div
                        key={res.id}
                        className="bg-soft-cream p-3 rounded-lg text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-deep-slate">
                            Room {res.room_number} - {res.room_name}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              res.status === 'CONFIRMED'
                                ? 'bg-blue-100 text-blue-800'
                                : res.status === 'CHECKED_IN'
                                ? 'bg-green-100 text-green-800'
                                : res.status === 'CHECKED_OUT'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <div className="text-deep-slate/70">
                          {format(new Date(res.check_in), 'MMM d, yyyy')} →{' '}
                          {format(new Date(res.check_out), 'MMM d, yyyy')}
                          <span className="ml-2">({res.nights} nights)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Guest Detail Modal */}
      {showDetailModal && selectedGuest && (
        <GuestDetailModal
          guest={selectedGuest}
          onClose={handleModalClose}
          onUpdate={handleGuestUpdate}
        />
      )}
    </div>
  );
}

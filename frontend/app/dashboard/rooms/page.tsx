'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RoomModal from '@/components/rooms/RoomModal';
import { fetchRooms, Room } from '@/lib/api';
import { getRoomTypeLabel } from '@/lib/utils';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleRoomSuccess = () => {
    loadRooms();
  };

  const filteredRooms =
    filterType === 'ALL'
      ? rooms
      : rooms.filter((room) => room.room_type === filterType);

  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    const floor = room.floor || 0;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

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
              className="text-[#E63946] font-semibold transition-colors"
            >
              Rooms
            </Link>
            <Link
              href="/dashboard/guests"
              className="hover:text-[#E63946] transition-colors"
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-deep-slate mb-2">Rooms</h2>
            <p className="text-deep-slate/70">
              Manage your hotel rooms and amenities
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] transition-colors font-semibold shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add Room
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#E63946]">
            <div className="text-2xl font-bold text-deep-slate">
              {rooms.length}
            </div>
            <div className="text-sm text-deep-slate/70">Total Rooms</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#457B9D]">
            <div className="text-2xl font-bold text-deep-slate">
              {rooms.filter((r) => r.room_type === 'SINGLE').length}
            </div>
            <div className="text-sm text-deep-slate/70">Singles</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#457B9D]">
            <div className="text-2xl font-bold text-deep-slate">
              {rooms.filter((r) => r.room_type === 'DOUBLE').length}
            </div>
            <div className="text-sm text-deep-slate/70">Doubles</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-[#457B9D]">
            <div className="text-2xl font-bold text-deep-slate">
              {rooms.filter((r) => r.room_type === 'SUITE').length +
                rooms.filter((r) => r.room_type === 'FAMILY').length}
            </div>
            <div className="text-sm text-deep-slate/70">Suites & Family</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'ALL'
                ? 'bg-[#E63946] text-white'
                : 'bg-white text-deep-slate border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setFilterType('SINGLE')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'SINGLE'
                ? 'bg-[#E63946] text-white'
                : 'bg-white text-deep-slate border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Singles
          </button>
          <button
            onClick={() => setFilterType('DOUBLE')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'DOUBLE'
                ? 'bg-[#E63946] text-white'
                : 'bg-white text-deep-slate border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Doubles
          </button>
          <button
            onClick={() => setFilterType('SUITE')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'SUITE'
                ? 'bg-[#E63946] text-white'
                : 'bg-white text-deep-slate border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Suites
          </button>
          <button
            onClick={() => setFilterType('FAMILY')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'FAMILY'
                ? 'bg-[#E63946] text-white'
                : 'bg-white text-deep-slate border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Family
          </button>
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
              <div className="text-deep-slate font-semibold">
                Loading rooms...
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
              Add your first room to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] transition-colors font-semibold"
            >
              Add Room
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(roomsByFloor)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((floor) => (
                <div key={floor}>
                  <h3 className="text-lg font-bold text-deep-slate mb-3">
                    Floor {floor}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {roomsByFloor[parseInt(floor)].map((room) => (
                      <div
                        key={room.id}
                        className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-[#E63946]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-2xl font-bold text-deep-slate">
                              {room.number}
                            </div>
                            <div className="text-sm text-deep-slate/70">
                              {room.name}
                            </div>
                          </div>
                          <div className="text-2xl">
                            {room.room_type === 'SINGLE'
                              ? '🛏️'
                              : room.room_type === 'DOUBLE'
                              ? '🛏️🛏️'
                              : room.room_type === 'SUITE'
                              ? '✨'
                              : '👨‍👩‍👧‍👦'}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-deep-slate/60">Type:</span>
                            <span className="font-medium text-deep-slate">
                              {getRoomTypeLabel(room.room_type)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-deep-slate/60">
                              Capacity:
                            </span>
                            <span className="font-medium text-deep-slate">
                              {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
                            </span>
                          </div>
                          {room.description && (
                            <div className="text-xs text-deep-slate/60 mt-2 pt-2 border-t">
                              {room.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Room Modal */}
      {showModal && (
        <RoomModal onClose={handleModalClose} onSuccess={handleRoomSuccess} />
      )}
    </div>
  );
}

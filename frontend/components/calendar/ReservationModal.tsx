'use client';

import { useState } from 'react';
import { Room, createReservation } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface ReservationModalProps {
  room: Room | null;
  date: Date | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationModal({
  room,
  date,
  onClose,
  onSuccess,
}: ReservationModalProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    guest_company: '',
    check_in: date ? formatDate(date) : '',
    check_out: date ? formatDate(new Date(date.getTime() + 86400000)) : '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!room || !date) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createReservation({
        room_id: room.id,
        ...formData,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-deep-slate">
            New Reservation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-soft-cream rounded-lg">
          <div className="text-sm text-deep-slate/70">Room</div>
          <div className="font-semibold text-deep-slate">
            {room.number} - {room.name}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-slate mb-1">
              Guest Name *
            </label>
            <input
              type="text"
              required
              value={formData.guest_name}
              onChange={(e) =>
                setFormData({ ...formData, guest_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-slate mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.guest_email}
              onChange={(e) =>
                setFormData({ ...formData, guest_email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.guest_phone}
                onChange={(e) =>
                  setFormData({ ...formData, guest_phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.guest_company}
                onChange={(e) =>
                  setFormData({ ...formData, guest_company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Check-in *
              </label>
              <input
                type="date"
                required
                value={formData.check_in}
                onChange={(e) =>
                  setFormData({ ...formData, check_in: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Check-out *
              </label>
              <input
                type="date"
                required
                value={formData.check_out}
                onChange={(e) =>
                  setFormData({ ...formData, check_out: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-slate mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              placeholder="Special requests or notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-deep-slate rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] disabled:bg-gray-400 transition-colors font-semibold"
            >
              {loading ? 'Creating...' : 'Create Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

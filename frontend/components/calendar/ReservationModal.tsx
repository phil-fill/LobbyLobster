'use client';

import { useState, useEffect } from 'react';
import { Room, createReservation, searchGuests } from '@/lib/api';
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
    guest_address: '',
    guest_city: '',
    guest_postal_code: '',
    guest_country: '',
    guest_company: '',
    company_address: '',
    company_city: '',
    company_postal_code: '',
    company_country: '',
    check_in: date ? formatDate(date) : '',
    check_out: date ? formatDate(new Date(date.getTime() + 86400000)) : '',
    price_per_night: 0,
    breakfast_included: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestSuggestions, setGuestSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!room || !date) return null;

  useEffect(() => {
    const searchGuestsDebounced = async () => {
      if (formData.guest_name.length >= 2) {
        try {
          const results = await searchGuests(formData.guest_name);
          setGuestSuggestions(results);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Failed to search guests:', err);
        }
      } else {
        setGuestSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(searchGuestsDebounced, 300);
    return () => clearTimeout(timer);
  }, [formData.guest_name]);

  const handleSelectGuest = (guest: any) => {
    setFormData({
      ...formData,
      guest_name: guest.guest_name,
      guest_email: guest.guest_email || '',
      guest_phone: guest.guest_phone || '',
      guest_address: guest.guest_address || '',
      guest_city: guest.guest_city || '',
      guest_postal_code: guest.guest_postal_code || '',
      guest_country: guest.guest_country || '',
      guest_company: guest.guest_company || '',
      company_address: guest.company_address || '',
      company_city: guest.company_city || '',
      company_postal_code: guest.company_postal_code || '',
      company_country: guest.company_country || '',
    });
    setShowSuggestions(false);
  };

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

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="relative">
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
              onFocus={() => guestSuggestions.length > 0 && setShowSuggestions(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              placeholder="Start typing name..."
              autoComplete="off"
            />
            {showSuggestions && guestSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {guestSuggestions.map((guest, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectGuest(guest)}
                    className="px-3 py-2 hover:bg-soft-cream cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-deep-slate">{guest.guest_name}</div>
                    {guest.guest_email && (
                      <div className="text-xs text-deep-slate/60">{guest.guest_email}</div>
                    )}
                    {guest.guest_company && (
                      <div className="text-xs text-deep-slate/60">🏢 {guest.guest_company}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

          {/* Guest Address */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-deep-slate mb-3">Guest Address</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.guest_address}
                onChange={(e) =>
                  setFormData({ ...formData, guest_address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Street address"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.guest_postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, guest_postal_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  placeholder="Postal code"
                />
                <input
                  type="text"
                  value={formData.guest_city}
                  onChange={(e) =>
                    setFormData({ ...formData, guest_city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  placeholder="City"
                />
              </div>
              <input
                type="text"
                value={formData.guest_country}
                onChange={(e) =>
                  setFormData({ ...formData, guest_country: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Country"
              />
            </div>
          </div>

          {/* Company Information (Optional) */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-deep-slate mb-3">Company (Optional)</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.guest_company}
                onChange={(e) =>
                  setFormData({ ...formData, guest_company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Company name"
              />
              <input
                type="text"
                value={formData.company_address}
                onChange={(e) =>
                  setFormData({ ...formData, company_address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Company street address"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.company_postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, company_postal_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  placeholder="Postal code"
                />
                <input
                  type="text"
                  value={formData.company_city}
                  onChange={(e) =>
                    setFormData({ ...formData, company_city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  placeholder="City"
                />
              </div>
              <input
                type="text"
                value={formData.company_country}
                onChange={(e) =>
                  setFormData({ ...formData, company_country: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Country"
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

          {/* Pricing */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-deep-slate mb-3">Pricing</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-deep-slate mb-1">
                  Price per Night (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_per_night}
                  onChange={(e) =>
                    setFormData({ ...formData, price_per_night: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.breakfast_included}
                    onChange={(e) =>
                      setFormData({ ...formData, breakfast_included: e.target.checked })
                    }
                    className="w-4 h-4 text-[#E63946] border-gray-300 rounded focus:ring-[#E63946]"
                  />
                  <span className="text-sm text-deep-slate">Breakfast included</span>
                </label>
              </div>
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

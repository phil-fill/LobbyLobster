'use client';

import { useState } from 'react';
import { Guest, updateGuestInfo } from '@/lib/api';
import { format } from 'date-fns';

interface GuestDetailModalProps {
  guest: Guest;
  onClose: () => void;
  onUpdate: () => void;
}

export default function GuestDetailModal({
  guest,
  onClose,
  onUpdate,
}: GuestDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
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

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      await updateGuestInfo(guest.guest_name, formData);
      onUpdate();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guest');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-deep-slate">Guest Profile</h2>
            <p className="text-sm text-deep-slate/60 mt-1">
              {guest.total_stays} {guest.total_stays === 1 ? 'stay' : 'stays'} • {guest.total_nights} nights total
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isEditing && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg text-sm">
            ℹ️ Changes will be applied to <strong>all {guest.total_stays} reservations</strong> for this guest
          </div>
        )}

        {/* Content */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Guest Information */}
          <div>
            <h3 className="text-lg font-bold text-deep-slate mb-3">Guest Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-deep-slate/70 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                ) : (
                  <div className="text-deep-slate font-medium text-lg">{guest.guest_name}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-deep-slate/70 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.guest_email}
                      onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                    />
                  ) : (
                    <div className="text-deep-slate">{guest.guest_email || '-'}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-slate/70 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.guest_phone}
                      onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                    />
                  ) : (
                    <div className="text-deep-slate">{guest.guest_phone || '-'}</div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-deep-slate/70 mb-2">Address</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.guest_address}
                      onChange={(e) => setFormData({ ...formData, guest_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                      placeholder="Street address"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.guest_postal_code}
                        onChange={(e) => setFormData({ ...formData, guest_postal_code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                        placeholder="Postal code"
                      />
                      <input
                        type="text"
                        value={formData.guest_city}
                        onChange={(e) => setFormData({ ...formData, guest_city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                        placeholder="City"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.guest_country}
                      onChange={(e) => setFormData({ ...formData, guest_country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                      placeholder="Country"
                    />
                  </div>
                ) : (
                  <div className="text-deep-slate">
                    {[guest.guest_address,
                      [guest.guest_postal_code, guest.guest_city].filter(Boolean).join(' '),
                      guest.guest_country
                    ].filter(Boolean).join(', ') || '-'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          {(isEditing || guest.guest_company) && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold text-deep-slate mb-3">Company Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-deep-slate/70 mb-1">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.guest_company}
                      onChange={(e) => setFormData({ ...formData, guest_company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                    />
                  ) : (
                    <div className="text-deep-slate">{guest.guest_company || '-'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-slate/70 mb-2">Company Address</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.company_address}
                        onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                        placeholder="Street address"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={formData.company_postal_code}
                          onChange={(e) => setFormData({ ...formData, company_postal_code: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                          placeholder="Postal code"
                        />
                        <input
                          type="text"
                          value={formData.company_city}
                          onChange={(e) => setFormData({ ...formData, company_city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                          placeholder="City"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.company_country}
                        onChange={(e) => setFormData({ ...formData, company_country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                        placeholder="Country"
                      />
                    </div>
                  ) : (
                    <div className="text-deep-slate">
                      {[guest.company_address,
                        [guest.company_postal_code, guest.company_city].filter(Boolean).join(' '),
                        guest.company_country
                      ].filter(Boolean).join(', ') || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Visit Statistics */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-deep-slate mb-3">Visit History</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-soft-cream p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-[#E63946]">{guest.total_stays}</div>
                <div className="text-sm text-deep-slate/70">Total Stays</div>
              </div>
              <div className="bg-soft-cream p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-[#E63946]">{guest.total_nights}</div>
                <div className="text-sm text-deep-slate/70">Total Nights</div>
              </div>
              <div className="bg-soft-cream p-4 rounded-lg text-center">
                <div className="text-sm font-medium text-deep-slate">
                  {format(new Date(guest.last_visit), 'MMM d, yyyy')}
                </div>
                <div className="text-xs text-deep-slate/70">Last Visit</div>
              </div>
            </div>

            {/* Reservation List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <div className="text-sm font-semibold text-deep-slate mb-2">All Reservations</div>
              {guest.reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-gray-200 p-3 rounded-lg text-sm hover:shadow-sm transition-shadow"
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
                    {format(new Date(res.check_in), 'MMM d')} → {format(new Date(res.check_out), 'MMM d, yyyy')}
                    <span className="ml-2">({res.nights} nights)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
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
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-deep-slate rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] disabled:bg-gray-400 transition-colors font-semibold"
              >
                {saving ? 'Saving...' : `Update All ${guest.total_stays} Reservations`}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-deep-slate rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-[#D32F40] transition-colors font-semibold"
              >
                Edit Guest Info
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

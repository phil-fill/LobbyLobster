'use client';

import { useState, useEffect } from 'react';
import { Reservation, updateReservation, deleteReservation, fetchRooms, Room, getInvoicePdfUrl } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { format } from 'date-fns';

interface ReservationDetailModalProps {
  reservationId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ReservationDetailModal({
  reservationId,
  onClose,
  onUpdate,
}: ReservationDetailModalProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    room_id: '',
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
    check_in: '',
    check_out: '',
    status: 'CONFIRMED' as 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED',
    price_per_night: 0,
    breakfast_included: false,
    payment_method: '' as '' | 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'INVOICE',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [reservationId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, roomsData] = await Promise.all([
        fetch(`http://localhost:8000/api/reservations/${reservationId}`).then(r => r.json()),
        fetchRooms()
      ]);
      
      setReservation(resData);
      setRooms(roomsData);
      setFormData({
        room_id: resData.room_id,
        guest_name: resData.guest_name,
        guest_email: resData.guest_email || '',
        guest_phone: resData.guest_phone || '',
        guest_address: resData.guest_address || '',
        guest_city: resData.guest_city || '',
        guest_postal_code: resData.guest_postal_code || '',
        guest_country: resData.guest_country || '',
        guest_company: resData.guest_company || '',
        company_address: resData.company_address || '',
        company_city: resData.company_city || '',
        company_postal_code: resData.company_postal_code || '',
        company_country: resData.company_country || '',
        check_in: resData.check_in,
        check_out: resData.check_out,
        status: resData.status,
        price_per_night: resData.price_per_night || 0,
        breakfast_included: resData.breakfast_included || false,
        payment_method: resData.payment_method || '',
        notes: resData.notes || '',
      });
    } catch (err) {
      setError('Failed to load reservation details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      await updateReservation(reservationId, formData);
      onUpdate();
      setIsEditing(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reservation');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    setSaving(true);
    setError('');

    try {
      await deleteReservation(reservationId);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete reservation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🦞</div>
            <div className="text-deep-slate font-semibold">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) return null;

  const room = rooms.find(r => r.id === reservation.room_id);
  const nights = Math.ceil(
    (new Date(reservation.check_out).getTime() - new Date(reservation.check_in).getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CHECKED_IN': return 'bg-green-100 text-green-800 border-green-300';
      case 'CHECKED_OUT': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-deep-slate">
            Reservation Details
          </h2>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <a
                href={getInvoicePdfUrl(reservationId)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#457B9D] text-white rounded-lg hover:bg-[#3A6A85] transition-colors font-semibold text-sm flex items-center gap-2"
              >
                📄 Download Invoice
              </a>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Room Info */}
          <div className="bg-soft-cream p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-deep-slate/70">Room</div>
                {isEditing ? (
                  <select
                    value={formData.room_id}
                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.number} - {r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="font-semibold text-deep-slate text-lg">
                    {room?.number} - {room?.name}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-deep-slate/70">Status</div>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={`mt-1 px-3 py-2 border rounded-lg font-semibold ${getStatusColor(formData.status)}`}
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CHECKED_IN">Checked In</option>
                    <option value="CHECKED_OUT">Checked Out</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                )}
              </div>
            </div>
          </div>

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
                  <div className="text-deep-slate font-medium">{reservation.guest_name}</div>
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
                    <div className="text-deep-slate">{reservation.guest_email || '-'}</div>
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
                    <div className="text-deep-slate">{reservation.guest_phone || '-'}</div>
                  )}
                </div>
              </div>
              {/* Guest Address */}
              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-deep-slate/70 mb-2">Address</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.guest_address}
                      onChange={(e) => setFormData({ ...formData, guest_address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                      placeholder="Street"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.guest_postal_code}
                        onChange={(e) => setFormData({ ...formData, guest_postal_code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                        placeholder="Postal"
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
                  <div className="text-deep-slate text-sm">
                    {[reservation.guest_address, 
                      [reservation.guest_postal_code, reservation.guest_city].filter(Boolean).join(' '),
                      reservation.guest_country
                    ].filter(Boolean).join(', ') || '-'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          {(isEditing || reservation.guest_company) && (
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
                    <div className="text-deep-slate">{reservation.guest_company || '-'}</div>
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
                        placeholder="Street"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={formData.company_postal_code}
                          onChange={(e) => setFormData({ ...formData, company_postal_code: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                          placeholder="Postal"
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
                    <div className="text-deep-slate text-sm">
                      {[reservation.company_address,
                        [reservation.company_postal_code, reservation.company_city].filter(Boolean).join(' '),
                        reservation.company_country
                      ].filter(Boolean).join(', ') || '-'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stay Information */}
          <div>
            <h3 className="text-lg font-bold text-deep-slate mb-3">Stay Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-deep-slate/70 mb-1">Check-in</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.check_in}
                    onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                ) : (
                  <div className="text-deep-slate font-medium">
                    {format(new Date(reservation.check_in), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-slate/70 mb-1">Check-out</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.check_out}
                    onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                ) : (
                  <div className="text-deep-slate font-medium">
                    {format(new Date(reservation.check_out), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-slate/70 mb-1">Nights</label>
                <div className="text-deep-slate font-medium">{nights}</div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-deep-slate mb-3">Pricing & Payment</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-deep-slate/70 mb-1">Price per Night</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                ) : (
                  <div className="text-deep-slate font-medium">
                    {reservation.price_per_night ? `€${reservation.price_per_night.toFixed(2)}` : '-'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-slate/70 mb-1">Total Price</label>
                <div className="text-deep-slate font-bold text-lg text-[#E63946]">
                  {reservation.total_price ? `€${reservation.total_price.toFixed(2)}` : 
                   reservation.price_per_night ? `€${(reservation.price_per_night * nights).toFixed(2)}` : '-'}
                </div>
              </div>
            </div>
            <div className="mb-3">
              {isEditing ? (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.breakfast_included}
                    onChange={(e) => setFormData({ ...formData, breakfast_included: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-deep-slate">Breakfast included</span>
                </label>
              ) : (
                reservation.breakfast_included && (
                  <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg inline-block">
                    ✓ Breakfast included
                  </div>
                )
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-slate/70 mb-1">Payment Method</label>
              {isEditing ? (
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                >
                  <option value="">Not specified</option>
                  <option value="CASH">Cash</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="INVOICE">Invoice (by post)</option>
                </select>
              ) : (
                <div className="text-deep-slate">
                  {reservation.payment_method ? 
                    {
                      'CASH': '💵 Cash',
                      'DEBIT_CARD': '💳 Debit Card',
                      'CREDIT_CARD': '💳 Credit Card',
                      'INVOICE': '📄 Invoice (by post)'
                    }[reservation.payment_method] : '-'}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-deep-slate/70 mb-1">Notes</label>
            {isEditing ? (
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="Special requests or notes..."
              />
            ) : (
              <div className="text-deep-slate bg-gray-50 p-3 rounded-lg min-h-[60px]">
                {reservation.notes || 'No notes'}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="text-xs text-deep-slate/50 border-t pt-4">
            <div>Created: {format(new Date(reservation.created_at), 'MMM d, yyyy HH:mm')}</div>
            <div>Updated: {format(new Date(reservation.updated_at), 'MMM d, yyyy HH:mm')}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  loadData();
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
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                Delete
              </button>
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
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

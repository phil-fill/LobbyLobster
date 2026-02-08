'use client';

import { useState } from 'react';
import { createRoom } from '@/lib/api';

interface RoomModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RoomModal({ onClose, onSuccess }: RoomModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    room_type: 'DOUBLE' as 'SINGLE' | 'DOUBLE' | 'SUITE' | 'FAMILY',
    capacity: 2,
    floor: 1,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createRoom(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-deep-slate">Add New Room</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Room Number *
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Floor *
              </label>
              <input
                type="number"
                required
                min="0"
                max="50"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-slate mb-1">
              Room Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              placeholder="Deluxe Double Room"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Room Type *
              </label>
              <select
                value={formData.room_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    room_type: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              >
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SUITE">Suite</option>
                <option value="FAMILY">Family</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-slate mb-1">
                Capacity *
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-deep-slate mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              placeholder="Room features and amenities..."
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
              {loading ? 'Creating...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

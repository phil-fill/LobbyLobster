'use client';

import { useState, useEffect } from 'react';
import { Room, Reservation } from '@/lib/api';
import { formatDate, getDateRange, addDays } from '@/lib/utils';
import { format } from 'date-fns';

interface CalendarGridProps {
  rooms: Room[];
  reservations: Reservation[];
  startDate: Date;
  days: number;
  onCellClick?: (room: Room, date: Date) => void;
}

export default function CalendarGrid({
  rooms,
  reservations,
  startDate,
  days,
  onCellClick,
}: CalendarGridProps) {
  const dates = getDateRange(startDate, addDays(startDate, days - 1));

  // Build a map of room + date -> reservation
  const reservationMap = new Map<string, Reservation>();
  reservations.forEach((res) => {
    const checkIn = new Date(res.check_in);
    const checkOut = new Date(res.check_out);
    const resDates = getDateRange(checkIn, addDays(checkOut, -1));
    
    resDates.forEach((date) => {
      const key = `${res.room_id}_${formatDate(date)}`;
      reservationMap.set(key, res);
    });
  });

  const handleCellClick = (room: Room, date: Date) => {
    if (onCellClick) {
      onCellClick(room, date);
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-deep-slate text-white">
            <th className="sticky left-0 z-10 bg-deep-slate px-4 py-3 text-left font-semibold border-r-2 border-white min-w-[150px]">
              Room
            </th>
            {dates.map((date) => (
              <th
                key={formatDate(date)}
                className="px-2 py-3 text-center font-medium border-r border-white/20 min-w-[80px]"
              >
                <div className="text-xs">{format(date, 'EEE')}</div>
                <div className="text-sm">{format(date, 'MMM d')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, roomIndex) => (
            <tr
              key={room.id}
              className={roomIndex % 2 === 0 ? 'bg-soft-cream' : 'bg-white'}
            >
              <td className="sticky left-0 z-10 px-4 py-3 border-b border-r-2 border-gray-200 font-medium bg-inherit">
                <div className="text-sm font-semibold text-deep-slate">
                  {room.number}
                </div>
                <div className="text-xs text-deep-slate/60">
                  {room.name}
                </div>
              </td>
              {dates.map((date) => {
                const key = `${room.id}_${formatDate(date)}`;
                const reservation = reservationMap.get(key);
                const isStart = reservation && formatDate(new Date(reservation.check_in)) === formatDate(date);
                const isEnd = reservation && formatDate(new Date(reservation.check_out)) === formatDate(addDays(date, 1));

                return (
                  <td
                    key={formatDate(date)}
                    className={`
                      border-b border-r border-gray-200 p-0 cursor-pointer
                      hover:bg-[#E63946]/10 transition-colors
                    `}
                    onClick={() => handleCellClick(room, date)}
                  >
                    {reservation ? (
                      <div
                        className={`
                          h-12 flex items-center justify-center
                          ${isStart ? 'rounded-l-md' : ''}
                          ${isEnd ? 'rounded-r-md' : ''}
                          ${
                            reservation.status === 'CONFIRMED'
                              ? 'bg-[#E63946] text-white'
                              : reservation.status === 'CHECKED_IN'
                              ? 'bg-[#457B9D] text-white'
                              : 'bg-gray-300 text-gray-700'
                          }
                        `}
                        title={`${reservation.guest_name} (${reservation.status})`}
                      >
                        {isStart && (
                          <span className="text-xs font-medium truncate px-2">
                            {reservation.guest_name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-12 flex items-center justify-center text-gray-300 hover:text-[#E63946]">
                        +
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

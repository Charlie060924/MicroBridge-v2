"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Clock, Check } from 'lucide-react';

interface TimeSlot {
  day: string;
  hour: number;
  available: boolean;
}

interface AvailabilityRange {
  day: string;
  ranges: [number, number][]; // [startHour, endHour][]
}

interface AvailabilityGridProps {
  availability: AvailabilityRange[];
  onAvailabilityChange: (availability: AvailabilityRange[]) => void;
  className?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

export default function AvailabilityGrid({
  availability,
  onAvailabilityChange,
  className = '',
}: AvailabilityGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: string; hour: number } | null>(null);

  // Convert availability ranges to time slots for easier manipulation
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[][] = DAYS.map(day => 
      HOURS.map(hour => ({
        day,
        hour,
        available: availability.some(range => 
          range.day === day && 
          range.ranges.some(([start, end]) => hour >= start && hour < end)
        ),
      }))
    );
    return slots;
  }, [availability]);

  // Convert time slots back to availability ranges
  const slotsToRanges = useCallback((slots: TimeSlot[][]) => {
    const ranges: AvailabilityRange[] = [];
    
    DAYS.forEach((day, dayIndex) => {
      const daySlots = slots[dayIndex];
      const dayRanges: [number, number][] = [];
      let startHour: number | null = null;
      
      daySlots.forEach((slot, hourIndex) => {
        if (slot.available && startHour === null) {
          startHour = slot.hour;
        } else if (!slot.available && startHour !== null) {
          dayRanges.push([startHour, slot.hour]);
          startHour = null;
        }
      });
      
      // Handle case where availability extends to end of day
      if (startHour !== null) {
        dayRanges.push([startHour, HOURS[HOURS.length - 1] + 1]);
      }
      
      if (dayRanges.length > 0) {
        ranges.push({ day, ranges: dayRanges });
      }
    });
    
    return ranges;
  }, []);

  // Toggle time slot
  const toggleSlot = useCallback((day: string, hour: number) => {
    const dayIndex = DAYS.indexOf(day);
    const hourIndex = HOURS.indexOf(hour);
    
    if (dayIndex === -1 || hourIndex === -1) return;
    
    const newSlots = timeSlots.map((daySlots, dIndex) =>
      dIndex === dayIndex
        ? daySlots.map((slot, hIndex) =>
            hIndex === hourIndex
              ? { ...slot, available: !slot.available }
              : slot
          )
        : daySlots
    );
    
    const newAvailability = slotsToRanges(newSlots);
    onAvailabilityChange(newAvailability);
  }, [timeSlots, onAvailabilityChange, slotsToRanges]);

  // Handle drag start
  const handleMouseDown = useCallback((day: string, hour: number) => {
    setIsDragging(true);
    setDragStart({ day, hour });
  }, []);

  // Handle drag over
  const handleMouseEnter = useCallback((day: string, hour: number) => {
    if (!isDragging || !dragStart) return;
    
    const dayIndex = DAYS.indexOf(day);
    const hourIndex = HOURS.indexOf(hour);
    const startDayIndex = DAYS.indexOf(dragStart.day);
    const startHourIndex = HOURS.indexOf(dragStart.hour);
    
    if (dayIndex === -1 || hourIndex === -1 || startDayIndex === -1 || startHourIndex === -1) return;
    
    // Determine the target state (opposite of start slot)
    const startSlot = timeSlots[startDayIndex][startHourIndex];
    const targetState = !startSlot.available;
    
    // Update all slots in the drag range
    const newSlots = timeSlots.map((daySlots, dIndex) =>
      daySlots.map((slot, hIndex) => {
        const inRange = dIndex >= Math.min(startDayIndex, dayIndex) && 
                       dIndex <= Math.max(startDayIndex, dayIndex) &&
                       hIndex >= Math.min(startHourIndex, hourIndex) && 
                       hIndex <= Math.max(startHourIndex, hourIndex);
        
        return inRange ? { ...slot, available: targetState } : slot;
      })
    );
    
    const newAvailability = slotsToRanges(newSlots);
    onAvailabilityChange(newAvailability);
  }, [isDragging, dragStart, timeSlots, onAvailabilityChange, slotsToRanges]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Quick actions
  const setAllAvailable = useCallback(() => {
    const newSlots = timeSlots.map(daySlots =>
      daySlots.map(slot => ({ ...slot, available: true }))
    );
    const newAvailability = slotsToRanges(newSlots);
    onAvailabilityChange(newAvailability);
  }, [timeSlots, onAvailabilityChange, slotsToRanges]);

  const setAllUnavailable = useCallback(() => {
    onAvailabilityChange([]);
  }, [onAvailabilityChange]);

  const setWeekdaysOnly = useCallback(() => {
    const newSlots = timeSlots.map((daySlots, dayIndex) =>
      daySlots.map(slot => ({
        ...slot,
        available: dayIndex < 5 // Mon-Fri only
      }))
    );
    const newAvailability = slotsToRanges(newSlots);
    onAvailabilityChange(newAvailability);
  }, [timeSlots, onAvailabilityChange, slotsToRanges]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={setAllAvailable}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
        >
          All Available
        </button>
        <button
          onClick={setAllUnavailable}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          All Unavailable
        </button>
        <button
          onClick={setWeekdaysOnly}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Weekdays Only
        </button>
      </div>

      {/* Grid */}
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Header */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
          <div className="p-3 border-r border-gray-200">
            <Clock className="h-4 w-4 text-gray-500" />
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {HOURS.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
            <div className="p-2 border-r border-gray-200 text-sm text-gray-500 flex items-center justify-center">
              {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
            </div>
            {DAYS.map((day, dayIndex) => {
              const slot = timeSlots[dayIndex][HOURS.indexOf(hour)];
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`
                    p-2 border-r border-gray-200 last:border-r-0 cursor-pointer transition-colors
                    ${slot.available 
                      ? 'bg-green-100 hover:bg-green-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                  onMouseDown={() => handleMouseDown(day, hour)}
                  onMouseEnter={() => handleMouseEnter(day, hour)}
                >
                  {slot.available && (
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Check,
  X,
  AlertCircle,
  Info,
  Zap,
  CalendarDays,
  Smartphone,
  Monitor
} from 'lucide-react';

interface StartDateCalendarProps {
  onDateSelect: (date: Date | null) => void;
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
  selectedDate?: Date | null;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  mode?: 'single' | 'range';
  minDate?: Date;
  maxDate?: Date;
  unavailableDates?: Date[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isUnavailable: boolean;
  isPast: boolean;
  isWeekend: boolean;
}

const StartDateCalendar: React.FC<StartDateCalendarProps> = ({
  onDateSelect,
  onDateRangeSelect,
  selectedDate,
  selectedStartDate,
  selectedEndDate,
  mode = 'single',
  minDate,
  maxDate,
  unavailableDates = [],
  className = '',
  placeholder = 'Select preferred start date',
  disabled = false
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  // Quick selection options
  const quickOptions = [
    { label: 'ASAP', value: 'asap', icon: <Zap className="h-4 w-4" /> },
    { label: 'Next Week', value: 'next-week', icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'Next Month', value: 'next-month', icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'In 2 Months', value: 'two-months', icon: <CalendarDays className="h-4 w-4" /> }
  ];

  // Get quick selection date
  const getQuickSelectionDate = (option: string): Date => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const twoMonths = new Date(today);
    twoMonths.setMonth(today.getMonth() + 2);

    switch (option) {
      case 'asap':
        return new Date(today.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
      case 'next-week':
        return nextWeek;
      case 'next-month':
        return nextMonth;
      case 'two-months':
        return twoMonths;
      default:
        return today;
    }
  };

  // Handle quick selection
  const handleQuickSelection = (option: string) => {
    const date = getQuickSelectionDate(option);
    if (mode === 'single') {
      onDateSelect(date);
    } else {
      onDateRangeSelect?.(date, null);
    }
    setIsOpen(false);
  };

  // Check if date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    const dateString = date.toDateString();
    return unavailableDates.some(unavailable => 
      unavailable.toDateString() === dateString
    );
  };

  // Check if date is selectable
  const isDateSelectable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    if (isDateUnavailable(date)) return false;
    
    return true;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isDateSelectable(date)) return;

    if (mode === 'single') {
      onDateSelect(date);
      setIsOpen(false);
    } else {
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Start new range
        onDateRangeSelect?.(date, null);
        setTempEndDate(null);
      } else {
        // Complete range
        if (date >= selectedStartDate) {
          onDateRangeSelect?.(selectedStartDate, date);
        } else {
          onDateRangeSelect?.(date, selectedStartDate);
        }
        setTempEndDate(null);
        setIsOpen(false);
      }
    }
  };

  // Handle date hover (for range selection)
  const handleDateHover = (date: Date) => {
    if (mode === 'range' && selectedStartDate && !selectedEndDate) {
      setHoveredDate(date);
      if (date >= selectedStartDate) {
        setTempEndDate(date);
      } else {
        setTempEndDate(selectedStartDate);
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isUnavailable = isDateUnavailable(date);
      
      let isSelected = false;
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;

      if (mode === 'single') {
        isSelected = selectedDate?.toDateString() === date.toDateString();
      } else {
        if (selectedStartDate && selectedEndDate) {
          isRangeStart = selectedStartDate.toDateString() === date.toDateString();
          isRangeEnd = selectedEndDate.toDateString() === date.toDateString();
          isInRange = date >= selectedStartDate && date <= selectedEndDate;
        } else if (selectedStartDate && tempEndDate) {
          isRangeStart = selectedStartDate.toDateString() === date.toDateString();
          isRangeEnd = tempEndDate.toDateString() === date.toDateString();
          isInRange = date >= Math.min(selectedStartDate, tempEndDate) && 
                     date <= Math.max(selectedStartDate, tempEndDate);
        } else if (selectedStartDate) {
          isRangeStart = selectedStartDate.toDateString() === date.toDateString();
        }
      }

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isUnavailable,
        isPast,
        isWeekend
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get display text
  const getDisplayText = (): string => {
    if (mode === 'single') {
      if (selectedDate) {
        return selectedDate.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      }
    } else {
      if (selectedStartDate && selectedEndDate) {
        return `${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${selectedEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      } else if (selectedStartDate) {
        return `From ${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
    }
    return placeholder;
  };

  // Get day class names
  const getDayClassNames = (day: CalendarDay): string => {
    const baseClasses = `
      relative w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg cursor-pointer transition-all duration-200
      ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900
      ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      ${day.isWeekend ? 'text-gray-500' : ''}
    `;

    if (!day.isCurrentMonth || day.isPast || day.isUnavailable) {
      return `${baseClasses} text-gray-400 cursor-not-allowed hover:bg-gray-100
    }

    if (day.isSelected || day.isRangeStart || day.isRangeEnd) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    if (day.isInRange) {
      return `${baseClasses} bg-blue-100 text-blue-900 
    }

    return `${baseClasses} hover:bg-gray-100
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300  rounded-lg shadow-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
          transition-all duration-200
        `}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <span className={selectedDate || selectedStartDate ? 'text-gray-900 : 'text-gray-500 
            {getDisplayText()}
          </span>
        </div>
        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200  rounded-lg shadow-xl z-50">
          {/* Quick Selection */}
          <div className="p-4 border-b border-gray-200
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Quick Selection
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuickSelection(option.value)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50  rounded-md hover:bg-gray-100  transition-colors"
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-200
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  className="p-1 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-600  rounded hover:bg-blue-200  transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={goToNext}
                  className="p-1 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-900
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="w-10 h-10 flex items-center justify-center text-xs font-medium text-gray-500
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day.date)}
                  onMouseEnter={() => handleDateHover(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={getDayClassNames(day)}
                  disabled={!day.isCurrentMonth || day.isPast || day.isUnavailable}
                  title={day.isUnavailable ? 'Unavailable' : day.date.toLocaleDateString()}
                >
                  {day.date.getDate()}
                  {day.isUnavailable && (
                    <X className="absolute top-0 right-0 h-2 w-2 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-200
            <div className="flex items-center justify-between text-xs text-gray-500
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 rounded"></div>
                  <span>Range</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded relative">
                    <X className="absolute top-0 right-0 h-1 w-1 text-red-500" />
                  </div>
                  <span>Unavailable</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                <span>Click to select</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StartDateCalendar;

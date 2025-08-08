"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import type {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/common/ui/modal";

// Define types
interface CalendarEvent extends EventInput {
  id: string; // Add this line
  extendedProps: {
    calendar: string;
  };
}

// Constants
const CALENDAR_EVENTS = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
} as const;

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Event Conf.",
    start: new Date().toISOString().split("T")[0],
    extendedProps: { calendar: "Danger" },
  },
  {
    id: "2",
    title: "Meeting",
    start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    extendedProps: { calendar: "Success" },
  },
  {
    id: "3",
    title: "Workshop",
    start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
    extendedProps: { calendar: "Primary" },
  },
];

// Fix the lazy imports - plugins should be imported normally, not with lazy()
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Only lazy load the main FullCalendar component
const FullCalendar = lazy(() => import("@fullcalendar/react").then(mod => ({
  default: mod.default
})));

const Calendar: React.FC = () => {
  const calendarRef = useRef<any>(null);
  const { isOpen, openModal, closeModal } = useModal();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventData, setEventData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    level: "",
  });

  useEffect(() => {
    setEvents(INITIAL_EVENTS);
  }, []);

  const resetModalFields = useCallback(() => {
    setEventData({
      title: "",
      startDate: "",
      endDate: "",
      level: "",
    });
    setSelectedEvent(null);
  }, []);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventData(prev => ({
      ...prev,
      startDate: selectInfo.startStr,
      endDate: selectInfo.endStr || selectInfo.startStr,
    }));
    openModal();
  }, [openModal, resetModalFields]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventData({
      title: event.title,
      startDate: event.start?.toISOString().split("T")[0] || "",
      endDate: event.end?.toISOString().split("T")[0] || "",
      level: event.extendedProps.calendar,
    });
    openModal();
  }, [openModal]);

  const handleAddOrUpdateEvent = useCallback(() => {
    const { title, startDate, endDate, level } = eventData;
    
    if (selectedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id ? {
          ...event,
          title,
          start: startDate,
          end: endDate,
          extendedProps: { calendar: level },
        } : event
      ));
    } else {
      setEvents(prev => [...prev, {
        id: Date.now().toString(),
        title,
        start: startDate,
        end: endDate,
        allDay: true,
        extendedProps: { calendar: level },
      }]);
    }
    
    closeModal();
    resetModalFields();
  }, [eventData, selectedEvent, closeModal, resetModalFields]);

  const calendarOptions = useMemo(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next addEventButton",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events,
    selectable: true,
    select: handleDateSelect,
    eventClick: handleEventClick,
    eventContent: (eventInfo: EventContentArg) => (
      <div className={`event-fc-color flex fc-event-main fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()} p-1 rounded-sm`}>
        <div className="fc-daygrid-event-dot"></div>
        <div className="fc-event-time">{eventInfo.timeText}</div>
        <div className="fc-event-title">{eventInfo.event.title}</div>
      </div>
    ),
    customButtons: {
      addEventButton: {
        text: "Add Event +",
        click: openModal,
      },
    },
  }), [events, handleDateSelect, handleEventClick, openModal]);

  const handleInputChange = useCallback((field: keyof typeof eventData, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <Suspense fallback={<div className="flex items-center justify-center h-64">Loading calendar...</div>}>
          <FullCalendar ref={calendarRef} {...calendarOptions} />
        </Suspense>
      </div>
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plan your next big moment: schedule or edit an event to stay on track
            </p>
          </div>
          
          <div className="mt-8">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Title
              </label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
            
            <div className="mt-6">
              <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Event Color
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(CALENDAR_EVENTS).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <label className="flex items-center text-sm text-gray-700 dark:text-gray-400">
                      <span className="relative">
                        <input
                          className="sr-only"
                          type="radio"
                          name="event-level"
                          value={key}
                          checked={eventData.level === key}
                          onChange={() => handleInputChange('level', key)}
                        />
                        <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                          <span className={`h-2 w-2 rounded-full bg-white ${eventData.level === key ? 'block' : 'hidden'}`}></span>
                        </span>
                      </span>
                      {key}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter Start Date
              </label>
              <input
                type="date"
                value={eventData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Enter End Date
              </label>
              <input
                type="date"
                value={eventData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6 sm:justify-end">
            <button
              onClick={closeModal}
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "Update Changes" : "Add Event"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
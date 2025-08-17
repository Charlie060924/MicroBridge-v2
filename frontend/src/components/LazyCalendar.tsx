import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('./dashboard/calendar/Calendar'), {
  loading: () => (
    <div className="animate-pulse h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading calendar...</div>
    </div>
  ),
  ssr: false, // Calendar is client-only due to FullCalendar
});

export default Calendar;


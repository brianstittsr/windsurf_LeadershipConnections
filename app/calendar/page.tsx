import EventCalendar from '@/components/Calendar/EventCalendar';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Events Calendar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay up to date with our upcoming workshops, classes, and events. 
            Register for events that interest you and join our community.
          </p>
        </div>
        
        <EventCalendar showFilters={true} />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaClipboardList, 
  FaDollarSign, 
  FaUserTie,
  FaVideo,
  FaCreditCard,
  FaChartBar,
  FaBlog,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaCheck
} from 'react-icons/fa';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  contact: string;
  notes: string;
}

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  facilitator: string;
  description: string;
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimated: number;
  actual: number;
  status: 'pending' | 'paid' | 'cancelled';
}

interface Presenter {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  sessionTitle: string;
  email: string;
  confirmed: boolean;
}

interface EventData {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  team: TeamMember[];
  venues: Venue[];
  activities: Activity[];
  budget: BudgetItem[];
  presenters: Presenter[];
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: FaCalendarAlt },
  { id: 'team', label: 'Team', icon: FaUsers },
  { id: 'venue', label: 'Venue', icon: FaMapMarkerAlt },
  { id: 'activities', label: 'Activities', icon: FaClipboardList },
  { id: 'budget', label: 'Budget', icon: FaDollarSign },
  { id: 'presenters', label: 'Presenters', icon: FaUserTie },
];

export default function EventWizardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [eventData, setEventData] = useState<EventData>({
    name: 'Y360 Technology and Trade Exploration Experience',
    date: '2025-12-06',
    startTime: '09:00',
    endTime: '14:00',
    description: 'A comprehensive program touching on AI & Robotics, skilled trades, family wellness and nutrition, with intergenerational learning opportunities.',
    team: [
      { id: '1', name: 'Katherine Harrelson', role: 'Founder/Volunteer Director', email: 'katherine@lcconnections.org', phone: '' },
      { id: '2', name: 'Veronica Revels', role: 'CEO/President', email: 'veronica@lcconnections.org', phone: '' },
    ],
    venues: [
      { id: '1', name: 'The Green Door', address: '130 Railroad Avenue, Gibsonville, NC', capacity: 100, contact: 'Gibsonville Square', notes: 'Building usage provided by Gibsonville Square' },
    ],
    activities: [
      { id: '1', name: 'Breakfast and Pre-Survey', startTime: '09:00', endTime: '09:50', location: 'Main Hall', facilitator: 'Staff', description: 'Welcome breakfast and participant surveys' },
      { id: '2', name: 'Session I', startTime: '10:00', endTime: '10:50', location: 'Various Rooms', facilitator: 'Multiple', description: 'First rotation of workshops' },
      { id: '3', name: 'Session II', startTime: '11:00', endTime: '11:50', location: 'Various Rooms', facilitator: 'Multiple', description: 'Second rotation of workshops' },
      { id: '4', name: 'Session III', startTime: '12:00', endTime: '12:50', location: 'Various Rooms', facilitator: 'Multiple', description: 'Third rotation of workshops' },
      { id: '5', name: 'Closing', startTime: '13:00', endTime: '14:00', location: 'Main Hall', facilitator: 'Leadership Team', description: 'Closing remarks and certificates' },
    ],
    budget: [
      { id: '1', category: 'Venue', description: 'Building Usage', estimated: 0, actual: 0, status: 'paid' },
      { id: '2', category: 'Food', description: 'Breakfast and Snacks', estimated: 500, actual: 0, status: 'pending' },
      { id: '3', category: 'Materials', description: 'Workshop Supplies', estimated: 300, actual: 0, status: 'pending' },
      { id: '4', category: 'Equipment', description: 'Robotics Demo Equipment', estimated: 200, actual: 0, status: 'pending' },
    ],
    presenters: [
      { id: '1', name: 'Gloria Bass', title: 'Trades Exploration Facilitator', organization: '', bio: 'Dynamic professional in architecture and construction', sessionTitle: 'Trades Exploration', email: '', confirmed: true },
      { id: '2', name: 'Ty Gibson', title: 'Let\'s Move Ambassador', organization: 'Red Carpet Kids, USA', bio: 'Professional Actor and Clean Comedian', sessionTitle: 'Red Carpet Kids Health and Wellness', email: '', confirmed: true },
      { id: '3', name: 'Thea Monet', title: 'Peer Mentoring Facilitator', organization: 'WICK Enterprise', bio: 'Over five decades in health, education, and wellness', sessionTitle: 'Peer-to-Peer Mentoring Training', email: '', confirmed: true },
      { id: '4', name: 'Brian Stitt', title: 'Instructional Technologist', organization: 'Wake Technical Community College', bio: 'Automation Specialist and Adjunct Professor', sessionTitle: 'Technology Exploration (Robotics)', email: '', confirmed: true },
      { id: '5', name: 'Donald Sweeper', title: 'The Drone Whisperer', organization: 'SweepWorX', bio: 'Emerging Technology STEAM Education Alchemist', sessionTitle: 'Technology Exploration (Robotics)', email: '', confirmed: true },
      { id: '6', name: 'India Warner', title: 'Health and Wellness Facilitator', organization: '', bio: 'SERV Safe Certified Chef', sessionTitle: 'Red Carpet Kids Health and Wellness', email: '', confirmed: true },
    ],
  });

  const updateEventField = (field: keyof EventData, value: any) => {
    setEventData({ ...eventData, [field]: value });
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      email: '',
      phone: '',
    };
    updateEventField('team', [...eventData.team, newMember]);
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    updateEventField('team', eventData.team.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeTeamMember = (id: string) => {
    updateEventField('team', eventData.team.filter(m => m.id !== id));
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: '',
      startTime: '',
      endTime: '',
      location: '',
      facilitator: '',
      description: '',
    };
    updateEventField('activities', [...eventData.activities, newActivity]);
  };

  const updateActivity = (id: string, field: keyof Activity, value: string) => {
    updateEventField('activities', eventData.activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeActivity = (id: string) => {
    updateEventField('activities', eventData.activities.filter(a => a.id !== id));
  };

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      category: '',
      description: '',
      estimated: 0,
      actual: 0,
      status: 'pending',
    };
    updateEventField('budget', [...eventData.budget, newItem]);
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
    updateEventField('budget', eventData.budget.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBudgetItem = (id: string) => {
    updateEventField('budget', eventData.budget.filter(b => b.id !== id));
  };

  const addPresenter = () => {
    const newPresenter: Presenter = {
      id: Date.now().toString(),
      name: '',
      title: '',
      organization: '',
      bio: '',
      sessionTitle: '',
      email: '',
      confirmed: false,
    };
    updateEventField('presenters', [...eventData.presenters, newPresenter]);
  };

  const updatePresenter = (id: string, field: keyof Presenter, value: any) => {
    updateEventField('presenters', eventData.presenters.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePresenter = (id: string) => {
    updateEventField('presenters', eventData.presenters.filter(p => p.id !== id));
  };

  const totalEstimated = eventData.budget.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = eventData.budget.reduce((sum, item) => sum + item.actual, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tools"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-3xl text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Planning Wizard</h1>
            <p className="text-gray-600">Comprehensive event planning and management</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Event Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={eventData.name}
                    onChange={(e) => updateEventField('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventData.date}
                    onChange={(e) => updateEventField('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventData.startTime}
                    onChange={(e) => updateEventField('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventData.endTime}
                    onChange={(e) => updateEventField('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => updateEventField('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{eventData.team.length}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{eventData.presenters.length}</div>
                  <div className="text-sm text-gray-600">Presenters</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{eventData.activities.length}</div>
                  <div className="text-sm text-gray-600">Activities</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">${totalEstimated}</div>
                  <div className="text-sm text-gray-600">Est. Budget</div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                <button
                  onClick={addTeamMember}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Member
                </button>
              </div>
              <div className="space-y-4">
                {eventData.team.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Role/Title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => updateTeamMember(member.id, 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="(555) 555-5555"
                          />
                        </div>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue Tab */}
          {activeTab === 'venue' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Venue Information</h2>
              {eventData.venues.map((venue) => (
                <div key={venue.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={venue.name}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, name: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                      <input
                        type="number"
                        value={venue.capacity}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, capacity: parseInt(e.target.value) } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={venue.address}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, address: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                      <input
                        type="text"
                        value={venue.contact}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, contact: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        value={venue.notes}
                        onChange={(e) => {
                          const updated = eventData.venues.map(v => v.id === venue.id ? { ...v, notes: e.target.value } : v);
                          updateEventField('venues', updated);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Schedule & Activities</h2>
                <button
                  onClick={addActivity}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Activity
                </button>
              </div>
              <div className="space-y-4">
                {eventData.activities.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Activity Name</label>
                        <input
                          type="text"
                          value={activity.name}
                          onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                        <input
                          type="time"
                          value={activity.startTime}
                          onChange={(e) => updateActivity(activity.id, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                        <input
                          type="time"
                          value={activity.endTime}
                          onChange={(e) => updateActivity(activity.id, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                        <input
                          type="text"
                          value={activity.location}
                          onChange={(e) => updateActivity(activity.id, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeActivity(activity.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={activity.description}
                        onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Budget Tracking</h2>
                <button
                  onClick={addBudgetItem}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              {/* Budget Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Estimated Total</div>
                  <div className="text-2xl font-bold text-blue-600">${totalEstimated.toFixed(2)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Actual Spent</div>
                  <div className="text-2xl font-bold text-green-600">${totalActual.toFixed(2)}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Remaining</div>
                  <div className="text-2xl font-bold text-orange-600">${(totalEstimated - totalActual).toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-3">
                {eventData.budget.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateBudgetItem(item.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Estimated</label>
                        <input
                          type="number"
                          value={item.estimated}
                          onChange={(e) => updateBudgetItem(item.id, 'estimated', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Actual</label>
                        <input
                          type="number"
                          value={item.actual}
                          onChange={(e) => updateBudgetItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => updateBudgetItem(item.id, 'status', e.target.value)}
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                            item.status === 'paid' ? 'bg-green-100 border-green-300' :
                            item.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                            'bg-yellow-100 border-yellow-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => removeBudgetItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Presenters Tab */}
          {activeTab === 'presenters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Presenters & Facilitators</h2>
                <button
                  onClick={addPresenter}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus /> Add Presenter
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventData.presenters.map((presenter) => (
                  <div key={presenter.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${presenter.confirmed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-xs text-gray-500">{presenter.confirmed ? 'Confirmed' : 'Pending'}</span>
                      </div>
                      <button
                        onClick={() => removePresenter(presenter.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={presenter.name}
                          onChange={(e) => updatePresenter(presenter.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                          <input
                            type="text"
                            value={presenter.title}
                            onChange={(e) => updatePresenter(presenter.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Organization</label>
                          <input
                            type="text"
                            value={presenter.organization}
                            onChange={(e) => updatePresenter(presenter.id, 'organization', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Session Title</label>
                        <input
                          type="text"
                          value={presenter.sessionTitle}
                          onChange={(e) => updatePresenter(presenter.id, 'sessionTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={presenter.confirmed}
                          onChange={(e) => updatePresenter(presenter.id, 'confirmed', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label className="text-sm text-gray-600">Confirmed</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

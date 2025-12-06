'use client';

import Link from 'next/link';
import { FaPrint, FaCalendarAlt, FaTools, FaIdBadge, FaIdCard, FaBook } from 'react-icons/fa';

const tools = [
  {
    id: 'table-tent',
    name: 'Table Tent Creator',
    description: 'Create Leadership Connections branded table tents with custom titles and subtitles. Perfect for events, meetings, and conferences.',
    icon: FaPrint,
    href: '/admin/tools/table-tent',
    color: 'bg-purple-500',
    features: ['LC Logo branding', 'Custom title & subtitle', 'Print-ready PDF', 'Professional design']
  },
  {
    id: 'name-badges',
    name: 'Name Badge Creator',
    description: 'Create professional name badges using Avery 5395 template. Import names from datasets or enter manually.',
    icon: FaIdBadge,
    href: '/admin/tools/name-badges',
    color: 'bg-green-500',
    features: [
      'Avery 5395 template (8 per sheet)',
      'Import from datasets',
      'Manual name entry',
      'LC Logo branding',
      'Optional title & organization',
      'Print-ready PDF'
    ]
  },
  {
    id: 'tent-cards',
    name: 'Small Tent Card Creator',
    description: 'Create small tent cards using Avery 5302 template. Perfect for table labels, station signs, and event markers.',
    icon: FaIdCard,
    href: '/admin/tools/tent-cards',
    color: 'bg-orange-500',
    features: [
      'Avery 5302 template (4 per sheet)',
      'Custom title per card',
      'Multiple line items',
      'LC Logo branding',
      'Duplicate cards easily',
      'Print to edge'
    ]
  },
  {
    id: 'program-booklet',
    name: 'Program Booklet Creator',
    description: 'Create professional multi-page event program booklets with cover pages, speaker bios, agendas, and acknowledgements.',
    icon: FaBook,
    href: '/admin/tools/program-booklet',
    color: 'bg-indigo-500',
    features: [
      'Multi-page PDF booklet',
      'Cover page design',
      'Speaker/Facilitator bios',
      'Session overviews',
      'Agenda formatting',
      'Acknowledgements page',
      'LC Logo branding',
      'Editable content'
    ]
  },
  {
    id: 'event-wizard',
    name: 'Project / Event Planning Wizard',
    description: 'Comprehensive event planning tool that tracks all aspects of your event from conception to completion.',
    icon: FaCalendarAlt,
    href: '/admin/tools/event-wizard',
    color: 'bg-blue-500',
    features: [
      'People & Team Management',
      'Venue & Location Planning',
      'Activity Scheduling',
      'Budget Tracking',
      'Registration Management',
      'Presenter Coordination',
      'Meeting Scheduling with Zoom',
      'Payment Integration (Stripe, PayPal, Bill.com)',
      'Event Reporting',
      'Blog Post Generation'
    ]
  }
];

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaTools className="text-3xl text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Tools</h1>
        </div>
        <p className="text-gray-600">
          Productivity tools to help you create materials and plan events for Leadership Connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden group"
          >
            <div className={`${tool.color} p-6 flex items-center gap-4`}>
              <div className="bg-white/20 p-3 rounded-lg">
                <tool.icon className="text-3xl text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">{tool.name}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Features:</p>
                <ul className="grid grid-cols-1 gap-1">
                  {tool.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                  {tool.features.length > 5 && (
                    <li className="text-sm text-primary font-medium">
                      +{tool.features.length - 5} more features
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-primary font-medium group-hover:underline">
                  Open Tool →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

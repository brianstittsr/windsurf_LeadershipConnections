'use client';

import Link from 'next/link';
import { FaPlug, FaGoogle, FaStripe, FaPaypal } from 'react-icons/fa';
import { SiZoom } from 'react-icons/si';

const integrations = [
  {
    id: 'google',
    name: 'Google Services',
    description: 'Connect Gmail, Google Drive, and Google Sheets for seamless data management and communication.',
    icon: FaGoogle,
    href: '/admin/integrations/google',
    color: 'bg-red-500',
    status: 'available',
    services: ['Gmail', 'Google Drive', 'Google Sheets']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments and manage subscriptions with Stripe payment processing.',
    icon: FaStripe,
    href: '/admin/integrations/stripe',
    color: 'bg-purple-600',
    status: 'coming_soon',
    services: ['Payments', 'Subscriptions', 'Invoicing']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Accept PayPal payments for donations and event registrations.',
    icon: FaPaypal,
    href: '/admin/integrations/paypal',
    color: 'bg-blue-600',
    status: 'coming_soon',
    services: ['Payments', 'Donations']
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Automatically schedule and manage Zoom meetings for events and planning sessions.',
    icon: SiZoom,
    href: '/admin/integrations/zoom',
    color: 'bg-blue-500',
    status: 'coming_soon',
    services: ['Meeting Scheduling', 'Webinars', 'Recording']
  }
];

export default function IntegrationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaPlug className="text-3xl text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">API Integrations</h1>
        </div>
        <p className="text-gray-600">
          Connect external services to enhance Leadership Connections functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
              integration.status === 'available' ? 'hover:shadow-lg hover:border-primary/30' : 'opacity-75'
            } transition-all duration-200`}
          >
            <div className={`${integration.color} p-6 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <integration.icon className="text-3xl text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{integration.name}</h2>
              </div>
              {integration.status === 'coming_soon' && (
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              )}
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">{integration.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-gray-700">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {integration.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              {integration.status === 'available' ? (
                <Link
                  href={integration.href}
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  Configure Integration →
                </Link>
              ) : (
                <span className="text-gray-400 text-sm">
                  This integration will be available soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

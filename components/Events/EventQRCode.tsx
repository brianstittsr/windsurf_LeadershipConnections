'use client';

import { QRCodeSVG } from 'qrcode.react';

interface EventQRCodeProps {
  registrationLink: string;
  eventTitle: string;
}

const EventQRCode = ({ registrationLink, eventTitle }: EventQRCodeProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        Register for This Event
      </h3>
      <div className="flex justify-center mb-4">
        <QRCodeSVG
          value={registrationLink}
          size={200}
          level="H"
          includeMargin={true}
          className="border-4 border-white shadow-md"
        />
      </div>
      <p className="text-sm text-gray-600 text-center mb-3">
        Scan this QR code to register
      </p>
      <div className="text-center">
        <a
          href={registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Register Now
        </a>
      </div>
      <p className="text-xs text-gray-500 text-center mt-3">
        Or click the button above to register online
      </p>
    </div>
  );
};

export default EventQRCode;

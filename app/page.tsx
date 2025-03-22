'use client';

// Removed dynamic imports that were causing module not found errors

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Components temporarily hidden to resolve module not found errors */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-center mb-8">Leadership Connections</h1>
        <p className="text-xl text-center max-w-2xl px-4">
          Welcome to Leadership Connections. Our main site is currently under maintenance.
          Please check back soon or visit our splash page.
        </p>
        <a 
          href="/splash" 
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Splash Page
        </a>
      </div>
    </div>
  );
}

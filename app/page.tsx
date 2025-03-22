'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Column - Text Content */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full text-indigo-600 font-medium text-sm mb-6">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                Empowering young women leaders
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Building the <span className="text-indigo-600">leaders</span> of tomorrow
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Leadership Connections NC provides programs that develop essential skills, 
                build confidence, and create opportunities for young women to thrive.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/take-action"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md text-base font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 bg-white text-gray-700 rounded-md text-base font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
              
              {/* Trusted By */}
              <div className="mt-12">
                <p className="text-sm text-gray-500 mb-4">Trusted by organizations</p>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="h-8 w-auto opacity-60">
                    <svg className="h-full w-auto text-gray-400" fill="currentColor" viewBox="0 0 124 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a8 8 0 100 16 8 8 0 000-16z"/>
                      <path d="M36 4h4v16h-4zM44 4h8a8 8 0 110 16h-8V4zm4 4v8h4a4 4 0 000-8h-4zM64 4h4v16h-4zM72 4h12v4h-8v4h8v4h-8v4h8v4H72z"/>
                    </svg>
                  </div>
                  <div className="h-6 w-auto opacity-60">
                    <svg className="h-full w-auto text-gray-400" fill="currentColor" viewBox="0 0 124 24">
                      <path d="M24 0H0v24h24V0zm-8 6a2 2 0 11-4 0 2 2 0 014 0zm-2 4a6 6 0 00-6 6v2h12v-2a6 6 0 00-6-6z"/>
                      <path d="M36 6h4v12h-4zM44 6h4v2h.2a4 4 0 017.6 0h.2a4 4 0 017.8 1.2v8.8h-4v-7.5a1.5 1.5 0 00-3 0v7.5h-4v-7.5a1.5 1.5 0 00-3 0v7.5h-4V6zM72 6h12a6 6 0 010 12h-8v6h-4V6zm4 4v4h8a2 2 0 000-4h-8z"/>
                    </svg>
                  </div>
                  <div className="h-7 w-auto opacity-60">
                    <svg className="h-full w-auto text-gray-400" fill="currentColor" viewBox="0 0 124 24">
                      <path d="M24 0l-6 22h-4l6-22h4zM32 4l-6 18h-4l6-18h4z"/>
                      <path d="M44 11a7 7 0 100 14 7 7 0 000-14zm0 10a3 3 0 110-6 3 3 0 010 6zM60 4a8 8 0 100 16 8 8 0 000-16zm0 12a4 4 0 110-8 4 4 0 010 8zM76 4h12a8 8 0 010 16h-12V4zm4 12h8a4 4 0 000-8h-8v8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-70"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-2xl opacity-70"></div>
                
                {/* Main image with frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <Image
                    src="/images/GroupPhotoOnBench.jpg"
                    alt="Leadership Connections Group"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  
                  {/* Stats card overlay */}
                  <div className="absolute -bottom-5 -right-5 bg-white rounded-lg shadow-lg p-4 w-48">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Success Rate</div>
                        <div className="text-lg font-bold text-gray-900">98%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full text-indigo-600 font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
              Our Approach
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">How We Empower Young Leaders</h2>
            <p className="text-lg text-gray-600">
              Our comprehensive approach focuses on developing essential leadership skills through targeted programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Leadership Skills</h3>
              <p className="text-gray-600">Develop essential leadership capabilities through workshops, training, and practical experience.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Mentorship</h3>
              <p className="text-gray-600">Connect with successful women leaders who provide guidance, support, and real-world insights.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Community Impact</h3>
              <p className="text-gray-600">Lead and participate in community service projects that make a real difference while building leadership experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full text-indigo-600 font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
              What We Offer
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Programs</h2>
            <p className="text-lg text-gray-600">
              Comprehensive programs designed to nurture leadership skills and build confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/images/leadership-workshop.jpg"
                  alt="Leadership Workshop"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Leadership Workshops</h3>
                <p className="text-gray-600 mb-4">Interactive sessions focused on developing essential leadership skills and confidence.</p>
                <Link href="/programs" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center group-hover:underline">
                  Learn more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Program 2 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/images/mentorship.jpg"
                  alt="Mentorship Program"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Mentorship Program</h3>
                <p className="text-gray-600 mb-4">One-on-one guidance from successful women leaders in various fields.</p>
                <Link href="/programs" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center group-hover:underline">
                  Learn more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Program 3 */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group">
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/images/community-service.jpg"
                  alt="Community Service"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Community Projects</h3>
                <p className="text-gray-600 mb-4">Hands-on experience in leading and organizing community service initiatives.</p>
                <Link href="/programs" className="text-indigo-600 font-medium hover:text-indigo-800 inline-flex items-center group-hover:underline">
                  Learn more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full text-white font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Join Us Today
            </div>
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Leadership Journey?</h2>
            <p className="text-xl mb-10 opacity-90">
              Join Leadership Connections NC today and take the first step toward becoming the leader you&apos;re meant to be.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/take-action"
                className="px-8 py-3 bg-white text-indigo-600 rounded-md text-base font-medium hover:bg-gray-100 transition-colors shadow-sm"
              >
                Get Started
              </Link>
              <Link 
                href="/about"
                className="px-8 py-3 bg-transparent text-white border border-white rounded-md text-base font-medium hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

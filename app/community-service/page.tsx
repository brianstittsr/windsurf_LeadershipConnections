import Image from 'next/image'
import Link from 'next/link'

export default function CommunityService() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-purple-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-6">
            Community Service
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Making a positive impact in our community through dedicated service and leadership.
          </p>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-12">Current Projects</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/community-service.jpg"
                alt="Community Service Project"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Food Bank Initiative</h3>
                <p className="text-gray-600 mb-4">
                  Working with local food banks to help distribute food to families in need. 
                  Our members help organize food drives and assist in distribution events.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">📅 Monthly Event</span>
                  <span>👥 Open to All Members</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/mentorship.jpg"
                alt="Education Support"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Education Support Program</h3>
                <p className="text-gray-600 mb-4">
                  Providing tutoring and mentorship to elementary school students. 
                  Members work one-on-one with students to help improve their academic performance.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">📅 Weekly Sessions</span>
                  <span>👥 Experienced Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Volunteer Hours</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">20+</div>
              <div className="text-gray-600">Community Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-gray-600">Partner Organizations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">Get Involved</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join us in making a difference in our community. Whether you're a student looking to gain leadership 
            experience or someone passionate about helping others, there's a place for you in our programs.
          </p>
          <Link
            href="/take-action"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Join Our Community
          </Link>
        </div>
      </section>
    </main>
  )
}

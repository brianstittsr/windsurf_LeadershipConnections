import Image from 'next/image'
import Link from 'next/link'

export default function Honors() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-purple-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-6">
            Leadership Connection Honors
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Recognizing outstanding achievements and contributions in leadership and community service.
          </p>
        </div>
      </section>

      {/* Honors Program Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">
                About the Honors Program
              </h2>
              <p className="text-gray-600 mb-6">
                The Leadership Connection Honors program recognizes young leaders who demonstrate exceptional 
                commitment to personal growth, leadership development, and community service. This prestigious 
                recognition is awarded to members who go above and beyond in their dedication to our mission.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Minimum of 100 hours of community service</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Leadership in at least one major community project</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Exemplary academic achievement</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/images/slider2.jpg"
                alt="Leadership Honors"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Honor Roll */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-12 text-center">
            Honor Roll 2024
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Example Honor Roll Cards - Replace with actual data */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-24 h-24 rounded-full bg-purple-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-800">Sarah Johnson</h3>
                <p className="text-gray-600">Gold Level Honor</p>
              </div>
              <p className="text-gray-600 text-center">
                Led the Food Bank Initiative and completed 150+ service hours
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-24 h-24 rounded-full bg-purple-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-800">Emily Davis</h3>
                <p className="text-gray-600">Silver Level Honor</p>
              </div>
              <p className="text-gray-600 text-center">
                Coordinated education support program and mentored 10 students
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-24 h-24 rounded-full bg-purple-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold text-purple-800">Madison Taylor</h3>
                <p className="text-gray-600">Bronze Level Honor</p>
              </div>
              <p className="text-gray-600 text-center">
                Organized community clean-up events and completed 100+ service hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apply for Honors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">
            Apply for Honors Recognition
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Are you ready to be recognized for your leadership and service? Apply for our Honors program 
            and join a distinguished group of young leaders making a difference in our community.
          </p>
          <Link
            href="/take-action"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  )
}

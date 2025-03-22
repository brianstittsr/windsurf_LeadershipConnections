import Image from 'next/image'
import Link from 'next/link'

export default function Programs() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-purple-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-6">
            Our Programs
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Discover our comprehensive programs designed to develop leadership skills, build confidence, 
            and create opportunities for growth.
          </p>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {/* Leadership Workshops */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/leadership-workshop.jpg"
                  alt="Leadership Workshop"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4">
                  Leadership Workshops
                </h2>
                <p className="text-gray-700 mb-6">
                  Our interactive workshops focus on developing essential leadership skills through hands-on 
                  activities, group discussions, and real-world scenarios. Participants learn:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Public speaking and communication skills</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Decision-making and problem-solving</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Team building and collaboration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mentorship Program */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4">
                  Mentorship Program
                </h2>
                <p className="text-gray-700 mb-6">
                  Connect with successful women leaders who provide guidance, share experiences, and help 
                  navigate personal and professional growth. Our mentorship program includes:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>One-on-one mentoring sessions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Career guidance and planning</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Networking opportunities</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <Image
                  src="/images/mentorship.jpg"
                  alt="Mentorship Program"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Community Projects */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/images/community-service.jpg"
                  alt="Community Service"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4">
                  Community Projects
                </h2>
                <p className="text-gray-700 mb-6">
                  Put leadership skills into practice through meaningful community service projects. 
                  Participants will:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Plan and execute community initiatives</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Develop project management skills</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Make a real impact in the community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link
              href="/take-action"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Join Our Programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

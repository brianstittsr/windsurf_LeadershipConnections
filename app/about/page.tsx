import Image from 'next/image'

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-purple-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-6">
            About Leadership Connections NC
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Empowering the next generation of female leaders through mentorship, education, and community engagement.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Leadership Connections NC was founded with a clear vision: to create a supportive environment 
                where young girls can develop their leadership potential and grow into confident, capable leaders.
              </p>
              <p className="text-gray-700 mb-6">
                Through our various programs and initiatives, we've helped countless young women discover their 
                voice, build their confidence, and develop essential leadership skills that will serve them 
                throughout their lives.
              </p>
            </div>
            <div>
              <Image
                src="/images/about-leadership.jpg"
                alt="Young leaders in action"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Empowerment</h3>
                <p className="text-gray-600">
                  We believe in empowering young women to take charge of their future and make a positive impact in their communities.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Mentorship</h3>
                <p className="text-gray-600">
                  We foster meaningful connections between experienced leaders and young aspiring leaders.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">
                  We create a supportive community where young women can learn, grow, and thrive together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

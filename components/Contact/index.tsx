'use client';

import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    otherProgram: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const programs = [
    'Red Carpet Kids',
    'STEEM Program',
    'College and University Visits',
    'Emerging Technology Learning',
    'Corporate Visits',
    'Fitness and Wellness Activities',
    'Volunteering',
    'Mentoring',
    'Financial Support',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          program: '',
          otherProgram: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-body-color dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Get Involved
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Are you passionate about making a difference? Join the Leadership Connections community! We offer numerous opportunities to get involved through volunteering, mentoring, or supporting our programs financially. Every contribution helps create enriching experiences for our youth. Together, we can uplift the next generation and help them achieve their dreams!
              </p>

              {submitStatus === 'success' && (
                <div className="mb-6 rounded-md bg-green-100 border border-green-400 text-green-700 px-4 py-3">
                  Thank you for your interest! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                  There was an error submitting your form. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                        className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="program"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-white"
                      >
                        Program of Interest
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                      >
                        <option value="">Select a program</option>
                        {programs.map((program) => (
                          <option key={program} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {formData.program === 'Other' && (
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="otherProgram"
                          className="mb-3 block text-sm font-medium text-body-color dark:text-white"
                        >
                          Please specify
                        </label>
                        <input
                          type="text"
                          name="otherProgram"
                          value={formData.otherProgram}
                          onChange={handleInputChange}
                          placeholder="Please specify your interest"
                          required={formData.program === 'Other'}
                          className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-body-color dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Enter your Message"
                        required
                        className="w-full resize-none rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

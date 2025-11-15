const Contact = () => {
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Get Involved
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Are you passionate about making a difference? Join the Leadership Connections community! We offer numerous opportunities to get involved through volunteering, mentoring, or supporting our programs financially. Every contribution helps create enriching experiences for our youth. Together, we can uplift the next generation and help them achieve their dreams!
              </p>
              <form>
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
                        placeholder="Enter your name"
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
                        placeholder="Enter your email"
                        className="w-full rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                      />
                    </div>
                  </div>
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
                        rows={5}
                        placeholder="Enter your Message"
                        className="w-full resize-none rounded-sm border border-stroke bg-[#2C303B] px-6 py-3 text-base text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white dark:shadow-two dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:ring-0"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30">
                      Send Message
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

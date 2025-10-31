import { Testimonial } from "@/types/testimonial";
import SectionTitle from "../Common/SectionTitle";
import SingleTestimonial from "./SingleTestimonial";

const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah L.",
    designation: "Former Participant",
    content:
      "Leadership Connections gave me the confidence to pursue my dreams. The mentorship I received was invaluable.",
    image: "/images/hero/pexels-mikhail-nilov-9242836.jpg",
    star: 5,
  },
  {
    id: 2,
    name: "Michael B.",
    designation: "Alumnus",
    content:
      "The hands-on experience and corporate visits opened my eyes to a world of possibilities. I'm now in a career I love, thanks to this program.",
    image: "/images/hero/pexels-mikhail-nilov-9242856.jpg",
    star: 5,
  },
  {
    id: 3,
    name: "Jessica M.",
    designation: "Graduate",
    content:
      "I learned so much about myself and my leadership potential. I'm forever grateful for the opportunities and support from Leadership Connections.",
    image: "/images/hero/pexels-pixabay-315934.jpg",
    star: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-secondary relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="What Our Alumni Say"
          paragraph="Discover the impact of our programs through the stories of those who have been a part of our journey."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonialData.map((testimonial) => (
            <SingleTestimonial key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

"use client";

import SectionTitle from "../Common/SectionTitle";
import SingleBlog from "./SingleBlog";
import { useEffect, useState } from "react";
import { getRecentBlogs } from "@/lib/blogUtils";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Get recent blogs when component mounts
    const recentBlogs = getRecentBlogs(3);
    setBlogs(recentBlogs);
  }, []);

  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="LC Blogs"
          paragraph="Stay updated with the latest news, stories, and insights from the Leadership C.O.N.N.E.C.T.I.O.N.S. Program."
          center
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="w-full">
              <SingleBlog blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;

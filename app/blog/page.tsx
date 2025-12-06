'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SingleBlog from "@/components/Blog/SingleBlog";
import blogData from "@/components/Blog/blogData";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Blog as BlogType } from "@/types/blog";

const Blog = () => {
  const [firestoreBlogs, setFirestoreBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6; // Show 6 blogs per page (2 rows of 3)

  useEffect(() => {
    const fetchBlogs = async () => {
      // Skip Firestore fetch if db is not available (e.g., during build)
      if (!db) {
        console.log('Firestore not available, using static blog data only');
        setLoading(false);
        return;
      }

      try {
        const blogsRef = collection(db, 'blogEntries');
        const q = query(blogsRef, orderBy('publishDate', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const blogs: BlogType[] = [];
        let index = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          blogs.push({
            id: data.id || (1000 + index), // Use stored id or generate unique number
            slug: data.slug || doc.id,
            title: data.title || '',
            paragraph: data.paragraph || data.excerpt || '',
            image: data.image || data.featuredImage || '/images/blog/blog-default.jpg',
            author: data.author || {
              name: 'Leadership Connections',
              image: '/images/logo/LeadershipConnectionsLogo.png',
              designation: 'Team'
            },
            tags: data.tags || [],
            publishDate: data.publishDate || new Date().toISOString().split('T')[0],
            content: data.content || ''
          });
          index++;
        });
        
        setFirestoreBlogs(blogs);
      } catch (error) {
        console.error('Error fetching blog entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Combine Firestore blogs with static blogs, removing duplicates
  // Firestore blogs take priority over static ones
  const firestoreSlugs = new Set(firestoreBlogs.map(blog => blog.slug));
  const uniqueStaticBlogs = blogData.filter(blog => !firestoreSlugs.has(blog.slug));
  const allBlogs = [...firestoreBlogs, ...uniqueStaticBlogs];

  // Calculate pagination
  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = allBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Breadcrumb
        pageName="C.O.N.N.E.C.T.I.O.N.S. Blog"
        description="Discover stories, highlights, and reflections from Leadership Connections participants as they explore colleges, visit corporations, create technology projects, and engage in arts, fitness, and community service experiences."
      />

      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : allBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="-mx-4 flex flex-wrap justify-center">
              {currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                >
                  <SingleBlog blog={blog} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination - Only show if there are multiple pages */}
          {totalPages > 1 && (
            <div
              className="wow fadeInUp -mx-4 flex flex-wrap"
              data-wow-delay=".15s"
            >
              <div className="w-full px-4">
                <ul className="flex items-center justify-center pt-8">
                  {/* Previous Button */}
                  <li className="mx-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-secondary text-body-color hover:bg-primary hover:text-white'
                      }`}
                    >
                      Prev
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <li key={pageNumber} className="mx-1">
                      <button
                        onClick={() => handlePageChange(pageNumber)}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                          currentPage === pageNumber
                            ? 'bg-primary text-white'
                            : 'bg-secondary text-body-color hover:bg-primary hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}

                  {/* Next Button */}
                  <li className="mx-1">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-md px-4 text-sm transition ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-secondary text-body-color hover:bg-primary hover:text-white'
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;

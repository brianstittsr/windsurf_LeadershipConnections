'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogEntry } from '@/lib/firestore-schema';
import Link from 'next/link';
import Image from 'next/image';
import AIContentGenerator from '@/components/Admin/AIContentGenerator';
import EnhanceWithAI from '@/components/Admin/EnhanceWithAI';

const BlogEntriesAdmin = () => {
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogEntry | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    slug: '',
    paragraph: '',
    content: '',
    image: '/images/blog/blog-01.jpg',
    author: {
      name: 'Katherine Harreleson',
      image: '/images/blog/author-01.png',
      designation: 'Program Director'
    },
    tags: [''],
    publishDate: new Date().toISOString().split('T')[0],
    published: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blogEntries'));
      const blogsData = querySnapshot.docs.map(doc => ({
        firestoreId: doc.id,  // Firestore document ID (string)
        ...doc.data()
      })) as BlogEntry[];
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingBlog && editingBlog.firestoreId) {
        await updateDoc(doc(db, 'blogEntries', editingBlog.firestoreId), {
          ...blogData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'blogEntries'), blogData);
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog: BlogEntry) => {
    setEditingBlog(blog);
    setFormData({
      id: typeof blog.id === 'number' ? blog.id : parseInt(String(blog.id)) || 0,
      title: blog.title,
      slug: blog.slug,
      paragraph: blog.paragraph,
      content: blog.content,
      image: blog.image,
      author: blog.author,
      tags: blog.tags.length > 0 ? blog.tags : [''],
      publishDate: blog.publishDate,
      published: blog.published
    });
    setShowForm(true);
  };

  const handleDelete = async (firestoreId: string) => {
    if (confirm('Are you sure you want to delete this blog entry?')) {
      try {
        await deleteDoc(doc(db, 'blogEntries', firestoreId));
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      title: '',
      slug: '',
      paragraph: '',
      content: '',
      image: '/images/blog/blog-01.jpg',
      author: {
        name: 'Katherine Harreleson',
        image: '/images/blog/author-01.png',
        designation: 'Program Director'
      },
      tags: [''],
      publishDate: new Date().toISOString().split('T')[0],
      published: false
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Entries Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Add New Blog Entry
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingBlog ? 'Edit Blog Entry' : 'Add New Blog Entry'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID (Numeric)</label>
                <input
                  type="number"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="e.g., 1, 2, 3..."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL-friendly)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Summary</label>
                <EnhanceWithAI
                  currentText={formData.paragraph}
                  onEnhanced={(enhancedText) => setFormData({ ...formData, paragraph: enhancedText })}
                  fieldName="blog summary"
                />
              </div>
              <textarea
                value={formData.paragraph}
                onChange={(e) => setFormData({ ...formData, paragraph: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML)</label>
              
              {/* AI Content Generator */}
              <AIContentGenerator
                summary={formData.paragraph}
                contentType="blog"
                onContentGenerated={(content) => {
                  setFormData(prev => ({ ...prev, content }));
                }}
              />
              
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-mono text-sm"
                placeholder="Enter HTML content or use AI to generate..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Path</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="/images/blog/my-image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                  <input
                    type="text"
                    value={formData.author.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      author: { ...formData.author, name: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Image</label>
                  <input
                    type="text"
                    value={formData.author.image}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      author: { ...formData.author, image: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    placeholder="/images/authors/john.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author Title/Role</label>
                  <input
                    type="text"
                    value={formData.author.designation}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      author: { ...formData.author, designation: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    placeholder="Program Director"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    placeholder="Enter tag"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-primary hover:text-primary/80"
              >
                + Add Tag
              </button>
            </div>

            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                Published
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingBlog ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex gap-4">
              {/* Thumbnail Image */}
              <div className="w-48 h-48 flex-shrink-0 relative bg-gray-200">
                <Image
                  src={blog.image || '/images/blog/blog-default.jpg'}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                    <p className="text-gray-600 text-sm">/{blog.slug}</p>
                    <div className="flex items-center mt-2">
                      {blog.published ? (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                      <span className="ml-2 text-sm text-gray-500">{blog.publishDate}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="text-green-600 hover:text-green-800"
                      target="_blank"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => blog.firestoreId && handleDelete(blog.firestoreId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-2">{blog.paragraph}</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogEntriesAdmin;

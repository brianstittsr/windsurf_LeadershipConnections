'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AlumniComment } from '@/lib/firestore-schema';

const AlumniCommentsAdmin = () => {
  const [comments, setComments] = useState<AlumniComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState<AlumniComment | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    comment: '',
    image: '/images/testimonials/author-01.png',
    featured: false
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'alumniComments'));
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AlumniComment[];
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const commentData = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingComment) {
        await updateDoc(doc(db, 'alumniComments', editingComment.id), {
          ...commentData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'alumniComments'), commentData);
      }

      resetForm();
      fetchComments();
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleEdit = (comment: AlumniComment) => {
    setEditingComment(comment);
    setFormData({
      name: comment.name,
      title: comment.title,
      comment: comment.comment,
      image: comment.image,
      featured: comment.featured
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteDoc(doc(db, 'alumniComments', id));
        fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      comment: '',
      image: '/images/testimonials/author-01.png',
      featured: false
    });
    setEditingComment(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alumni Comments Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Add New Comment
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingComment ? 'Edit Comment' : 'Add New Comment'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Path</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                placeholder="/images/testimonials/author-01.png"
              />
            </div>
            <div>
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured on Homepage
              </label>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingComment ? 'Update' : 'Create'}
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
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{comment.name}</h3>
                <p className="text-gray-600">{comment.title}</p>
                {comment.featured && (
                  <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mt-1">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{comment.comment}</p>
            <div className="flex items-center">
              <img
                src={comment.image}
                alt={comment.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <span className="text-sm text-gray-500">Image: {comment.image}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniCommentsAdmin;

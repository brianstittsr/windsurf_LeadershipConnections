'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/lib/firestore-schema';
import { FaTimes, FaPlus, FaFolder, FaCheck } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface ProjectAssignmentModalProps {
  formId: string;
  formTitle: string;
  currentProjectId?: string;
  onClose: () => void;
  onAssigned: () => void;
}

const PROJECT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

export default function ProjectAssignmentModal({
  formId,
  formTitle,
  currentProjectId,
  onClose,
  onAssigned
}: ProjectAssignmentModalProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(PROJECT_COLORS[0]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        metadata: {
          ...doc.data().metadata,
          lastActivity: doc.data().metadata?.lastActivity?.toDate(),
        },
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !user) return;

    setCreating(true);
    try {
      const now = new Date();
      const projectData = {
        name: newProjectName,
        description: newProjectDescription,
        color: newProjectColor,
        createdBy: user.uid,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        tags: [],
        status: 'active',
        formIds: [formId],
        datasetIds: [],
        eventIds: [],
        metadata: {
          totalForms: 1,
          totalDatasets: 0,
          totalSubmissions: 0,
          lastActivity: Timestamp.fromDate(now),
        },
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      // Update form with project ID
      await updateDoc(doc(db, 'customForms', formId), {
        projectId: docRef.id,
        updatedAt: Timestamp.fromDate(now),
      });

      onAssigned();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    } finally {
      setCreating(false);
    }
  };

  const handleAssignToProject = async (projectId: string) => {
    try {
      const now = new Date();
      
      // Remove from old project if exists
      if (currentProjectId) {
        await updateDoc(doc(db, 'projects', currentProjectId), {
          formIds: arrayRemove(formId),
          updatedAt: Timestamp.fromDate(now),
        });
      }

      // Add to new project
      await updateDoc(doc(db, 'projects', projectId), {
        formIds: arrayUnion(formId),
        updatedAt: Timestamp.fromDate(now),
        'metadata.lastActivity': Timestamp.fromDate(now),
      });

      // Update form
      await updateDoc(doc(db, 'customForms', formId), {
        projectId: projectId,
        updatedAt: Timestamp.fromDate(now),
      });

      onAssigned();
      onClose();
    } catch (error) {
      console.error('Error assigning to project:', error);
      alert('Error assigning to project');
    }
  };

  const handleRemoveFromProject = async () => {
    if (!currentProjectId) return;

    try {
      const now = new Date();
      
      await updateDoc(doc(db, 'projects', currentProjectId), {
        formIds: arrayRemove(formId),
        updatedAt: Timestamp.fromDate(now),
      });

      await updateDoc(doc(db, 'customForms', formId), {
        projectId: null,
        updatedAt: Timestamp.fromDate(now),
      });

      onAssigned();
      onClose();
    } catch (error) {
      console.error('Error removing from project:', error);
      alert('Error removing from project');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Assign to Project</h2>
              <p className="text-white/90 text-sm">Form: {formTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </div>
          ) : (
            <>
              {/* Create New Project */}
              {showCreateNew ? (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Create New Project</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="e.g., Annual Gala 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newProjectDescription}
                        onChange={(e) => setNewProjectDescription(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Brief description of the project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <div className="flex gap-2">
                        {PROJECT_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => setNewProjectColor(color)}
                            className={`w-10 h-10 rounded-lg transition-all ${
                              newProjectColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateProject}
                        disabled={!newProjectName.trim() || creating}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                      >
                        {creating ? 'Creating...' : 'Create & Assign'}
                      </button>
                      <button
                        onClick={() => setShowCreateNew(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreateNew(true)}
                  className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
                >
                  <FaPlus />
                  Create New Project
                </button>
              )}

              {/* Existing Projects */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Existing Projects</h3>
                
                {currentProjectId && (
                  <button
                    onClick={handleRemoveFromProject}
                    className="w-full text-left px-4 py-3 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 font-medium">Remove from Current Project</span>
                      <FaTimes className="text-red-600" />
                    </div>
                  </button>
                )}

                {projects.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No projects yet. Create one above to get started.
                  </p>
                ) : (
                  projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleAssignToProject(project.id)}
                      disabled={currentProjectId === project.id}
                      className={`w-full text-left px-4 py-3 border rounded-lg transition-all ${
                        currentProjectId === project.id
                          ? 'border-green-300 bg-green-50 cursor-default'
                          : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${project.color}20` }}
                          >
                            <FaFolder style={{ color: project.color }} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-500">{project.description}</p>
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                              <span>{project.formIds.length} forms</span>
                              <span>{project.datasetIds.length} datasets</span>
                            </div>
                          </div>
                        </div>
                        {currentProjectId === project.id && (
                          <FaCheck className="text-green-600 text-xl" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

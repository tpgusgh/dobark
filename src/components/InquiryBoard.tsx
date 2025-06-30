import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, Clock, CheckCircle, X, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Inquiry } from '../types';

const InquiryBoard: React.FC = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    const stored = localStorage.getItem('inquiries');
    if (stored) {
      setInquiries(JSON.parse(stored));
    }
  }, []);

  const saveInquiry = (inquiry: Inquiry) => {
    const currentInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const existingIndex = currentInquiries.findIndex((i: Inquiry) => i.id === inquiry.id);
    
    if (existingIndex >= 0) {
      currentInquiries[existingIndex] = inquiry;
    } else {
      currentInquiries.push(inquiry);
    }
    
    localStorage.setItem('inquiries', JSON.stringify(currentInquiries));
    setInquiries(currentInquiries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.content.trim()) return;

    const inquiry: Inquiry = {
      id: editingId || Date.now().toString(),
      userId: user.id,
      username: user.username,
      title: formData.title.trim(),
      content: formData.content.trim(),
      status: 'open',
      createdAt: editingId ? inquiries.find(i => i.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveInquiry(inquiry);
    setFormData({ title: '', content: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (inquiry: Inquiry) => {
    setFormData({ title: inquiry.title, content: inquiry.content });
    setEditingId(inquiry.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    const updated = inquiries.filter(i => i.id !== id);
    localStorage.setItem('inquiries', JSON.stringify(updated));
    setInquiries(updated);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="text-yellow-400" size={16} />;
      case 'answered':
        return <MessageCircle className="text-blue-400" size={16} />;
      case 'closed':
        return <CheckCircle className="text-green-400" size={16} />;
      default:
        return <Clock className="text-yellow-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'answered':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'closed':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      default:
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
    }
  };

  const userInquiries = inquiries.filter(i => i.userId === user?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Inquiry Board
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md font-medium transition-all duration-200 flex items-center"
        >
          <Plus className="mr-2" size={16} />
          New Inquiry
        </button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Inquiry' : 'Create New Inquiry'}
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                setFormData({ title: '', content: '' });
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter inquiry title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your inquiry..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setFormData({ title: '', content: '' });
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition-all duration-200"
              >
                {editingId ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inquiries List */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Your Inquiries</h2>
        </div>

        {userInquiries.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>You haven't submitted any inquiries yet.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Create your first inquiry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {userInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">{inquiry.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>By {inquiry.username}</span>
                      <span>•</span>
                      <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      {inquiry.updatedAt !== inquiry.createdAt && (
                        <>
                          <span>•</span>
                          <span>Updated {new Date(inquiry.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                      {getStatusIcon(inquiry.status)}
                      <span className="ml-1 capitalize">{inquiry.status}</span>
                    </span>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(inquiry)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{inquiry.content}</p>

                {inquiry.response && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Admin Response:</h4>
                    <p className="text-gray-300">{inquiry.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryBoard;
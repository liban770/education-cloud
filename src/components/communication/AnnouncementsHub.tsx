import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Announcement } from '../../types';
import { BellRing, PlusCircle, AlertCircle, Megaphone, Calendar, ShieldAlert, X } from 'lucide-react';

export const AnnouncementsHub: React.FC = () => {
  const { announcements, createAnnouncement } = useSchoolData();
  const { currentUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Academic' | 'Campus Life' | 'Security Alert' | 'Administrative'>('Campus Life');
  const [targetAudience, setTargetAudience] = useState<'all' | 'students' | 'parents' | 'teachers'>('all');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    createAnnouncement({
      title,
      content,
      category,
      targetAudience,
      priority,
      authorName: currentUser.name,
      authorRole: currentUser.roleTitle,
    });

    setTitle('');
    setContent('');
    setIsCreateOpen(false);
  };

  const canPost = currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'dpo';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Campus Bulletins & Encrypted Broadcasts
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Direct Institution-to-Family Feed</span>
            <span aria-hidden="true">·</span>
            <span>Audited Push Transmissions</span>
          </div>
        </div>

        {canPost && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Bulletin</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div 
            key={ann.id} 
            className={`p-5 rounded-lg border bg-white shadow-xs transition-colors ${
              ann.priority === 'urgent' ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {ann.priority === 'urgent' && (
                  <span className="text-[10px] font-bold font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-700" />
                    PRIORITY
                  </span>
                )}
                <span className="text-xs font-semibold text-indigo-700">{ann.category}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 capitalize">Audience: {ann.targetAudience}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {ann.publishedAt}
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {ann.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mt-2 font-sans">
                {ann.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                Published by: <span className="font-semibold text-slate-700">{ann.authorName}</span> ({ann.authorRole})
              </div>
              <div className="text-emerald-700 font-medium">
                Verified Institution Dispatch
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                <span>Create Campus Bulletin</span>
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Bulletin Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Fall Parent-Teacher Conferences"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Security Alert">Security Alert</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                  >
                    <option value="all">Everyone</option>
                    <option value="parents">Parents Only</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Faculty Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Announcement Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details, dates, instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Broadcast Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

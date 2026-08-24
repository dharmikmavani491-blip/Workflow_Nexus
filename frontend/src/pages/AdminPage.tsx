import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Star, Clock, AlertCircle } from 'lucide-react';
import { FeedbackItem } from '../types';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await api.approveFeedback(id);
      await fetchFeedbacks();
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Admin Governance
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Feedback Moderation & Knowledge Base Updates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
          Review user ratings, qualitative comments, and approve trusted optimizations to the core knowledge base.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading governance records...</div>
      ) : feedbacks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
          No feedback entries currently pending review.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-4">Workflow & Version</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">User Feedback</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-900">
                      {fb.workflow_id}
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        v{fb.workflow_version}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-800">{fb.rating}/5</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs text-slate-700">
                      {fb.comment ? fb.comment : <span className="italic text-slate-400">No comment</span>}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {fb.is_approved_for_knowledge_update ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                          Approved
                        </span>
                      ) : fb.is_reviewed ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          Reviewed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {!fb.is_approved_for_knowledge_update && (
                        <button
                          onClick={() => handleApprove(fb.id)}
                          disabled={approvingId === fb.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-all disabled:opacity-50"
                        >
                          {approvingId === fb.id ? 'Approving...' : 'Approve for KB'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

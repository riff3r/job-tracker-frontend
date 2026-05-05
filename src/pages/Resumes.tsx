import { useState } from 'react';
import { toast } from 'sonner';
import { useResumes } from '@/hooks/useResumes';
import { useDeleteResume } from '@/mutations/useDeleteResume';
import { ResumeUploader } from '@/components/resumes/ResumeUploader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, getApiErrorMessage } from '@/lib/utils';
import type { Resume } from '@/types';

function groupByLabel(resumes: Resume[]): Record<string, Resume[]> {
  return resumes.reduce<Record<string, Resume[]>>((acc, r) => {
    if (!acc[r.label]) acc[r.label] = [];
    acc[r.label].push(r);
    return acc;
  }, {});
}

export default function Resumes() {
  const { data: resumes, isLoading } = useResumes();
  const deleteResume = useDeleteResume();
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null);

  function handleDownload(id: string) {
    // noopener+noreferrer prevents the opened context from accessing window.opener
    // and from leaking referrer info. Defense in depth even though the URL is internal.
    window.open(
      `${import.meta.env.VITE_API_URL}/v1/resumes/${id}/download`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteResume.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Resume deleted');
        setDeleteTarget(null);
      },
      onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete resume')),
    });
  }

  const grouped = groupByLabel(resumes ?? []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Resumes</h1>
        <p className="text-sm text-slate-500 mt-1">Upload and manage your resume files</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Upload New Resume</h2>
        <ResumeUploader />
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Your Resumes</h2>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            No resumes uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {Object.entries(grouped).map(([label, versions]) => (
              <div key={label} className="px-5 py-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{label}</p>
                <div className="space-y-2">
                  {versions
                    .sort((a, b) => b.version - a.version)
                    .map((resume) => (
                      <div key={resume.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          resume.fileType === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {resume.fileType}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 truncate">
                            v{resume.version}
                            <span className="text-slate-400 ml-2 font-normal">
                              {formatDate(resume.createdAt)}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(resume.id)}
                          className="text-xs text-indigo-600 hover:underline flex-shrink-0"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => setDeleteTarget(resume)}
                          className="text-xs text-red-500 hover:underline flex-shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete resume"
        description={`Delete v${deleteTarget?.version} of "${deleteTarget?.label}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteResume.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

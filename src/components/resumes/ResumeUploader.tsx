import { useRef, useState, type DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn, getApiErrorMessage } from '@/lib/utils';
import { useUploadResume } from '@/mutations/useUploadResume';
import { Spinner } from '@/components/ui/Spinner';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 5;

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
});

type FormValues = z.infer<typeof schema>;

export function ResumeUploader() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadResume = useUploadResume();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function validateFile(file: File): boolean {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Only PDF and DOCX files are accepted');
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) setSelectedFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  }

  function onSubmit(values: FormValues) {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploadProgress(0);
    uploadResume.mutate(
      {
        file: selectedFile,
        label: values.label,
        onUploadProgress: setUploadProgress,
      },
      {
        onSuccess: () => {
          toast.success('Resume uploaded');
          setSelectedFile(null);
          setUploadProgress(0);
          reset();
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Upload failed'));
          setUploadProgress(0);
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
          dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50'
        )}
      >
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-slate-600 font-medium">
          {selectedFile ? selectedFile.name : 'Drag & drop your resume here'}
        </p>
        <p className="text-xs text-slate-400">
          {selectedFile
            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
            : 'or click to browse · PDF or DOCX · Max 5MB'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <div className="flex-1">
          <input
            {...register('label')}
            className={cn(
              'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              errors.label ? 'border-red-400' : 'border-slate-300'
            )}
            placeholder="e.g. Software Engineer"
          />
          {errors.label && (
            <p className="text-xs text-red-500 mt-1">{errors.label.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={uploadResume.isPending || !selectedFile}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
        >
          {uploadResume.isPending ? (
            <>
              <Spinner size="sm" />
              {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
            </>
          ) : (
            'Upload Resume'
          )}
        </button>
      </form>
    </div>
  );
}

import { useCallback, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UploadResponse, ProcessingJob, JobsListResponse } from '@/types';

interface FileUploadState {
  file: File | null;
  jobId: string | null;
}

export const useFileUpload = () => {
  const queryClient = useQueryClient();
  const [fileState, setFileState] = useState<FileUploadState>({ file: null, jobId: null });
  const lastFileRef = useRef<FileUploadState>({ file: null, jobId: null });

  // Mutation for uploading a file
  const uploadFileMutation = useMutation({
    mutationFn: async ({ 
      file, 
      prompt, 
      priority = 1 
    }: { 
      file: File; 
      prompt?: string; 
      priority?: number; 
    }): Promise<UploadResponse> => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.uploadFile(file, token, prompt, priority);
      setFileState({ file, jobId: response.data.job_id });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['file', data.data.job_id], data);
    },
  });

  // Send prompt to an existing job
  const sendPromptMutation = useMutation({
    mutationFn: async ({ 
      jobId, 
      prompt 
    }: { 
      jobId: string; 
      prompt: string; 
    }) => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      // For now, we'll just return a mock response
      // You'll need to implement the actual API call in your API client
      return { success: true, message: 'Prompt sent successfully' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Combined function to handle both new uploads and prompts
  const sendMessage = useCallback(async (file: File | null, prompt: string) => {
    if (file) {
      // If there's a new file, upload it
      const response = await uploadFileMutation.mutateAsync({ file, prompt });
      return response.data.job_id;
    } else if (fileState.jobId) {
      // If no file but we have a previous upload, just send the prompt
      await sendPromptMutation.mutateAsync({ 
        jobId: fileState.jobId, 
        prompt 
      });
      return fileState.jobId;
    } else {
      throw new Error('No file has been uploaded yet');
    }
  }, [fileState.jobId]);

  // Query to get job status
  const useJobStatus = (jobId: string | undefined) => {
    return useQuery<ProcessingJob, Error>({
      queryKey: ['job', jobId],
      queryFn: async (): Promise<ProcessingJob> => {
        if (!jobId) throw new Error('No job ID provided');
        const response = await api.getJobStatus(jobId);
        return response.data;
      },
      enabled: !!jobId,
      refetchInterval: (query) => {
        const jobData = query.state.data;
        return jobData?.status === 'processing' ? 1000 : false;
      },
    });
  };

  // Query to get all jobs
  const useJobs = () => {
    return useQuery<JobsListResponse, Error, ProcessingJob[]>({
      queryKey: ['jobs'],
      queryFn: async (): Promise<JobsListResponse> => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        return await api.getJobs(token);
      },
      select: (data) => data.data.jobs,
      refetchInterval: 5000,
    });
  };

  return {
    // Upload and prompt methods
    sendMessage,
    isUploading: uploadFileMutation.isPending,
    isSendingPrompt: sendPromptMutation.isPending,
    uploadError: uploadFileMutation.error,
    sendPromptError: sendPromptMutation.error,
    lastJobId: lastFileRef.current?.jobId,
    
    // Job status and listing hooks
    useJobStatus,
    useJobs,
    
    // Direct access to mutations if needed
    uploadFile: uploadFileMutation.mutateAsync,
    sendPrompt: sendPromptMutation.mutateAsync,
  };
};

export default useFileUpload;

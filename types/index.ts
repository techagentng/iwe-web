// WebSocket message types
export interface WebSocketMessage {
  type: 'job_update' | 'ai_chunk' | 'job_completed' | 'job_failed' | 'connection' | 'error';
  job_id?: string;
  progress?: number;
  chunk?: string;
  partial?: string;
  ai_response?: string;
  error?: string;
  message?: string;
}

// Processing job types
export interface ProcessingJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  file_name: string;
  created_at: string;
  completed_at?: string;
  error?: string;
  ai_response?: string;
}

// API response types
export interface UploadResponse {
  success: boolean;
  data: {
    job_id: string;
    status: string;
    progress: number;
    message: string;
  };
}

export interface JobStatusResponse {
  success: boolean;
  data: ProcessingJob;
}

export interface JobsListResponse {
  success: boolean;
  data: {
    jobs: ProcessingJob[];
    total: number;
  };
}

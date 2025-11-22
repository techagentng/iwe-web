// WebSocket message types
export type WebSocketMessage = 
  | JobUpdateMessage
  | AIChunkMessage
  | JobCompletedMessage
  | JobFailedMessage
  | ConnectionMessage
  | ErrorMessage
  | RawMessage
  | StreamUpdateMessage
  | StreamCompleteMessage;

export type { 
  JobUpdateMessage, 
  AIChunkMessage, 
  JobCompletedMessage, 
  JobFailedMessage, 
  ConnectionMessage, 
  ErrorMessage, 
  RawMessage, 
  StreamUpdateMessage, 
  StreamCompleteMessage 
};

// Base message interface
interface BaseMessage {
  type: string;
  job_id?: string;
  timestamp?: string;
  [key: string]: any; // Allow additional properties
}

// Specific message types
interface JobUpdateMessage extends BaseMessage {
  type: 'job_update';
  progress: number;
  status?: string;
}

interface AIChunkMessage extends BaseMessage {
  type: 'ai_chunk';
  chunk: string;
  done?: boolean;
}

interface JobCompletedMessage extends BaseMessage {
  type: 'job_completed';
  result?: any;
}

interface JobFailedMessage extends BaseMessage {
  type: 'job_failed';
  error: string;
}

interface ConnectionMessage extends BaseMessage {
  type: 'connection';
  status: 'connected' | 'disconnected';
}

interface ErrorMessage extends BaseMessage {
  type: 'error';
  error: string;
}

// Internal message types for streaming
interface RawMessage extends BaseMessage {
  type: 'raw';
  data: any;
}

interface StreamUpdateMessage extends BaseMessage {
  type: 'stream_update';
  data: string;
  done: boolean;
}

interface StreamCompleteMessage extends BaseMessage {
  type: 'stream_complete';
  data: string;
  done: true;
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

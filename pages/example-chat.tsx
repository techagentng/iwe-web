import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/websocket';
import { WebSocketMessage, ProcessingJob } from '@/types/index';
import { useFileUpload } from '../src/hooks/useFileUpload';
import { useAuth } from '@/contexts/AuthContext';

type Attachment = {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'image';
  size: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  jobId?: string; // Link to backend job
  file?: File; // Store file for actual upload
};

// WebSocket connection status type
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export default function ExampleChat() {
  const { user, logout, isLoggedIn } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastPing, setLastPing] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, jobId?: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use the file upload hook
  const { 
    uploadAndAnalyze,
    isUploading,
    isAnalyzing,
    fileState,
    lastFileId
  } = useFileUpload();
  
  // Update the send button text based on state
  const sendButtonText = isProcessing 
    ? (isUploading || isAnalyzing ? 'Processing...' : 'Sending...')
    : 'Send';
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // WebSocket connection with authentication
  const { sendMessage, isConnected } = useWebSocket({
    authToken: user?.token, // Pass the JWT token for authentication
    onConnect: () => {
      console.log('🔌 WebSocket connected and authenticated');
      setConnectionStatus('connected');
      setConnectionError(null);
      
      // Send a verification message to check if we're properly authenticated
      const verifyAuth = () => {
        const verifyMessage = {
          type: 'verify_auth',
          timestamp: Date.now(),
          sessionId: user?.id || 'unknown'
        };
        sendMessage('verify_auth', verifyMessage);
        console.log('🔍 Sent auth verification request', verifyMessage);
      };
      
      // Wait a moment before verifying to ensure connection is fully established
      const verifyTimeout = setTimeout(verifyAuth, 1000);
      
      return () => clearTimeout(verifyTimeout);
    },
    onDisconnect: () => {
      console.log('⚠️ WebSocket disconnected');
      setConnectionStatus('disconnected');
      setConnectionError('Disconnected from server. Reconnecting...');
    },
    onError: (event: Event) => {
      const errorMessage = event instanceof ErrorEvent ? event.message : 'Connection error';
      console.error('WebSocket error:', errorMessage, event);
      setConnectionStatus('error');
      
      // Provide more specific error messages based on the error type
      if ('code' in event && (event as any).code === 4001) {
        setConnectionError('Authentication failed. Please log in again.');
      } else {
        setConnectionError(`Connection error: ${errorMessage}`);
      }
    },
    reconnectInterval: 3000, // 3 seconds between reconnection attempts
    maxReconnectAttempts: 10, // Try to reconnect up to 10 times
    onMessage: (message) => {
      console.log('📨 Received WebSocket message:', message);
      
      // Handle connection verification response
      if (message.type === 'auth_verified') {
        console.log('✅ WebSocket authentication verified:', message);
        setConnectionStatus('connected');
        setConnectionError(null);
        setLastPing(Date.now());
        return;
      }
      
      // Handle ping-pong for connection monitoring
      if (message.type === 'pong') {
        const latency = Date.now() - message.timestamp;
        console.log(`🏓 Pong received (${latency}ms)`);
        setLastPing(latency);
        return;
      }
      
      // Handle different message types
      if (message.type === 'job_update') {
        // Update job progress
        if (message.job_id === currentJobId) {
          setAttachments(prev => prev.map(att => 
            att.jobId === message.job_id 
              ? { ...att, progress: message.progress || 0 }
              : att
          ));
        }
        return;
      }
      
      // Handle AI response chunks
      if (message.type === 'ai_chunk') {
        // Stream AI response chunks
        if (message.job_id === currentJobId && streamingMessageIndex !== null) {
          setDisplayedContent(message.partial || message.chunk || '');
        }
        return;
      }
      
      // Handle job completion
      if (message.type === 'job_completed') {
        // Job finished successfully
        if (message.job_id === currentJobId) {
          setIsProcessing(false);
          setAttachments(prev => prev.map(att => 
            att.jobId === message.job_id 
              ? { ...att, status: 'completed', progress: 100 }
              : att
          ));
          
          // Update message with final AI response
          if (streamingMessageIndex !== null && message.ai_response) {
            setMessages(prev => prev.map((msg, idx) => 
              idx === streamingMessageIndex 
                ? { ...msg, content: message.ai_response! }
                : msg
            ));
            setStreamingMessageIndex(null);
          }
        }
        return;
      }
      
      // Handle job failure
      if (message.type === 'job_failed') {
        // Job failed - support both job_id and jobId for backward compatibility
        const jobId = 'jobId' in message ? message.jobId : (message as any).job_id;
        if (jobId === currentJobId) {
          setIsProcessing(false);
          setAttachments(prev => prev.map(att => 
            att.jobId === jobId 
              ? { ...att, status: 'error', progress: 0 }
              : att
          ));
          
          // Show error message
          if (streamingMessageIndex !== null) {
            setMessages(prev => prev.map((msg, idx) => 
              idx === streamingMessageIndex 
                ? { ...msg, content: `Error: ${message.error || 'Processing failed'}` }
                : msg
            ));
            setStreamingMessageIndex(null);
          }
        }
        return;
      }
    },
  });

  // Handle WebSocket messages
  function handleWebSocketMessage(message: WebSocketMessage) {
    console.log('📨 WebSocket message:', message);
    
    // Handle authentication response
    if (message.type === 'auth_response') {
      if (message.authenticated) {
        console.log('✅ WebSocket authentication successful');
        setConnectionStatus('connected');
        setConnectionError(null);
      } else {
        console.error('❌ WebSocket authentication failed:', message.error);
        setConnectionStatus('error');
        setConnectionError(`Authentication failed: ${message.error || 'Unknown error'}`);
      }
      return;
    }

    switch (message.type) {
      case 'job_update':
        // Update job progress
        if (message.job_id === currentJobId) {
          setAttachments(prev => prev.map(att => 
            att.jobId === message.job_id 
              ? { ...att, progress: message.progress || 0 }
              : att
          ));
        }
        break;

      case 'ai_chunk':
        // Stream AI response chunks
        if (message.job_id === currentJobId && streamingMessageIndex !== null) {
          setDisplayedContent(message.partial || message.chunk || '');
        }
        break;

      case 'job_completed':
        // Job finished successfully
        if (message.job_id === currentJobId) {
          setIsProcessing(false);
          setAttachments(prev => prev.map(att => 
            att.jobId === message.job_id 
              ? { ...att, status: 'completed', progress: 100 }
              : att
          ));
          
          // Update message with final AI response
          if (streamingMessageIndex !== null && message.ai_response) {
            setMessages(prev => prev.map((msg, idx) => 
              idx === streamingMessageIndex 
                ? { ...msg, content: message.ai_response! }
                : msg
            ));
            setStreamingMessageIndex(null);
          }
        }
        break;

      case 'job_failed':
        // Job failed
        if (message.job_id === currentJobId) {
          setIsProcessing(false);
          setAttachments(prev => prev.map(att => 
            att.jobId === message.job_id 
              ? { ...att, status: 'error', progress: 0 }
              : att
          ));
          
          // Show error message
          if (streamingMessageIndex !== null) {
            setMessages(prev => prev.map((msg, idx) => 
              idx === streamingMessageIndex 
                ? { ...msg, content: `Error: ${message.error || 'Processing failed'}` }
                : msg
            ));
            setStreamingMessageIndex(null);
          }
        }
        break;
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const prompt = inputValue.trim() || 'Analyze this document';
    
    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: prompt }];
    setMessages(newMessages);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Get the first completed attachment if it exists
      const completedAttachment = attachments.find(att => att.status === 'completed' && att.jobId);
      
      if (completedAttachment?.jobId) {
        // Use the analyzeDocument function to send a follow-up question
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await api.analyzeDocument(completedAttachment.jobId, prompt, token);
        
        // Add the AI's response to the chat
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant' as const, 
            content: response.data.answer, 
            jobId: completedAttachment.jobId
          }
        ]);
      } else if (currentJobId) {
        // No new file but we have an existing job, just send the prompt
        try {
          const token = localStorage.getItem('auth_token');
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          const response = await api.analyzeDocument(currentJobId, prompt, token);
          
          // Add the AI's response to the chat
          setMessages(prev => [
            ...prev, 
            { 
              role: 'assistant' as const, 
              content: response.data.answer, // Access the answer from data.answer
              jobId: currentJobId
            }
          ]);
        } catch (error) {
          console.error('Error sending prompt:', error);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Error: ${error instanceof Error ? error.message : 'Failed to send prompt'}`
          }]);
        }
      } else {
        // No attachments and no existing job
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Please upload a document first to analyze it.'
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}` 
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, attachments, messages, currentJobId]);

  // Streaming effect for AI responses
  useEffect(() => {
    if (streamingMessageIndex !== null && messages[streamingMessageIndex]) {
      const fullContent = messages[streamingMessageIndex].content;
      let currentIndex = 0;
      
      const intervalId = setInterval(() => {
        if (currentIndex < fullContent.length) {
          setDisplayedContent(fullContent.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setStreamingMessageIndex(null);
        }
      }, 20); // Adjust speed here (lower = faster)
      
      return () => clearInterval(intervalId);
    }
  }, [streamingMessageIndex, messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setShowUploadModal(false);
    setStreamingMessageIndex(null);
    setDisplayedContent('');
    setIsSidebarOpen(false);
    setAttachments([]);
    setCurrentJobId(null);
    setIsProcessing(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // File upload handler
  const handleFileSelect = async (file: File, type: 'pdf' | 'csv' | 'image') => {
    const attachmentId = Math.random().toString(36).substr(2, 9);
    
    // Create a new attachment in uploading state
    const newAttachment: Attachment = {
      id: attachmentId,
      name: file.name,
      type,
      size: file.size,
      status: 'uploading',
      progress: 0,
      file,
    };
    
    setAttachments(prev => [...prev, newAttachment]);
    setShowUploadModal(false);
    
    try {
      // Add a user message showing the file is being processed
      const userMessage = `Uploading ${file.name}...`;
      setMessages(prev => [...prev, { role: 'user' as const, content: userMessage }]);
      
      // Start the upload and analysis process with the default prompt
      const { fileId, analysis } = await uploadAndAnalyze(file);
      
      // Update the attachment with the file ID and mark as completed
      setAttachments(prev => 
        prev.map(att => 
          att.id === attachmentId 
            ? { ...att, jobId: fileId, status: 'completed', progress: 100 }
            : att
        )
      );
      
      // Add the AI's response to the chat
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant' as const, 
          content: analysis,
          jobId: fileId
        }
      ]);
      
      setCurrentJobId(fileId);
      
    } catch (error) {
      console.error('Upload and analysis error:', error);
      
      // Update the attachment to show error state
      setAttachments(prev => 
        prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'error' }
            : att
        )
      );
      
      // Add an error message
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant' as const, 
          content: `Error: ${error instanceof Error ? error.message : 'Failed to process file'}`
        }
      ]);
    }
  };
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Hidden file inputs - kept outside modals to persist in DOM */}
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file, 'pdf');
          e.target.value = '';
        }}
      />
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file, 'csv');
          e.target.value = '';
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file, 'image');
          e.target.value = '';
        }}
      />
      
      
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`w-64 flex flex-col p-4 fixed md:relative h-full z-40 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div className="text-xl font-semibold mb-6 flex items-center gap-2">
          ChatIWE
          {isConnected && (
            <div className="w-2 h-2 rounded-full bg-green-500" title="Connected" />
          )}
        </div>

        {/* New Chat Button */}
        <button 
          className="w-full py-2 px-3 rounded-md text-left transition flex items-center gap-2 mb-6" 
          style={{ backgroundColor: 'var(--bg-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
          onClick={handleNewChat}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New chat
        </button>

        {/* Search Chats */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Search chats
          </div>
        </div>

        {/* Library */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4.66667H14M2 4.66667V13.3333C2 13.6869 2.14048 14.0261 2.39052 14.2761C2.64057 14.5262 2.97971 14.6667 3.33333 14.6667H12.6667C13.0203 14.6667 13.3594 14.5262 13.6095 14.2761C13.8595 14.0261 14 13.6869 14 13.3333V4.66667M2 4.66667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H5.33333L6.66667 4.66667M14 4.66667V3.33333C14 2.97971 13.8595 2.64057 13.6095 2.39052C13.3594 2.14048 13.0203 2 12.6667 2H10.6667L9.33333 4.66667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Library
          </div>
        </div>

        {/* GPTs Section */}
        <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>GPTs</div>
        
        {/* Explore */}
        <div className="mb-4">
          <Link href="/">
            <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10.6667C9.47276 10.6667 10.6667 9.47276 10.6667 8C10.6667 6.52724 9.47276 5.33333 8 5.33333C6.52724 5.33333 5.33333 6.52724 5.33333 8C5.33333 9.47276 6.52724 10.6667 8 10.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 2L4 4M12 12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Explore
            </div>
          </Link>
        </div>

        {/* Projects Section */}
        <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Projects</div>
        
        {/* New project */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New project
          </div>
        </div>

        {/* App overview and tech at... */}
        <div className="mb-8">
          <div className="text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            App overview and tech at...
          </div>
        </div>

        {/* Chats Section */}
        <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Chats</div>

        {/* Custom errors in Go */}
        <div className="mb-8">
          <div className="text-sm p-2 rounded-md transition cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Custom errors in Go
          </div>
        </div>

        {/* User profile */}
        <div className="mt-auto pt-4 relative" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div 
            className="flex items-center gap-2 text-sm p-2 rounded-md transition cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <span className="text-white text-xs">
                {user?.fullname?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
              </span>
            </div>
            <span className="truncate max-w-[120px]">{user?.fullname || 'User'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Dropdown menu */}
          {showProfileDropdown && (
            <div 
              className="absolute bottom-full left-0 right-0 mb-2 py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                <div className="font-medium">{user?.fullname || 'User'}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email || ''}</div>
              </div>
              <button
                onClick={() => {
                  // Use the logout function from auth context
                  if (typeof window !== 'undefined') {
                    logout();
                    window.location.href = '/login';
                  }
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col relative">
        {/* Connection status indicator */}
        {!isConnected && messages.length > 0 && (
          <div className="absolute top-4 right-4 px-3 py-2 rounded-lg text-white text-sm z-50" style={{ backgroundColor: '#f59e0b' }}>
            Reconnecting...
          </div>
        )}
        
        {messages.length === 0 ? (
          /* Empty state - centered title and input */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-semibold mb-4">ChatIWE</h1>
              <p className="text-2xl" style={{ color: 'var(--text-secondary)' }}>What's on your mind today?</p>
            </div>
            
            {/* Centered input */}
            <div className="w-full max-w-3xl relative">
              {/* Attachments Display */}
              {attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {attachments.map((attachment) => (
                    <motion.div
                      key={attachment.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    >
                      {/* File Icon */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: attachment.type === 'pdf' ? 'var(--accent-primary)' : 
                                          attachment.type === 'csv' ? 'var(--accent-success)' : 
                                          'var(--accent-info)' 
                        }}
                      >
                        {attachment.type === 'pdf' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        {attachment.type === 'csv' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 13H16M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                        {attachment.type === 'image' && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{attachment.name}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {attachment.status === 'uploading' && `Uploading... ${Math.round(attachment.progress)}%`}
                          {attachment.status === 'completed' && formatFileSize(attachment.size)}
                        </div>
                        
                        {/* Progress Bar */}
                        {attachment.status === 'uploading' && (
                          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <motion.div
                              className="h-full"
                              style={{ backgroundColor: 'var(--accent-primary)' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${attachment.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Status Icon or Remove Button */}
                      {attachment.status === 'completed' && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-success)' }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 rounded-lg transition"
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                      {attachment.status === 'uploading' && (
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-primary)' }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 rounded-full border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <button 
                  className="p-2 rounded-lg transition flex-shrink-0"
                  onClick={() => setShowUploadModal(!showUploadModal)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <input
                  type="text"
                  className="flex-1 outline-none bg-transparent px-4"
                  placeholder="ChatIWE..."
                  style={{ color: 'var(--text-primary)' }}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              {/* Upload Modal - Positioned above input */}
              <AnimatePresence>
                {showUploadModal && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUploadModal(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-full left-0 mb-2 z-50"
                      style={{ width: '400px' }}
                    >
                      <div 
                        className="rounded-2xl p-4 shadow-2xl"
                        style={{ backgroundColor: 'var(--bg-primary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Upload File</h3>
                          <button 
                            className="p-1 rounded-lg transition"
                            onClick={() => setShowUploadModal(false)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {/* Upload PDF Button */}
                          <button 
                            className="w-full p-3 rounded-xl text-left transition flex items-center gap-3"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onClick={() => pdfInputRef.current?.click()}
                          >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Upload PDF</div>
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Bank statement or document</div>
                            </div>
                          </button>

                          {/* Upload CSV Button */}
                          <button 
                            className="w-full p-3 rounded-xl text-left transition flex items-center gap-3"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onClick={() => csvInputRef.current?.click()}
                          >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-success)' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 13H16M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Upload CSV</div>
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Spreadsheet data</div>
                            </div>
                          </button>

                          {/* Upload Image Button */}
                          <button 
                            className="w-full p-3 rounded-xl text-left transition flex items-center gap-3"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onClick={() => imageInputRef.current?.click()}
                          >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-info)' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">Upload Image</div>
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Photo or screenshot</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              
              <div className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                ChatIWE can make mistakes. Consider checking important information.
              </div>
            </div>
          </div>
        ) : (
          /* Chat mode - messages at top, input at bottom */
          <>
            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                    )}
                    <div 
                      className={`p-4 rounded-2xl max-w-[80%] ${
                        message.role === 'user' 
                          ? 'rounded-br-none' 
                          : 'rounded-bl-none'
                      }`}
                      style={{ 
                        backgroundColor: message.role === 'user' 
                          ? 'var(--accent-primary)' 
                          : 'var(--bg-secondary)' 
                      }}
                    >
                      <p style={{ color: message.role === 'user' ? 'white' : 'var(--text-primary)' }}>
                        {streamingMessageIndex === index ? (
                          <>
                            {displayedContent}
                            <span className="animate-pulse">▋</span>
                          </>
                        ) : message.content}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-info)' }}>
                        <span className="text-white text-xs font-bold">NN</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt input at bottom */}
            <div className="p-6">
              <div className="max-w-3xl mx-auto relative">
                {/* Attachments Display */}
                {attachments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {attachments.map((attachment) => (
                      <motion.div
                        key={attachment.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl border"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                      >
                        {/* File Icon */}
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ 
                            backgroundColor: attachment.type === 'pdf' ? 'var(--accent-primary)' : 
                                            attachment.type === 'csv' ? 'var(--accent-success)' : 
                                            'var(--accent-info)' 
                          }}
                        >
                          {attachment.type === 'pdf' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {attachment.type === 'csv' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 13H16M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          )}
                          {attachment.type === 'image' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{attachment.name}</div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {attachment.status === 'uploading' && `Uploading... ${Math.round(attachment.progress)}%`}
                            {attachment.status === 'completed' && formatFileSize(attachment.size)}
                          </div>
                          
                          {/* Progress Bar */}
                          {attachment.status === 'uploading' && (
                            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                              <motion.div
                                className="h-full"
                                style={{ backgroundColor: 'var(--accent-primary)' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${attachment.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Status Icon or Remove Button */}
                        {attachment.status === 'completed' && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-success)' }}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <button
                              onClick={() => removeAttachment(attachment.id)}
                              className="p-1 rounded-lg transition"
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        )}
                        {attachment.status === 'uploading' && (
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-primary)' }} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 rounded-full border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <button 
                    className="p-2 rounded-lg transition flex-shrink-0"
                    onClick={() => setShowUploadModal(!showUploadModal)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <input
                    type="text"
                    className="flex-1 outline-none bg-transparent px-4"
                    placeholder="ChatIWE..."
                    style={{ color: 'var(--text-primary)' }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                
                {/* Upload Modal - Positioned above input */}
                <AnimatePresence>
                  {showUploadModal && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUploadModal(false)}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-full left-0 mb-2 z-50"
                        style={{ width: '400px' }}
                      >
                        <div 
                          className="rounded-2xl p-4 shadow-2xl"
                          style={{ backgroundColor: 'var(--bg-primary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Upload File</h3>
                            <button 
                              className="p-1 rounded-lg transition"
                              onClick={() => setShowUploadModal(false)}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {/* Upload PDF Button */}
                            <button 
                              className="w-full p-3 rounded-xl text-left transition flex items-center gap-3"
                              style={{ backgroundColor: 'var(--bg-secondary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                              onClick={() => pdfInputRef.current?.click()}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">Upload PDF</div>
                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Bank statement or document</div>
                              </div>
                            </button>

                            {/* Upload CSV Button */}
                            <button 
                              className="w-full p-3 rounded-xl text-left transition flex items-center gap-3"
                              style={{ backgroundColor: 'var(--bg-secondary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                              onClick={() => csvInputRef.current?.click()}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-success)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8 13H16M8 17H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">Upload CSV</div>
                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Spreadsheet data</div>
                              </div>
                            </button>

                            {/* Upload Image Button */}
                            <button 
                              className="w-full p-3 rounded-xl text-left transition flex items-center gap-3"
                              style={{ backgroundColor: 'var(--bg-secondary)', borderWidth: '1px', borderColor: 'var(--border-color)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                              onClick={() => imageInputRef.current?.click()}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-info)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">Upload Image</div>
                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Photo or screenshot</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
                
                <div className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                  ChatIWE can make mistakes. Consider checking important information.
                </div>
              </div>
            </div>
          </>
        )}
      </main>

    </div>
  );
}
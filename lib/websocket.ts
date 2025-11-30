import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  WebSocketMessage, 
  StreamUpdateMessage, 
  StreamCompleteMessage, 
  RawMessage 
} from '@/types/index';

// Determine if we're in production based on the current hostname
const isProd = typeof window !== 'undefined' && 
  (window.location.hostname.endsWith('iweapps.com') || 
   process.env.NODE_ENV === 'production');

// Base URL without the /ws suffix to prevent duplication
const getBaseUrl = (): string => {
  // If NEXT_PUBLIC_WS_URL is set, use it as-is
  if (process.env.NEXT_PUBLIC_WS_URL) {
    const url = process.env.NEXT_PUBLIC_WS_URL.replace(/\/+$/, ''); // Remove trailing slashes
    console.log('🌐 Using NEXT_PUBLIC_WS_URL:', url);
    return url;
  }
  
  // In development, use WebSocket protocol matching the current page's protocol
  if (!isProd) {
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost:8080';
    const url = `${protocol}//${host}`;
    console.log('🌐 Using development WebSocket URL:', url);
    return url;
  }
  
  // Production fallback
  return 'wss://api.iweapps.com';
};

const WS_BASE_URL = getBaseUrl();

// Debug logging for WebSocket configuration
console.log('🌐 WebSocket Configuration:', {
  isProd,
  WS_BASE_URL,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  protocol: typeof window !== 'undefined' ? window.location.protocol : 'server',
  env: process.env.NODE_ENV,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL
});

// Get auth token from localStorage for development
const getDevAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  // Try to get token from auth context first, then fallback to localStorage
  try {
    const authState = JSON.parse(localStorage.getItem('auth_state') || '{}');
    return authState?.token || localStorage.getItem('dev_jwt');
  } catch (e) {
    return localStorage.getItem('dev_jwt');
  }
};

// Construct WebSocket URL with proper authentication
function getWebSocketUrl(isReactNative: boolean = false, authToken?: string): string {
  let baseUrl = WS_BASE_URL;
  const wsProtocol = baseUrl.startsWith('https') ? 'wss://' : 'ws://';
  const wsUrl = baseUrl.replace(/^https?:\/\//, '');
  
  // Construct the WebSocket URL
  let url = `${wsProtocol}${wsUrl}`;
  
  // Ensure /ws endpoint
  if (!url.endsWith('/ws')) {
    url = url.endsWith('/') ? `${url}ws` : `${url}/ws`;
  }
  
  // Add token to URL if provided
  if (authToken) {
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}token=${encodeURIComponent(authToken)}`;
  }
  
  console.log('🌐 WebSocket URL:', url);
  return url;
}

const WS_URL = getWebSocketUrl();

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  authToken?: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  reconnect: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    authToken
  } = options;
  
  const debug = (message: string, data?: any) => {
    console.log(`[WebSocket] ${message}`, data || '');
  };

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const messageBufferRef = useRef(''); // Buffer for streaming messages
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl(false, authToken);
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      // Debug WebSocket events
      ws.addEventListener('open', (event) => {
        console.log('✅ WebSocket connection established');
      });
      
      ws.addEventListener('error', (error) => {
        console.error('❌ WebSocket error:', {
          type: 'WebSocket Error',
          timestamp: new Date().toISOString(),
          error,
          readyState: ws.readyState,
          url: wsUrl
        });
      });
      
      ws.addEventListener('close', (event) => {
        console.log('🔌 WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
      });

      wsRef.current.onopen = () => {
        console.log('WebSocket connected, authenticating...');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // If we have an auth token, send an auth message
        if (authToken) {
          const authMessage = {
            type: 'auth',
            token: authToken,
            timestamp: new Date().toISOString()
          };
          console.log('Sending auth message:', authMessage);
          wsRef.current?.send(JSON.stringify(authMessage));
        } else if (onConnect) {
          onConnect();
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received WebSocket message:', message);
          
          // Handle auth response
          if (message.type === 'auth_response') {
            if (message.authenticated) {
              console.log('WebSocket authentication successful');
              if (onConnect) onConnect();
            } else {
              console.error('WebSocket authentication failed:', message.error);
              wsRef.current?.close(4001, 'Authentication failed');
            }
            return;
          }
          
          setLastMessage(message);
          if (onMessage) onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error, event.data);
        }
      };

      ws.onerror = (event) => {
        const error = {
          type: 'WebSocket Error',
          timestamp: new Date().toISOString(),
          error: event,
          readyState: ws.readyState,
          url: wsUrl
        };
        console.error('WebSocket error:', error);
        debug('WebSocket Error', error);
        onError?.(event);
        ws.close();
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        onDisconnect?.();

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(
            reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1),
            30000 // Max 30 seconds
          );
          
          debug(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            debug(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        } else {
          const error = new Event('max_reconnect_attempts');
          debug('Max reconnection attempts reached');
          onError?.(error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [onMessage, onConnect, onDisconnect, onError, reconnectInterval, maxReconnectAttempts, authToken]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      debug('Closing existing connection');
      wsRef.current.close();
    }

    debug(`Connecting to WebSocket: ${WS_URL}`);
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    reconnect,
  };
}

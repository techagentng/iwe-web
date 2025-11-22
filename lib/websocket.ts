import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  WebSocketMessage, 
  StreamUpdateMessage, 
  StreamCompleteMessage, 
  RawMessage 
} from '@/types/index';

// Use different endpoints for browser and React Native
const isProd = process.env.NODE_ENV === 'production';
const WS_BASE_URL = isProd ? 'wss://api.iweapps.com' : 'ws://localhost:8080';
const WS_URL = `${WS_BASE_URL}/ws`;
const WS_AUTH_URL = `${WS_BASE_URL}/ws/auth`;

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
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
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const messageBufferRef = useRef(''); // Buffer for streaming messages
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    try {
      // Get the auth token from cookies (will be sent automatically by the browser)
      const token = typeof window !== 'undefined' ? 
        document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] : null;
      
      // For React Native, we'll use the auth endpoint with token in headers
      const isReactNative = typeof navigator !== 'undefined' && 
        navigator.product === 'ReactNative';
      
      const wsUrl = isReactNative && token ? WS_AUTH_URL : WS_URL;
      
      // Create WebSocket connection
      const ws = isReactNative && token ? 
        // @ts-ignore - React Native supports headers in WebSocket constructor
        new WebSocket(wsUrl, { headers: { Authorization: `Bearer ${token}` } }) :
        new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          // Log raw message for debugging
          console.log('📨 Raw WebSocket message:', event.data);
          
          // Try to parse as JSON, fallback to raw text
          try {
            const rawData = typeof event.data === 'string' ? event.data : '';
            const message = JSON.parse(rawData) as WebSocketMessage;
            
            // Handle different message types
            setLastMessage(message);
            
            // Process based on message type
            switch (message.type) {
              case 'ai_chunk':
                // Handle streaming chunks
                messageBufferRef.current += message.chunk || '';
                onMessage?.({
                  type: 'stream_update',
                  data: messageBufferRef.current,
                  done: false,
                  timestamp: new Date().toISOString()
                } as StreamUpdateMessage);
                break;
                
              case 'job_completed':
                // Handle job completion
                onMessage?.({
                  type: 'stream_complete',
                  data: messageBufferRef.current,
                  done: true,
                  timestamp: new Date().toISOString()
                } as StreamCompleteMessage);
                messageBufferRef.current = ''; // Reset buffer
                onMessage?.(message); // Also forward the original message
                break;
                
              case 'job_update':
                // Forward job updates
                onMessage?.(message);
                break;
                
              case 'error':
                console.error('WebSocket error:', message.error);
                onMessage?.(message);
                break;
                
              default:
                console.log('Unhandled message type:', message.type, message);
                onMessage?.(message);
            }
          } catch (parseError) {
            // Handle non-JSON messages or parse errors
            console.log('Non-JSON WebSocket message:', event.data);
            onMessage?.({
              type: 'raw',
              data: event.data,
              timestamp: new Date().toISOString()
            } as RawMessage);
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        onDisconnect?.();

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(
            `🔄 Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.error('❌ Max reconnection attempts reached');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [onMessage, onConnect, onDisconnect, onError, reconnectInterval, maxReconnectAttempts]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttemptsRef.current = 0;
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

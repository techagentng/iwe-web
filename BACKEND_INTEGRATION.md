# Backend Integration Guide

This guide explains how the chat interface integrates with your backend API for document processing.

## Overview

The chat interface (`/example-chat`) now supports:
- **Real-time file uploads** (PDF, CSV, Images)
- **WebSocket streaming** for AI responses
- **Job progress tracking**
- **Automatic reconnection** on connection loss

## Architecture

### Components Created

1. **`/lib/api.ts`** - REST API client for file uploads and job management
2. **`/lib/websocket.ts`** - WebSocket hook for real-time updates
3. **`/types/index.ts`** - TypeScript types for API responses and WebSocket messages

### Data Flow

```
User uploads file → API uploads to backend → Backend processes → 
WebSocket streams progress → UI updates in real-time → Job completes
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# Backend API URL (HTTP)
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_WS_URL=wss://your-backend-url.com/ws
```

## Backend API Requirements

Your backend must implement these endpoints:

### 1. File Upload Endpoint
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (PDF, CSV, or image)
- prompt: string (user's question/instruction)
- priority: number (optional, default: 0)
- scheduled_at: string (optional, ISO datetime)

Response:
{
  "success": true,
  "data": {
    "job_id": "unique-job-id",
    "status": "pending",
    "progress": 0,
    "message": "File uploaded successfully"
  }
}
```

### 2. WebSocket Endpoint
```
WS /ws

Messages sent by backend:
```

#### Job Update
```json
{
  "type": "job_update",
  "job_id": "job-123",
  "progress": 45
}
```

#### AI Response Chunk (Streaming)
```json
{
  "type": "ai_chunk",
  "job_id": "job-123",
  "chunk": "partial response text",
  "partial": "accumulated text so far"
}
```

#### Job Completed
```json
{
  "type": "job_completed",
  "job_id": "job-123",
  "ai_response": "Final complete AI response text"
}
```

#### Job Failed
```json
{
  "type": "job_failed",
  "job_id": "job-123",
  "error": "Error message"
}
```

### 3. Job Status Endpoint (Optional)
```
GET /api/jobs/{job_id}

Response:
{
  "success": true,
  "data": {
    "job_id": "job-123",
    "status": "completed",
    "progress": 100,
    "file_name": "document.pdf",
    "created_at": "2024-01-01T00:00:00Z",
    "completed_at": "2024-01-01T00:05:00Z",
    "ai_response": "AI response text"
  }
}
```

## How It Works

### 1. File Selection
When a user selects a file:
- File is stored locally in component state
- Attachment card shows immediately with "completed" status
- No upload happens yet (file stored in memory)

### 2. Sending Message
When user clicks send:
- User message added to chat
- File uploaded to backend via `api.uploadFile()`
- Backend returns `job_id`
- AI message placeholder added to chat

### 3. Real-time Updates
Via WebSocket:
- `job_update` messages update progress bar
- `ai_chunk` messages stream AI response text
- `job_completed` finalizes the response
- `job_failed` shows error message

### 4. Connection Management
- Auto-connects on component mount
- Shows green dot when connected
- Shows "Reconnecting..." banner when disconnected
- Auto-reconnects up to 5 times with 3s intervals

## UI Features Preserved

All existing UI features remain intact:
- ✅ ChatGPT-style loading animations
- ✅ File attachment cards with progress bars
- ✅ Smooth message streaming
- ✅ Remove attachment button
- ✅ Responsive design
- ✅ Dark/light theme support

## Testing Without Backend

The code gracefully handles missing backend:
- WebSocket connection attempts but doesn't break UI
- File upload errors are caught and shown to user
- You can still test the UI with simulated responses

## Customization

### Change API Endpoints
Edit `/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### Adjust Reconnection Settings
Edit `/lib/websocket.ts`:
```typescript
reconnectInterval: 3000,  // 3 seconds
maxReconnectAttempts: 5,  // 5 attempts
```

### Add Authentication
Modify API client to include auth headers:
```typescript
const response = await fetch(`${this.baseURL}/api/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

## Troubleshooting

### WebSocket won't connect
- Check `NEXT_PUBLIC_WS_URL` is correct
- Ensure backend WebSocket server is running
- Check browser console for connection errors
- Verify CORS settings on backend

### File upload fails
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend accepts multipart/form-data
- Check file size limits on backend
- Look for CORS errors in console

### AI responses not streaming
- Verify WebSocket connection is active (green dot)
- Check backend sends `ai_chunk` messages
- Ensure `job_id` matches between upload and WebSocket messages

## Next Steps

1. **Set up your backend** with the required endpoints
2. **Add environment variables** to `.env.local`
3. **Test the integration** by uploading a file
4. **Monitor WebSocket messages** in browser console
5. **Customize as needed** for your use case

## Support

For issues or questions about the integration, check:
- Browser console for errors
- Network tab for API calls
- WebSocket tab for real-time messages

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'student' | 'employer';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'link';
  size?: number;
}

export interface ChatRoom {
  id: string;
  projectId?: string;
  candidateId?: string;
  participants: {
    id: string;
    name: string;
    type: 'student' | 'employer';
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  content: string;
  attachments?: File[];
}

export const useChat = (roomId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch chat room details
  const fetchChatRoom = useCallback(async (roomId: string) => {
    console.log('💬 Fetching chat room:', roomId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await chatService.getChatRoom(roomId);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockChatRoom: ChatRoom = {
        id: roomId,
        projectId: 'project-123',
        participants: [
          {
            id: 'student-1',
            name: 'John Doe',
            type: 'student'
          },
          {
            id: 'employer-1',
            name: 'Jane Smith',
            type: 'employer'
          }
        ],
        unreadCount: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z'
      };

      setChatRoom(mockChatRoom);
      console.log('💬 Chat room loaded:', mockChatRoom.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chat room';
      console.error('💬 Error fetching chat room:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a chat room
  const fetchMessages = useCallback(async (roomId: string) => {
    console.log('💬 Fetching messages for room:', roomId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await chatService.getMessages(roomId);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: 'employer-1',
          senderName: 'Jane Smith',
          senderType: 'employer',
          content: 'Hi John! I wanted to check in on the project progress.',
          timestamp: '2024-01-20T09:00:00Z',
          isRead: true
        },
        {
          id: '2',
          senderId: 'student-1',
          senderName: 'John Doe',
          senderType: 'student',
          content: 'Hello Jane! The project is going well. I\'ve completed the initial setup and started working on the design phase.',
          timestamp: '2024-01-20T09:15:00Z',
          isRead: true
        },
        {
          id: '3',
          senderId: 'employer-1',
          senderName: 'Jane Smith',
          senderType: 'employer',
          content: 'That\'s great! Can you share the current progress?',
          timestamp: '2024-01-20T10:00:00Z',
          isRead: false
        },
        {
          id: '4',
          senderId: 'student-1',
          senderName: 'John Doe',
          senderType: 'student',
          content: 'Sure! I\'ll upload the latest wireframes in a moment.',
          timestamp: '2024-01-20T10:05:00Z',
          isRead: false
        }
      ];

      setMessages(mockMessages);
      console.log('💬 Messages loaded:', mockMessages.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      console.error('💬 Error fetching messages:', err);
      setError(errorMessage);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (messageData: SendMessageRequest) => {
    if (!roomId) {
      console.error('💬 No room ID provided for sending message');
      return;
    }

    console.log('💬 Sending message:', messageData);
    setSending(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await chatService.sendMessage(roomId, messageData);
      
      // Mock sending
      await new Promise(resolve => setTimeout(resolve, 300));
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current-user', // TODO: Get from auth context
        senderName: 'Current User', // TODO: Get from auth context
        senderType: 'student', // TODO: Get from auth context
        content: messageData.content,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setMessages(prev => [...prev, newMessage]);
      console.log('💬 Message sent:', newMessage.id);
      
      // Clear typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      console.error('💬 Error sending message:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  }, [roomId]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    console.log('💬 Marking messages as read:', messageIds);
    
    try {
      // TODO: Replace with actual API call
      // await chatService.markAsRead(roomId, messageIds);
      
      // Mock marking as read
      setMessages(prev => 
        prev.map(message => 
          messageIds.includes(message.id) 
            ? { ...message, isRead: true }
            : message
        )
      );
      console.log('💬 Messages marked as read');
    } catch (err) {
      console.error('💬 Error marking messages as read:', err);
    }
  }, []);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      // TODO: Send typing indicator to server
      console.log('💬 User started typing');
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log('💬 User stopped typing');
    }, 2000);
  }, [isTyping]);

  // Load chat data when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchChatRoom(roomId);
      fetchMessages(roomId);
    } else {
      setMessages([]);
      setChatRoom(null);
    }
  }, [roomId, fetchChatRoom, fetchMessages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    messages,
    chatRoom,
    loading,
    sending,
    error,
    isTyping,
    typingUsers,
    
    // Actions
    sendMessage,
    markAsRead,
    handleTyping,
    
    // Utilities
    hasMessages: messages.length > 0,
    unreadCount: messages.filter(m => !m.isRead).length,
    lastMessage: messages[messages.length - 1],
    messagesEndRef
  };
};

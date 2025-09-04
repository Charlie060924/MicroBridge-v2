"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { useChat, ChatMessage } from '@/hooks/useChat';

interface ChatBoxProps {
  roomId: string;
  title?: string;
  className?: string;
  onClose?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  roomId,
  title = "Project Chat",
  className = "",
  onClose
}) => {
  const [message, setMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    chatRoom,
    loading,
    sending,
    error,
    isTyping,
    sendMessage,
    markAsRead,
    handleTyping,
    messagesEndRef
  } = useChat(roomId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    try {
      await sendMessage({ content: message.trim() });
      setMessage('');
    } catch (error) {
      // Failed to send message
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload logic
      // Files selected for upload
      setIsAttaching(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessageIds = messages
        .filter(m => !m.isRead)
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  }, [messages, markAsRead]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-600 mb-4">Failed to load chat</div>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 flex flex-col h-96 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {chatRoom && (
              <p className="text-sm text-gray-500">
                {chatRoom.participants.length} participants
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isTyping && (
              <span className="text-xs text-gray-500 animate-pulse">
                Someone is typing...
              </span>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const showDate = index === 0 || 
              formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp);
            
            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="text-center mb-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${msg.senderType === 'employer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${
                    msg.senderType === 'employer' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  } rounded-lg px-3 py-2`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium">
                        {msg.senderName}
                      </span>
                      <span className="text-xs opacity-75">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                    {!msg.isRead && msg.senderType === 'employer' && (
                      <div className="text-xs opacity-75 mt-1">✓</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsAttaching(!isAttaching)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            title="Add emoji"
          >
            <Smile className="h-4 w-4" />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
        {/* File upload input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        {isAttaching && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Choose files to attach
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
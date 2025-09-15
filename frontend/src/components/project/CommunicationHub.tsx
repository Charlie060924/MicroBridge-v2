"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Download, Eye, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'employer';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: string[];
}

interface CommunicationHubProps {
  projectId: string;
  currentUserId: string;
  currentUserRole: 'student' | 'employer';
  onNewMessage?: (message: Message) => void;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({
  projectId,
  currentUserId,
  currentUserRole,
  onNewMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: currentUserRole === 'student' ? 'You' : 'You',
        senderRole: currentUserRole,
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
        readBy: [currentUserId]
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      onNewMessage?.(message);
      
      // Mark as read
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, readBy: [...m.readBy, 'other-user'] } : m
        ));
      }, 2000);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile(true);
      
      try {
        // Simulate file upload
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const message: Message = {
          id: Date.now().toString(),
          senderId: currentUserId,
          senderName: currentUserRole === 'student' ? 'You' : 'You',
          senderRole: currentUserRole,
          content: `Shared ${file.name}`,
          timestamp: new Date(),
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          fileUrl: URL.createObjectURL(file),
          readBy: [currentUserId]
        };
        
        setMessages(prev => [...prev, message]);
        onNewMessage?.(message);
      } catch (error) {
        console.error('File upload failed:', error);
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isOwn = message.senderId === currentUserId;
    const isRead = message.readBy.length > 1;

    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}>
          {!isOwn && (
            <div className="text-xs font-medium mb-1 opacity-75">
              {message.senderName}
            </div>
          )}
          
          {message.type === 'file' ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm font-medium">{message.fileName}</span>
              </div>
              <div className="text-xs opacity-75">
                {formatFileSize(message.fileSize || 0)}
              </div>
              <div className="flex space-x-2">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>Download</span>
                </button>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm">{message.content}</div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className={`text-xs opacity-75 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTime(message.timestamp)}
            </div>
            {isOwn && (
              <div className="flex items-center space-x-1">
                {isRead ? (
                  <CheckCircle2 className="h-3 w-3 text-blue-200" />
                ) : (
                  <Clock className="h-3 w-3 text-blue-200" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Project Communication
          </h3>
          {isTyping && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Client is typing...
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingFile}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || uploadingFile}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {uploadingFile && (
          <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
            Uploading file...
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;
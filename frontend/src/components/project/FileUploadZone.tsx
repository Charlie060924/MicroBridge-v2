"use client";

import React, { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import UploadedFilesList from "./UploadedFilesList";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface FileUploadZoneProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesUploaded,
  maxFiles = 10,
  maxFileSize = 100,
  acceptedTypes = [],
  multiple = true
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [draggedOver, setDraggedOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`;
    }
    
    if (acceptedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !acceptedTypes.includes(fileExtension)) {
        return `File type "${fileExtension}" is not supported.`;
      }
    }
    
    if (uploadedFiles.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed.`;
    }
    
    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const newErrors: string[] = [];
    const validFiles: UploadedFile[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: getFileType(file.name),
          file
        };
        validFiles.push(uploadedFile);
        simulateUpload(uploadedFile.id);
      }
    });

    setErrors(newErrors);
    setUploadedFiles(prev => [...prev, ...validFiles]);
    onFilesUploaded?.(validFiles);
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['doc', 'docx', 'pdf', 'txt', 'md'].includes(extension || '')) return 'document';
    if (['js', 'ts', 'py', 'java', 'cpp', 'html', 'css'].includes(extension || '')) return 'code';
    if (['png', 'jpg', 'jpeg', 'svg', 'gif'].includes(extension || '')) return 'image';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) return 'archive';
    return 'other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          draggedOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <input
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload-input"
          accept={acceptedTypes.length > 0 ? acceptedTypes.map(type => `.${type}`).join(',') : undefined}
        />
        <label htmlFor="file-upload-input" className="cursor-pointer">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-sm text-gray-500">
            {acceptedTypes.length > 0 
              ? `Accepts: ${acceptedTypes.join(', ')} • Max ${maxFileSize}MB each`
              : `All file types • Max ${maxFileSize}MB each`
            }
          </p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-500 mt-1">
              Maximum {maxFiles} files
            </p>
          )}
        </label>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files List */}
      <UploadedFilesList 
        files={uploadedFiles}
        uploadProgress={uploadProgress}
        onRemove={removeFile}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

export default FileUploadZone;
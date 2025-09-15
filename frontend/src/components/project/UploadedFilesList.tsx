"use client";

import React from "react";
import { FileText, X } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
  uploadProgress: { [key: string]: number };
  onRemove: (fileId: string) => void;
  formatFileSize: (bytes: number) => string;
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  files,
  uploadProgress,
  onRemove,
  formatFileSize
}) => {
  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      document: 'text-blue-600',
      code: 'text-green-600',
      image: 'text-purple-600',
      archive: 'text-orange-600',
      other: 'text-gray-600'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Files List */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Uploaded Files ({files.length})
        </h4>
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`${getTypeColor(file.type)}`}>
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="capitalize">{file.type}</span>
                </div>
              </div>
            </div>
            
            {/* Upload Progress */}
            {uploadProgress[file.id] !== undefined && (
              <div className="flex items-center space-x-2 mr-3">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress[file.id]}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
                  {uploadProgress[file.id]}%
                </span>
              </div>
            )}
            
            {/* Remove Button */}
            <button
              onClick={() => onRemove(file.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              disabled={uploadProgress[file.id] !== undefined}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-medium">{files.length}</span> file{files.length !== 1 ? 's' : ''} ready for upload
          <span className="ml-2">
            ({formatFileSize(files.reduce((sum, file) => sum + file.size, 0))} total)
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-blue-600 dark:text-blue-300">
            {Object.keys(uploadProgress).length > 0 
              ? `Uploading ${Object.keys(uploadProgress).length} file${Object.keys(uploadProgress).length !== 1 ? 's' : ''}...`
              : 'Ready to submit'
            }
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Clear All
            </button>
            <button 
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
              disabled={Object.keys(uploadProgress).length > 0}
            >
              Upload All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedFilesList;
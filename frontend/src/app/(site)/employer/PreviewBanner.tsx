"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, X } from "lucide-react";

const PreviewBanner: React.FC = () => {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const preview = searchParams.get('preview');
    setIsVisible(preview === 'true');
  }, [searchParams]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center">
          <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            You are viewing this page as a student would
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewBanner;

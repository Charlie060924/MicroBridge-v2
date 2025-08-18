"use client";

import React, { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

interface CompleteJobButtonProps {
  jobId: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onComplete?: () => void;
}

const CompleteJobButton: React.FC<CompleteJobButtonProps> = ({
  jobId,
  className = "",
  variant = "primary",
  size = "md",
  onComplete,
}) => {
  const { completeJob, completeJobMutation } = useReviews();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async () => {
    try {
      await completeJob(jobId);
      setIsCompleted(true);
      onComplete?.();
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    
    const variantClasses = {
      primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
      outline: "border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500",
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  if (isCompleted) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
        <CheckCircle className="h-4 w-4" />
        <span>Completed</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={completeJobMutation.isPending}
      className={getButtonClasses()}
    >
      {completeJobMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <span>
        {completeJobMutation.isPending ? "Completing..." : "Complete Job"}
      </span>
    </button>
  );
};

export default CompleteJobButton;

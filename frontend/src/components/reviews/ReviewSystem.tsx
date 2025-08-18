"use client";

import React from "react";
import { useReviews } from "@/hooks/useReviews";
import { useUser } from "@/hooks/useUser";
import ReviewModal from "./ReviewModal";
import LeaveReviewButton from "./LeaveReviewButton";

interface ReviewSystemProps {
  children?: React.ReactNode;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ children }) => {
  const { user } = useUser();
  const {
    isReviewModalOpen,
    selectedJobForReview,
    closeReviewModal,
    submitReview,
    createReviewMutation,
  } = useReviews();

  const handleSubmitReview = (reviewData: any) => {
    submitReview(reviewData);
  };

  return (
    <>
      {children}
      
      {/* Review Modal */}
      {selectedJobForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          jobId={selectedJobForReview.jobId}
          revieweeId={selectedJobForReview.revieweeId}
          revieweeName={selectedJobForReview.revieweeName}
          jobTitle={selectedJobForReview.jobTitle}
          userType={user?.userType as "student" | "employer"}
          onSubmit={handleSubmitReview}
          isLoading={createReviewMutation.isPending}
        />
      )}
    </>
  );
};

export default ReviewSystem;

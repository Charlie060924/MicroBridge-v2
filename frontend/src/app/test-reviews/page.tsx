"use client";

import React, { useState } from 'react';
import { mockStudents, mockEmployers, mockCompletedJobs, getMockUserReviewStats } from '@/data/mockReviewData';
import { ReviewsSection, ReviewSystem } from '@/components/reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, User, Building, Briefcase } from 'lucide-react';

export default function TestReviewsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>('student-001');
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'employer'>('student');

  const allUsers = [...mockStudents, ...mockEmployers];
  const selectedUser = allUsers.find(user => user.id === selectedUserId);
  const userStats = getMockUserReviewStats(selectedUserId);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <ReviewSystem>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Review System Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This page demonstrates the review system with mock data. Select different users to see their reviews and ratings.
          </p>
        </div>

        {/* User Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Select User to View Reviews
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockStudents.map((student) => {
                  const stats = getMockUserReviewStats(student.id);
                  return (
                    <div
                      key={student.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUserId === student.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedUserId(student.id);
                        setSelectedUserType('student');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {student.location} • {student.experienceLevel}
                          </p>
                        </div>
                        <div className="text-right">
                          {stats.totalReviews > 0 ? (
                            <div className="flex items-center gap-1">
                              {renderStars(stats.averageRating)}
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {stats.averageRating.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">No reviews</span>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stats.totalReviews} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Employers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Employers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockEmployers.map((employer) => {
                  const stats = getMockUserReviewStats(employer.id);
                  return (
                    <div
                      key={employer.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUserId === employer.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => {
                        setSelectedUserId(employer.id);
                        setSelectedUserType('employer');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {employer.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {employer.location} • {employer.experienceLevel}
                          </p>
                        </div>
                        <div className="text-right">
                          {stats.totalReviews > 0 ? (
                            <div className="flex items-center gap-1">
                              {renderStars(stats.averageRating)}
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {stats.averageRating.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">No reviews</span>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stats.totalReviews} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected User Info */}
        {selectedUser && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    {selectedUser.userType === 'student' ? (
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedUser.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {selectedUser.userType}
                      </Badge>
                      {userStats.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {userStats.totalReviews > 0 && (
                    <div className="ml-auto text-right">
                      <div className="flex items-center gap-2">
                        {renderStars(userStats.averageRating)}
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {userStats.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {userStats.totalReviews} {userStats.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{selectedUser.bio}</p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Location:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{selectedUser.location}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Experience:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{selectedUser.experienceLevel}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Work Preference:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{selectedUser.workPreference}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Level:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{selectedUser.level} (XP: {selectedUser.xp})</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill) => (
                        <Badge key={skill.name} variant="outline" className="text-xs">
                          {skill.name} (Lv.{skill.level})
                          {skill.verified && (
                            <span className="ml-1 text-green-600">✓</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completed Jobs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Completed Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCompletedJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {job.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {job.description.substring(0, 100)}...
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Company:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{job.company}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Location:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{job.location}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Duration:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{job.duration} weeks</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-900 dark:text-gray-100">Salary:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">
                        ${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}/{job.salary.period}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <ReviewsSection
            userId={selectedUserId}
            userType={selectedUserType}
            showHeader={true}
          />
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Testing Instructions
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>• Click on different users to see their reviews and ratings</p>
            <p>• Notice how reviews show different category ratings for students vs employers</p>
            <p>• Badges are automatically calculated based on review performance</p>
            <p>• The review system supports double-blind reviews (initially hidden)</p>
            <p>• Reviews become visible after both parties submit or after 14 days</p>
          </div>
        </div>
      </div>
    </ReviewSystem>
  );
}

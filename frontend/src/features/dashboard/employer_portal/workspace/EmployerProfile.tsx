"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Building, MapPin, Mail, Phone, Globe, Edit, Save, X, Shield, Eye, EyeOff, Upload, CheckCircle, AlertCircle, Info } from "lucide-react";
import { companyTypes, industries, companySizes } from "@/components/dashboard/Employers/Emplyer_Info_Constant";
import LevelProgressBar from "@/components/common/Level/LevelProgressBar";
import { useLevel } from "@/hooks/useLevel";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import ReviewSystem from "@/components/reviews/ReviewSystem";

interface UnifiedEmployerProfile {
  // Company Information (Public)
  companyName: string;
  companyType: string;
  industry: string;
  companySize: string;
  website: string;
  location: string;
  description: string;
  logo: File | null;
  
  // Personal Information (Private - HR Contact)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  bio: string;
}

const UnifiedEmployerProfile: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gainXP, unlockAchievement } = useLevel();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [isFromRoleSelection, setIsFromRoleSelection] = useState(false);

  const [profileData, setProfileData] = useState<UnifiedEmployerProfile>({
    // Company Information
    companyName: "",
    companyType: "",
    industry: "",
    companySize: "",
    website: "",
    location: "",
    description: "",
    logo: null,
    
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    bio: "",
  });

  // Check if profile is complete
  const isProfileComplete = () => {
    const requiredFields = [
      'companyName', 'companyType', 'industry', 'companySize', 'location',
      'firstName', 'lastName', 'email', 'phone', 'position'
    ];
    return requiredFields.every(field => profileData[field as keyof UnifiedEmployerProfile]);
  };

  // Calculate profile completion percentage
  const getProfileCompletionPercentage = () => {
    const requiredFields = [
      'companyName', 'companyType', 'industry', 'companySize', 'location',
      'firstName', 'lastName', 'email', 'phone', 'position'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = profileData[field as keyof UnifiedEmployerProfile];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Load existing profile data on component mount
  useEffect(() => {
    // Check if user is coming from role selection
    const fromRoleSelection = searchParams.get('fromRoleSelection') === 'true';
    setIsFromRoleSelection(fromRoleSelection);
    
    // If coming from role selection, automatically enable edit mode
    if (fromRoleSelection) {
      setIsEditing(true);
    }

    // TODO: Load existing profile data from API
    const loadProfileData = async () => {
      try {
        // Simulate API call
        const mockData = {
          companyName: "TechCorp Inc.",
          companyType: "startup",
          industry: "technology",
          companySize: "10-50",
          website: "https://techcorp.com",
          location: "San Francisco, CA",
          description: "Innovative tech company focused on AI solutions",
          logo: null,
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@techcorp.com",
          phone: "+1 (555) 123-4567",
          position: "Senior HR Manager",
          bio: "Experienced HR professional with over 8 years in talent acquisition",
        };
        setProfileData(mockData);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfileData();
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfileData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Company Information validation
    if (!profileData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!profileData.companyType) {
      newErrors.companyType = "Company type is required";
    }
    if (!profileData.industry) {
      newErrors.industry = "Industry is required";
    }
    if (!profileData.companySize) {
      newErrors.companySize = "Company size is required";
    }
    if (!profileData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Personal Information validation
    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!profileData.position.trim()) {
      newErrors.position = "Position/Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Save profile data to API
      console.log("Saving unified profile:", profileData);
      
      // Award XP for completing profile
      gainXP(100);
      
      // Unlock profile completion achievement
      unlockAchievement({
        id: "complete_profile",
        title: "Profile Complete",
        description: "Completed your employer profile",
        icon: "✅"
      });

      // If this was the first login and profile is now complete, redirect to dashboard
      if (isProfileComplete()) {
        router.push("/employer_portal/workspace");
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // TODO: Reset form to original data
  };

  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4" />
        {errors[fieldName]}
      </div>
    ) : null;
  };

  const completionPercentage = getProfileCompletionPercentage();

  return (
    <ReviewSystem>
      <div className="min-h-screen bg-gray-50
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200  p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900
                Employer Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your company and personal information
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors   
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Company Level Progress */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 Level</h3>
            <LevelProgressBar />
          </div>

          {/* Profile Completion Progress */}
          {isFromRoleSelection && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200  rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Complete Your Profile
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Please complete your profile to start using the employer portal. This information helps students understand your company and contact you appropriately.
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-700
                    {completionPercentage}% complete ({Math.round((completionPercentage / 100) * 10)} of 10 required fields)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information Section */}
          <div className="bg-white rounded-xl border border-gray-200  p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600 />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900
                  Company Information
                </h2>
                <p className="text-gray-600
                  This information will be visible to students and other users
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700  text-xs rounded-full">
                <Eye className="h-3 w-3" />
                Public
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1 rounded-lg border border-gray-300 p-3  
                    disabled={!isEditing}
                  />
                  {profileData.logo && (
                    <div className="w-16 h-16 relative">
                      <img
                        src={URL.createObjectURL(profileData.logo)}
                        alt="Company Logo Preview"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.companyName 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                />
                {getFieldError('companyName')}
              </div>

              {/* Company Type */}
              <div>
                <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Type *
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={profileData.companyType}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.companyType 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                >
                  <option value="">Select Company Type</option>
                  {companyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {getFieldError('companyType')}
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={profileData.industry}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.industry 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                >
                  <option value="">Select Industry</option>
                  {industries.map(ind => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
                {getFieldError('industry')}
              </div>

              {/* Company Size */}
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size *
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.companySize 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                >
                  <option value="">Select Size</option>
                  {companySizes.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
                {getFieldError('companySize')}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.location 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="City, Country"
                  disabled={!isEditing}
                  required
                />
                {getFieldError('location')}
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={profileData.website}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3   focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://"
                  disabled={!isEditing}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={profileData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-3   focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Briefly describe your company..."
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-xl border border-gray-200  p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600 />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900
                  Personal Information (HR Contact)
                </h2>
                <p className="text-gray-600
                  This information is private and used for platform communication only
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700  text-xs rounded-full">
                <Shield className="h-3 w-3" />
                Private
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200  rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Privacy Notice
                  </h4>
                  <p className="text-sm text-blue-800
                    Your personal information (HR contact details) is private and will NOT be publicly visible. 
                    It is used solely for platform communication such as notifications, support, and interview coordination. 
                    Only company information will be visible to students and other users.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.firstName 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                />
                {getFieldError('firstName')}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.lastName 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                />
                {getFieldError('lastName')}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                />
                {getFieldError('email')}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={!isEditing}
                  required
                />
                {getFieldError('phone')}
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position/Title *
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={profileData.position}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border p-3  ${
                    errors.position 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="e.g., HR Manager, Recruiter"
                  disabled={!isEditing}
                  required
                />
                {getFieldError('position')}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3   focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description about your role and experience..."
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors   
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Reviews Section */}
        <ReviewsSection
          userId="employer-001" // Using mock user ID for testing
          userType="employer"
          showHeader={true}
          className="mt-8"
        />
      </div>
    </div>
    </ReviewSystem>
  );
};

export default UnifiedEmployerProfile;

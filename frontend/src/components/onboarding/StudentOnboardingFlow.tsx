"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  GraduationCap, 
  Target, 
  Calendar,
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Star,
  Trophy,
  Book,
  Briefcase,
  Clock,
  MapPin
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  required: boolean;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  major: string;
  yearOfStudy: string;
  skills: string[];
  interests: string[];
  availability: {
    hoursPerWeek: number;
    preferredStartDate: string;
    flexibleTiming: boolean;
  };
  careerGoals: string;
}

const StudentOnboardingFlow = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: "",
    lastName: "",
    email: "",
    university: "",
    major: "",
    yearOfStudy: "",
    skills: [],
    interests: [],
    availability: {
      hoursPerWeek: 10,
      preferredStartDate: "",
      flexibleTiming: true
    },
    careerGoals: ""
  });

  // Sample data for dropdowns
  const universities = [
    "The University of Hong Kong (HKU)",
    "Hong Kong University of Science and Technology (HKUST)",
    "Chinese University of Hong Kong (CUHK)",
    "City University of Hong Kong (CityU)",
    "Hong Kong Polytechnic University (PolyU)",
    "Hong Kong Baptist University (HKBU)",
    "Lingnan University",
    "The Education University of Hong Kong"
  ];

  const majors = [
    "Computer Science", "Business Administration", "Engineering", "Design",
    "Marketing", "Finance", "Psychology", "Data Science", "Media Studies",
    "International Relations", "Medicine", "Law", "Architecture"
  ];

  const skillOptions = [
    "Python", "JavaScript", "React", "UI/UX Design", "Data Analysis",
    "Digital Marketing", "Project Management", "Graphic Design", "Writing",
    "Social Media", "Excel", "Figma", "Adobe Creative Suite", "SQL"
  ];

  const interestOptions = [
    "Software Development", "Web Development", "Data Science", "AI/Machine Learning",
    "Digital Marketing", "Content Creation", "UI/UX Design", "Business Strategy",
    "Finance", "Consulting", "Healthcare", "Education", "Social Impact"
  ];

  // Step Components
  const BasicInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get to know you!</h2>
        <p className="text-gray-600">Tell us about yourself to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="your.email@university.edu.hk"
        />
      </div>
    </motion.div>
  );

  const EducationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education Details</h2>
        <p className="text-gray-600">Help us match you with relevant opportunities</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
        <select
          value={profile.university}
          onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select your university</option>
          {universities.map((uni) => (
            <option key={uni} value={uni}>{uni}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Major/Program</label>
          <select
            value={profile.major}
            onChange={(e) => setProfile(prev => ({ ...prev, major: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your major</option>
            {majors.map((major) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
          <select
            value={profile.yearOfStudy}
            onChange={(e) => setProfile(prev => ({ ...prev, yearOfStudy: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select year</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Year 5">Year 5</option>
            <option value="Graduate">Graduate Student</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const SkillsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your skills?</h2>
        <p className="text-gray-600">Select the skills you have experience with</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {skillOptions.map((skill) => (
          <button
            key={skill}
            onClick={() => {
              setProfile(prev => ({
                ...prev,
                skills: prev.skills.includes(skill) 
                  ? prev.skills.filter(s => s !== skill)
                  : [...prev.skills, skill]
              }));
            }}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              profile.skills.includes(skill)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Interests</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => {
                setProfile(prev => ({
                  ...prev,
                  interests: prev.interests.includes(interest) 
                    ? prev.interests.filter(i => i !== interest)
                    : [...prev.interests, interest]
                }));
              }}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                profile.interests.includes(interest)
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const AvailabilityStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">When can you work?</h2>
        <p className="text-gray-600">Let us know your availability for micro-internships</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <Clock className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium text-blue-800">Estimated Earnings</span>
        </div>
        <p className="text-blue-700 text-sm">
          Based on {profile.availability.hoursPerWeek} hours/week: <strong>HK${profile.availability.hoursPerWeek * 150} - HK${profile.availability.hoursPerWeek * 250} per month</strong>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hours per week: {profile.availability.hoursPerWeek} hours
        </label>
        <input
          type="range"
          min="5"
          max="40"
          step="5"
          value={profile.availability.hoursPerWeek}
          onChange={(e) => setProfile(prev => ({
            ...prev,
            availability: { ...prev.availability, hoursPerWeek: Number(e.target.value) }
          }))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 hours</span>
          <span>40 hours</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date</label>
        <input
          type="date"
          value={profile.availability.preferredStartDate}
          onChange={(e) => setProfile(prev => ({
            ...prev,
            availability: { ...prev.availability, preferredStartDate: e.target.value }
          }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="flexible"
          checked={profile.availability.flexibleTiming}
          onChange={(e) => setProfile(prev => ({
            ...prev,
            availability: { ...prev.availability, flexibleTiming: e.target.checked }
          }))}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="flexible" className="ml-2 text-sm text-gray-700">
          I have flexible timing and can adapt to project schedules
        </label>
      </div>
    </motion.div>
  );

  const CompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MicroBridge!</h2>
        <p className="text-gray-600 text-lg">Your profile is ready. Let's find your first opportunity!</p>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>Skills added</span>
            <span className="font-medium">{profile.skills.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Interests selected</span>
            <span className="font-medium">{profile.interests.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Weekly availability</span>
            <span className="font-medium">{profile.availability.hoursPerWeek} hours</span>
          </div>
        </div>
      </div>

      {/* Gamification Preview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            <span className="font-medium">Level 1</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            <span>100 CC</span>
          </div>
        </div>
        <p className="text-sm opacity-90">
          You've earned your first 100 Career Coins for completing your profile!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button
          onClick={() => router.push('/student_portal/workspace')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => router.push('/student_portal/workspace/jobs')}
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Browse Jobs
        </button>
      </div>
    </motion.div>
  );

  const steps: OnboardingStep[] = [
    {
      id: "basic-info",
      title: "Basic Information",
      subtitle: "Tell us about yourself",
      icon: <User className="w-6 h-6" />,
      component: <BasicInfoStep />,
      required: true
    },
    {
      id: "education",
      title: "Education",
      subtitle: "Academic background",
      icon: <GraduationCap className="w-6 h-6" />,
      component: <EducationStep />,
      required: true
    },
    {
      id: "skills",
      title: "Skills & Interests",
      subtitle: "What you're good at",
      icon: <Book className="w-6 h-6" />,
      component: <SkillsStep />,
      required: true
    },
    {
      id: "availability",
      title: "Availability",
      subtitle: "When you can work",
      icon: <Calendar className="w-6 h-6" />,
      component: <AvailabilityStep />,
      required: true
    },
    {
      id: "complete",
      title: "Complete",
      subtitle: "You're all set!",
      icon: <CheckCircle className="w-6 h-6" />,
      component: <CompleteStep />,
      required: false
    }
  ];

  const currentStepData = steps[currentStep];
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profile.firstName && profile.lastName && profile.email;
      case 1:
        return profile.university && profile.major && profile.yearOfStudy;
      case 2:
        return profile.skills.length > 0 && profile.interests.length > 0;
      case 3:
        return profile.availability.preferredStartDate;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Profile Setup</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center max-w-[80px]">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <AnimatePresence mode="wait">
            {currentStepData.component}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < steps.length - 1 && (
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentOnboardingFlow;
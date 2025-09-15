"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Info, 
  CheckCircle,
  Star,
  User,
  GraduationCap,
  Target,
  Calendar,
  Settings,
  Lightbulb,
  Lock,
  Unlock
} from "lucide-react";

interface ProgressiveField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'range';
  required: boolean;
  level: 'essential' | 'important' | 'optional' | 'advanced';
  dependsOn?: string[];
  options?: string[];
  placeholder?: string;
  helpText?: string;
  unlockCondition?: string;
  group: string;
}

interface OnboardingGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  level: 'essential' | 'important' | 'optional' | 'advanced';
  unlockCondition?: string;
  fields: ProgressiveField[];
}

const ProgressiveOnboarding = () => {
  const [currentLevel, setCurrentLevel] = useState<'essential' | 'important' | 'optional' | 'advanced'>('essential');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedGroups, setCompletedGroups] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['basic-info']));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHelpFor, setShowHelpFor] = useState<string | null>(null);

  const studentGroups: OnboardingGroup[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      subtitle: 'Essential details to get started',
      icon: <User className="w-5 h-5" />,
      level: 'essential',
      fields: [
        {
          id: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          level: 'essential',
          placeholder: 'Enter your first name',
          group: 'basic-info'
        },
        {
          id: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          level: 'essential',
          placeholder: 'Enter your last name',
          group: 'basic-info'
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'text',
          required: true,
          level: 'essential',
          placeholder: 'your.email@university.edu.hk',
          helpText: 'Use your university email for automatic verification',
          group: 'basic-info'
        }
      ]
    },
    {
      id: 'education',
      title: 'Education Background',
      subtitle: 'Help us match you with relevant opportunities',
      icon: <GraduationCap className="w-5 h-5" />,
      level: 'essential',
      unlockCondition: 'basic-info-complete',
      fields: [
        {
          id: 'university',
          label: 'University',
          type: 'select',
          required: true,
          level: 'essential',
          options: [
            'The University of Hong Kong (HKU)',
            'Hong Kong University of Science and Technology (HKUST)',
            'Chinese University of Hong Kong (CUHK)',
            'City University of Hong Kong (CityU)',
            'Hong Kong Polytechnic University (PolyU)',
            'Hong Kong Baptist University (HKBU)'
          ],
          group: 'education'
        },
        {
          id: 'major',
          label: 'Major/Program',
          type: 'select',
          required: true,
          level: 'essential',
          dependsOn: ['university'],
          options: ['Computer Science', 'Business Administration', 'Engineering', 'Design', 'Marketing'],
          group: 'education'
        },
        {
          id: 'yearOfStudy',
          label: 'Year of Study',
          type: 'select',
          required: true,
          level: 'important',
          options: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate'],
          helpText: 'This helps employers understand your experience level',
          group: 'education'
        },
        {
          id: 'gpa',
          label: 'GPA (Optional)',
          type: 'text',
          required: false,
          level: 'optional',
          placeholder: 'e.g., 3.75',
          helpText: 'You can add this later to strengthen your profile',
          group: 'education'
        }
      ]
    },
    {
      id: 'skills-interests',
      title: 'Skills & Interests',
      subtitle: 'What you can do and want to learn',
      icon: <Target className="w-5 h-5" />,
      level: 'important',
      unlockCondition: 'education-complete',
      fields: [
        {
          id: 'primarySkills',
          label: 'Top 3 Skills',
          type: 'multiselect',
          required: true,
          level: 'important',
          options: ['Python', 'JavaScript', 'Design', 'Writing', 'Marketing', 'Data Analysis'],
          helpText: 'Choose your strongest skills first',
          group: 'skills-interests'
        },
        {
          id: 'interests',
          label: 'Career Interests',
          type: 'multiselect',
          required: true,
          level: 'important',
          options: ['Software Development', 'UI/UX Design', 'Digital Marketing', 'Data Science', 'Business Strategy'],
          helpText: 'What fields interest you most?',
          group: 'skills-interests'
        },
        {
          id: 'additionalSkills',
          label: 'Additional Skills',
          type: 'multiselect',
          required: false,
          level: 'optional',
          dependsOn: ['primarySkills'],
          options: ['Excel', 'Figma', 'SQL', 'Social Media', 'Project Management'],
          helpText: 'Add more skills to expand your opportunities',
          group: 'skills-interests'
        }
      ]
    },
    {
      id: 'availability',
      title: 'Availability',
      subtitle: 'When you can work',
      icon: <Calendar className="w-5 h-5" />,
      level: 'important',
      unlockCondition: 'skills-complete',
      fields: [
        {
          id: 'hoursPerWeek',
          label: 'Hours per Week',
          type: 'range',
          required: true,
          level: 'important',
          helpText: 'This affects your earning potential',
          group: 'availability'
        },
        {
          id: 'startDate',
          label: 'Earliest Start Date',
          type: 'date',
          required: true,
          level: 'important',
          group: 'availability'
        },
        {
          id: 'flexibleTiming',
          label: 'I have flexible timing',
          type: 'checkbox',
          required: false,
          level: 'optional',
          helpText: 'This helps with project scheduling',
          group: 'availability'
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences & Settings',
      subtitle: 'Customize your experience',
      icon: <Settings className="w-5 h-5" />,
      level: 'advanced',
      unlockCondition: 'availability-complete',
      fields: [
        {
          id: 'notifications',
          label: 'Email Notifications',
          type: 'checkbox',
          required: false,
          level: 'advanced',
          helpText: 'Get notified about new opportunities',
          group: 'preferences'
        },
        {
          id: 'profileVisibility',
          label: 'Profile Visibility',
          type: 'select',
          required: false,
          level: 'advanced',
          options: ['Public', 'Private', 'University Only'],
          helpText: 'Control who can see your profile',
          group: 'preferences'
        }
      ]
    }
  ];

  // Check if a group's unlock condition is met
  const isGroupUnlocked = (group: OnboardingGroup) => {
    if (!group.unlockCondition) return true;
    
    switch (group.unlockCondition) {
      case 'basic-info-complete':
        return formData.firstName && formData.lastName && formData.email;
      case 'education-complete':
        return formData.university && formData.major;
      case 'skills-complete':
        return formData.primarySkills && formData.primarySkills.length >= 3;
      case 'availability-complete':
        return formData.hoursPerWeek && formData.startDate;
      default:
        return true;
    }
  };

  // Check if a field should be shown based on dependencies
  const shouldShowField = (field: ProgressiveField) => {
    if (!field.dependsOn) return true;
    return field.dependsOn.every(dep => formData[dep]);
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const essentialFields = studentGroups.flatMap(g => g.fields.filter(f => f.level === 'essential' && f.required));
    const completedEssential = essentialFields.filter(f => formData[f.id]).length;
    return Math.round((completedEssential / essentialFields.length) * 100);
  };

  // Determine what level to show next
  useEffect(() => {
    const completion = getCompletionPercentage();
    if (completion >= 100) {
      if (currentLevel === 'essential') setCurrentLevel('important');
      else if (currentLevel === 'important') setCurrentLevel('optional');
    }
  }, [formData, currentLevel]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getFieldsToShow = (group: OnboardingGroup) => {
    return group.fields.filter(field => {
      if (!shouldShowField(field)) return false;
      
      // Progressive disclosure logic
      if (field.level === 'essential') return true;
      if (field.level === 'important' && currentLevel !== 'essential') return true;
      if (field.level === 'optional' && (currentLevel === 'optional' || currentLevel === 'advanced')) return true;
      if (field.level === 'advanced' && showAdvanced) return true;
      
      return false;
    });
  };

  const renderField = (field: ProgressiveField) => {
    const isCompleted = formData[field.id];
    
    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
            {field.level === 'optional' && (
              <span className="text-gray-400 text-xs ml-2">(Optional)</span>
            )}
            {field.level === 'advanced' && (
              <span className="text-purple-500 text-xs ml-2">(Advanced)</span>
            )}
          </label>
          
          {field.helpText && (
            <button
              onClick={() => setShowHelpFor(showHelpFor === field.id ? null : field.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Help Text */}
        <AnimatePresence>
          {showHelpFor === field.id && field.helpText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            >
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">{field.helpText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Field Input */}
        <div className="relative">
          {field.type === 'text' && (
            <input
              type="text"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}

          {field.type === 'select' && (
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}

          {field.type === 'multiselect' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {field.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const current = formData[field.id] || [];
                      const newValue = current.includes(option)
                        ? current.filter((item: string) => item !== option)
                        : [...current, option];
                      handleFieldChange(field.id, newValue);
                    }}
                    className={`p-2 text-sm rounded-lg border-2 transition-all ${
                      (formData[field.id] || []).includes(option)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {field.id === 'primarySkills' && (
                <p className="text-xs text-gray-500">
                  Selected: {(formData[field.id] || []).length}/3
                </p>
              )}
            </div>
          )}

          {field.type === 'range' && (
            <div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={formData[field.id] || 15}
                onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 hours</span>
                <span className="font-medium">{formData[field.id] || 15} hours</span>
                <span>40 hours</span>
              </div>
            </div>
          )}

          {field.type === 'date' && (
            <input
              type="date"
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}

          {field.type === 'checkbox' && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData[field.id] || false}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{field.label}</span>
            </label>
          )}

          {/* Completion Indicator */}
          {isCompleted && (
            <div className="absolute -right-2 -top-2">
              <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{getCompletionPercentage()}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getCompletionPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Level Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Detail Level:</span>
          <div className="flex space-x-2">
            {(['essential', 'important', 'optional'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setCurrentLevel(level)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showAdvanced
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showAdvanced ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {studentGroups.map((group) => {
          const isUnlocked = isGroupUnlocked(group);
          const isExpanded = expandedGroups.has(group.id);
          const fieldsToShow = getFieldsToShow(group);
          const groupCompletion = group.fields.filter(f => formData[f.id] && f.required).length;
          const groupRequired = group.fields.filter(f => f.required).length;

          if (!isUnlocked) return null;

          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroupExpansion(group.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      groupCompletion === groupRequired ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <div className={groupCompletion === groupRequired ? 'text-green-600' : 'text-blue-600'}>
                        {group.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{group.title}</h3>
                      <p className="text-sm text-gray-600">{group.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {groupCompletion === groupRequired && groupRequired > 0 && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-sm text-gray-500">
                      {groupCompletion}/{groupRequired}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </button>

              {/* Group Fields */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6 space-y-6">
                      {fieldsToShow.map(renderField)}
                      
                      {/* Show unlock message for hidden fields */}
                      {group.fields.length > fieldsToShow.length && (
                        <div className="text-center py-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500 mb-2">
                            {group.fields.length - fieldsToShow.length} more fields available
                          </p>
                          <button
                            onClick={() => {
                              if (currentLevel === 'essential') setCurrentLevel('important');
                              else if (currentLevel === 'important') setCurrentLevel('optional');
                              else setShowAdvanced(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Show more options
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Profile Strength:</span>
            <div className="font-medium text-blue-900">
              {getCompletionPercentage() >= 80 ? 'Strong' : 
               getCompletionPercentage() >= 60 ? 'Good' : 
               getCompletionPercentage() >= 40 ? 'Fair' : 'Needs Work'}
            </div>
          </div>
          <div>
            <span className="text-blue-700">Completed Sections:</span>
            <div className="font-medium text-blue-900">
              {completedGroups.size}/{studentGroups.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveOnboarding;
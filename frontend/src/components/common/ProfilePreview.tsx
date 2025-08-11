import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit3, User, Mail, MapPin, Calendar, Briefcase, Award, ExternalLink } from 'lucide-react';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  location?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  profilePicture?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface ProfilePreviewProps {
  profileData: ProfileData;
  isVisible: boolean;
  onClose: () => void;
  onEdit: () => void;
  className?: string;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profileData,
  isVisible,
  onClose,
  onEdit,
  className = '',
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const ProfileContent = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt={profileData.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white/80" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-blue-100 flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{profileData.email}</span>
            </p>
            {profileData.location && (
              <p className="text-blue-100 flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{profileData.location}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Bio */}
        {profileData.bio && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {profileData.bio}
            </p>
          </div>
        )}

        {/* Experience */}
        {profileData.experience && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Experience</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {profileData.experience}
            </p>
          </div>
        )}

        {/* Education */}
        {profileData.education && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Education</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {profileData.education}
            </p>
          </div>
        )}

        {/* Skills */}
        {profileData.skills && profileData.skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(profileData.linkedin || profileData.github || profileData.portfolio) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Links
            </h3>
            <div className="space-y-2">
              {profileData.linkedin && (
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profileData.github && (
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profileData.portfolio && (
                <a
                  href={profileData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isFullScreen) {
    return (
      <Modal
        isOpen={isVisible}
        onClose={onClose}
        size="xl"
        showCloseButton={true}
        closeOnOverlayClick={true}
        className="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Preview
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={onEdit}
                icon={Edit3}
              >
                Edit Profile
              </Button>
            </div>
          </div>
          <ProfileContent />
        </div>
      </Modal>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative w-full max-w-2xl">
            <ProfileContent />
            
            {/* Action Bar */}
            <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsFullScreen(true)}
                icon={Eye}
              >
                Full Screen
              </Button>
              <Button
                variant="primary"
                onClick={onEdit}
                icon={Edit3}
              >
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePreview;

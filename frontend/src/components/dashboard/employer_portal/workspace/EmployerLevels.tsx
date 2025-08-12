"use client";

import React from "react";
import { Star, Trophy, Award, TrendingUp, Users, Briefcase } from "lucide-react";

const EmployerLevels: React.FC = () => {
  const currentLevel = 5;
  const currentXP = 1250;
  const nextLevelXP = 2000;
  const progress = (currentXP / nextLevelXP) * 100;

  const achievements = [
    {
      id: 1,
      title: "First Job Posted",
      description: "Successfully posted your first job listing",
      icon: <Briefcase className="h-6 w-6" />,
      completed: true,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Hiring Champion",
      description: "Hired 5 candidates through the platform",
      icon: <Users className="h-6 w-6" />,
      completed: true,
      date: "2024-01-20"
    },
    {
      id: 3,
      title: "Active Recruiter",
      description: "Posted 10 job listings",
      icon: <TrendingUp className="h-6 w-6" />,
      completed: false,
      progress: 7
    },
    {
      id: 4,
      title: "Top Employer",
      description: "Achieve a 4.5+ rating from candidates",
      icon: <Star className="h-6 w-6" />,
      completed: false,
      progress: 4.2
    }
  ];

  const levelBenefits = [
    "Priority support",
    "Advanced analytics",
    "Featured job listings",
    "Direct messaging with candidates",
    "Custom branding options"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Level System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and unlock new features
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Level Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <span className="text-white font-bold text-sm">{currentLevel}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Level {currentLevel}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Experienced Recruiter
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentXP} / {nextLevelXP} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {nextLevelXP - currentXP} XP needed for next level
                </p>
              </div>
            </div>
          </div>

          {/* Level Benefits */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Level Benefits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {levelBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                      <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Achievements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.completed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      achievement.completed
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <div className={achievement.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                        {achievement.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.completed ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-white'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      
                      {achievement.completed ? (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <Star className="h-4 w-4 mr-1" />
                          Completed {achievement.date}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {achievement.progress && (
                            <>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${(achievement.progress / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span>{achievement.progress}/10</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Progression */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Level Progression
            </h3>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <div
                  key={level}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    level === currentLevel
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                      : level < currentLevel
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      level === currentLevel
                        ? 'bg-blue-600 text-white'
                        : level < currentLevel
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {level < currentLevel ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">{level}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        level === currentLevel
                          ? 'text-blue-900 dark:text-blue-100'
                          : level < currentLevel
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        Level {level}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level === 1 && "New Recruiter"}
                        {level === 2 && "Active Recruiter"}
                        {level === 3 && "Experienced Recruiter"}
                        {level === 4 && "Senior Recruiter"}
                        {level === 5 && "Hiring Manager"}
                        {level === 6 && "Talent Director"}
                        {level === 7 && "HR Executive"}
                        {level === 8 && "Recruitment Expert"}
                        {level === 9 && "Talent Strategist"}
                        {level === 10 && "Hiring Legend"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {level * 400} XP
                    </div>
                    {level === currentLevel && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Current Level
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLevels;

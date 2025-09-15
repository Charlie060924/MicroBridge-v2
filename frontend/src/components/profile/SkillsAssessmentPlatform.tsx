"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Zap,
  Award,
  BarChart3,
  BookOpen,
  Clock,
  Users,
  Lightbulb,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Download
} from "lucide-react";
import { SKILL_CATEGORIES } from "../../app/student_portal/workspace/settings/utils/studentConstants";

interface Skill {
  value: string;
  label: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpValue: number;
  lastAssessed: string;
  confidence: number;
  projectsUsed: number;
  marketDemand: 'low' | 'medium' | 'high' | 'very_high';
}

interface Assessment {
  id: string;
  skillId: string;
  questions: AssessmentQuestion[];
  currentQuestion: number;
  score: number;
  timeSpent: number;
  completed: boolean;
  result?: AssessmentResult;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'code_review' | 'scenario' | 'practical';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

interface AssessmentResult {
  score: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  xpEarned: number;
  nextLevel: string;
}

const SkillsAssessmentPlatform = () => {
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [assessmentTimer, setAssessmentTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sample skill assessments data
  const skillAssessments = {
    'react': {
      questions: [
        {
          id: '1',
          question: 'What is the purpose of the useEffect hook in React?',
          type: 'multiple_choice' as const,
          options: [
            'To manage component state',
            'To perform side effects in functional components',
            'To create reusable components',
            'To handle user events'
          ],
          correctAnswer: 'To perform side effects in functional components',
          explanation: 'useEffect is used to perform side effects like API calls, subscriptions, or manually changing the DOM.',
          difficulty: 'medium' as const,
          timeLimit: 60
        },
        {
          id: '2',
          question: 'When would you use React.memo?',
          type: 'multiple_choice' as const,
          options: [
            'To memoize expensive calculations',
            'To prevent unnecessary re-renders of components',
            'To cache API responses',
            'To store form data'
          ],
          correctAnswer: 'To prevent unnecessary re-renders of components',
          explanation: 'React.memo is a higher-order component that prevents re-renders when props haven\'t changed.',
          difficulty: 'medium' as const,
          timeLimit: 60
        }
      ]
    },
    'python': {
      questions: [
        {
          id: '1',
          question: 'What is the output of: print([1, 2, 3] * 2)?',
          type: 'multiple_choice' as const,
          options: [
            '[1, 2, 3, 1, 2, 3]',
            '[2, 4, 6]',
            'Error',
            '[1, 2, 3] * 2'
          ],
          correctAnswer: '[1, 2, 3, 1, 2, 3]',
          explanation: 'The * operator with lists creates a new list by repeating the original list.',
          difficulty: 'easy' as const,
          timeLimit: 45
        }
      ]
    }
  };

  // Initialize user skills from SKILL_CATEGORIES
  useEffect(() => {
    const initialSkills: Skill[] = [];
    SKILL_CATEGORIES.forEach(category => {
      category.skills.forEach(skill => {
        initialSkills.push({
          value: skill.value,
          label: skill.label,
          category: category.category,
          proficiency: 'beginner',
          xpValue: 0,
          lastAssessed: '',
          confidence: 0,
          projectsUsed: 0,
          marketDemand: getMarketDemand(skill.value)
        });
      });
    });
    setUserSkills(initialSkills);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && currentAssessment) {
      interval = setInterval(() => {
        setAssessmentTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentAssessment]);

  const getMarketDemand = (skillValue: string): 'low' | 'medium' | 'high' | 'very_high' => {
    const highDemand = ['react', 'python', 'javascript', 'typescript', 'nodejs', 'sql'];
    const veryHighDemand = ['python', 'react', 'javascript'];
    
    if (veryHighDemand.includes(skillValue)) return 'very_high';
    if (highDemand.includes(skillValue)) return 'high';
    return 'medium';
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'very_high': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'expert': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'advanced': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'intermediate': return 'bg-green-100 text-green-700 border-green-200';
      case 'beginner': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const startAssessment = (skillValue: string) => {
    const skill = userSkills.find(s => s.value === skillValue);
    if (!skill) return;

    const questions = skillAssessments[skillValue as keyof typeof skillAssessments]?.questions || [];
    
    const newAssessment: Assessment = {
      id: `assessment-${skillValue}-${Date.now()}`,
      skillId: skillValue,
      questions,
      currentQuestion: 0,
      score: 0,
      timeSpent: 0,
      completed: false
    };

    setCurrentAssessment(newAssessment);
    setSelectedSkill(skillValue);
    setAssessmentTimer(0);
    setIsTimerRunning(true);
    setShowResults(false);
  };

  const answerQuestion = (answer: string) => {
    if (!currentAssessment) return;

    const currentQ = currentAssessment.questions[currentAssessment.currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    
    const updatedAssessment = {
      ...currentAssessment,
      score: isCorrect ? currentAssessment.score + 1 : currentAssessment.score,
      currentQuestion: currentAssessment.currentQuestion + 1
    };

    if (updatedAssessment.currentQuestion >= updatedAssessment.questions.length) {
      // Assessment completed
      const finalScore = (updatedAssessment.score / updatedAssessment.questions.length) * 100;
      const proficiency = 
        finalScore >= 90 ? 'expert' :
        finalScore >= 75 ? 'advanced' :
        finalScore >= 60 ? 'intermediate' : 'beginner';

      const result: AssessmentResult = {
        score: finalScore,
        proficiency,
        strengths: getStrengths(finalScore),
        improvements: getImprovements(finalScore),
        recommendations: getRecommendations(selectedSkill, proficiency),
        xpEarned: Math.round(finalScore * 2),
        nextLevel: getNextLevel(proficiency)
      };

      updatedAssessment.result = result;
      updatedAssessment.completed = true;
      updatedAssessment.timeSpent = assessmentTimer;

      // Update user skill
      setUserSkills(prev => prev.map(skill => 
        skill.value === selectedSkill 
          ? { 
              ...skill, 
              proficiency,
              xpValue: skill.xpValue + result.xpEarned,
              lastAssessed: new Date().toISOString(),
              confidence: finalScore
            }
          : skill
      ));

      setIsTimerRunning(false);
      setShowResults(true);
    }

    setCurrentAssessment(updatedAssessment);
  };

  const getStrengths = (score: number): string[] => {
    if (score >= 80) return ['Strong foundational knowledge', 'Good problem-solving skills'];
    if (score >= 60) return ['Basic understanding established'];
    return ['Learning fundamentals'];
  };

  const getImprovements = (score: number): string[] => {
    if (score < 60) return ['Focus on basic concepts', 'Practice more fundamentals'];
    if (score < 80) return ['Work on advanced topics', 'Build more projects'];
    return ['Explore expert-level concepts'];
  };

  const getRecommendations = (skill: string, proficiency: string): string[] => {
    const base = [
      'Complete practice projects',
      'Join study groups',
      'Follow online tutorials'
    ];
    
    if (proficiency === 'advanced' || proficiency === 'expert') {
      base.push('Mentor other students', 'Contribute to open source');
    }
    
    return base;
  };

  const getNextLevel = (current: string): string => {
    switch (current) {
      case 'beginner': return 'intermediate';
      case 'intermediate': return 'advanced';
      case 'advanced': return 'expert';
      case 'expert': return 'master';
      default: return 'intermediate';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categorizedSkills = SKILL_CATEGORIES.map(category => ({
    ...category,
    userSkills: userSkills.filter(skill => skill.category === category.category)
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Skills Assessment Platform</h1>
              <p className="text-gray-600">Assess your skills, track progress, and get personalized recommendations</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {userSkills.filter(s => s.lastAssessed).length}
            </div>
            <div className="text-sm text-gray-500">Skills Assessed</div>
          </div>
        </div>
      </div>

      {/* Assessment Interface */}
      {currentAssessment && !showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {userSkills.find(s => s.value === selectedSkill)?.label} Assessment
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(assessmentTimer)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentAssessment.currentQuestion + 1} of {currentAssessment.questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentAssessment.currentQuestion) / currentAssessment.questions.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Question */}
          {currentAssessment.questions[currentAssessment.currentQuestion] && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                {currentAssessment.questions[currentAssessment.currentQuestion].question}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {currentAssessment.questions[currentAssessment.currentQuestion].options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => answerQuestion(option)}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Difficulty: <span className="capitalize">{currentAssessment.questions[currentAssessment.currentQuestion].difficulty}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Time limit: {currentAssessment.questions[currentAssessment.currentQuestion].timeLimit}s
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Assessment Results */}
      {showResults && currentAssessment?.result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
            <p className="text-gray-600">Here are your results for {userSkills.find(s => s.value === selectedSkill)?.label}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(currentAssessment.result.score)}%
              </div>
              <div className="text-sm text-blue-700">Overall Score</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2 capitalize">
                {currentAssessment.result.proficiency}
              </div>
              <div className="text-sm text-purple-700">Proficiency Level</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                +{currentAssessment.result.xpEarned}
              </div>
              <div className="text-sm text-green-700">XP Earned</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
              <ul className="space-y-2">
                {currentAssessment.result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h3>
              <ul className="space-y-2">
                {currentAssessment.result.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-orange-700">
                    <Lightbulb className="w-4 h-4" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Recommended Next Steps</h3>
            <div className="space-y-2">
              {currentAssessment.result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-blue-700">
                  <ArrowRight className="w-4 h-4" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setCurrentAssessment(null);
                setShowResults(false);
                setSelectedSkill('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      )}

      {/* Skills Grid */}
      {!currentAssessment && (
        <div className="space-y-8">
          {categorizedSkills.map((category) => (
            <div key={category.category} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{category.category}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.userSkills.map((skill) => (
                  <div key={skill.value} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{skill.label}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDemandColor(skill.marketDemand)}`}>
                          {skill.marketDemand} demand
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>XP Earned:</span>
                        <span className="font-medium">{skill.xpValue}</span>
                      </div>
                      {skill.confidence > 0 && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Confidence:</span>
                          <span className="font-medium">{Math.round(skill.confidence)}%</span>
                        </div>
                      )}
                      {skill.lastAssessed && (
                        <div className="text-xs text-gray-500">
                          Last assessed: {new Date(skill.lastAssessed).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => startAssessment(skill.value)}
                      disabled={!skillAssessments[skill.value as keyof typeof skillAssessments]}
                      className="w-full flex items-center justify-center space-x-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>
                        {skill.lastAssessed ? 'Retake Assessment' : 'Take Assessment'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Skills Progress Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {userSkills.filter(s => s.proficiency === 'expert').length}
            </div>
            <div className="text-sm opacity-90">Expert Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {userSkills.reduce((sum, skill) => sum + skill.xpValue, 0)}
            </div>
            <div className="text-sm opacity-90">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {userSkills.filter(s => s.marketDemand === 'very_high' && s.proficiency !== 'beginner').length}
            </div>
            <div className="text-sm opacity-90">High-Demand Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(userSkills.filter(s => s.confidence > 0).reduce((sum, s) => sum + s.confidence, 0) / userSkills.filter(s => s.confidence > 0).length || 0)}%
            </div>
            <div className="text-sm opacity-90">Avg. Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessmentPlatform;
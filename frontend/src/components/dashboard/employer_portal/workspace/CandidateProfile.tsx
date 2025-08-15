"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Mail, 
  Phone, 
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  ExternalLink,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: string;
  location: string;
  matchScore: number;
  avatar?: string;
  education: string;
  availability: string;
  hourlyRate: string;
  lastActive: string;
  email: string;
  phone: string;
  bio: string;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

const CandidateProfile: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCandidate: Candidate = {
      id: candidateId,
      name: "John Doe",
      title: "Frontend Developer",
      skills: ["React", "TypeScript", "CSS", "Node.js", "Next.js", "Tailwind CSS", "GraphQL", "Jest"],
      experience: "3 years",
      location: "Hong Kong",
      matchScore: 95,
      education: "Computer Science, HKU",
      availability: "Full-time",
      hourlyRate: "$25-35",
      lastActive: "2 hours ago",
      email: "john.doe@example.com",
      phone: "+852 9123 4567",
      bio: "Passionate frontend developer with 3 years of experience building modern web applications. Specialized in React ecosystem and TypeScript. I love creating intuitive user experiences and solving complex problems through clean, maintainable code.",
      projects: [
        {
          id: "1",
          title: "E-commerce Platform",
          description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          link: "https://github.com/johndoe/ecommerce"
        },
        {
          id: "2",
          title: "Task Management App",
          description: "Developed a collaborative task management application with real-time updates and team collaboration features.",
          technologies: ["React", "Firebase", "TypeScript", "Tailwind CSS"],
          link: "https://github.com/johndoe/taskmanager"
        }
      ],
      certifications: [
        {
          id: "1",
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          date: "2023"
        },
        {
          id: "2",
          name: "React Developer Certification",
          issuer: "Meta",
          date: "2022"
        }
      ]
    };

    setTimeout(() => {
      setCandidate(mockCandidate);
      setIsLoading(false);
    }, 500);
  }, [candidateId]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Candidate Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The candidate you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {candidate.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {candidate.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              {/* Avatar and Basic Info */}
              <div className="text-center mb-6">
                {candidate.avatar ? (
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {candidate.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {candidate.title}
                </p>
                
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreBg(candidate.matchScore)} ${getMatchScoreColor(candidate.matchScore)}`}>
                  <Star className="h-4 w-4 mr-1" />
                  {candidate.matchScore}% match
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-3" />
                  {candidate.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-3" />
                  {candidate.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-3" />
                  {candidate.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-3" />
                  {candidate.availability}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <GraduationCap className="h-4 w-4 mr-3" />
                  {candidate.education}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Briefcase className="h-4 w-4 mr-3" />
                  {candidate.experience} experience
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-3" />
                  Active {candidate.lastActive}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Download Resume
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'projects', label: 'Projects' },
                    { id: 'certifications', label: 'Certifications' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600 dark:text-green-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        About
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {candidate.bio}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Hourly Rate
                      </h3>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {candidate.hourlyRate}
                      </p>
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Projects
                    </h3>
                    {candidate.projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </h4>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Certifications
                    </h3>
                    {candidate.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {cert.name}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {cert.issuer}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {cert.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;

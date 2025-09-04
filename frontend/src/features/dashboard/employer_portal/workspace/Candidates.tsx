"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  Eye,
  GraduationCap,
  Building,
  Briefcase
} from 'lucide-react';
import { Avatar } from '@/components/common/OptimizedImage';

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
}

const Candidates: React.FC = () => {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [sortBy, setSortBy] = useState('matchScore');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCandidates: Candidate[] = [
      {
        id: "1",
        name: "John Doe",
        title: "Frontend Developer",
        skills: ["React", "TypeScript", "CSS", "Node.js"],
        experience: "3 years",
        location: "Hong Kong",
        matchScore: 95,
        education: "Computer Science, HKU",
        availability: "Full-time",
        hourlyRate: "$25-35",
        lastActive: "2 hours ago"
      },
      {
        id: "2",
        name: "Jane Smith",
        title: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        experience: "2 years",
        location: "Hong Kong",
        matchScore: 88,
        education: "Design, PolyU",
        availability: "Part-time",
        hourlyRate: "$20-30",
        lastActive: "1 day ago"
      },
      {
        id: "3",
        name: "Mike Johnson",
        title: "Backend Developer",
        skills: ["Python", "Django", "PostgreSQL", "AWS"],
        experience: "4 years",
        location: "Hong Kong",
        matchScore: 92,
        education: "Software Engineering, CUHK",
        availability: "Full-time",
        hourlyRate: "$30-40",
        lastActive: "3 hours ago"
      },
      {
        id: "4",
        name: "Sarah Wilson",
        title: "Data Analyst",
        skills: ["Python", "SQL", "Tableau", "Excel"],
        experience: "2 years",
        location: "Hong Kong",
        matchScore: 85,
        education: "Statistics, HKUST",
        availability: "Part-time",
        hourlyRate: "$18-25",
        lastActive: "5 hours ago"
      },
      {
        id: "5",
        name: "Alex Chen",
        title: "Mobile Developer",
        skills: ["React Native", "iOS", "Android", "Firebase"],
        experience: "3 years",
        location: "Hong Kong",
        matchScore: 90,
        education: "Computer Science, CityU",
        availability: "Full-time",
        hourlyRate: "$25-35",
        lastActive: "1 hour ago"
      }
    ];

    setTimeout(() => {
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter and sort candidates
  useEffect(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = !locationFilter || candidate.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesExperience = !experienceFilter || candidate.experience.includes(experienceFilter);
      
      return matchesSearch && matchesLocation && matchesExperience;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return b.matchScore - a.matchScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'lastActive':
          return a.lastActive.localeCompare(b.lastActive);
        default:
          return b.matchScore - a.matchScore;
      }
    });

    setFilteredCandidates(filtered);
  }, [candidates, searchQuery, locationFilter, experienceFilter, sortBy]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600
    if (score >= 80) return 'text-blue-600
    if (score >= 70) return 'text-yellow-600
    return 'text-red-600
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100
    if (score >= 80) return 'bg-blue-100
    if (score >= 70) return 'bg-yellow-100
    return 'bg-red-100
  };

  const handleViewCandidate = (candidateId: string) => {
    router.push(`/employer_portal/workspace/candidates/${candidateId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900
              Candidates
            </h1>
            <p className="text-gray-600
              Browse and connect with talented students
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl border border-gray-200  p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent  
              />
            </div>

            {/* Location Filter */}
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent  
            />

            {/* Experience Filter */}
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent  
            >
              <option value="">All Experience</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4+ years</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent  
            >
              <option value="matchScore">Match Score</option>
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="lastActive">Last Active</option>
            </select>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-xl border border-gray-200 ">
          <div className="p-6 border-b border-gray-200
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900
                Candidates ({filteredCandidates.length})
              </h2>
            </div>
          </div>

          <div className="p-6">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No candidates found
                </h3>
                <p className="text-gray-600
                  {searchQuery || locationFilter || experienceFilter 
                    ? "Try adjusting your filters" 
                    : "Candidates will appear here when they apply to your jobs"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar
                            src={candidate.avatar}
                            alt={candidate.name}
                            size="medium"
                          />
                        </div>

                        {/* Candidate Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900
                              {candidate.name}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreBg(candidate.matchScore)} ${getMatchScoreColor(candidate.matchScore)}`}>
                              {candidate.matchScore}% match
                            </span>
                          </div>

                          <p className="text-gray-600 mb-2">
                            {candidate.title}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {candidate.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {candidate.experience} experience
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {candidate.availability}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {candidate.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700  rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700  rounded text-xs">
                                +{candidate.skills.length - 4} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center text-xs text-gray-500
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {candidate.education} • {candidate.hourlyRate}/hr • Active {candidate.lastActive}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewCandidate(candidate.id)}
                          className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900  hover:bg-gray-100  rounded-lg transition-colors">
                          <Star className="h-4 w-4" />
                        </button>
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
  );
};

export default Candidates;

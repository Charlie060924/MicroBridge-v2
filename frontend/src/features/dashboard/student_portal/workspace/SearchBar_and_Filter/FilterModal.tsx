"use client";

import React, { useState } from "react";
import { X, GraduationCap, Briefcase, Award, DollarSign, Filter } from "lucide-react";
import Modal from "@/components/ui/modal";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
}

export interface Filters {
  occupation: string;
  educationLevel: string;
  difficulty: string;
  workType: string;
  salaryRange: [number, number];
}

const educationLevels = [
  "High School", "Undergraduate", "Graduate", "Postgraduate"
];

const difficulties = ["Easy", "Intermediate", "Hard"];

const workTypes = ["On-site", "Hybrid", "Remote"];

const occupations = [
  "Web Development", "Data Science", "Design", "Marketing", "Writing", "Research"
];

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState<Filters>({
    occupation: "",
    educationLevel: "",
    difficulty: "",
    workType: "",
    salaryRange: [0, 5000],
  });

  const handleClear = () => {
    setFilters({
      occupation: "",
      educationLevel: "",
      difficulty: "",
      workType: "",
      salaryRange: [0, 5000],
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleSalaryChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      salaryRange: [values[0], values[1]] as [number, number],
    }));
  };

  return (
    <>
      {isOpen && (
        <div className="absolute top-0 left-0 right-0 z-50">
          {/* Dropdown modal */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200  max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 hover:text-gray-700 />
                </button>
              </div>

        <div className="space-y-6">
          {/* Occupation */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-gray-500 />
              <h3 className="font-medium">Occupation</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {occupations.map((occ) => (
                <motion.button
                  key={occ}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${filters.occupation === occ
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-300 text-gray-700  hover:border-primary/50"
                    }`}
                  onClick={() => setFilters(prev => ({ ...prev, occupation: occ }))}
                >
                  {occ}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Education Level */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-gray-500 />
              <h3 className="font-medium">Level of Education</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {educationLevels.map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${filters.educationLevel === level
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-300 text-gray-700  hover:border-primary/50"
                    }`}
                  onClick={() => setFilters(prev => ({ ...prev, educationLevel: level }))}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Difficulty */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gray-500 />
              <h3 className="font-medium">Difficulty</h3>
            </div>
            <div className="flex gap-2">
              {difficulties.map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-full border flex-1 text-sm transition-all ${filters.difficulty === level
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-300 text-gray-700  hover:border-primary/50"
                    }`}
                  onClick={() => setFilters(prev => ({ ...prev, difficulty: level }))}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Work Type */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-gray-500 />
              <h3 className="font-medium">Work Type</h3>
            </div>
            <div className="flex gap-2">
              {workTypes.map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-full border flex-1 text-sm transition-all ${filters.workType === type
                    ? "bg-primary text-white border-primary shadow-md"
                    : "border-gray-300 text-gray-700  hover:border-primary/50"
                    }`}
                  onClick={() => setFilters(prev => ({ ...prev, workType: type }))}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Salary Range Slider */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-500 />
              <h3 className="font-medium">
                Salary Range: ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
              </h3>
            </div>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={filters.salaryRange}
              onValueChange={handleSalaryChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$5,000</span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center">
          <motion.button
            onClick={handleClear}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-gray-500 hover:underline text-sm transition-colors"
          >
            Clear All
          </motion.button>
          <motion.button
            onClick={handleApply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            Show Results
          </motion.button>
        </div>
      </div>
    </div>
  </div>
     )}
   </>
 );
};

export default FilterModal;
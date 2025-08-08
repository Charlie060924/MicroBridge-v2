"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const universities = [
  "University of Hong Kong",
  "The Chinese University of Hong Kong",
  "The Hong Kong University of Science and Technology",
  "City University of Hong Kong",
  "The Hong Kong Polytechnic University",
  "Hong Kong Baptist University",
  "The Education University of Hong Kong",
  "Lingnan University",
  "Hong Kong Metropolitan University",
  "The Hang Seng University of Hong Kong",
  "Other",
];

const majors = [
  "Computer Science",
  "Engineering",
  "Business",
  "Arts",
  "Other",
];

const levels = [
  "Undergraduate", 
  "Postgraduate",
  "PhD",
  "Other",
];

const occupations = [
  "Software Developer",
  "Data Analyist",
  "Product Manager",
  "Researcher",
  "Other",
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
];

const StudentInfoForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    level: "", // Changed from 'name' to 'level'
    university: "",
    major: "",
    occupation: "",
    industry: "",
    resume: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Narrow type to HTMLInputElement and check if it's a file input
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "file" &&
      e.target.files
    ) {
      setFormData({ ...formData, resume: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Upload to backend
    console.log("Submitted:", formData);

    router.push("/student_portal/workspace"); // or next step
  };

  return (
    <section className="pb-20 pt-32 lg:pt-40 xl:pt-44">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-10 text-3xl font-semibold text-black dark:text-white text-center">
          Get Personal recommendations based on your background
        </h2>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Education Section */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Education
            </h3>
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              {/* Replaced 'Full Name' input with 'Select Education Level' select dropdown */}
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="flex-1 rounded border border-stroke p-3 dark:bg-black dark:text-white"
                required
              >
                <option value="" disabled>
                  Select Education Level
                </option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="flex-1 rounded border border-stroke p-3 dark:bg-black dark:text-white"
                required
              >
                <option value="" disabled>
                  Select University
                </option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>

              <select
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="flex-1 rounded border border-stroke p-3 dark:bg-black dark:text-white"
                required
              >
                <option value="" disabled>
                  Select Major
                </option>
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Career Goal Section */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Career Goal
            </h3>
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="flex-1 rounded border border-stroke p-3 dark:bg-black dark:text-white"
                required
              >
                <option value="" disabled>
                  Select Occupation
                </option>
                {occupations.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>

              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="flex-1 rounded border border-stroke p-3 dark:bg-black dark:text-white"
                required
              >
                <option value="" disabled>
                  Select Industry
                </option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label
              htmlFor="resume"
              className="mb-2 block text-sm font-medium text-black dark:text-white"
            >
              Upload Resume (PDF only)
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
              className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-opacity-90 dark:bg-btndark"
          >
            Submit Info
          </button>
        </form>
      </div>
    </section>
  );
};

export default StudentInfoForm;
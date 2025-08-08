"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Retail",
  "Hospitality",
  "Other"
];

const companyTypes = [
  "Startup",
  "SME",
  "Enterprise",
  "Non-profit",
  "Government",
  "Educational Institution",
  "Other"
];

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees"
];

const hiringFrequencies = [
  "Occasionally (1-2 interns/project)",
  "Regularly (3-5 interns/project)",
  "Frequently (6+ interns/project)"
];

export default function EmployerInfoForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    industry: "",
    companySize: "",
    hiringFrequency: "",
    website: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    router.push("/employer/dashboard");
  };

  return (
    <section className="pb-20 pt-32 lg:pt-40 xl:pt-44">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-10 text-center text-3xl font-semibold text-black dark:text-white">
          Tell us about your company
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Basic Info */}
          <div className="space-y-6">
            <div>
              <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-black dark:text-white">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="companyType" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Company Type
                </label>
                <select
                  id="companyType"
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                  required
                >
                  <option value="" disabled>Select Company Type</option>
                  {companyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="industry" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                  required
                >
                  <option value="" disabled>Select Industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="companySize" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Company Size
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                  required
                >
                  <option value="" disabled>Select Size</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="hiringFrequency" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Intern Hiring Frequency
                </label>
                <select
                  id="hiringFrequency"
                  name="hiringFrequency"
                  value={formData.hiringFrequency}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                  required
                >
                  <option value="" disabled>Select Frequency</option>
                  {hiringFrequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-6">
            <div>
              <label htmlFor="website" className="mb-2 block text-sm font-medium text-black dark:text-white">
                Company Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                placeholder="https://"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-black dark:text-white">
                Company Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded border border-stroke p-3 dark:bg-black dark:text-white"
                placeholder="Briefly describe your company..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-opacity-90 dark:bg-btndark"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </section>
  );
} 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { companyTypes, industries, companySizes } from "./Emplyer_Info_Constant";
import LevelProgressBar from "@/components/common/Level/LevelProgressBar";
import { useLevel } from "@/hooks/useLevel";
import { User, ArrowLeft } from "lucide-react";

export default function EmployerInfoForm() {
  const router = useRouter();
  const { gainXP, unlockAchievement } = useLevel();
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    industry: "",
    companySize: "",
    website: "",
    location: "",
    description: "",
    logo: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Employer Info:", formData);
    
    // Award XP for completing company profile
    gainXP(75);
    
    // Unlock company profile achievement
    unlockAchievement({
      id: "company_profile",
      title: "Company Creator",
      description: "Set up your company profile",
      icon: "🏢"
    });
    
    router.push("/employer_portal/workspace/profile?fromRoleSelection=true");
  };

  return (
    <div className="min-h-screen bg-gray-50
      <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-md rounded-xl p-8">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/employer_portal/workspace/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500    transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </Link>
            </div>
            <Link
              href="/employer_portal/workspace/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500    transition-colors duration-200"
            >
              <User className="w-4 h-4" />
              Personal Profile
            </Link>
          </div>
          
          <h2 className="mb-10 text-center text-3xl font-semibold text-black
            Company Profile Information
          </h2>

        {/* Company Level Progress */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-black Level</h3>
          <LevelProgressBar />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full rounded border border-stroke p-3 "
            />
            {formData.logo && (
              <div className="mt-4 w-20 h-20 relative">
                <Image
                  src={URL.createObjectURL(formData.logo)}
                  alt="Company Logo Preview"
                  fill
                  className="object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-black
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full rounded border border-stroke p-3 "
              required
            />
          </div>
        

          {/* Dropdowns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="companyType" className="mb-2 block text-sm font-medium text-black
                Company Type
              </label>
              <select
                id="companyType"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className="w-full rounded border border-stroke p-3 "
                required
              >
                <option value="" disabled>Select Company Type</option>
                {companyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="industry" className="mb-2 block text-sm font-medium text-black
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded border border-stroke p-3 "
                required
              >
                <option value="" disabled>Select Industry</option>
                {industries.map(ind => (
                  <option key={ind.value} value={ind.value}>{ind.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Company Size & Location */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="companySize" className="mb-2 block text-sm font-medium text-black
                Company Size
              </label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full rounded border border-stroke p-3 "
                required
              >
                <option value="" disabled>Select Size</option>
                {companySizes.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-black
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded border border-stroke p-3 "
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="mb-2 block text-sm font-medium text-black
              Company Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded border border-stroke p-3 "
              placeholder="https://"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-black
              Company Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded border border-stroke p-3 "
              placeholder="Briefly describe your company..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Save Company Profile
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}


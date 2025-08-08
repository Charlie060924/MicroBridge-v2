"use client";

import React, { useCallback, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiEdit2,
  FiBook,
  FiBriefcase,
  FiCode,
  FiClock,
  FiDollarSign,
  FiUpload,
} from "react-icons/fi";
import {
  educationLevels,
  academicMajors,
  careerGoals,
  industries,
  technicalSkills,
  proficiencyLevels,
  availabilityOptions,
  durationOptions,
  paymentTypes,
  projectSalaryRanges,
  currencies,
} from "./Student_Info_Constant";

type FormData = {
  // Basic Info
  firstName: string;
  lastName: string;
  preferredName: string;
  username: string;
  email: string;

  // Education
  educationLevel: string;
  major: string;

  // Career
  careerGoal: string;
  industry: string;

  // Skills
  skills: Array<{
    skill: string;
    proficiency: number;
  }>;

  // Availability
  availability: string;
  projectDuration: string;

  // Compensation
  paymentType: string;
  salaryRange?: string;
  customAmount?: string;
  flexibleNegotiation: boolean;
  currency: string;

  // Resume
  resume: File | null;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  preferredName: "",
  username: "",
  email: "",
  educationLevel: "",
  major: "",
  careerGoal: "",
  industry: "",
  skills: [],
  availability: "",
  projectDuration: "",
  paymentType: "",
  salaryRange: undefined,
  customAmount: undefined,
  flexibleNegotiation: false,
  currency: "HKD",
  resume: null,
};

type Action =
  | { type: "SET_FIELD"; field: keyof FormData; value: any }
  | { type: "SET_RESUME"; file: File | null }
  | { type: "ADD_SKILL"; skill: { skill: string; proficiency: number } }
  | { type: "REMOVE_SKILL"; skill: string }
  | { type: "RESET" }
  | { type: "SET_PAYMENT_TYPE"; paymentType: string }
  | { type: "SET_SALARY_RANGE"; value?: string };

function reducer(state: FormData, action: Action): FormData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_RESUME":
      return { ...state, resume: action.file };
    case "ADD_SKILL":
      // prevent duplicates
      if (state.skills.some((s) => s.skill === action.skill.skill)) return state;
      return { ...state, skills: [...state.skills, action.skill] };
    case "REMOVE_SKILL":
      return {
        ...state,
        skills: state.skills.filter((s) => s.skill !== action.skill),
      };
    case "SET_PAYMENT_TYPE":
      return {
        ...state,
        paymentType: action.paymentType,
        // clear salaryRange/custom amount if not project_based
        salaryRange: action.paymentType === "project_based" ? state.salaryRange : undefined,
        customAmount: action.paymentType === "project_based" ? state.customAmount : undefined,
      };
    case "SET_SALARY_RANGE":
      return {
        ...state,
        salaryRange: action.value,
        customAmount: action.value === "custom" ? state.customAmount : undefined,
      };
    case "RESET":
      return initialFormData;
    default:
      return state;
  }
}

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between mb-2 text-sm text-gray-600">
      <span>Step {currentStep} of 7</span>
      <span>
        {[
          "Basic Info",
          "Education",
          "Career",
          "Skills",
          "Availability",
          "Compensation",
          "Resume",
        ][currentStep - 1]}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${(currentStep / 7) * 100}%` }}
      ></div>
    </div>
  </div>
);

const StudentInfoForm: React.FC = () => {
  const router = useRouter();
  const [formData, dispatch] = useReducer(reducer, initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentSkill, setCurrentSkill] = useState<string>("");
  const [currentProficiency, setCurrentProficiency] = useState<number>(3);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // derive selected skills (no duplicated state)
  const selectedSkills = useMemo(() => formData.skills.map((s) => s.skill), [formData.skills]);

  // Handlers (stable with useCallback)
  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement | HTMLSelectElement;
      if (type === "checkbox") {
        // for checkboxes, value comes from checked
        dispatch({ type: "SET_FIELD", field: name as keyof FormData, value: (checked as any) });
      } else {
        dispatch({ type: "SET_FIELD", field: name as keyof FormData, value });
      }
    },
    []
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    dispatch({ type: "SET_RESUME", file });
  }, []);

  const addSkill = useCallback(() => {
    if (!currentSkill) return;
    if (selectedSkills.includes(currentSkill)) {
      return;
    }
    dispatch({
      type: "ADD_SKILL",
      skill: { skill: currentSkill, proficiency: currentProficiency },
    });
    setCurrentSkill("");
    setCurrentProficiency(3);
  }, [currentSkill, currentProficiency, selectedSkills]);

  const removeSkill = useCallback((skillToRemove: string) => {
    dispatch({ type: "REMOVE_SKILL", skill: skillToRemove });
  }, []);

  const setPaymentType = useCallback((type: string) => {
    dispatch({ type: "SET_PAYMENT_TYPE", paymentType: type });
  }, []);

  const setSalaryRange = useCallback((value?: string) => {
    dispatch({ type: "SET_SALARY_RANGE", value });
  }, []);

  // Validate step reading from the reducer-based formData
  const validateStep = useCallback(
    (step: number) => {
      const newErrors: Record<string, string> = {};
      switch (step) {
        case 1:
          if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
          if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
          if (!formData.preferredName?.trim()) newErrors.preferredName = "Preferred name is required";
          if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
          } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
          }
          break;
        case 2:
          if (!formData.educationLevel) newErrors.educationLevel = "Education level is required";
          if (!formData.major) newErrors.major = "Major is required";
          break;
        case 3:
          if (!formData.careerGoal) newErrors.careerGoal = "Career goal is required";
          if (!formData.industry) newErrors.industry = "Industry is required";
          break;
        case 4:
          if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
          break;
        case 5:
          if (!formData.availability) newErrors.availability = "Availability is required";
          if (!formData.projectDuration) newErrors.projectDuration = "Project duration is required";
          break;
        case 6:
          if (!formData.paymentType) newErrors.paymentType = "Payment type is required";
          if (formData.paymentType === "project_based" && !formData.salaryRange) {
            newErrors.salaryRange = "Salary range is required";
          }
          if (formData.salaryRange === "custom" && !formData.customAmount) {
            newErrors.customAmount = "Custom amount is required";
          }
          break;
      }
      return newErrors;
    },
    [formData]
  );

  // Navigation
  const nextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (currentStep === 1) {
      // generate username predictable now
      const username = `${(formData.preferredName || "").trim().toLowerCase()} ${(formData.lastName || "").trim().toLowerCase()}`;
      dispatch({ type: "SET_FIELD", field: "username", value: username });
    }

    setCurrentStep((prev) => Math.min(prev + 1, 7));
    setErrors({});
  }, [currentStep, formData, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const finalErrors = validateStep(currentStep);
      if (Object.keys(finalErrors).length > 0) {
        setErrors(finalErrors);
        return;
      }

      // Prepare submission data
      const submissionData = {
        basicInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          preferredName: formData.preferredName,
          username: formData.username,
          email: formData.email,
        },
        education: {
          level: formData.educationLevel,
          major: formData.major,
        },
        career: {
          goal: formData.careerGoal,
          industry: formData.industry,
        },
        skills: formData.skills,
        availability: {
          weekly: formData.availability,
          duration: formData.projectDuration,
        },
        compensation: {
          type: formData.paymentType,
          ...(formData.paymentType === "project_based" && {
            range: formData.salaryRange,
            customAmount: formData.customAmount,
            currency: formData.currency,
            negotiable: formData.flexibleNegotiation,
          }),
        },
        resume: formData.resume?.name || null,
      };

      // If you need to upload file: build FormData and call fetch/axios with content-type multipart/form-data
      // Example (uncomment + adapt):
      // const fd = new FormData();
      // fd.append("payload", JSON.stringify(submissionData));
      // if (formData.resume) fd.append("resume", formData.resume);
      // await fetch("/api/student/profile", { method: "POST", body: fd });

      console.log("Submitting:", submissionData);
      // After submit - navigate
      router.push("/student_portal/workspace");
    },
    [formData, currentStep, validateStep, router]
  );

  // Steps JSX (cleaned up to use stable handlers)
  return (
    <section className="pb-20 pt-12 lg:pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-center">Complete Your Profile</h2>

          <ProgressBar currentStep={currentStep} />

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiUser className="text-blue-500" /> Basic Information
                </h3>

                <div className="space-y-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="mr-2 text-gray-500" /> First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFieldChange}
                      placeholder="Enter your first name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="mr-2 text-gray-500" /> Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFieldChange}
                      placeholder="Enter your last name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                  </div>

                  {/* Preferred Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiEdit2 className="mr-2 text-gray-500" /> Preferred Name *
                    </label>
                    <input
                      type="text"
                      name="preferredName"
                      value={formData.preferredName}
                      onChange={handleFieldChange}
                      placeholder="What should we call you?"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.preferredName ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.preferredName && <p className="text-sm text-red-600">{errors.preferredName}</p>}
                    <p className="text-xs text-gray-500">
                    This will be part of your username:{" "}
                    {(formData.preferredName || "").toLowerCase()}
                    {" "} {/* Added space here */}
                    {(formData.lastName || "").toLowerCase()}
                  </p>
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMail className="mr-2 text-gray-500" /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFieldChange}
                      placeholder="your@email.com"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiBook className="text-blue-500" /> Education Background
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiBook className="mr-2 text-gray-500" /> Education Level *
                    </label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleFieldChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.educationLevel ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select your level</option>
                      {educationLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    {errors.educationLevel && <p className="text-sm text-red-600">{errors.educationLevel}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiBook className="mr-2 text-gray-500" /> Major/Field of Study *
                    </label>
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleFieldChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.major ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select your major</option>
                      {academicMajors.map((major) => (
                        <option key={major.value} value={major.value}>
                          {major.label}
                        </option>
                      ))}
                    </select>
                    {errors.major && <p className="text-sm text-red-600">{errors.major}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiBriefcase className="text-blue-500" /> Career Goals
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiBriefcase className="mr-2 text-gray-500" /> Primary Career Goal *
                    </label>
                    <select
                      name="careerGoal"
                      value={formData.careerGoal}
                      onChange={handleFieldChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.careerGoal ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select career goal</option>
                      {careerGoals.map((goal) => (
                        <option key={goal.value} value={goal.value}>
                          {goal.label}
                        </option>
                      ))}
                    </select>
                    {errors.careerGoal && <p className="text-sm text-red-600">{errors.careerGoal}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiBriefcase className="mr-2 text-gray-500" /> Target Industry *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleFieldChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.industry ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry.value} value={industry.value}>
                          {industry.label}
                        </option>
                      ))}
                    </select>
                    {errors.industry && <p className="text-sm text-red-600">{errors.industry}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiCode className="text-blue-500" /> Technical Skills
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <select
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      className="flex-1 rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Select a skill
                      </option>
                      {technicalSkills.map((skill) => (
                        <option key={skill.value} value={skill.value} disabled={selectedSkills.includes(skill.value)}>
                          {skill.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={currentProficiency}
                      onChange={(e) => setCurrentProficiency(Number(e.target.value))}
                      className="w-1/3 rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {proficiencyLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label.split(" ")[0]}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                      disabled={!currentSkill}
                    >
                      Add
                    </button>
                  </div>

                  {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}

                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(({ skill, proficiency }) => {
                      const skillInfo = technicalSkills.find((s) => s.value === skill);
                      const proficiencyInfo = proficiencyLevels.find((p) => p.value === proficiency);

                      return (
                        <div key={skill} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <span>
                            {skillInfo?.label} ({proficiencyInfo?.label.split(" ")[0]})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiClock className="text-blue-500" /> Availability
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiClock className="mr-2 text-gray-500" /> Weekly Availability *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleFieldChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.availability ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select availability</option>
                      {availabilityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.availability && <p className="text-sm text-red-600">{errors.availability}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiClock className="mr-2 text-gray-500" /> Preferred Project Duration *
                    </label>
                    <select
                      name="projectDuration"
                      value={formData.projectDuration}
                      onChange={handleFieldChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.projectDuration ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select duration</option>
                      {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.projectDuration && <p className="text-sm text-red-600">{errors.projectDuration}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6 */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiDollarSign className="text-blue-500" /> Compensation Preferences
                </h3>

                <div className="space-y-8">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <FiDollarSign className="mr-2 text-gray-500" /> Preferred Payment Structure *
                    </label>
                    {errors.paymentType && <p className="text-sm text-red-600 mb-2">{errors.paymentType}</p>}
                    <div className="grid gap-4 md:grid-cols-3">
                      {paymentTypes.map((type) => (
                        <div
                          key={type.value}
                          onClick={() => setPaymentType(type.value)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.paymentType === type.value ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                          }`}
                        >
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project-Based Options */}
                  {formData.paymentType === "project_based" && (
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FiDollarSign className="mr-2 text-gray-500" /> Expected Project Fee Range *
                        </label>
                        <select
                          name="salaryRange"
                          value={formData.salaryRange ?? ""}
                          onChange={(e) => setSalaryRange(e.target.value || undefined)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.salaryRange ? "border-red-500" : "border-gray-300"
                          }`}
                          required
                        >
                          <option value="" disabled>
                            Select range
                          </option>
                          {projectSalaryRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                        {errors.salaryRange && <p className="text-sm text-red-600">{errors.salaryRange}</p>}
                      </div>

                      {formData.salaryRange === "custom" && (
                        <div>
                          <label className="block mb-2 text-sm font-medium">Custom Amount *</label>
                          <div className="flex items-center gap-2">
                            <select
                              value={formData.currency}
                              onChange={(e) => dispatch({ type: "SET_FIELD", field: "currency", value: e.target.value })}
                              className="w-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {currencies.map((curr) => (
                                <option key={curr.value} value={curr.value}>
                                  {curr.value}
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              name="customAmount"
                              value={formData.customAmount ?? ""}
                              onChange={handleFieldChange}
                              placeholder="Enter amount"
                              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          {errors.customAmount && <p className="text-sm text-red-600">{errors.customAmount}</p>}
                        </div>
                      )}

                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id="flexibleNegotiation"
                          name="flexibleNegotiation"
                          checked={formData.flexibleNegotiation}
                          onChange={handleFieldChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="flexibleNegotiation" className="ml-2 text-sm">
                          Open to negotiation based on project scope
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Unpaid Notice */}
                  {formData.paymentType === "unpaid" && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-800">Learning Opportunity</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        You'll be matched with non-profit and educational projects offering valuable experience
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7 */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <FiUpload className="text-blue-500" /> Upload Your Resume
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <FiUpload className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>

                  <input type="file" id="resume" name="resume" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="resume" className="inline-block mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    Select File
                  </label>

                  {formData.resume && <p className="mt-2 text-sm text-green-600">{formData.resume.name} selected</p>}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button type="button" onClick={prevStep} className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 7 ? (
                <button type="button" onClick={nextStep} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Next
                </button>
              ) : (
                <button type="submit" className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                  Submit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default StudentInfoForm;

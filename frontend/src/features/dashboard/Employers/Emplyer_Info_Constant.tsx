export const companyTypes = [
  { value: "startup", label: "Startup" },
  { value: "sme", label: "Small/Medium Business" },
  { value: "corporate", label: "Corporation" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "education", label: "School/University" },
  { value: "other", label: "Other" }
] as const;

export const industries = [
  { value: "tech", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" }
] as const;

export const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201+", label: "201+ employees" }
] as const;
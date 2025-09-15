'use client';
import React from 'react';
import { Lightbulb } from 'lucide-react';

export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  tags: string[];
}

export const COVER_LETTER_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: 'technical-focused',
    name: 'Technical Focus',
    description: 'Emphasizes technical skills and project experience',
    template: `Dear {{company}} Team,

I am excited to apply for the {{position}} role. With my background in {{relevant_skills}}, I am confident I can contribute significantly to your project.

In my recent work, I have:
• {{achievement_1}}
• {{achievement_2}}
• {{achievement_3}}

I am particularly drawn to this opportunity because {{why_interested}}. My experience with {{specific_tech}} aligns well with your requirements, and I am eager to bring my skills in {{key_skills}} to help achieve your project goals.

I have attached my portfolio showcasing relevant projects, including {{portfolio_highlight}}. I would welcome the opportunity to discuss how my technical expertise can benefit your team.

Thank you for your consideration.

Best regards,
{{applicant_name}}`,
    tags: ['technical', 'developer', 'engineering']
  },
  {
    id: 'business-focused',
    name: 'Business Impact',
    description: 'Highlights business value and problem-solving approach',
    template: `Dear {{company}} Team,

I am writing to express my strong interest in the {{position}} opportunity. Having reviewed your project requirements, I believe my experience in {{relevant_area}} makes me an ideal candidate to help achieve your business objectives.

My approach to this project would involve:
1. {{approach_step_1}}
2. {{approach_step_2}}
3. {{approach_step_3}}

In previous projects, I have successfully {{business_achievement}}, resulting in {{quantifiable_result}}. I understand that {{business_challenge}}, and I am excited to apply my expertise in {{solution_area}} to address these challenges.

What sets me apart is my ability to {{unique_value_proposition}}. I am committed to delivering high-quality results within your timeline and budget constraints.

I would love to discuss how I can contribute to your project's success. Thank you for considering my application.

Sincerely,
{{applicant_name}}`,
    tags: ['business', 'strategy', 'consulting']
  },
  {
    id: 'creative-focused',
    name: 'Creative & Design',
    description: 'Perfect for design and creative roles',
    template: `Hello {{company}} Team,

I am thrilled to apply for the {{position}} role. As a creative professional with expertise in {{creative_skills}}, I am excited about the opportunity to bring fresh ideas and innovative solutions to your project.

My creative process involves:
• Understanding the target audience and brand vision
• Developing concepts that balance creativity with functionality
• Iterating based on feedback to achieve optimal results

Recent projects have allowed me to {{creative_achievement}}, and I am particularly proud of {{portfolio_highlight}} which demonstrates my ability to {{key_creative_skill}}.

I am drawn to this project because {{creative_motivation}}. I believe my unique perspective on {{design_philosophy}} would add significant value to your team.

I have curated a selection of my best work that directly relates to your needs. I would be delighted to walk you through my portfolio and discuss how my creative vision aligns with your project goals.

Thank you for your time and consideration.

Best wishes,
{{applicant_name}}`,
    tags: ['design', 'creative', 'art', 'marketing']
  }
];

interface TemplateSelectionStepProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  jobCategory?: string;
  jobTitle?: string;
}

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  selectedTemplate,
  onTemplateSelect,
  jobCategory = '',
  jobTitle = ''
}) => {
  const getRecommendedTemplate = (): string => {
    const category = jobCategory.toLowerCase();
    const title = jobTitle.toLowerCase();
    
    if (category.includes('design') || title.includes('design') || title.includes('creative')) {
      return 'creative-focused';
    } else if (category.includes('business') || title.includes('analyst') || title.includes('consultant')) {
      return 'business-focused';
    } else {
      return 'technical-focused';
    }
  };

  const recommendedTemplateId = getRecommendedTemplate();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Choose a Cover Letter Template
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select a template that best matches this opportunity
        </p>
      </div>
      
      <div className="grid gap-4">
        {COVER_LETTER_TEMPLATES.map(template => {
          const isRecommended = template.id === recommendedTemplateId;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'
                }`} />
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
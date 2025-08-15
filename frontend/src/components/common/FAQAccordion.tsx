"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  defaultExpanded?: string[];
}

export default function FAQAccordion({ 
  items, 
  className = "", 
  defaultExpanded = [] 
}: FAQAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
        >
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-expanded={expandedItems.has(item.id)}
            aria-controls={`faq-${item.id}`}
          >
            <h3 className="font-medium text-gray-900 dark:text-white pr-4">
              {item.question}
            </h3>
            <div className={`transform transition-transform duration-200 flex-shrink-0 ${
              expandedItems.has(item.id) ? 'rotate-180' : ''
            }`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </button>
          {expandedItems.has(item.id) && (
            <div 
              id={`faq-${item.id}`}
              className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700"
            >
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pt-4">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
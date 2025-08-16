"use client";
import { usePathname } from 'next/navigation';
import PricingSection from '@/components/pricing/PricingSection';

const Pricing = () => {
  const pathname = usePathname();
  
  // Determine variant based on the current page
  const getVariant = () => {
    // More specific matching to ensure student portal only shows student pricing
    if (pathname === '/student' || pathname?.startsWith('/student_portal') || pathname?.includes('/student')) {
      return 'student';
    } else if (pathname === '/employer' || pathname?.startsWith('/employer_portal') || pathname?.includes('/employer')) {
      return 'employer';
    }
    return 'general';
  };

  return <PricingSection variant={getVariant()} />;
};

export default Pricing;

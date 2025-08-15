import { useRouter } from 'next/navigation';
import { paymentService } from '@/services/paymentService';

interface PaymentNavigationProps {
  className?: string;
}

/**
 * Utility component that provides methods to navigate to the unified payment page
 * for different payment scenarios
 */
export const PaymentNavigation: React.FC<PaymentNavigationProps> = ({ className }) => {
  const router = useRouter();

  /**
   * Navigate to salary payment page
   */
  const navigateToSalaryPayment = (params: {
    candidateName: string;
    jobTitle: string;
    startDate: string;
    duration: string;
    amount: number;
  }) => {
    const url = paymentService.formatPaymentUrl('salary', {
      candidateName: params.candidateName,
      jobTitle: params.jobTitle,
      startDate: params.startDate,
      duration: params.duration,
      amount: params.amount.toString()
    });
    
    router.push(url);
  };

  /**
   * Navigate to subscription payment page
   */
  const navigateToSubscriptionPayment = (params: {
    planName: string;
    planDuration: string;
    amount: number;
  }) => {
    const url = paymentService.formatPaymentUrl('subscription', {
      planName: params.planName,
      planDuration: params.planDuration,
      amount: params.amount.toString()
    });
    
    router.push(url);
  };

  return {
    navigateToSalaryPayment,
    navigateToSubscriptionPayment
  };
};

/**
 * Hook for payment navigation
 */
export const usePaymentNavigation = () => {
  const router = useRouter();

  const navigateToSalaryPayment = (params: {
    candidateName: string;
    jobTitle: string;
    startDate: string;
    duration: string;
    amount: number;
  }) => {
    const url = paymentService.formatPaymentUrl('salary', {
      candidateName: params.candidateName,
      jobTitle: params.jobTitle,
      startDate: params.startDate,
      duration: params.duration,
      amount: params.amount.toString()
    });
    
    router.push(url);
  };

  const navigateToSubscriptionPayment = (params: {
    planName: string;
    planDuration: string;
    amount: number;
  }) => {
    const url = paymentService.formatPaymentUrl('subscription', {
      planName: params.planName,
      planDuration: params.planDuration,
      amount: params.amount.toString()
    });
    
    router.push(url);
  };

  return {
    navigateToSalaryPayment,
    navigateToSubscriptionPayment
  };
};

export default PaymentNavigation;

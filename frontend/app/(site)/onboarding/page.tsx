import RoleSelection from "@/components/dashboard/onboarding/RoleSelection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started - MicroBridge",
  description: "Choose your role to begin the onboarding process.",
};

export default function OnboardingPage() {
  return <RoleSelection />;
}

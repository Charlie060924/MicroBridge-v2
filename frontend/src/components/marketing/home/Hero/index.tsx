"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePreviewMode } from "@/context/PreviewModeContext";
import { useAuth } from "@/hooks/useAuth";
import { NavigationMemory } from "@/utils/navigationMemory";
import { useEffect } from "react";

interface HeroProps {
  variant?: "student" | "employer";
}

const Hero = ({ variant = "student" }: HeroProps) => {
  const router = useRouter();
  const { enterPreviewMode, isPreviewMode } = usePreviewMode();
  const { isAuthenticated } = useAuth();
  const isEmployer = variant === "employer";

  // Set landing page origin based on variant when component mounts
  useEffect(() => {
    NavigationMemory.saveLandingOrigin(isEmployer ? "employer" : "student");
  }, [isEmployer]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // If user is authenticated, go directly to the appropriate portal
      const basePath = isEmployer ? '/employer_portal/workspace' : '/student_portal/workspace';
      router.push(basePath);
    } else {
      // If not authenticated, enter preview mode
      enterPreviewMode(isEmployer ? "employer" : "student");
    }
  };

  const handleSignUp = () => {
    // Ensure landing origin is saved before navigation
    NavigationMemory.saveLandingOrigin(isEmployer ? "employer" : "student");
    router.push(isEmployer ? "/auth/employer-signup" : "/auth/signup");
  };

  const handleSignIn = () => {
    // Ensure landing origin is saved before navigation
    NavigationMemory.saveLandingOrigin(isEmployer ? "employer" : "student");
    router.push(isEmployer ? "/auth/employer-signin" : "/auth/signin");
  };

  return (
    <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
          {/* LEFT TEXT BLOCK */}
          <div className="md:w-1/2">
            <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
              {isEmployer
                ? "👩‍💼 Hire Smarter with MicroBridge"
                : "🚀 MicroBridge – Connecting Students and Startups"}
            </h4>

            <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero">
              {isEmployer
                ? "Connect with Hong Kong's Top Student Talent"
                : "Bridging Hong Kong's "}
              {!isEmployer && (
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                  Talent
                </span>
              )}
              {isEmployer && (
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                  Future Talent
                </span>
              )}
            </h1>

            <p className="text-base leading-relaxed text-black dark:text-white">
              {isEmployer
                ? "Post short-term paid projects and work with motivated students from top Hong Kong universities. Get results, fast."
                : "MicroBridge is a bilingual platform connecting Hong Kong university students with startups and SMEs through short-term, paid micro-internships."}
            </p>

            {/* CALL TO ACTION */}
            <div className="mt-10 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <button
                  onClick={handleGetStarted}
                  className="rounded-full bg-black px-10.5 py-2.5 text-white text-xl duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                >
                  {isAuthenticated 
                    ? (isEmployer ? "Go to Dashboard" : "Go to Dashboard")
                    : (isEmployer ? "Preview Platform" : "Get Started")
                  }
                </button>
                
                <p className="mt-3 text-black dark:text-white md:mt-0">
                  {isAuthenticated
                    ? "Access your personalized dashboard."
                    : (isEmployer
                        ? "Explore the platform without signing up."
                        : "Preview the platform and explore opportunities."
                      )
                  }
                </p>
              </div>



              {!isEmployer && !isAuthenticated && (
                <p className="text-base mt-6">
                  <span
                    onClick={handleSignUp}
                    className="cursor-pointer text-primary underline underline-offset-4 hover:text-opacity-80"
                  >
                    Upload your resume
                  </span>
                  <span className="text-black"> – it will only take a few seconds</span>
                </p>
              )}

              {/* Employer-specific call-to-action */}
              {isEmployer && !isAuthenticated && (
                <p className="text-base mt-6 text-black dark:text-white">
                  <span 
                    onClick={handleSignUp}
                    className="cursor-pointer text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-opacity-80"
                  >
                    Post your job
                  </span> – it only takes a few seconds
                </p>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE BLOCK */}
          <div className="animate_right hidden md:w-1/2 lg:block">
            <div className="relative 2xl:-mr-7.5">
              {/* Main Image */}
              <div className="relative w-full h-[444px]">
                <Image
                  className="shadow-solid-l dark:hidden"
                  src={
                    isEmployer
                      ? "/images/hero/hero-employer-light.svg"
                      : "/images/hero/hero-light.svg"
                  }
                  alt="Hero"
                  fill
                />
                <Image
                  className="hidden shadow-solid-l dark:block"
                  src={
                    isEmployer
                      ? "/images/hero/hero-employer-dark.svg"
                      : "/images/hero/hero-dark.svg"
                  }
                  alt="Hero"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

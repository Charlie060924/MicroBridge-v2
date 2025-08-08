"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeroProps {
  variant?: "student" | "employer";
}

const Hero = ({ variant = "student" }: HeroProps) => {
  const router = useRouter();
  const isEmployer = variant === "employer";

  const handleSignUp = () => {
    router.push(isEmployer ? "/auth/employer-signup" : "/auth/signup");
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
                  onClick={handleSignUp}
                  className="rounded-full bg-black px-10.5 py-2.5 text-white text-xl duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                >
                  {isEmployer ? "Post a Project" : "Get Started"}
                </button>
                
                <p className="mt-3 text-black dark:text-white md:mt-0">
                  {isEmployer
                    ? "Sign up to start hiring students on demand."
                    : "Create an account to see your personalized job recommendations."}
                </p>
              </div>

              {!isEmployer && (
                <p className="text-base mt-10">
                  <span
                    onClick={handleSignUp}
                    className="cursor-pointer text-primary underline underline-offset-4 hover:text-opacity-80"
                  >
                    Upload your resume
                  </span>
                  <span className="text-black"> – it will only take a few seconds</span>
                </p>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE BLOCK */}
          <div className="animate_right hidden md:w-1/2 lg:block">
            <div className="relative 2xl:-mr-7.5">
              {/* Main Image */}
              <div className="relative aspect-700/444 w-full">
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

"use client";

import { useRouter } from "next/navigation";

const RoleSelection = () => {
  const router = useRouter();

  const handleSelect = (role: "student" | "employer") => {
    router.push(role === "student" ? "/students_info" : "/employer_info");
  };

  return (
    <section className="pb-14 pt-36 lg:pb-28 lg:pt-50 xl:pb-34 xl:pt-56">
      <div className="relative z-1 mx-auto max-w-c-1016 px-8 pb-8 pt-12 lg:px-16 lg:pt-16 xl:px-24 xl:pt-24">

        {/* Background layer */}
        <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:to-[#252A42]" />

        <div className="rounded-lg dark:border dark:border-strokedark dark:bg-black text-center">
          <h2 className="mb-6 text-4xl font-semibold text-black dark:text-white">
            Welcome!
          </h2>
          <p className="mb-12 text-lg text-body-color dark:text-body-color-dark">
            Ready for the next step? <br />
            Create an account for tools to help you.
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <button
              onClick={() => handleSelect("student")}
              className="inline-flex justify-center items-center gap-2.5 rounded-full border border-blue-600 px-8 py-4 font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-black"
            >
              I’m a Student
            </button>

            <button
              onClick={() => handleSelect("employer")}
              className="inline-flex justify-center items-center gap-2.5 rounded-full border border-blue-600 px-8 py-4 font-medium text-blue-600 hover:bg-primary hover:text-white transition dark:border-blue-400 dark:text-blue-400"
            >
              I’m an Employer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
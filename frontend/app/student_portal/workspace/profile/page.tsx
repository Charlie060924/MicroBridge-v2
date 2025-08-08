"use client";

import React from "react";

function StudentInfoCard() {
  function useModal() {
    const [isOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return { isOpen, openModal, closeModal };
  }
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving personal info...");
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Musharof
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Chowdhury
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                randomuser@pimjo.com
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                +09 363 398 46
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Team Manager
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          Edit
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-6 dark:bg-gray-900">
            <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Edit Personal Information
            </h4>
            <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">First Name</label>
                <input
                  type="text"
                  defaultValue="Musharof"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Last Name</label>
                <input
                  type="text"
                  defaultValue="Chowdhury"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Email Address</label>
                <input
                  type="text"
                  defaultValue="randomuser@pimjo.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Phone</label>
                <input
                  type="text"
                  defaultValue="+09 363 398 46"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Bio</label>
                <input
                  type="text"
                  defaultValue="Team Manager"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentEducationCard() {
  function useModal() {
    const [isOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return { isOpen, openModal, closeModal };
  }
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    console.log("Saving education info...");
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Education Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">University</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">University of Hong Kong</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Degree</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">Bachelor of Engineering</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Major</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">Chemical Engineering</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Expected Graduation</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">June 2026</p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          Edit
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-[600px] rounded-xl bg-white p-6 dark:bg-gray-900">
            <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Edit Education Info
            </h4>
            <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">University</label>
                <input
                  type="text"
                  defaultValue="University of Hong Kong"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Degree</label>
                <input
                  type="text"
                  defaultValue="Bachelor of Engineering"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Major</label>
                <input
                  type="text"
                  defaultValue="Chemical Engineering"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Expected Graduation</label>
                <input
                  type="text"
                  defaultValue="June 2026"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Profile</h1>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Profile</h3>
          <p className="text-gray-500 dark:text-gray-400">Your profile information will appear here.</p>
        </div>

        <StudentInfoCard />
        <StudentEducationCard />
      </div>
    </div>
  );
}

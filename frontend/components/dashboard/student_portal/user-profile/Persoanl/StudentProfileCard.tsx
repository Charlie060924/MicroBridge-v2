"use client";

import React from "react";

import { useModal } from "@/hooks/useModal";  // <-- import here

export default function StudentInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    // Save logic here
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Student Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Charlie Lau
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                charlie@example.com
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                +852 6123 4567
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Aspiring chemical engineer, passionate about sustainability and innovation.
              </p>
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
              Edit Student Info
            </h4>
            <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  defaultValue="Charlie Lau"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  defaultValue="charlie@example.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Phone</label>
                <input
                  type="text"
                  defaultValue="+852 6123 4567"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Bio</label>
                <input
                  type="text"
                  defaultValue="Aspiring chemical engineer, passionate about sustainability and innovation."
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

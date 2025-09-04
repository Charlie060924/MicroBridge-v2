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
    <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 lg:mb-6">
            Student Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800
                Charlie Lau
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500
                Email
              </p>
              <p className="text-sm font-medium text-gray-800
                charlie@example.com
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800
                +852 6123 4567
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800
                Aspiring chemical engineer, passionate about sustainability and innovation.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800     lg:inline-flex lg:w-auto"
        >
          Edit
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-[600px] rounded-xl bg-white p-6
            <h4 className="mb-4 text-xl font-semibold text-gray-800
              Edit Student Info
            </h4>
            <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 Name</label>
                <input
                  type="text"
                  defaultValue="Charlie Lau"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none  
                />
              </div>
              <div>
                <label className="text-sm text-gray-600
                <input
                  type="email"
                  defaultValue="charlie@example.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none  
                />
              </div>
              <div>
                <label className="text-sm text-gray-600
                <input
                  type="text"
                  defaultValue="+852 6123 4567"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none  
                />
              </div>
              <div className="lg:col-span-2">
                <label className="text-sm text-gray-600
                <input
                  type="text"
                  defaultValue="Aspiring chemical engineer, passionate about sustainability and innovation."
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none  
                />
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100   
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

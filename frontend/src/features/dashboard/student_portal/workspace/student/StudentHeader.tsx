"use client";
import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import NotificationDropdown from "../Dashboard_header/NotificationDropdown";
import UserDropdown from "../Dashboard_header/UserDropdown";

export default function StudentHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white ">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-800
          Welcome back, Student!
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </header>
  );
}

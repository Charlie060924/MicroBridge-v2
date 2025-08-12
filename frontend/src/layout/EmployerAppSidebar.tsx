"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useLevel } from "@/hooks/useLevel";
import { 
  Star, 
  Briefcase, 
  Users, 
  Calendar, 
  Settings, 
  User,
  BarChart3,
  FileText,
  Plus,
  Building
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/employer_portal/workspace",
    icon: BarChart3,
  },
  {
    name: "Post Job",
    path: "/employer_portal/workspace/post-job",
    icon: Plus,
  },
  {
    name: "Manage Jobs",
    path: "/employer_portal/workspace/manage-jobs",
    icon: Briefcase,
  },
  {
    name: "Applications",
    path: "/employer_portal/workspace/applications",
    icon: FileText,
    showBadge: true,
    badgeText: "12",
    badgeColor: "bg-green-500",
  },
  {
    name: "Candidates",
    path: "/employer_portal/workspace/candidates",
    icon: Users,
  },
  {
    name: "Calendar",
    path: "/employer_portal/workspace/calendar",
    icon: Calendar,
  },
  {
    name: "Reports",
    path: "/employer_portal/workspace/reports",
    icon: BarChart3,
  },
  {
    name: "Profile",
    path: "/employer_portal/workspace/profile",
    icon: User,
  },
  {
    name: "Settings",
    path: "/employer_portal/workspace/settings",
    icon: Settings,
  },
];

const EmployerAppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { levelData } = useLevel();
  const pathname = usePathname();
  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 sidebar-layout
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex items-center">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              MicroBridge
            </span>
          ) : (
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((nav) => {
              const IconComponent = nav.icon;
              const isCurrentActive = isActive(nav.path);
              
              return (
                <li key={nav.name}>
                  <Link
                    href={nav.path}
                    className={`menu-item group relative ${
                      isCurrentActive
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    {/* Icon */}
                    {IconComponent && (
                      <IconComponent className="w-5 h-5" />
                    )}
                    
                    {/* Text */}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                    
                    {/* Badge */}
                    {nav.showBadge && (isExpanded || isHovered || isMobileOpen) && (
                      <div className={`absolute -top-1 -right-1 px-2 py-1 ${nav.badgeColor} rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900`}>
                        <span className="text-xs font-bold text-white">
                          {nav.badgeText}
                        </span>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default EmployerAppSidebar;

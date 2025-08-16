"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useLevel } from "@/hooks/useLevel";
import { usePreviewMode } from "@/context/PreviewModeContext";
import RestrictedPageModal from "@/components/common/RestrictedPageModal";
import { 
  Star, 
  CreditCard, 
  BarChart3, 
  Search, 
  FileText, 
  User, 
  Settings,
  FolderOpen,
  Lock,
  HelpCircle
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    path: "/student_portal/workspace",
    icon: BarChart3,
    restricted: false,
  },
  {
    name: "Browse Jobs",
    path: "/student_portal/workspace/jobs",
    icon: Search,
    restricted: false,
  },
  {
    name: "Applications",
    path: "/student_portal/workspace/applications",
    icon: FileText,
    restricted: true,
    feature: "view_applications",
  },
  {
    name: "Working Projects",
    path: "/student_portal/workspace/working_projects",
    icon: FolderOpen,
    restricted: true,
    feature: "current_projects",
  },
  {
    name: "Billing",
    path: "/billing",
    icon: CreditCard,
    restricted: true,
    feature: "billing",
  },
  {
    name: "Level System",
    path: "/student_portal/workspace/levels",
    icon: Star,
    showBadge: true,
    restricted: true,
    feature: "level_system",
  },
  {
    name: "Profile",
    path: "/student_portal/workspace/profile",
    icon: User,
    restricted: true,
    feature: "profile",
  },
  {
    name: "Settings",
    path: "/student_portal/workspace/settings",
    icon: Settings,
    restricted: true,
    feature: "profile",
  },
  {
    name: "Help Centre",
    path: "/help",
    icon: HelpCircle,
    restricted: false,
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { levelData } = useLevel();
  const { isPreviewMode, isFeatureLocked } = usePreviewMode();
  const pathname = usePathname();
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [restrictedFeature, setRestrictedFeature] = useState<string>("");
  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 sidebar-layout overflow-hidden
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
        className={`py-8 flex overflow-hidden ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex items-center overflow-hidden">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <span className="text-xl font-bold text-gray-900 dark:text-white truncate">
              MicroBridge
            </span>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">M</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar sidebar-overflow-fix">
        <nav className="mb-6 overflow-hidden">
          <ul className="flex flex-col gap-4 overflow-hidden">
            {navItems.map((nav) => {
              const IconComponent = nav.icon;
              const isCurrentActive = isActive(nav.path);
              const isRestricted = isPreviewMode && nav.restricted && isFeatureLocked(nav.feature || "");
              
              const handleClick = (e: React.MouseEvent) => {
                if (isRestricted) {
                  e.preventDefault();
                  setRestrictedFeature(nav.feature || "");
                  setShowRestrictedModal(true);
                }
              };
              
              return (
                <li key={nav.name} className="overflow-hidden">
                  <Link
                    href={nav.path}
                    onClick={handleClick}
                    className={`menu-item group relative overflow-hidden ${
                      isCurrentActive
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } ${isRestricted ? "opacity-60" : ""}`}
                  >
                    {/* Icon */}
                    <div className="relative">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                      )}
                      {isRestricted && (
                        <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Text */}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text truncate">{nav.name}</span>
                    )}
                    
                    {/* Level Badge for Level System */}
                    {nav.showBadge && (isExpanded || isHovered || isMobileOpen) && (
                      <div className="sidebar-badge w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500">
                        <span className="text-xs font-bold text-white truncate">
                          {levelData.level}
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
      
      <RestrictedPageModal
        isOpen={showRestrictedModal}
        onClose={() => setShowRestrictedModal(false)}
        feature={restrictedFeature}
      />
    </aside>
  );
};

export default AppSidebar;

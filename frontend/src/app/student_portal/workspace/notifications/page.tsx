"use client";

import React, { useState } from "react";
import { Bell, Search, Filter, ChevronLeft, ChevronRight, Trash2, Check, ExternalLink } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notificationService";
import Link from "next/link";

export default function NotificationHistoryPage() {
  const {
    notifications,
    loading,
    error,
    pagination,
    markAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotifications({
    autoRefresh: false,
    initialLimit: 20
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter notifications based on search and type
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filtering the current notifications
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const handleLoadMore = () => {
    if (pagination.canLoadMore) {
      fetchNotifications(pagination.page + 1, pagination.limit);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch (error) {
      // console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      // console.error('Failed to delete notification:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Notifications</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notification History
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  View and manage all your notifications
                </p>
              </div>
            </div>
            <Link
              href="/student_portal/workspace"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {["all", "info", "success", "warning", "error"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                      filterType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any notifications yet"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.is_read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.is_read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            New
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`text-lg font-medium mb-2 ${
                        !notification.is_read 
                          ? "text-gray-900 dark:text-white" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {notification.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{notificationService.formatTimeAgo(notification.created_at)}</span>
                        {notification.action_url && notification.action_text && (
                          <Link
                            href={notification.action_url}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {notification.action_text}
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {pagination.canLoadMore && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors duration-200"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* Pagination Info */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredNotifications.length} of {pagination.total} notifications
        </div>
      </div>
    </div>
  );
}

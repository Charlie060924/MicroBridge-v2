"use client";

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Measure performance metrics
    const measurePerformance = () => {
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries[entries.length - 1];
          setMetrics(prev => ({ 
            fcp: fcp.startTime,
            lcp: prev?.lcp || 0,
            fid: prev?.fid || 0,
            cls: prev?.cls || 0,
            ttfb: prev?.ttfb || 0
          }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          setMetrics(prev => ({ 
            fcp: prev?.fcp || 0,
            lcp: lcp.startTime,
            fid: prev?.fid || 0,
            cls: prev?.cls || 0,
            ttfb: prev?.ttfb || 0
          }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fid = entries[0] as PerformanceEventTiming;
          setMetrics(prev => ({ 
            fcp: prev?.fcp || 0,
            lcp: prev?.lcp || 0,
            fid: fid.processingStart - fid.startTime,
            cls: prev?.cls || 0,
            ttfb: prev?.ttfb || 0
          }));
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0;
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              cls += layoutShiftEntry.value;
            }
          }
          setMetrics(prev => ({ 
            fcp: prev?.fcp || 0,
            lcp: prev?.lcp || 0,
            fid: prev?.fid || 0,
            cls,
            ttfb: prev?.ttfb || 0
          }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({ 
          fcp: prev?.fcp || 0,
          lcp: prev?.lcp || 0,
          fid: prev?.fid || 0,
          cls: prev?.cls || 0,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart
        }));
      }
    };

    measurePerformance();

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') return null;

  const getMetricColor = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.needsImprovement) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Performance Metrics
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>
      
      {metrics && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FCP:</span>
            <span className={getMetricColor(metrics.fcp, { good: 1800, needsImprovement: 3000 })}>
              {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">LCP:</span>
            <span className={getMetricColor(metrics.lcp, { good: 2500, needsImprovement: 4000 })}>
              {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FID:</span>
            <span className={getMetricColor(metrics.fid, { good: 100, needsImprovement: 300 })}>
              {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">CLS:</span>
            <span className={getMetricColor(metrics.cls, { good: 0.1, needsImprovement: 0.25 })}>
              {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
            <span className={getMetricColor(metrics.ttfb, { good: 800, needsImprovement: 1800 })}>
              {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
            </span>
          </div>
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Ctrl+Shift+P to toggle
        </p>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 
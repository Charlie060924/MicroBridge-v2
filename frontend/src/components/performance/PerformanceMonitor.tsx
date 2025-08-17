"use client";

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  navigationTime: number;
  renderTime: number;
  dataLoadTime: number;
}

interface PerformanceMonitorProps {
  pageName: string;
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  pageName, 
  onMetrics 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    navigationTime: 0,
    renderTime: 0,
    dataLoadTime: 0,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Mark navigation start
    console.time(`Navigation:${pageName}`);
    
    return () => {
      const endTime = performance.now();
      const navigationTime = endTime - startTime;
      
      console.timeEnd(`Navigation:${pageName}`);
      console.log(`Page ${pageName} navigation took ${navigationTime.toFixed(2)}ms`);
      
      const newMetrics = {
        ...metrics,
        navigationTime,
      };
      
      setMetrics(newMetrics);
      onMetrics?.(newMetrics);
    };
  }, [pageName]);

  // Monitor render performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
      }));
    };
  }, []);

  // Monitor data loading performance
  useEffect(() => {
    const startTime = performance.now();
    
    // Simulate data loading monitoring
    const timer = setTimeout(() => {
      const endTime = performance.now();
      const dataLoadTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        dataLoadTime,
      }));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metrics for ${pageName}:`, metrics);
    }
  }, [metrics, pageName]);

  return null; // This component doesn't render anything
};

// Hook for easy performance monitoring
export const usePerformanceMonitor = (pageName: string) => {
  useEffect(() => {
    console.time(`PageLoad:${pageName}`);
    
    return () => {
      console.timeEnd(`PageLoad:${pageName}`);
    };
  }, [pageName]);
};

// Performance debugging utility
export const logPerformance = (label: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label} took ${(end - start).toFixed(2)}ms`);
};

// Async performance monitoring
export const logAsyncPerformance = async (label: string, fn: () => Promise<void>) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  console.log(`${label} took ${(end - start).toFixed(2)}ms`);
};

"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { PERFORMANCE_TARGETS } from '@/config/million.config';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentName: string;
  timestamp: number;
  frameRate: number;
  bundleSize?: number;
}

interface PerformanceMonitorOptions {
  componentName?: string;
  enableMemoryTracking?: boolean;
  enableRenderTimeTracking?: boolean;
  enableFrameRateTracking?: boolean;
  sampleRate?: number; // 0-1, percentage of renders to track
}

interface UsePerformanceMonitorResult {
  metrics: PerformanceMetrics | null;
  isSlowRender: boolean;
  averageRenderTime: number;
  memoryPressure: 'low' | 'medium' | 'high';
  startMeasurement: () => void;
  endMeasurement: () => void;
  logMetrics: () => void;
}

const usePerformanceMonitor = (
  options: PerformanceMonitorOptions = {}
): UsePerformanceMonitorResult => {
  const {
    componentName = 'Unknown',
    enableMemoryTracking = true,
    enableRenderTimeTracking = true,
    enableFrameRateTracking = false,
    sampleRate = 0.1 // Only track 10% of renders by default
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [renderTimes, setRenderTimes] = useState<number[]>([]);
  const [frameRate, setFrameRate] = useState<number>(60);
  
  const measurementStartRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Check if we should sample this render
  const shouldSample = useCallback(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);

  // Get memory usage (if supported)
  const getMemoryUsage = useCallback((): number => {
    if (!enableMemoryTracking) return 0;
    
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize;
    }
    return 0;
  }, [enableMemoryTracking]);

  // Calculate frame rate
  const updateFrameRate = useCallback(() => {
    if (!enableFrameRateTracking) return;
    
    const now = performance.now();
    frameCountRef.current++;
    
    if (lastFrameTimeRef.current !== 0) {
      const delta = now - lastFrameTimeRef.current;
      const fps = 1000 / delta;
      setFrameRate(Math.round(fps));
    }
    
    lastFrameTimeRef.current = now;
  }, [enableFrameRateTracking]);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    if (!enableRenderTimeTracking || !shouldSample()) return;
    
    measurementStartRef.current = performance.now();
    updateFrameRate();
  }, [enableRenderTimeTracking, shouldSample, updateFrameRate]);

  // End performance measurement
  const endMeasurement = useCallback(() => {
    if (!enableRenderTimeTracking || measurementStartRef.current === 0) return;
    
    const endTime = performance.now();
    const renderTime = endTime - measurementStartRef.current;
    const memoryUsage = getMemoryUsage();
    
    const newMetrics: PerformanceMetrics = {
      renderTime,
      memoryUsage,
      componentName,
      timestamp: Date.now(),
      frameRate
    };
    
    setMetrics(newMetrics);
    
    // Update render times history (keep last 100 measurements)
    setRenderTimes(prev => {
      const updated = [...prev, renderTime].slice(-100);
      return updated;
    });
    
    // Log performance warnings in development
    if (process.env.NODE_ENV === 'development') {
      if (renderTime > PERFORMANCE_TARGETS.renderTime.warning) {
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
      
      if (renderTime > PERFORMANCE_TARGETS.renderTime.critical) {
        console.error(
          `🚨 Critical render performance in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    }
    
    // Reset measurement
    measurementStartRef.current = 0;
  }, [enableRenderTimeTracking, getMemoryUsage, componentName, frameRate]);

  // Calculate average render time
  const averageRenderTime = renderTimes.length > 0 
    ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
    : 0;

  // Determine if current render is slow
  const isSlowRender = metrics 
    ? metrics.renderTime > PERFORMANCE_TARGETS.renderTime.target
    : false;

  // Determine memory pressure level
  const memoryPressure: 'low' | 'medium' | 'high' = (() => {
    if (!metrics?.memoryUsage) return 'low';
    
    const mb = metrics.memoryUsage / 1024 / 1024;
    if (mb > 100) return 'high';
    if (mb > 50) return 'medium';
    return 'low';
  })();

  // Log comprehensive metrics
  const logMetrics = useCallback(() => {
    if (!metrics) return;
    
    console.group(`📊 Performance Metrics - ${componentName}`);
    console.log('Render Time:', `${metrics.renderTime.toFixed(2)}ms`);
    console.log('Average Render Time:', `${averageRenderTime.toFixed(2)}ms`);
    console.log('Memory Usage:', `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log('Frame Rate:', `${metrics.frameRate}fps`);
    console.log('Memory Pressure:', memoryPressure);
    console.log('Is Slow Render:', isSlowRender);
    console.log('Sample Count:', renderTimes.length);
    console.groupEnd();
  }, [metrics, componentName, averageRenderTime, memoryPressure, isSlowRender, renderTimes.length]);

  // Auto-cleanup old metrics
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setRenderTimes(prev => prev.slice(-50)); // Keep only last 50
    }, 30000); // Clean up every 30 seconds

    return () => clearTimeout(cleanup);
  }, []);

  return {
    metrics,
    isSlowRender,
    averageRenderTime,
    memoryPressure,
    startMeasurement,
    endMeasurement,
    logMetrics
  };
};

// Higher-order component for automatic performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  monitorOptions?: PerformanceMonitorOptions
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const perfMonitor = usePerformanceMonitor({
      componentName: Component.displayName || Component.name,
      ...monitorOptions
    });

    useEffect(() => {
      perfMonitor.startMeasurement();
      
      // End measurement on next tick to capture render time
      const timer = setTimeout(() => {
        perfMonitor.endMeasurement();
      }, 0);

      return () => clearTimeout(timer);
    });

    return React.createElement(Component, {
      ...props,
      performanceMonitor: perfMonitor
    } as P);
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default usePerformanceMonitor;
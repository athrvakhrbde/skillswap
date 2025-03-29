import { useEffect, useState } from 'react';

/**
 * Custom hook for Firebase Performance Monitoring
 * 
 * This hook dynamically imports Firebase Performance to avoid SSR issues
 * and provides methods to track custom traces and metrics
 */
export const useFirebasePerformance = () => {
  const [perf, setPerf] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Only initialize if firebase config exists
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

    // Dynamically import Firebase Performance
    const initPerformance = async () => {
      try {
        const { getApp } = await import('firebase/app');
        const { getPerformance, trace } = await import('firebase/performance');
        
        const app = getApp();
        const perfInstance = getPerformance(app);
        
        setPerf(perfInstance);
        setIsSupported(true);
        
        // Log initialization success
        console.log('Firebase Performance initialized');
      } catch (error) {
        console.error('Failed to initialize Firebase Performance:', error);
        setIsSupported(false);
      }
    };

    initPerformance();
  }, []);

  /**
   * Start a custom trace for measuring performance
   * @param traceName - Name of the trace to create
   * @returns A function that stops and records the trace
   */
  const startTrace = (traceName: string) => {
    if (!isSupported || !perf) {
      // Return a no-op function if not supported
      return {
        stop: () => {},
        putAttribute: () => {},
        putMetric: () => {}
      };
    }

    try {
      const { trace } = require('firebase/performance');
      const customTrace = trace(perf, traceName);
      customTrace.start();

      return {
        stop: () => {
          customTrace.stop();
        },
        putAttribute: (name: string, value: string) => {
          customTrace.putAttribute(name, value);
        },
        putMetric: (name: string, value: number) => {
          customTrace.putMetric(name, value);
        }
      };
    } catch (error) {
      console.error(`Error starting trace "${traceName}":`, error);
      // Return a no-op object
      return {
        stop: () => {},
        putAttribute: () => {},
        putMetric: () => {}
      };
    }
  };

  return {
    perf,
    isSupported,
    startTrace,
  };
}; 
'use client';

// Dualite.dev API utility functions
import { useEffect, useState } from 'react';

// Define the Profile type to match our database schema
export interface Profile {
  id?: string;
  name: string;
  teach: string;
  learn: string;
  location: string;
  contact: string;
  about?: string;
  teachingExperience?: string;
  created?: number;
}

// Storage keys
const LOCAL_STORAGE_KEY = 'skillswap_profiles';
const LAST_SYNC_KEY = 'skillswap_last_sync';

// API URLs - to be replaced with actual backend service in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Error handling utility
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your error tracking service
    // errorTrackingService.captureException(error);
  }
  return null;
};

// Create a new profile
export const createProfile = async (profile: Profile): Promise<Profile | null> => {
  try {
    const newProfile = {
      ...profile,
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created: Date.now(),
    };
    
    // In production, this would make an API call to your backend
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProfile),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        // Fall back to localStorage if the API call fails
        console.warn('API call failed, falling back to localStorage', error);
      }
    }
    
    // Fallback for local development or if API is unavailable
    const existingProfiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updatedProfiles = [...existingProfiles, newProfile];
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfiles));
    
    return newProfile;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all profiles
export const getProfiles = async (): Promise<Profile[]> => {
  try {
    // In production, this would fetch from your backend API
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        // Cache the data locally for offline access
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
        return data;
      } catch (error) {
        // Fall back to localStorage if the API call fails
        console.warn('API call failed, falling back to localStorage', error);
      }
    }
    
    // Fallback for local development or if API is unavailable
    const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};

// Custom hook for profiles with optimized data loading
export const useProfiles = (searchTerm: string = '') => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let syncIntervalId: NodeJS.Timeout | null = null;
    
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const allProfiles = await getProfiles();
        
        if (!isMounted) return;
        
        // Filter profiles based on search term
        const filtered = searchTerm 
          ? allProfiles.filter(profile => 
              profile.teach.toLowerCase().includes(searchTerm.toLowerCase()) ||
              profile.learn.toLowerCase().includes(searchTerm.toLowerCase()) ||
              profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase()))
            )
          : allProfiles;
          
        setProfiles(filtered);
        setError(null);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching profiles:', error);
        setError('Failed to load profiles. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfiles();

    // Set up real-time updates
    if (typeof window !== 'undefined') {
      // Listen for local storage changes
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === LOCAL_STORAGE_KEY) {
          fetchProfiles();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // For production, sync with the server periodically (e.g., every minute)
      if (API_BASE_URL) {
        syncIntervalId = setInterval(fetchProfiles, 60000);
      }

      return () => {
        isMounted = false;
        if (syncIntervalId) clearInterval(syncIntervalId);
        window.removeEventListener('storage', handleStorageChange);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  return { profiles, loading, error };
}; 
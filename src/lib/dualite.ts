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
}

// Mock database for local development
const LOCAL_STORAGE_KEY = 'skillswap_profiles';

// Sample profiles for demo
const SAMPLE_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Alex',
    teach: 'Guitar',
    learn: 'Coding',
    location: 'Downtown',
    contact: 'alex@example.com',
    about: 'Music enthusiast with 8 years of guitar playing experience. I love teaching beginners and helping them discover the joy of music.',
    teachingExperience: 'I\'ve taught guitar to over 20 students, ranging from complete beginners to intermediate players. My specialty is acoustic fingerstyle and basic music theory.'
  },
  {
    id: '2',
    name: 'Sara',
    teach: 'Yoga',
    learn: 'Photography',
    location: 'Uptown',
    contact: 'sara@example.com',
    about: 'Certified yoga instructor passionate about mindfulness and wellness. I believe yoga is for everybody regardless of age or fitness level.',
    teachingExperience: 'I\'ve been teaching yoga for 5 years, with certifications in Hatha and Vinyasa. I specialize in beginner-friendly flows and alignment techniques.'
  },
  {
    id: '3',
    name: 'Mike',
    teach: 'Baking',
    learn: 'Spanish',
    location: 'Midtown',
    contact: 'mike@example.com',
    about: 'Self-taught baker who loves creating delicious treats. From sourdough to pastries, I enjoy the science and art of baking.',
    teachingExperience: 'I\'ve hosted multiple baking workshops focusing on bread basics and pastry techniques. I can teach you to make incredible sourdough from scratch!'
  },
  {
    id: '4',
    name: 'Priya',
    teach: 'Spanish',
    learn: 'Guitar',
    location: 'West End',
    contact: 'priya@example.com',
    about: 'Bilingual speaker who lived in Madrid for 3 years. I love sharing Spanish language and culture through conversation practice.',
    teachingExperience: 'I\'ve tutored Spanish for both casual learners and university students. My teaching style focuses on practical conversation skills and everyday vocabulary.'
  },
  {
    id: '5',
    name: 'Jordan',
    teach: 'Coding',
    learn: 'Juggling',
    location: 'East Side',
    contact: 'jordan@example.com',
    about: 'Software developer with a passion for teaching others. I believe anyone can learn to code with the right guidance.',
    teachingExperience: 'I\'ve mentored junior developers and taught coding workshops. I specialize in JavaScript, React, and web development fundamentals.'
  }
];

// Initialize local storage with sample profiles
const initializeLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const existingProfiles = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!existingProfiles) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_PROFILES));
    }
  }
};

// Create a new profile
export const createProfile = async (profile: Profile): Promise<Profile> => {
  // In a real implementation, this would use Dualite's API
  // For our prototype, we'll use localStorage
  
  initializeLocalStorage();
  
  const newProfile = {
    ...profile,
    id: Date.now().toString(),
  };
  
  const existingProfiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const updatedProfiles = [...existingProfiles, newProfile];
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfiles));
  
  return newProfile;
};

// Get all profiles
export const getProfiles = async (): Promise<Profile[]> => {
  // In a real implementation, this would fetch from Dualite's API
  initializeLocalStorage();
  
  const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  return profiles;
};

// Custom hook for profiles with real-time updates
export const useProfiles = (searchTerm: string = '') => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const allProfiles = await getProfiles();
        
        // Filter profiles based on search term
        const filtered = searchTerm 
          ? allProfiles.filter(profile => 
              profile.teach.toLowerCase().includes(searchTerm.toLowerCase()) ||
              profile.learn.toLowerCase().includes(searchTerm.toLowerCase()) ||
              profile.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : allProfiles;
          
        setProfiles(filtered);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    // Set up real-time updates with localStorage event listener
    const handleStorageChange = () => {
      fetchProfiles();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // For our prototype, poll for changes every 2 seconds
    const interval = setInterval(fetchProfiles, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [searchTerm]);

  return { profiles, loading };
}; 
'use client';

import React, { useState } from 'react';
import { Profile, createProfile } from '@/lib/dualite';
import { useRouter } from 'next/navigation';

export default function ProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Profile, 'id'>>({
    name: '',
    teach: '',
    learn: '',
    location: '',
    contact: ''
  });
  const [errors, setErrors] = useState({
    teach: false,
    learn: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (name === 'teach' || name === 'learn') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      teach: !formData.teach.trim(),
      learn: !formData.learn.trim(),
    };
    
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (newErrors.teach || newErrors.learn) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create profile with defaults if needed
      const profileToCreate: Profile = {
        ...formData,
        name: formData.name.trim() || 'User',
        contact: formData.contact.trim() || 'user@example.com',
      };
      
      await createProfile(profileToCreate);
      
      // Navigate to browse page
      router.push('/browse');
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">Name (optional)</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            className="glass-input w-full px-4 py-3"
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="teach" className="block text-gray-300 mb-2 font-medium">
            I can teach <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            id="teach"
            name="teach"
            placeholder="e.g., Guitar, Cooking, JavaScript"
            value={formData.teach}
            onChange={handleChange}
            className={`glass-input w-full px-4 py-3 ${errors.teach ? 'border-red-400' : ''}`}
            required
          />
          {errors.teach && (
            <p className="text-red-400 text-sm mt-1">Please enter a skill you can teach</p>
          )}
        </div>
        
        <div className="mb-5">
          <label htmlFor="learn" className="block text-gray-300 mb-2 font-medium">
            I want to learn <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            id="learn"
            name="learn"
            placeholder="e.g., Piano, Photography, Python"
            value={formData.learn}
            onChange={handleChange}
            className={`glass-input w-full px-4 py-3 ${errors.learn ? 'border-red-400' : ''}`}
            required
          />
          {errors.learn && (
            <p className="text-red-400 text-sm mt-1">Please enter a skill you want to learn</p>
          )}
        </div>
        
        <div className="mb-5">
          <label htmlFor="location" className="block text-gray-300 mb-2 font-medium">Location (optional)</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., Downtown, Online"
            value={formData.location}
            onChange={handleChange}
            className="glass-input w-full px-4 py-3"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="contact" className="block text-gray-300 mb-2 font-medium">Contact (optional)</label>
          <input
            type="email"
            id="contact"
            name="contact"
            placeholder="Your email"
            value={formData.contact}
            onChange={handleChange}
            className="glass-input w-full px-4 py-3"
          />
          <p className="text-gray-500 text-sm mt-1">Defaults to user@example.com if left empty</p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="connect-button w-full block"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Profile...
            </span>
          ) : 'Create Profile'}
        </button>
      </form>
    </div>
  );
} 
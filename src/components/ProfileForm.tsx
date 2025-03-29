'use client';

import React, { useState } from 'react';
import { Profile, createProfile } from '@/lib/dualite';
import { useRouter } from 'next/navigation';
import { FaUser, FaGraduationCap, FaBrain, FaMapMarkerAlt, FaEnvelope, FaSpinner, FaInfoCircle, FaChalkboardTeacher } from 'react-icons/fa';

export default function ProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Profile, 'id'>>({
    name: '',
    teach: '',
    learn: '',
    location: '',
    contact: '',
    about: '',
    teachingExperience: ''
  });
  const [errors, setErrors] = useState({
    teach: false,
    learn: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <label htmlFor="name" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaUser className="mr-2 text-indigo-400" size={14} /> Name (optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="teach" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaGraduationCap className="mr-2 text-indigo-400" size={14} /> I can teach <span className="text-indigo-400 ml-1">*</span>
          </label>
          <input
            type="text"
            id="teach"
            name="teach"
            placeholder="e.g., Guitar, Cooking, JavaScript"
            value={formData.teach}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400 ${errors.teach ? 'border-red-400' : 'border-[rgba(255,255,255,0.1)]'}`}
            required
          />
          {errors.teach && (
            <p className="text-red-400 text-sm mt-1">Please enter a skill you can teach</p>
          )}
        </div>
        
        <div className="mb-5">
          <label htmlFor="learn" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaBrain className="mr-2 text-indigo-400" size={14} /> I want to learn <span className="text-indigo-400 ml-1">*</span>
          </label>
          <input
            type="text"
            id="learn"
            name="learn"
            placeholder="e.g., Piano, Photography, Python"
            value={formData.learn}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400 ${errors.learn ? 'border-red-400' : 'border-[rgba(255,255,255,0.1)]'}`}
            required
          />
          {errors.learn && (
            <p className="text-red-400 text-sm mt-1">Please enter a skill you want to learn</p>
          )}
        </div>
        
        <div className="mb-5">
          <label htmlFor="about" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-400" size={14} /> About me (optional)
          </label>
          <textarea
            id="about"
            name="about"
            placeholder="Tell others about yourself, your interests, and what motivates you to teach and learn"
            value={formData.about}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="teachingExperience" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaChalkboardTeacher className="mr-2 text-indigo-400" size={14} /> Teaching experience (optional)
          </label>
          <textarea
            id="teachingExperience"
            name="teachingExperience"
            placeholder="Describe your experience teaching this skill or any relevant qualifications"
            value={formData.teachingExperience}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="location" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaMapMarkerAlt className="mr-2 text-indigo-400" size={14} /> Location (optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., Downtown, Online"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="contact" className="block text-gray-300 mb-2 font-medium flex items-center">
            <FaEnvelope className="mr-2 text-indigo-400" size={14} /> Contact (optional)
          </label>
          <input
            type="email"
            id="contact"
            name="contact"
            placeholder="Your email"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
          />
          <p className="text-gray-500 text-sm mt-1">Defaults to user@example.com if left empty</p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-button w-full flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" />
              Creating Profile...
            </span>
          ) : 'Create Profile'}
        </button>
      </form>
    </div>
  );
} 
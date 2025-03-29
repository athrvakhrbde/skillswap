'use client';

import React from 'react';
import { Profile } from '@/lib/dualite';
import { FaArrowRight, FaGraduationCap, FaBrain, FaMapMarkerAlt } from 'react-icons/fa';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="cursor-card">
      <div className="cursor-card-content">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white">{profile.name || 'User'}</h3>
          <div className="px-3 py-1 bg-indigo-600/30 rounded-full text-xs font-medium text-indigo-300 border border-indigo-500/20">
            {profile.teach}
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <FaGraduationCap className="text-indigo-400 mt-1 mr-3" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Teaches</span>
              <span className="text-white">{profile.teach}</span>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaBrain className="text-indigo-400 mt-1 mr-3" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Wants to learn</span>
              <span className="text-white">{profile.learn}</span>
            </div>
          </div>
          
          {profile.location && (
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-indigo-400 mt-1 mr-3" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-white">{profile.location}</span>
              </div>
            </div>
          )}
        </div>
        
        <a 
          href={`mailto:${profile.contact}`}
          className="cursor-button w-full flex items-center justify-center"
        >
          Connect Now <FaArrowRight className="ml-2" size={14} />
        </a>
      </div>
    </div>
  );
} 
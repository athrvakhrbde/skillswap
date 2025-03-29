'use client';

import React from 'react';
import { Profile } from '@/lib/dualite';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="event-card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="text-xl font-semibold text-white">{profile.name || 'User'}</h3>
          <div className="skill-badge">{profile.teach}</div>
        </div>
        
        <div className="card-details">
          <div className="detail-row">
            <div className="detail-icon">👨‍🏫</div>
            <div className="detail-text">
              <span className="text-sm text-gray-400">Teaches</span>
              <span className="text-white">{profile.teach}</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-icon">🧠</div>
            <div className="detail-text">
              <span className="text-sm text-gray-400">Wants to learn</span>
              <span className="text-white">{profile.learn}</span>
            </div>
          </div>
          
          {profile.location && (
            <div className="detail-row">
              <div className="detail-icon">📍</div>
              <div className="detail-text">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-white">{profile.location}</span>
              </div>
            </div>
          )}
        </div>
        
        <a 
          href={`mailto:${profile.contact}`}
          className="connect-button w-full"
        >
          Connect Now
        </a>
      </div>
    </div>
  );
} 
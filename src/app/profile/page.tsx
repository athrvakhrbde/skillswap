'use client';

import React from 'react';
import ProfileForm from '@/components/ProfileForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="page-container py-8">
        <div className="text-center mb-12">
          <h1 className="hero-title mb-4">Create Your Profile</h1>
          <p className="hero-subtitle max-w-3xl mx-auto">
            Share your skills and find people to learn from in your community
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="cursor-card">
            <div className="cursor-card-content">
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
'use client';

import React from 'react';
import ProfileForm from '@/components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Create Your Profile</h1>
        <p className="page-subtitle">
          Share your skills and find people to learn from in your community
        </p>
      </div>
      
      <div className="form-container">
        <ProfileForm />
      </div>
    </div>
  );
} 
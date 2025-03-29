'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-container max-w-screen-xl mx-auto px-4">
      <div className="hero-section">
        <div className="gradient-orb top-right"></div>
        <div className="gradient-orb bottom-left"></div>
        <div className="gradient-orb middle-center"></div>
        
        <div className="page-header text-center">
          <h1 className="hero-title mx-auto max-w-4xl">
            Trade skills, build community!
          </h1>
          
          <p className="hero-subtitle px-4">
            SkillSwap connects people who want to teach and learn from each other. 
            Share your expertise and discover new skills in your community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 px-4">
            <Link 
              href="/profile" 
              className="primary-button w-full sm:w-auto"
            >
              <span>Create Profile</span>
              <span className="button-arrow">→</span>
            </Link>
            
            <Link
              href="/browse"
              className="secondary-button w-full sm:w-auto"
            >
              <span>Browse Skills</span>
              <span className="button-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section mb-20">
        <h2 className="features-title">How it works</h2>
        
        <div className="features-grid max-w-5xl mx-auto px-4">
          <div className="event-card feature-card">
            <div className="card-content">
              <div className="feature-number">1</div>
              <div className="card-header">
                <h3 className="text-xl font-semibold text-white">Share Your Expertise</h3>
              </div>
              <p className="text-gray-300 mt-4">
                Teach others what you're passionate about. Everyone has valuable skills to share!
              </p>
            </div>
          </div>
          
          <div className="event-card feature-card">
            <div className="card-content">
              <div className="feature-number">2</div>
              <div className="card-header">
                <h3 className="text-xl font-semibold text-white">Learn Something New</h3>
              </div>
              <p className="text-gray-300 mt-4">
                Discover new skills from people in your community. Feed your curiosity!
              </p>
            </div>
          </div>
          
          <div className="event-card feature-card">
            <div className="card-content">
              <div className="feature-number">3</div>
              <div className="card-header">
                <h3 className="text-xl font-semibold text-white">Connect Locally</h3>
              </div>
              <p className="text-gray-300 mt-4">
                Meet like-minded people in your area. Build meaningful connections!
              </p>
            </div>
          </div>
        </div>

        <div className="cta-section px-4">
          <div className="cta-card">
            <h3 className="cta-title">Ready to start swapping skills?</h3>
            <p className="cta-text">Join our community today and discover the joy of skill sharing!</p>
            <Link href="/profile" className="primary-button mx-auto block sm:inline-flex">
              <span>Get Started</span>
              <span className="button-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
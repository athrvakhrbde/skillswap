'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="page-header text-center">
          <h1 className="hero-title mx-auto max-w-4xl">
            Trade skills, build community!
          </h1>
          
          <p className="hero-subtitle">
            SkillSwap connects people who want to teach and learn from each other. 
            Share your expertise and discover new skills in your community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link 
              href="/profile" 
              className="cursor-button"
            >
              Create Profile <FaArrowRight className="ml-2" size={14} />
            </Link>
            
            <Link
              href="/browse"
              className="cursor-button-secondary"
            >
              Browse Skills <FaArrowRight className="ml-2" size={14} />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2 className="features-title">How it works</h2>
        
        <div className="features-grid">
          <div className="cursor-card feature-card">
            <div className="cursor-card-content">
              <div className="feature-number">1</div>
              <div className="card-header mb-4">
                <h3>Share Your Expertise</h3>
              </div>
              <p className="text-gray-300">
                Teach others what you're passionate about. Everyone has valuable skills to share!
              </p>
            </div>
          </div>
          
          <div className="cursor-card feature-card">
            <div className="cursor-card-content">
              <div className="feature-number">2</div>
              <div className="card-header mb-4">
                <h3>Learn Something New</h3>
              </div>
              <p className="text-gray-300">
                Discover new skills from people in your community. Feed your curiosity!
              </p>
            </div>
          </div>
          
          <div className="cursor-card feature-card">
            <div className="cursor-card-content">
              <div className="feature-number">3</div>
              <div className="card-header mb-4">
                <h3>Connect Locally</h3>
              </div>
              <p className="text-gray-300">
                Meet like-minded people in your area. Build meaningful connections!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to start swapping skills?</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">Join our community today and discover the joy of skill sharing!</p>
          <Link href="/profile" className="cursor-button">
            Get Started <FaArrowRight className="ml-2" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
} 
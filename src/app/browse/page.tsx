'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ProfileCard from '@/components/ProfileCard';
import { useProfiles } from '@/lib/dualite';

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { profiles, loading } = useProfiles(searchTerm);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Find Skill Swap Partners</h1>
        <p className="page-subtitle">
          Connect with people who want to share their skills and learn from you
        </p>
      </div>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="filters-row">
        <div className="active-filters">
          <span className="filter-label">Browse by:</span>
          <button className="filter-tag active">All Skills</button>
          <button className="filter-tag">Teaching</button>
          <button className="filter-tag">Learning</button>
        </div>
        
        <div className="view-options">
          <span className="count-label">{profiles.length} results</span>
        </div>
      </div>
      
      <div className="profiles-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Finding skill swap partners...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No profiles found</h3>
            <p className="empty-message">
              {searchTerm 
                ? `No profiles match your search for "${searchTerm}"`
                : "No profiles have been created yet. Be the first one!"}
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
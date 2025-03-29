'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ProfileCard from '@/components/ProfileCard';
import { useProfiles, Profile } from '@/lib/dualite';
import { FaSpinner, FaSearch, FaPlus, FaFilter, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

// Filter types
type FilterType = 'all' | 'teaching' | 'learning' | 'location';

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const { profiles, loading, error } = useProfiles(searchTerm);

  // Apply filters to profiles
  useEffect(() => {
    if (!profiles) return;
    
    let filtered = [...profiles];
    
    // Apply category filters
    if (activeFilter === 'teaching') {
      filtered = filtered.filter(profile => profile.teach?.trim());
    } else if (activeFilter === 'learning') {
      filtered = filtered.filter(profile => profile.learn?.trim());
    } else if (activeFilter === 'location') {
      filtered = filtered.filter(profile => profile.location?.trim());
    }
    
    // Sort profiles by creation date if available
    filtered.sort((a, b) => {
      if (a.created && b.created) {
        return b.created - a.created; // Newest first
      }
      return 0;
    });
    
    setFilteredProfiles(filtered);
  }, [profiles, activeFilter]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  return (
    <div className="page-container py-8">
      <div className="text-center mb-12">
        <h1 className="hero-title mb-4">Find Skill Swap Partners</h1>
        <p className="hero-subtitle max-w-3xl mx-auto">
          Connect with people who want to share their skills and learn from you
        </p>
      </div>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400 flex items-center"><FaFilter className="mr-2" /> Browse by:</span>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === 'all' 
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/20' 
              : 'bg-[rgba(255,255,255,0.05)] text-gray-300 border border-white/10 hover:bg-[rgba(255,255,255,0.08)]'}`}
            onClick={() => handleFilterChange('all')}
          >
            All Skills
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === 'teaching' 
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/20' 
              : 'bg-[rgba(255,255,255,0.05)] text-gray-300 border border-white/10 hover:bg-[rgba(255,255,255,0.08)]'}`}
            onClick={() => handleFilterChange('teaching')}
          >
            Teaching
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === 'learning' 
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/20' 
              : 'bg-[rgba(255,255,255,0.05)] text-gray-300 border border-white/10 hover:bg-[rgba(255,255,255,0.08)]'}`}
            onClick={() => handleFilterChange('learning')}
          >
            Learning
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${activeFilter === 'location' 
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/20' 
              : 'bg-[rgba(255,255,255,0.05)] text-gray-300 border border-white/10 hover:bg-[rgba(255,255,255,0.08)]'}`}
            onClick={() => handleFilterChange('location')}
          >
            Location
          </button>
        </div>
        
        <div className="text-gray-400 text-sm">
          {filteredProfiles.length} {filteredProfiles.length === 1 ? 'result' : 'results'}
        </div>
      </div>
      
      {error ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="bg-red-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-300 w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Unable to Load Profiles</h3>
          <p className="text-gray-400 mb-6">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="cursor-button-secondary"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="text-center py-20">
          <FaSpinner className="animate-spin text-indigo-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-300">Finding skill swap partners...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="bg-indigo-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaSearch className="text-indigo-300 w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || activeFilter !== 'all'
              ? "No profiles match your current filters."
              : "Be the first to create a profile and start connecting with others!"}
          </p>
          {searchTerm || activeFilter !== 'all' ? (
            <button 
              onClick={clearSearch} 
              className="cursor-button-secondary flex items-center mx-auto"
            >
              <FaTimes className="mr-2" size={14} /> Clear Filters
            </button>
          ) : (
            <Link href="/profile" className="cursor-button flex items-center mx-auto">
              <FaPlus className="mr-2" size={14} /> Create Your Profile
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id || profile.name} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ProfileCard from '@/components/ProfileCard';
import { useProfiles } from '@/lib/dualite';
import { FaSpinner, FaSearch } from 'react-icons/fa';

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { profiles, loading } = useProfiles(searchTerm);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // In a real app, this would filter the data differently
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
          <span className="text-sm text-gray-400">Browse by:</span>
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
        </div>
        
        <div className="text-gray-400 text-sm">
          {profiles.length} results
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-20">
          <FaSpinner className="animate-spin text-indigo-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-300">Finding skill swap partners...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="bg-indigo-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaSearch className="text-indigo-300 w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
          <p className="text-gray-400">
            {searchTerm 
              ? `No profiles match your search for "${searchTerm}"`
              : "No profiles have been created yet. Be the first one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
} 
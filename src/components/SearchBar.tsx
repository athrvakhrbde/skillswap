'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <FaSearch size={16} />
        </div>
        <input
          type="text"
          placeholder="Search skills, members, or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-12 pr-10 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <FaTimes size={16} />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="mt-4 flex items-center">
          <div className="px-3 py-1 bg-indigo-600/30 rounded-full text-xs font-medium text-indigo-300 border border-indigo-500/20 flex items-center">
            <span>{searchTerm}</span>
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 text-indigo-300 hover:text-white transition-colors"
              aria-label="Remove filter"
            >
              <FaTimes size={10} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
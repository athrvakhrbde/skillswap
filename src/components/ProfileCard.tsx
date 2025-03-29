'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/dualite';
import { FaArrowRight, FaGraduationCap, FaBrain, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaComments, FaPaperPlane } from 'react-icons/fa';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'peer'}[]>([]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsChatOpen(false);
    }
  };

  const toggleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
    setMessage('');
    
    // Simulate a response from the peer after a short delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          text: `Hi there! I'm interested in swapping skills. I can teach ${profile.teach} and would love to learn from you.`, 
          sender: 'peer' 
        }
      ]);
    }, 1000);
  };

  return (
    <div className={`cursor-card transition-all duration-300 ${isExpanded ? 'shadow-lg ring-1 ring-indigo-500/20' : ''}`}>
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
        
        {isExpanded && (
          <div className="mt-2 mb-6 border-t border-indigo-500/10 pt-4">
            <h4 className="text-lg font-medium text-white mb-3">About {profile.name || 'User'}</h4>
            <p className="text-gray-300 mb-4">
              {profile.about || `Hi there! I'm ${profile.name || 'a user'} who loves to teach ${profile.teach} and I'm eager to learn ${profile.learn}. Let's connect and share skills!`}
            </p>
            
            <h4 className="text-lg font-medium text-white mb-3">Teaching Experience</h4>
            <p className="text-gray-300">
              {profile.teachingExperience || `I have experience teaching ${profile.teach} and can adapt to different learning styles. Whether you're a beginner or looking to advance your skills, I'm happy to help.`}
            </p>
          </div>
        )}
        
        {isChatOpen && (
          <div className="mb-6 border border-indigo-500/20 rounded-lg overflow-hidden">
            <div className="bg-[rgba(30,30,50,0.5)] px-4 py-2 border-b border-indigo-500/20">
              <h4 className="font-medium text-white">Chat with {profile.name || 'User'}</h4>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-3 space-y-3 bg-[rgba(15,15,35,0.4)]">
              {chatMessages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Start a conversation</p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-indigo-600/40 text-white' 
                          : 'bg-[rgba(255,255,255,0.1)] text-gray-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={sendMessage} className="flex items-center p-3 bg-[rgba(20,20,40,0.5)]">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-[rgba(255,255,255,0.05)] border border-indigo-500/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
              <button 
                type="submit" 
                className="ml-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-white rounded-lg p-2 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={toggleExpand}
            className="flex-1 cursor-button-secondary flex items-center justify-center"
          >
            {isExpanded ? (
              <>Less Details <FaChevronUp className="ml-2" size={14} /></>
            ) : (
              <>More Details <FaChevronDown className="ml-2" size={14} /></>
            )}
          </button>
          
          <button
            onClick={toggleChat}
            className={`flex-1 ${isChatOpen ? 'cursor-button' : 'cursor-button-secondary'} flex items-center justify-center`}
          >
            <FaComments className="mr-2" size={14} /> 
            {isChatOpen ? 'Close Chat' : 'Chat'}
          </button>
        </div>
      </div>
    </div>
  );
} 
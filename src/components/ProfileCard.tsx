'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '@/lib/dualite';
import { FaArrowRight, FaGraduationCap, FaBrain, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaComments, FaPaperPlane, FaUser, FaExclamationCircle, FaEnvelope, FaLock } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'peer';
  timestamp: number;
  status: 'sending' | 'sent' | 'error';
}

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current && isChatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Focus on input when chat opens
  useEffect(() => {
    if (isChatOpen && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isChatOpen]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsChatOpen(false);
    }
  };

  const toggleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChatOpen(!isChatOpen);
    setChatError(null);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    const newMessageId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMessage: Message = {
      id: newMessageId,
      text: message.trim(),
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending'
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsSending(true);
    setChatError(null);
    
    try {
      // In a production app, this would be an API call to your chat service
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Update the message status to sent
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === newMessageId ? { ...msg, status: 'sent' } : msg
        )
      );
      
      // Simulate a response from the peer after a short delay
      const peerIsTyping = setTimeout(() => {
        // In production, this would be a real-time message from a chat system
        const responseMessage: Message = {
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: `Hi there! I'm interested in swapping skills. I can teach ${profile.teach} and would love to learn more about ${profile.learn}.`,
          sender: 'peer',
          timestamp: Date.now(),
          status: 'sent'
        };
        
        setChatMessages(prev => [...prev, responseMessage]);
      }, 1500);
      
      return () => clearTimeout(peerIsTyping);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatError('Failed to send message. Please try again.');
      
      // Update the message status to error
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === newMessageId ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // Format time from timestamp
  const formatMessageTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle direct contact
  const handleContact = () => {
    if (profile.contact) {
      window.location.href = `mailto:${profile.contact}?subject=SkillSwap: Interested in learning ${profile.teach}&body=Hi ${profile.name || 'there'},\n\nI saw your profile on SkillSwap and I'm interested in learning ${profile.teach}. Would you be available to connect?\n\nBest regards,`;
    }
  };

  return (
    <div className={`cursor-card transition-all duration-300 ${isExpanded ? 'shadow-lg ring-1 ring-indigo-500/20' : ''}`}>
      <div className="cursor-card-content">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            {profile.name || 'User'} 
            {profile.created && (
              <span className="ml-2 text-xs text-gray-400 font-normal">
                • joined {new Date(profile.created).toLocaleDateString()}
              </span>
            )}
          </h3>
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
            
            {profile.contact && (
              <div className="mt-4 pt-4 border-t border-indigo-500/10">
                <button 
                  onClick={handleContact}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center text-sm"
                >
                  <FaEnvelope className="mr-2" /> Contact via Email
                </button>
              </div>
            )}
          </div>
        )}
        
        {isChatOpen && (
          <div className="mb-6 border border-indigo-500/20 rounded-lg overflow-hidden">
            <div className="bg-[rgba(30,30,50,0.5)] px-4 py-2 border-b border-indigo-500/20 flex justify-between items-center">
              <h4 className="font-medium text-white flex items-center">
                <FaUser className="mr-2 text-indigo-400" size={12} />
                {profile.name || 'User'}
              </h4>
              <div className="text-xs text-gray-400">
                <FaLock className="inline mr-1" size={10} /> End-to-end encrypted
              </div>
            </div>
            
            <div className="h-60 overflow-y-auto p-3 space-y-3 bg-[rgba(15,15,35,0.4)]">
              {chatMessages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Start a conversation</p>
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600/40 text-white' 
                            : 'bg-[rgba(255,255,255,0.1)] text-gray-200'
                        }`}
                      >
                        <div className="mb-1">{msg.text}</div>
                        <div className="flex justify-end items-center text-xs text-gray-400">
                          {formatMessageTime(msg.timestamp)}
                          {msg.sender === 'user' && (
                            <span className="ml-1">
                              {msg.status === 'sending' && '•'}
                              {msg.status === 'sent' && '✓'}
                              {msg.status === 'error' && <FaExclamationCircle className="text-red-400 ml-1" size={10} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>
            
            {chatError && (
              <div className="px-3 py-2 bg-red-900/20 border-y border-red-500/20 text-red-300 text-sm flex items-center">
                <FaExclamationCircle className="mr-2" size={12} />
                {chatError}
              </div>
            )}
            
            <form onSubmit={sendMessage} className="flex items-center p-3 bg-[rgba(20,20,40,0.5)]">
              <input
                ref={messageInputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-grow bg-[rgba(255,255,255,0.05)] border border-indigo-500/20 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-70"
              />
              <button 
                type="submit" 
                disabled={isSending || !message.trim()}
                className={`ml-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-white rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSending ? 'opacity-50' : ''}`}
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
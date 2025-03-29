'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '@/lib/dualite';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  getOrCreateConversation, 
  sendMessage, 
  listenToMessages, 
  ChatMessage as FirebaseChatMessage 
} from '@/lib/firebase';
import { FaArrowRight, FaGraduationCap, FaBrain, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaComments, FaPaperPlane, FaUser, FaExclamationCircle, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

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
  const router = useRouter();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [firebaseMessages, setFirebaseMessages] = useState<FirebaseChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current && isChatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen, firebaseMessages]);

  // Focus on input when chat opens
  useEffect(() => {
    if (isChatOpen && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [isChatOpen]);

  // Set up Firebase chat listener when conversation is opened
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    if (isChatOpen && user && conversationId) {
      unsubscribe = listenToMessages(conversationId, (messages) => {
        setFirebaseMessages(messages);
      });
    }
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isChatOpen, user, conversationId]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsChatOpen(false);
    }
  };

  const toggleChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login?redirect=/browse');
      return;
    }
    
    if (!isChatOpen && !conversationId && profile.id) {
      try {
        // Get or create a conversation with this profile's user
        const convId = await getOrCreateConversation(user.uid, profile.id);
        setConversationId(convId);
      } catch (error) {
        console.error('Error creating conversation:', error);
        setChatError('Failed to start conversation. Please try again.');
        return;
      }
    }
    
    setIsChatOpen(!isChatOpen);
    setChatError(null);
  };

  const sendMessageToUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || !user || !profile.id || !conversationId) return;
    
    setIsSending(true);
    
    try {
      await sendMessage(conversationId, user.uid, profile.id, message.trim());
      setMessage('');
      setChatError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Format time from timestamp
  const formatMessageTime = (timestamp: any): string => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp)
      : new Date(timestamp.toDate());
      
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle direct contact
  const handleContact = () => {
    if (profile.contact) {
      window.location.href = `mailto:${profile.contact}?subject=SkillSwap: Interested in learning ${profile.teach}&body=Hi ${profile.name || 'there'},\n\nI saw your profile on SkillSwap and I'm interested in learning ${profile.teach}. Would you be available to connect?\n\nBest regards,`;
    }
  };

  // Navigate to full conversation view
  const navigateToConversation = () => {
    if (conversationId && user) {
      router.push(`/messages/${conversationId}`);
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
              <div className="flex items-center">
                <div className="text-xs text-gray-400 mr-2">
                  <FaLock className="inline mr-1" size={10} /> Encrypted
                </div>
                <button 
                  onClick={navigateToConversation}
                  className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 px-2 py-1 rounded text-indigo-300 transition-colors"
                >
                  Expand
                </button>
              </div>
            </div>
            
            <div className="h-60 overflow-y-auto p-3 space-y-3 bg-[rgba(15,15,35,0.4)]">
              {firebaseMessages.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Start a conversation</p>
              ) : (
                <>
                  {firebaseMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          msg.senderId === user?.uid 
                            ? 'bg-indigo-600/40 text-white' 
                            : 'bg-[rgba(255,255,255,0.1)] text-gray-200'
                        }`}
                      >
                        <div className="mb-1">{msg.text}</div>
                        <div className="flex justify-end items-center text-xs text-gray-400">
                          {msg.timestamp && formatMessageTime(msg.timestamp)}
                          {msg.senderId === user?.uid && (
                            <span className="ml-1">
                              {msg.status === 'sending' && '•'}
                              {msg.status === 'sent' && '✓'}
                              {msg.status === 'read' && '✓✓'}
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
            
            <form onSubmit={sendMessageToUser} className="px-3 py-2 flex items-center gap-2 bg-[rgba(20,20,40,0.3)]">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow text-sm bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 text-white placeholder-gray-400"
                ref={messageInputRef}
                disabled={isSending}
              />
              <button 
                type="submit"
                disabled={!message.trim() || isSending}
                className={`p-2 rounded ${
                  !message.trim() || isSending
                    ? 'bg-indigo-600/20 text-indigo-300/50'
                    : 'bg-indigo-600/40 text-indigo-300 hover:bg-indigo-600/60'
                } transition-colors`}
              >
                {isSending ? <FaSpinner className="animate-spin" size={14} /> : <FaPaperPlane size={14} />}
              </button>
            </form>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-indigo-500/10">
          <button 
            onClick={toggleExpand}
            className="text-gray-400 hover:text-white text-sm flex items-center transition-colors"
          >
            {isExpanded ? (
              <>
                <FaChevronUp className="mr-1" size={12} /> Show Less
              </>
            ) : (
              <>
                <FaChevronDown className="mr-1" size={12} /> Show More
              </>
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleChat}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center text-sm px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-600/10"
            >
              <FaComments className="mr-2" size={14} /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
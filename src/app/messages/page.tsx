'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getUserConversations, ChatConversation } from '@/lib/firebase';
import { FaSpinner, FaEnvelope, FaComment, FaExclamationTriangle } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let unsubscribe: (() => void) | null = null;
    
    const fetchConversations = () => {
      try {
        // Subscribe to user's conversations
        unsubscribe = getUserConversations(user.uid, (fetchedConversations) => {
          setConversations(fetchedConversations);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
        setLoading(false);
      }
    };

    fetchConversations();

    // Unsubscribe from the listener when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Format relative time for messages
  const formatRelativeTime = (timestamp: any): string => {
    if (!timestamp) return 'Never';

    const now = new Date();
    const messageDate = new Date(timestamp.toDate());
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMin = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMin < 1) return 'Just now';
    if (diffInMin < 60) return `${diffInMin}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return messageDate.toLocaleDateString();
  };

  const navigateToChat = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <FaSpinner className="animate-spin text-indigo-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-300">Loading your conversations...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="bg-red-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-300 w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Unable to Load Conversations</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="cursor-button-secondary"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (conversations.length === 0) {
      return (
        <div className="text-center py-12 cursor-card">
          <div className="cursor-card-content">
            <div className="bg-indigo-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-indigo-300 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't started any conversations yet. Browse profiles and connect with others!
            </p>
            <button 
              onClick={() => router.push('/browse')}
              className="cursor-button"
            >
              Find Skill Swap Partners
            </button>
          </div>
        </div>
      );
    }

    // Make sure user is available
    if (!user) return null;
    
    return (
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id} 
            className="cursor-card hover:ring-1 hover:ring-indigo-500/20 transition-all cursor-pointer"
            onClick={() => conversation.id && navigateToChat(conversation.id)}
          >
            <div className="cursor-card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600/30 rounded-full flex items-center justify-center">
                    <FaComment className="text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">
                      {conversation.participants.filter(id => id !== user.uid).join(', ')}
                    </h3>
                    {conversation.lastMessage && (
                      <p className="text-gray-400 text-sm line-clamp-1">
                        {conversation.lastMessage.text}
                      </p>
                    )}
                  </div>
                </div>
                {conversation.lastMessage && conversation.lastMessage.timestamp && (
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(conversation.lastMessage.timestamp)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="page-container py-8">
        <div className="text-center mb-12">
          <h1 className="hero-title mb-4">Your Messages</h1>
          <p className="hero-subtitle max-w-3xl mx-auto">
            Connect with your skill swap partners
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
} 
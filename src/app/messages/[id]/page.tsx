'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  ChatMessage, 
  listenToMessages, 
  sendMessage, 
  getProfileByUserId
} from '@/lib/firebase';
import { FaSpinner, FaPaperPlane, FaArrowLeft, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChatPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string>('User');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = params.id;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    let unsubscribe: (() => void) | null = null;
    
    const loadConversation = async () => {
      try {
        // Get messages for this conversation
        unsubscribe = listenToMessages(conversationId, (fetchedMessages) => {
          setMessages(fetchedMessages);
          setLoading(false);
          
          // Determine the recipient ID (the other participant)
          if (fetchedMessages.length > 0) {
            const otherParticipant = fetchedMessages[0].senderId === user.uid 
              ? fetchedMessages[0].recipientId 
              : fetchedMessages[0].senderId;
            
            setRecipientId(otherParticipant);
            
            // Load recipient profile to get their name
            getProfileByUserId(otherParticipant)
              .then(profile => {
                if (profile) {
                  setRecipientName(profile.name || 'User');
                }
              })
              .catch(err => {
                console.error('Error loading recipient profile:', err);
              });
          }
          
          // Scroll to bottom when messages change
          setTimeout(scrollToBottom, 100);
        });
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };

    loadConversation();

    // Unsubscribe from the listener when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, conversationId]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !recipientId || !newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      await sendMessage(conversationId, user.uid, recipientId, newMessage.trim());
      setNewMessage('');
      
      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Format message time
  const formatMessageTime = (timestamp: any): string => {
    if (!timestamp) return '';
    
    const messageDate = new Date(timestamp.toDate());
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <FaSpinner className="animate-spin text-indigo-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-300">Loading conversation...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="bg-red-600/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-300 w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Something Went Wrong</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/messages')}
            className="cursor-button-secondary"
          >
            Back to Messages
          </button>
        </div>
      );
    }

    // Make sure user is available
    if (!user) return null;

    return (
      <div className="cursor-card h-[calc(100vh-180px)] flex flex-col">
        {/* Chat header */}
        <div className="bg-[rgba(30,30,50,0.5)] px-4 py-3 border-b border-indigo-500/20 flex justify-between items-center">
          <button
            onClick={() => router.push('/messages')}
            className="text-gray-400 hover:text-white transition-colors flex items-center"
          >
            <FaArrowLeft className="mr-2" size={14} /> Back
          </button>
          <h2 className="font-medium text-white flex items-center">
            <FaUser className="mr-2 text-indigo-400" size={14} />
            {recipientName}
          </h2>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Messages container */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.senderId === user.uid
                      ? 'bg-indigo-600/40 text-white'
                      : 'bg-[rgba(255,255,255,0.1)] text-gray-200'
                  }`}
                >
                  <div className="mb-1">{message.text}</div>
                  <div className="flex justify-end items-center text-xs text-gray-400">
                    {message.timestamp && formatMessageTime(message.timestamp)}
                    {message.senderId === user.uid && (
                      <span className="ml-1">
                        {message.status === 'sending' && '•'}
                        {message.status === 'sent' && '✓'}
                        {message.status === 'read' && '✓✓'}
                        {message.status === 'error' && '!'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <div className="p-3 border-t border-indigo-500/20">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 text-white placeholder-gray-400"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className={`p-2 rounded-lg ${
                !newMessage.trim() || sending
                  ? 'bg-[rgba(255,255,255,0.05)] text-gray-500'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-colors`}
            >
              {sending ? (
                <FaSpinner className="animate-spin w-5 h-5" />
              ) : (
                <FaPaperPlane className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="page-container py-4">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </ProtectedRoute>
  );
} 
import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { ChatMessage, ChatConversation } from '../types';

const CHAT_STORAGE_KEY = 'chatConversations';
const AUTO_SAVE_DELAY_MS = 2000; // 2 second delay for chat

export const useChatAutoSave = (
  selectedState: string,
  cancerType: string,
  stage: string,
  insuranceType: string
) => {
  const { currentUser, updateChatConversation } = useAuth();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedConversationRef = useRef<ChatConversation | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  // Generate a unique conversation ID based on context
  const generateConversationId = useCallback(() => {
    const context = `${selectedState}-${cancerType}-${stage}-${insuranceType}`;
    return `conv_${Date.now()}_${context.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }, [selectedState, cancerType, stage, insuranceType]);

  // Save to localStorage (for non-authenticated users)
  const saveToLocalStorage = useCallback((conversation: ChatConversation) => {
    try {
      const existingConversations = JSON.parse(
        localStorage.getItem(CHAT_STORAGE_KEY) || '[]'
      );
      
      const conversationIndex = existingConversations.findIndex(
        (conv: ChatConversation) => conv.id === conversation.id
      );

      if (conversationIndex >= 0) {
        existingConversations[conversationIndex] = conversation;
      } else {
        existingConversations.push(conversation);
      }

      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(existingConversations));
    } catch (error) {
      console.warn('Failed to save chat to localStorage:', error);
    }
  }, []);

  // Save to Firestore via AuthContext (for authenticated users)
  const saveToFirestore = useCallback(async (conversation: ChatConversation) => {
    if (!currentUser) return;
    
    try {
      await updateChatConversation(conversation);
    } catch (error) {
      console.warn('Failed to save chat to Firestore:', error);
      // Fallback to localStorage
      saveToLocalStorage(conversation);
    }
  }, [currentUser, updateChatConversation, saveToLocalStorage]);

  // Auto-save function with debouncing
  const autoSave = useCallback((messages: ChatMessage[]) => {
    if (messages.length === 0) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Generate conversation ID if not exists
    if (!currentConversationId) {
      setCurrentConversationId(generateConversationId());
    }

    const conversation: ChatConversation = {
      id: currentConversationId || generateConversationId(),
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString()
      })),
      context: {
        selectedState,
        cancerType,
        stage,
        insuranceType,
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Check if data has actually changed
    if (JSON.stringify(conversation) === JSON.stringify(lastSavedConversationRef.current)) {
      return;
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (currentUser) {
        saveToFirestore(conversation);
      } else {
        saveToLocalStorage(conversation);
      }
      lastSavedConversationRef.current = conversation;
    }, AUTO_SAVE_DELAY_MS);
  }, [currentUser, currentConversationId, generateConversationId, selectedState, cancerType, stage, insuranceType, saveToFirestore, saveToLocalStorage]);

  // Load saved conversations
  const loadSavedConversations = useCallback((): ChatConversation[] => {
    try {
      if (currentUser) {
        // Try to load from sessionStorage first (most recent)
        const sessionData = sessionStorage.getItem(`user_${currentUser.uid}_chatConversations`);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          return parsed.chatConversations || [];
        }
        
        // Fallback to localStorage
        const localData = localStorage.getItem(`user_${currentUser.uid}_chatConversations`);
        if (localData) {
          const parsed = JSON.parse(localData);
          return parsed.chatConversations || [];
        }
      } else {
        // Non-authenticated user - load from localStorage
        const localData = localStorage.getItem(CHAT_STORAGE_KEY);
        if (localData) {
          return JSON.parse(localData);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved chat conversations:', error);
    }
    
    return [];
  }, [currentUser]);

  // Load conversation for current context
  const loadConversationForContext = useCallback((): ChatMessage[] => {
    const conversations = loadSavedConversations();
    // const contextKey = `${selectedState}-${cancerType}-${stage}-${insuranceType}`;
    
    const matchingConversation = conversations.find(conv => 
      conv.context.selectedState === selectedState &&
      conv.context.cancerType === cancerType &&
      conv.context.stage === stage &&
      conv.context.insuranceType === insuranceType
    );

    if (matchingConversation) {
      setCurrentConversationId(matchingConversation.id);
      return matchingConversation.messages;
    }

    return [];
  }, [loadSavedConversations, selectedState, cancerType, stage, insuranceType]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    autoSave,
    loadConversationForContext,
    currentConversationId,
  };
};

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TreatmentFormData {
  selectedState: string;
  cancerType: string;
  stage: string;
  insuranceType: string;
}

const TREATMENT_FORM_STORAGE_KEY = 'treatmentFormData';
const AUTO_SAVE_DELAY_MS = 1000; // 1 second delay

export const useTreatmentFormAutoSave = () => {
  const { currentUser, updateTreatmentFormData } = useAuth();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<TreatmentFormData | null>(null);

  // Save to localStorage (for non-authenticated users)
  const saveToLocalStorage = useCallback((data: TreatmentFormData) => {
    try {
      localStorage.setItem(TREATMENT_FORM_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, []);

  // Save to Firestore via AuthContext (for authenticated users)
  const saveToFirestore = useCallback(async (data: TreatmentFormData) => {
    if (!currentUser) return;
    
    try {
      // Use the AuthContext method to update treatment form data
      // This will update the user's profile without additional Firestore calls
      await updateTreatmentFormData(data);
    } catch (error) {
      console.warn('Failed to save to Firestore:', error);
      // Fallback to localStorage
      saveToLocalStorage(data);
    }
  }, [currentUser, updateTreatmentFormData, saveToLocalStorage]);

  // Auto-save function with debouncing
  const autoSave = useCallback((data: TreatmentFormData) => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Check if data has actually changed
    if (JSON.stringify(data) === JSON.stringify(lastSavedDataRef.current)) {
      return;
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (currentUser) {
        saveToFirestore(data);
      } else {
        saveToLocalStorage(data);
      }
      lastSavedDataRef.current = data;
    }, AUTO_SAVE_DELAY_MS);
  }, [currentUser, saveToFirestore, saveToLocalStorage]);

  // Load saved data
  const loadSavedData = useCallback((): Partial<TreatmentFormData> => {
    try {
      if (currentUser) {
        // Try to load from sessionStorage first (most recent)
        const sessionData = sessionStorage.getItem(`user_${currentUser.uid}_treatmentForm`);
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          return parsed.treatmentFormData || {};
        }
        
        // Fallback to localStorage
        const localData = localStorage.getItem(`user_${currentUser.uid}_treatmentForm`);
        if (localData) {
          const parsed = JSON.parse(localData);
          return parsed.treatmentFormData || {};
        }
      } else {
        // Non-authenticated user - load from localStorage
        const localData = localStorage.getItem(TREATMENT_FORM_STORAGE_KEY);
        if (localData) {
          return JSON.parse(localData);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved treatment form data:', error);
    }
    
    return {};
  }, [currentUser]);

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
    loadSavedData,
  };
};

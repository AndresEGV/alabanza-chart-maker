import { useEffect, useRef, useCallback } from 'react';
import { SongData } from '@/types/song';

interface UseAutoSaveOptions {
  delay?: number; // Delay in milliseconds (default: 30000 = 30 seconds)
  key?: string; // localStorage key (default: 'autosaved-song')
  enabled?: boolean; // Whether autosave is enabled (default: true)
}

export function useAutoSave(
  data: SongData,
  options: UseAutoSaveOptions = {}
) {
  const {
    delay = 30000, // 30 seconds
    key = 'autosaved-song',
    enabled = true
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const saveToLocalStorage = useCallback((songData: SongData) => {
    try {
      const dataToSave = {
        ...songData,
        lastAutoSaved: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log('✅ Autoguardado exitoso:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Error en autoguardado:', error);
    }
  }, [key]);

  const scheduleAutoSave = useCallback((songData: SongData) => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(songData);
    if (currentDataString === lastSavedRef.current) {
      return; // No changes, don't save
    }

    // Schedule new autosave
    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage(songData);
      lastSavedRef.current = currentDataString;
    }, delay);
  }, [enabled, delay, saveToLocalStorage]);

  // Auto-save when data changes
  useEffect(() => {
    scheduleAutoSave(data);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, scheduleAutoSave]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveToLocalStorage(data);
    lastSavedRef.current = JSON.stringify(data);
  }, [data, saveToLocalStorage]);

  // Load autosaved data
  const loadAutoSaved = useCallback((): SongData | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Remove the lastAutoSaved property before returning
        const { lastAutoSaved, ...songData } = parsed;
        return songData as SongData;
      }
    } catch (error) {
      console.error('Error loading autosaved data:', error);
    }
    return null;
  }, [key]);

  // Check if there's autosaved data
  const hasAutoSaved = useCallback((): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [key]);

  // Clear autosaved data
  const clearAutoSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing autosaved data:', error);
    }
  }, [key]);

  // Get last autosave time
  const getLastAutoSaveTime = useCallback((): Date | null => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lastAutoSaved ? new Date(parsed.lastAutoSaved) : null;
      }
    } catch (error) {
      console.error('Error getting last autosave time:', error);
    }
    return null;
  }, [key]);

  return {
    saveNow,
    loadAutoSaved,
    hasAutoSaved,
    clearAutoSaved,
    getLastAutoSaveTime,
    isEnabled: enabled
  };
}
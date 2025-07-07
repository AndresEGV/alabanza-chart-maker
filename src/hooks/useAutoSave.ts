import { useEffect, useRef } from 'react';
import { SongData } from '@/types/song';
import { useSongStore } from '@/stores/useSongStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { debounce } from '@/utils/debounce';

interface UseAutoSaveOptions {
  enabled?: boolean;
  delay?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export function useAutoSave(
  songData: SongData | null,
  options: UseAutoSaveOptions = {}
) {
  const {
    enabled = true,
    delay = 30000, // 30 seconds
    onSave,
    onError,
  } = options;

  const { user } = useAuthStore();
  const { 
    currentSong, 
    saveDraft, 
    updateSong, 
    autoSaveEnabled,
    setHasUnsavedChanges 
  } = useSongStore();
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');

  // Debounced save function
  const debouncedSave = useRef(
    debounce(async (data: SongData) => {
      if (!user || !data || !enabled || !autoSaveEnabled) return;

      try {
        const dataString = JSON.stringify(data);
        
        // Don't save if data hasn't changed
        if (dataString === lastSavedDataRef.current) {
          return;
        }

        // If we have a current song (already saved), update it
        if (currentSong?.id && !currentSong.isDraft) {
          await updateSong(currentSong.id, data);
        } else {
          // Otherwise save as draft
          await saveDraft(data, user.uid);
        }

        lastSavedDataRef.current = dataString;
        setHasUnsavedChanges(false);
        onSave?.();
        
      } catch (error) {
        console.error('Autosave error:', error);
        onError?.(error as Error);
        toast.error('Error al guardar automáticamente');
      }
    }, 2000) // 2 second debounce
  ).current;

  // Effect for periodic saves
  useEffect(() => {
    if (!songData || !enabled || !autoSaveEnabled || !user) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set up periodic save
    saveTimeoutRef.current = setInterval(() => {
      debouncedSave(songData);
    }, delay);

    return () => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current);
      }
    };
  }, [songData, enabled, autoSaveEnabled, delay, user]);

  // Effect for immediate save on data change
  useEffect(() => {
    if (!songData || !enabled || !autoSaveEnabled || !user) return;

    const dataString = JSON.stringify(songData);
    if (dataString !== lastSavedDataRef.current) {
      setHasUnsavedChanges(true);
      debouncedSave(songData);
    }
  }, [songData, enabled, autoSaveEnabled, user]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (songData && enabled && autoSaveEnabled && user) {
        // Force immediate save on unmount
        debouncedSave.cancel();
        const dataString = JSON.stringify(songData);
        if (dataString !== lastSavedDataRef.current) {
          saveDraft(songData, user.uid);
        }
      }
    };
  }, []);

  return {
    saveNow: () => {
      if (songData && user) {
        debouncedSave(songData);
      }
    },
    lastSaved: lastSavedDataRef.current ? new Date() : null,
  };
}
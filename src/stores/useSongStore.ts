import { create } from 'zustand';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { SongData } from '@/types/song';

export interface SavedSong extends SongData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  version: number;
  isDraft?: boolean;
}

interface SongState {
  songs: SavedSong[];
  currentSong: SavedSong | null;
  loading: boolean;
  error: string | null;
  autoSaveEnabled: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  
  // Actions
  fetchUserSongs: (userId: string) => Promise<void>;
  createSong: (songData: SongData, userId: string) => Promise<string>;
  updateSong: (songId: string, updates: Partial<SongData>) => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  loadSong: (songId: string) => Promise<void>;
  saveDraft: (songData: SongData, userId: string) => Promise<void>;
  setCurrentSong: (song: SavedSong | null) => void;
  setAutoSave: (enabled: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSongStore = create<SongState>((set, get) => ({
  songs: [],
  currentSong: null,
  loading: false,
  error: null,
  autoSaveEnabled: true,
  lastSaved: null,
  hasUnsavedChanges: false,

  setCurrentSong: (song) => set({ currentSong: song }),
  setAutoSave: (enabled) => set({ autoSaveEnabled: enabled }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  setError: (error) => set({ error }),

  fetchUserSongs: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'songs'),
        where('userId', '==', userId),
        where('isDraft', '!=', true),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const songs: SavedSong[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        songs.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SavedSong);
      });
      
      set({ songs, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createSong: async (songData, userId) => {
    set({ loading: true, error: null });
    try {
      const songRef = doc(collection(db, 'songs'));
      const savedSong: Omit<SavedSong, 'id'> = {
        ...songData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        tags: [],
        version: 1,
        isDraft: false,
      };
      
      await setDoc(songRef, {
        ...savedSong,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      const newSong = { ...savedSong, id: songRef.id } as SavedSong;
      set((state) => ({
        songs: [newSong, ...state.songs],
        currentSong: newSong,
        loading: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));
      
      return songRef.id;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateSong: async (songId, updates) => {
    set({ loading: true, error: null });
    try {
      const songRef = doc(db, 'songs', songId);
      await updateDoc(songRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      set((state) => ({
        songs: state.songs.map((s) =>
          s.id === songId
            ? { ...s, ...updates, updatedAt: new Date() }
            : s
        ),
        currentSong: state.currentSong?.id === songId
          ? { ...state.currentSong, ...updates, updatedAt: new Date() }
          : state.currentSong,
        loading: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteSong: async (songId) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'songs', songId));
      
      set((state) => ({
        songs: state.songs.filter((s) => s.id !== songId),
        currentSong: state.currentSong?.id === songId ? null : state.currentSong,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loadSong: async (songId) => {
    set({ loading: true, error: null });
    try {
      const songDoc = await getDoc(doc(db, 'songs', songId));
      
      if (songDoc.exists()) {
        const data = songDoc.data();
        const song: SavedSong = {
          ...data,
          id: songDoc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as SavedSong;
        
        set({ currentSong: song, loading: false });
      } else {
        throw new Error('Song not found');
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  saveDraft: async (songData, userId) => {
    try {
      const draftRef = doc(db, 'drafts', userId);
      await setDoc(draftRef, {
        ...songData,
        userId,
        updatedAt: serverTimestamp(),
        isDraft: true,
      });
      
      set({ 
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      });
    } catch (error: any) {
      console.error('Error saving draft:', error);
      // Don't throw, just log - drafts failing shouldn't interrupt user
    }
  },
}));
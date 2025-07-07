import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLogin: Date;
  preferences: {
    theme: 'light' | 'dark';
    showChords: boolean;
    autoSave: boolean;
  };
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      loginWithEmail: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          await get().updateUserProfile({ lastLogin: new Date() });
          set({ loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signupWithEmail: async (email, password, displayName) => {
        set({ loading: true, error: null });
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          
          // Update display name
          if (credential.user) {
            await updateProfile(credential.user, { displayName });
            
            // Create user profile in Firestore
            const userProfile: UserProfile = {
              uid: credential.user.uid,
              email: credential.user.email,
              displayName,
              photoURL: null,
              createdAt: new Date(),
              lastLogin: new Date(),
              preferences: {
                theme: 'light',
                showChords: true,
                autoSave: true,
              },
            };
            
            await setDoc(doc(db, 'users', credential.user.uid), userProfile);
            set({ user: userProfile, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          
          // Check if user profile exists
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (!userDoc.exists()) {
            // Create new profile
            const userProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              lastLogin: new Date(),
              preferences: {
                theme: 'light',
                showChords: true,
                autoSave: true,
              },
            };
            
            await setDoc(doc(db, 'users', user.uid), userProfile);
            set({ user: userProfile, loading: false });
          } else {
            // Update last login
            await get().updateUserProfile({ lastLogin: new Date() });
            set({ loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await signOut(auth);
          set({ user: null, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateUserProfile: async (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        try {
          const updatedProfile = { ...currentUser, ...updates };
          await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true });
          set({ user: updatedProfile });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Auth state listener
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      useAuthStore.getState().setUser(userDoc.data() as UserProfile);
    }
  } else {
    useAuthStore.getState().setUser(null);
  }
  useAuthStore.getState().setLoading(false);
});
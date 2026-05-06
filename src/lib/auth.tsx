import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile } from '../app/actions';

interface UserProfile {
  plan: 'free' | 'pro' | 'agency';
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      if (!auth.currentUser) return;
      const idToken = await auth.currentUser.getIdToken();
      const userProfile = await getUserProfile(idToken);
      
      // Fix dates (they come back from server action as objects or strings sometimes, or we just set current date to be safe if missing)
      setProfile({ 
        ...userProfile, 
        createdAt: userProfile.createdAt || new Date(), 
        updatedAt: userProfile.updatedAt || new Date() 
      } as UserProfile);
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile: async () => {
      if (user) await fetchProfile(user.uid);
    } }}>
      {children}
    </AuthContext.Provider>
  );
}

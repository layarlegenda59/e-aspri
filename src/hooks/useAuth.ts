import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  nip: string;
  avatar: string;
}

// =========================================================
// SOURCE OF TRUTH: User profiles defined here in code.
// Names are ALWAYS resolved from this map, never from localStorage.
// To rename a user, just update this map — no cache issues.
// =========================================================
const USER_PROFILES: Record<string, Partial<User>> = {
  'u_iyan': {
    name: 'Bpk. Iyan Satria',
    role: 'Asisten Pimpinan',
    nip: '198205122008011003',
    avatar: '👨‍💼'
  },
  'u_fauzi': {
    name: 'Dr. Ir. H. Ahmad Fauzi, ME.',
    role: 'Asisten Pimpinan',
    nip: '197509141998031002',
    avatar: '👨‍💼'
  }
};

/** Merge stored session with latest profile data from code */
function resolveUser(stored: User | null): User | null {
  if (!stored) return null;
  const profile = USER_PROFILES[stored.id];
  if (!profile) return stored;
  return { ...stored, ...profile };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('e_aspri_user');
    if (saved) {
      try {
        // Always resolve against latest code profile on load
        return resolveUser(JSON.parse(saved));
      } catch {
        return null;
      }
    }
    return null;
  });

  // Sync any profile changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('e_aspri_user', JSON.stringify(user));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (nipOrUsername: string, pass: string) => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock verification
    if (nipOrUsername.trim().length > 3) {
      const userId = nipOrUsername === 'iyan' ? 'u_iyan' : 'u_fauzi';
      const profile = USER_PROFILES[userId];
      const mockUser: User = {
        id: userId,
        name: profile?.name ?? nipOrUsername,
        role: profile?.role ?? 'Asisten Pimpinan',
        nip: profile?.nip ?? '000000000000000000',
        avatar: profile?.avatar ?? '👤'
      };
      
      setUser(mockUser);
      localStorage.setItem('e_aspri_user', JSON.stringify(mockUser));
      setLoading(false);
      return true;
    } else {
      setError('NIP atau Username salah. Minimal 4 karakter.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('e_aspri_user');
  };

  return {
    user,
    loading,
    error,
    login,
    logout
  };
}

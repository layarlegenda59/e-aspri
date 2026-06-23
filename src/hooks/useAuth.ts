import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  nip: string;
  avatar: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('e_aspri_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user && user.role !== 'Asisten Pimpinan') {
      const updatedUser = { ...user, role: 'Asisten Pimpinan' };
      setUser(updatedUser);
      localStorage.setItem('e_aspri_user', JSON.stringify(updatedUser));
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
      const mockUser: User = {
        id: 'u_iyan',
        name: nipOrUsername === 'iyan' ? 'Bapak Iyan, M.Si.' : 'Dr. Ir. H. Ahmad Fauzi, ME.',
        role: 'Asisten Pimpinan',
        nip: nipOrUsername === 'iyan' ? '198205122008011003' : '197509141998031002',
        avatar: nipOrUsername === 'iyan' ? '👨‍💼' : '👨‍💼'
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

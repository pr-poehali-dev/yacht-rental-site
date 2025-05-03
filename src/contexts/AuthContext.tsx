
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, getUserByEmail, validateUser, registerUser } from '@/data/users';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем, есть ли данные пользователя в localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Ошибка при парсинге данных пользователя:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // В реальном приложении здесь будет запрос к API
      const validatedUser = validateUser(email, password);
      
      if (validatedUser) {
        setUser(validatedUser);
        localStorage.setItem('user', JSON.stringify(validatedUser));
        return true;
      } else {
        setError('Неверный email или пароль');
        return false;
      }
    } catch (e) {
      setError('Произошла ошибка при входе в систему');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Проверяем, существует ли уже пользователь с таким email
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        setError('Пользователь с таким email уже существует');
        return false;
      }
      
      // В реальном приложении здесь будет запрос к API
      const newUser = registerUser({ name, email, password, phone });
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (e) {
      setError('Произошла ошибка при регистрации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

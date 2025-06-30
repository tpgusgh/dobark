import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuthState({ user, isLoggedIn: true });
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (user && password === 'password') { // Simplified for demo
      localStorage.setItem('currentUser', JSON.stringify(user));
      setAuthState({ user, isLoggedIn: true });
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      balance: 10000, // Starting balance
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setAuthState({ user: newUser, isLoggedIn: true });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({ user: null, isLoggedIn: false });
  };

  const updateBalance = (newBalance: number) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, balance: newBalance };
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === authState.user!.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setAuthState({ user: updatedUser, isLoggedIn: true });
      }
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateBalance,
  };
};
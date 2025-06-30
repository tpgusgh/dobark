export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface GameResult {
  id: string;
  userId: string;
  gameType: 'snail-race';
  betAmount: number;
  winAmount: number;
  result: 'win' | 'lose';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}
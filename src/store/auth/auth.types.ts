export interface AdminProfile {
  id: string;
  username: string;
  email: string;
  role?: string | null;
}

export interface AuthStore {
  isAuthenticated: boolean;
  admin: AdminProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setAdmin: (user: AdminProfile | null) => void;
  setAccessToken: (token: string | null) => void;
  setIsLoading: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (admin: AdminProfile, accessToken: string) => void;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContextType, AuthState, User, GoogleLoginResponse } from '../types/auth';
import { setSession, clearSession, getSession, getUserRole, getUserData } from '../utils/auth';

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    role_name: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getSession();
        const role = getUserRole();
        const userData = getUserData();

        if (token && userData) {
          setState({
            isLoggedIn: true,
            isInitialized: true,
            user: userData,
            role_name: role,
          });
        } else {
          setState({
            isLoggedIn: false,
            isInitialized: true,
            user: null,
            role_name: null,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({
          isLoggedIn: false,
          isInitialized: true,
          user: null,
          role_name: null,
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Google login function
   * Sends user data to backend and handles authentication
   */
  const googleLogin = async (
    email: string,
    fullname: string,
    telephone: string
  ): Promise<void> => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      
      if (!backendUrl) {
        throw new Error('Backend API URL is not configured');
      }

      // Send email, fullname, and telephone to the backend
      const response = await axios.post<{ data: GoogleLoginResponse }>(
        `${backendUrl}/google/user/login`,
        {
          email,
          fullname,
          telephone,
        }
      );

      // Extract data from the response
      const responseData = response.data.data;
      const access_token = responseData.access_token;
      const role_name = responseData.role_name || 'User';
      const backendUserData = responseData.data;

      // Construct user object
      const user: User = {
        id: backendUserData.id || '',
        email: email,
        fullname: backendUserData.fullname || fullname,
        username: backendUserData.username,
        telephone: backendUserData.telephone || telephone,
        role_name: role_name,
      };

      // Update session and state
      setSession(access_token, role_name, user);
      
      setState({
        isLoggedIn: true,
        isInitialized: true,
        user: user,
        role_name: role_name,
      });

      // Navigate to dashboard
      router.push('/example-chat');
    } catch (error) {
      console.error('Google Login error:', error);
      
      // Clear any partial session data
      clearSession();
      
      setState({
        isLoggedIn: false,
        isInitialized: true,
        user: null,
        role_name: null,
      });
      
      throw error;
    }
  };

  /**
   * Logout function
   * Clears session and redirects to login
   */
  const logout = () => {
    clearSession();
    
    setState({
      isLoggedIn: false,
      isInitialized: true,
      user: null,
      role_name: null,
    });

    router.push('/login');
  };

  const value: AuthContextType = {
    ...state,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * Throws error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;

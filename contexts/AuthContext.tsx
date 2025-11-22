import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContextType, AuthState, User, GoogleLoginResponse } from '../types/auth';
import { setSession, clearSession, getSession, getUserRole, getUserData } from '../utils/auth';
import { setDevAuthToken, clearDevAuthToken } from '../src/utils/auth-utils';

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
      const backendUrl = process.env.NEXT_PUBLIC_API_URL;
      
      console.log('🔧 Backend URL:', backendUrl);
      
      if (!backendUrl) {
        console.error('❌ Backend API URL is not configured!');
        throw new Error('Backend API URL is not configured');
      }

      const loginUrl = `${backendUrl}/google/user/login`;
      console.log('📤 Sending login request to:', loginUrl);
      console.log('📦 Payload:', { email, fullname, telephone });

      // Send email, fullname, and telephone to the backend
      const response = await axios.post<{ data: GoogleLoginResponse }>(
        loginUrl,
        {
          email,
          fullname,
          telephone,
        }
      );

      console.log('📥 Backend response:', response.data);

      // Extract data from the response with safe fallbacks
      const responseData = response.data.data;
      
      if (!responseData) {
        throw new Error('Invalid response structure from backend');
      }

      const access_token = responseData.access_token;
      const role_name = responseData.role_name || 'User';
      const backendUserData: any = responseData.data || {};

      // Construct user object with safe fallbacks
      const user: User = {
        id: backendUserData.id || email, // Use email as fallback ID
        email: email,
        fullname: backendUserData.fullname || fullname,
        username: backendUserData.username || email.split('@')[0],
        telephone: backendUserData.telephone || telephone,
        role_name: role_name,
      };

      console.log('👤 Constructed user object:', user);

      // Set the session with the received token and user data
      setSession(
        responseData.access_token,
        responseData.role_name,
        responseData.data
      );

      // In development, store the token for WebSocket authentication
      if (process.env.NODE_ENV !== 'production') {
        setDevAuthToken(responseData.access_token);
      }

      // Update auth state
      setState({
        isLoggedIn: true,
        isInitialized: true,
        user: responseData.data,
        role_name: responseData.role_name,
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
    // Clear session data
    clearSession();
    
    // Clear development WebSocket token
    if (process.env.NODE_ENV !== 'production') {
      clearDevAuthToken();
    }
    
    // Reset auth state
    setState({
      isLoggedIn: false,
      isInitialized: true,
      user: null,
      role_name: null,
    });
    
    // Redirect to login page
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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  
  // Generate a unique session ID for this tab
  const [sessionId] = useState(() => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize auth state from session storage
  const getInitialAuthState = (): AuthState => {
    const storedState = sessionStorage.getItem(`authState_${window.location.origin}_${sessionId}`);
    return storedState ? JSON.parse(storedState) : {
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false
    };
  };

  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState());

  // Update session storage when auth state changes
  const updateAuthState = (newState: AuthState) => {
    setAuthState(newState);
    sessionStorage.setItem(`authState_${window.location.origin}_${sessionId}`, JSON.stringify(newState));
    // Broadcast the change to other tabs
    const broadcastChannel = new BroadcastChannel('auth_state_change');
    broadcastChannel.postMessage({ sessionId, state: newState });
  };

  // Handle auth state changes across tabs using BroadcastChannel
  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('auth_state_change');

    const handleMessage = (event: MessageEvent) => {
      const { sessionId: broadcastSessionId, state } = event.data;
      // Only update if the message is from a different tab
      if (broadcastSessionId !== sessionId) {
        if (state === null) {
          // Another tab logged out
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false
          });
          navigate('/login');
        } else {
          setAuthState(state);
        }
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel.close();
    };
  }, [navigate, sessionId]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setAuthState({
              user: userData,
              loading: false,
              error: null,
              isAuthenticated: true
            });
          } else {
            // If user document doesn't exist in Firestore but exists in Firebase Auth
            // Create a basic user object with data from Firebase Auth
            const basicUserData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'patient', // Default role
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            setAuthState({
              user: basicUserData,
              loading: false,
              error: null,
              isAuthenticated: true
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({
            user: null,
            loading: false,
            error: 'Failed to fetch user data',
            isAuthenticated: false
          });
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to implement exponential backoff
  const retryWithBackoff = async <T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Max retries exceeded');
  };

  const handleAuthError = (error: unknown): string => {
    if (error instanceof Error) {
      if ('code' in error && typeof error.code === 'string') {
        const authError = error as AuthError;
        switch (authError.code) {
          case 'auth/email-already-in-use':
            return 'This email is already registered. Please try logging in instead.';
          case 'auth/invalid-email':
            return 'Please enter a valid email address.';
          case 'auth/operation-not-allowed':
            return 'Email/password sign up is not enabled. Please contact support.';
          case 'auth/weak-password':
            return 'Password is too weak. Please use a stronger password with at least 6 characters.';
          case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            return 'Invalid email or password.';
          case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
          case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
          default:
            return error.message || 'An unexpected error occurred. Please try again.';
        }
      }
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>) => {
    if (!isOnline) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Cannot create account while offline. Please check your internet connection.'
      }));
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await retryWithBackoff(async () => {
        const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update Firebase user profile
        if (firebaseUser) {
          await updateProfile(firebaseUser, {
            displayName: userData.displayName
          });
        }
    
        const newUserData = {
          ...userData,
          uid: firebaseUser.uid,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          createdAt: new Date(),
          updatedAt: new Date()
        };
  
        // Create user document in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
    
        return { firebaseUser, userData: newUserData };
      });
  
      if (result) {
        const { userData } = result;
        const user: User = {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        };
        setAuthState(prev => ({
          ...prev,
          user,
          loading: false,
          error: null,
          isAuthenticated: true
        }));
        
        // Redirect based on user role, similar to signIn function
        switch (result.userData.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'nurse':
            navigate('/nurse/dashboard');
            break;
          case 'patient':
            navigate('/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (error) {
      const errorMessage = handleAuthError(error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isOnline) {
      const offlineError = 'Cannot sign in while offline. Please check your internet connection.';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: offlineError,
        isAuthenticated: false
      }));
      throw new Error(offlineError);
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // Implement retry with backoff for authentication
      const { user: firebaseUser } = await retryWithBackoff(
        () => signInWithEmailAndPassword(auth, email, password)
      );
      
      if (!firebaseUser) {
        throw new Error('Authentication failed');
      }

      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        let userData: User;
        
        if (!userDoc.exists()) {
          // If user document doesn't exist in Firestore but exists in Firebase Auth
          userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'patient', // Default role
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Create the user document in Firestore to ensure persistence
          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        } else {
          userData = userDoc.data() as User;
        }

        // Update auth state with user data
        updateAuthState({
          user: userData,
          loading: false,
          error: null,
          isAuthenticated: true
        });

        // Redirect based on user role
        switch (userData.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'nurse':
            navigate('/nurse/dashboard');
            break;
          case 'patient':
          default:
            navigate('/dashboard');
            break;
        }
      } catch (firestoreError) {
        console.error('Error fetching/creating user data:', firestoreError);
        const errorMessage = 'Failed to load user profile. Please try again.';
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          isAuthenticated: false
        }));
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = handleAuthError(error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        isAuthenticated: false
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear this tab's session storage
      sessionStorage.removeItem(`authState_${window.location.origin}_${sessionId}`);
      // Notify other tabs about logout
      const broadcastChannel = new BroadcastChannel('auth_state_change');
      broadcastChannel.postMessage({ sessionId, state: null });
      broadcastChannel.close();
      updateAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      });
      navigate('/login');
    } catch (error) {
      updateAuthState({
        ...authState,
        error: 'Failed to logout'
      });
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    logout,
    isOnline
  };
};
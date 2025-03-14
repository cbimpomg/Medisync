import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        let retries = 3;
        while (retries > 0) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) {
              setAuthState({
                user: null,
                loading: false,
                error: 'User data not found in database'
              });
              return;
            }
            const userData = userDoc.data() as User;
            setAuthState({
              user: userData,
              loading: false,
              error: null
            });
            return;
          } catch (error) {
            retries--;
            if (retries === 0) {
              console.error('Firestore connection error:', error);
              setAuthState({
                user: null,
                loading: false,
                error: 'Connection error. Please check your internet connection and try again.'
              });
              return;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data() as User;
      setAuthState({
        user: userData,
        loading: false,
        error: null
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
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in'
      }));
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'uid'>) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        uid: firebaseUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to create account'
      }));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/signup');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to logout'
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    logout
  };
};
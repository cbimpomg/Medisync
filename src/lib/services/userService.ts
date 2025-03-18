import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, collections, User } from '../firebase';

/**
 * User Service - Handles all user-related operations with Firestore
 */
export const userService = {
  /**
   * Get a user by their ID
   * @param userId - The user's ID
   * @returns The user data or null if not found
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, collections.users, userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  /**
   * Create a new user in Firestore
   * @param userData - The user data to create
   * @returns The created user data
   */
  async createUser(userData: User): Promise<User> {
    try {
      await setDoc(doc(db, collections.users, userData.uid), userData);
      return userData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update an existing user in Firestore
   * @param userId - The user's ID
   * @param userData - The user data to update
   * @returns The updated user data
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const userRef = doc(db, collections.users, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const updatedData = {
        ...userData,
        updatedAt: new Date()
      };
      
      await updateDoc(userRef, updatedData);
      
      // Get the updated user data
      const updatedUserDoc = await getDoc(userRef);
      return updatedUserDoc.data() as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Get users by role
   * @param role - The role to filter by
   * @returns Array of users with the specified role
   */
  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(db, collections.users),
        where('role', '==', role)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error) {
      console.error(`Error getting ${role}s:`, error);
      throw error;
    }
  },

  /**
   * Search users by name
   * @param searchTerm - The search term to look for in displayName
   * @returns Array of users matching the search term
   */
  async searchUsersByName(searchTerm: string): Promise<User[]> {
    try {
      // Note: Firestore doesn't support native text search
      // This is a simple implementation that gets all users and filters client-side
      // For production, consider using Algolia or similar search service
      const querySnapshot = await getDocs(collection(db, collections.users));
      const users = querySnapshot.docs.map(doc => doc.data() as User);
      
      return users.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
};
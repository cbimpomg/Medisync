import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, onSnapshot } from 'firebase/firestore';
import { db, collections, Message, User } from '../firebase';

// Define allowed messaging relationships
const ALLOWED_MESSAGING_RULES = {
  patient: ['doctor', 'nurse'],
  doctor: ['patient', 'nurse', 'admin', 'doctor'],
  nurse: ['patient', 'doctor', 'admin', 'nurse'],
  admin: ['doctor', 'nurse', 'admin', 'patient']
};

/**
 * Message Service - Handles all message-related operations with Firestore
 */
export const messageService = {
  /**
   * Get conversations for a user
   * @param userId - The user's ID
   * @returns Array of conversations with latest message
   */
  async getConversations(userId: string) {
    try {
      // Get messages where the user is either sender or receiver
      const sentQuery = query(
        collection(db, collections.messages),
        where('senderId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const receivedQuery = query(
        collection(db, collections.messages),
        where('receiverId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);

      // Combine and process messages to create conversations
      const messages: Message[] = [];
      sentSnapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      receivedSnapshot.forEach(doc => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });

      // Group by conversation partner
      const conversationsMap = new Map();
      
      for (const message of messages) {
        const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
        
        if (!conversationsMap.has(partnerId) || 
            (conversationsMap.get(partnerId).createdAt < message.createdAt)) {
          conversationsMap.set(partnerId, message);
        }
      }
      
      // Get user details for each conversation partner
      const conversations = [];
      for (const [partnerId, lastMessage] of conversationsMap.entries()) {
        const partnerDoc = await getDoc(doc(db, collections.users, partnerId));
        if (partnerDoc.exists()) {
          const partner = partnerDoc.data() as User;
          conversations.push({
            id: partnerId,
            name: partner.displayName,
            avatar: partner.photoURL || '',
            role: partner.role,
            lastMessage: lastMessage.content,
            timestamp: (lastMessage.createdAt as Timestamp).toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            unread: lastMessage.senderId !== userId && !lastMessage.read ? 1 : 0,
            online: true // This would need a separate online status tracking system
          });
        }
      }
      
      return conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  },

  /**
   * Get messages between two users
   * @param userId - The current user's ID
   * @param partnerId - The conversation partner's ID
   * @returns Array of messages
   */
  async getMessages(userId: string, partnerId: string) {
    try {
      // Get messages where the two users are communicating
      const sentQuery = query(
        collection(db, collections.messages),
        where('senderId', '==', userId),
        where('receiverId', '==', partnerId),
        orderBy('createdAt', 'asc')
      );
      
      const receivedQuery = query(
        collection(db, collections.messages),
        where('senderId', '==', partnerId),
        where('receiverId', '==', userId),
        orderBy('createdAt', 'asc')
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);

      // Combine and process messages
      const messages: Array<{
        id: string;
        senderId: string;
        senderName: string;
        content: string;
        timestamp: string;
        read: boolean;
      }> = [];
      
      sentSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          senderName: 'You',
          content: data.content,
          timestamp: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          read: data.read
        });
      });
      
      // Get partner details to display the correct name
      const partnerDoc = await getDoc(doc(db, collections.users, partnerId));
      const partnerName = partnerDoc.exists() ? (partnerDoc.data() as User).displayName : 'Unknown User';
      
      receivedSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          senderName: partnerName,
          content: data.content,
          timestamp: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          read: data.read
        });
      });

      // Mark unread messages as read
      const unreadMessages = receivedSnapshot.docs.filter(doc => !doc.data().read);
      const updatePromises = unreadMessages.map(doc => {
        return updateDoc(doc.ref, { read: true });
      });
      
      await Promise.all(updatePromises);

      // Sort messages by timestamp
      return messages.sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  /**
   * Subscribe to messages between two users in real-time
   * @param userId - The current user's ID
   * @param partnerId - The conversation partner's ID
   * @param callback - Function to call when messages change
   * @returns Unsubscribe function
   */
  subscribeToMessages(userId: string, partnerId: string, callback: (messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
  }>) => void) {
    try {
      // Create queries for sent and received messages
      const sentQuery = query(
        collection(db, collections.messages),
        where('senderId', '==', userId),
        where('receiverId', '==', partnerId),
        orderBy('createdAt', 'asc')
      );
      
      const receivedQuery = query(
        collection(db, collections.messages),
        where('senderId', '==', partnerId),
        where('receiverId', '==', userId),
        orderBy('createdAt', 'asc')
      );

      // Get partner details to display the correct name
      let partnerName = 'Unknown User';
      getDoc(doc(db, collections.users, partnerId)).then(partnerDoc => {
        if (partnerDoc.exists()) {
          partnerName = (partnerDoc.data() as User).displayName;
        }
      });

      // Keep track of all messages
      const allMessages = new Map();

      // Process updates from either query
      const processMessagesUpdate = async (snapshot, isSent) => {
        // Mark received messages as read
        if (!isSent) {
          const unreadMessages = snapshot.docs.filter(doc => !doc.data().read);
          unreadMessages.forEach(doc => {
            updateDoc(doc.ref, { read: true });
          });
        }

        // Update the messages map
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data();
          const messageId = change.doc.id;

          if (change.type === 'added' || change.type === 'modified') {
            allMessages.set(messageId, {
              id: messageId,
              senderId: data.senderId,
              senderName: isSent ? 'You' : partnerName,
              content: data.content,
              timestamp: (data.createdAt as Timestamp)?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              read: data.read
            });
          } else if (change.type === 'removed') {
            allMessages.delete(messageId);
          }
        });

        // Convert map to array and sort by timestamp
        const messagesArray = Array.from(allMessages.values());
        const sortedMessages = messagesArray.sort((a, b) => {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });

        // Call the callback with the updated messages
        callback(sortedMessages);
      };

      // Set up listeners for both queries
      const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
        processMessagesUpdate(snapshot, true);
      });

      const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
        processMessagesUpdate(snapshot, false);
      });


      // Return a function to unsubscribe from both listeners
      return () => {
        unsubscribeSent();
        unsubscribeReceived();
      };
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      throw error;
    }
  },

  /**
   * Send a new message
   * @param senderId - The sender's ID
   * @param receiverId - The receiver's ID
   * @param content - The message content
   * @returns The created message
   */
  async sendMessage(senderId: string, receiverId: string, content: string) {
    try {
      // Get sender and receiver roles
      const [senderDoc, receiverDoc] = await Promise.all([
        getDoc(doc(db, collections.users, senderId)),
        getDoc(doc(db, collections.users, receiverId))
      ]);
      
      if (!senderDoc.exists() || !receiverDoc.exists()) {
        throw new Error('Sender or receiver not found');
      }
      
      const senderRole = senderDoc.data().role;
      const receiverRole = receiverDoc.data().role;
      
      // Check if messaging is allowed based on roles
      const allowedReceiverRoles = ALLOWED_MESSAGING_RULES[senderRole] || [];
      if (!allowedReceiverRoles.includes(receiverRole)) {
        throw new Error(`${senderRole} cannot send messages to ${receiverRole}`);
      }

      const messageData = {
        senderId,
        receiverId,
        content,
        read: false,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, collections.messages), messageData);
      return {
        id: docRef.id,
        ...messageData,
        createdAt: new Date() // Use current date as serverTimestamp is null initially
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
      }

  /**
   * Mark a message as read
   * @param messageId - The message ID
   * @returns Promise that resolves when the operation is complete
   */
,async  markAsRead(messageId: string) {
    try {
      const messageRef = doc(db, collections.messages, messageId);
      await updateDoc(messageRef, { read: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};
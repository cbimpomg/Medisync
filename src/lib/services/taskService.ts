import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, deleteDoc } from 'firebase/firestore';
import { db, collections, User } from '../firebase';

// Task interface
export interface Task {
  id: string;
  title: string;
  patientId: string;
  assignedTo: string; // User ID of the nurse assigned to the task
  assignedBy: string; // User ID of the person who assigned the task
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  category: string; // e.g., 'Medication', 'Wound Care', 'Monitoring', etc.
  dueDate: Date;
  dueTime: string;
  description: string;
  notes?: string;
  room?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * Task Service - Handles all task-related operations with Firestore
 */
export const taskService = {
  /**
   * Get tasks assigned to a specific nurse
   * @param nurseId - The nurse's ID
   * @param status - Optional status filter
   * @returns Array of tasks
   */
  async getNurseTasks(nurseId: string, status?: Task['status']) {
    try {
      let tasksQuery;
      
      if (status) {
        tasksQuery = query(
          collection(db, collections.tasks),
          where('assignedTo', '==', nurseId),
          where('status', '==', status),
          orderBy('dueDate', 'asc')
        );
      } else {
        tasksQuery = query(
          collection(db, collections.tasks),
          where('assignedTo', '==', nurseId),
          orderBy('dueDate', 'asc')
        );
      }

      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks: Array<Task & {
        patientName: string;
        assignedByName: string;
      }> = [];

      for (const docSnapshot of tasksSnapshot.docs) {
        const taskData = docSnapshot.data() as Task;
        
        // Get patient details
        const patientDoc = await getDoc(doc(db, collections.users, taskData.patientId));
        const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
        
        // Get assigner details
        const assignerDoc = await getDoc(doc(db, collections.users, taskData.assignedBy));
        const assignerData = assignerDoc.exists() ? assignerDoc.data() as User : null;
        
        tasks.push({
          id: docSnapshot.id,
          ...taskData,
          patientName: patientData?.displayName || 'Unknown Patient',
          assignedByName: assignerData?.displayName || 'Unknown',
          dueDate: taskData.dueDate instanceof Timestamp ? 
            taskData.dueDate.toDate() : 
            new Date(taskData.dueDate),
        });
      }

      return tasks;
    } catch (error) {
      console.error('Error getting nurse tasks:', error);
      throw error;
    }
  },

  /**
   * Get tasks for a specific patient
   * @param patientId - The patient's ID
   * @returns Array of tasks
   */
  async getPatientTasks(patientId: string) {
    try {
      const tasksQuery = query(
        collection(db, collections.tasks),
        where('patientId', '==', patientId),
        orderBy('dueDate', 'asc')
      );

      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks: Array<Task & {
        nurseName: string;
        assignedByName: string;
      }> = [];

      for (const docSnapshot of tasksSnapshot.docs) {
        const taskData = docSnapshot.data() as Task;
        
        // Get nurse details
        const nurseDoc = await getDoc(doc(db, collections.users, taskData.assignedTo));
        const nurseData = nurseDoc.exists() ? nurseDoc.data() as User : null;
        
        // Get assigner details
        const assignerDoc = await getDoc(doc(db, collections.users, taskData.assignedBy));
        const assignerData = assignerDoc.exists() ? assignerDoc.data() as User : null;
        
        tasks.push({
          id: docSnapshot.id,
          ...taskData,
          nurseName: nurseData?.displayName || 'Unknown Nurse',
          assignedByName: assignerData?.displayName || 'Unknown',
          dueDate: taskData.dueDate instanceof Timestamp ? 
            taskData.dueDate.toDate() : 
            new Date(taskData.dueDate),
        });
      }

      return tasks;
    } catch (error) {
      console.error('Error getting patient tasks:', error);
      throw error;
    }
  },

  /**
   * Get all tasks (for administrators or charge nurses)
   * @param status - Optional status filter
   * @param date - Optional date filter
   * @returns Array of tasks
   */
  async getAllTasks(status?: Task['status'], date?: Date) {
    try {
      let tasksQuery;
      
      if (status && date) {
        // Create date range for the specified date (start of day to end of day)
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        tasksQuery = query(
          collection(db, collections.tasks),
          where('status', '==', status),
          where('dueDate', '>=', startDate),
          where('dueDate', '<=', endDate),
          orderBy('dueDate', 'asc')
        );
      } else if (status) {
        tasksQuery = query(
          collection(db, collections.tasks),
          where('status', '==', status),
          orderBy('dueDate', 'asc')
        );
      } else if (date) {
        // Create date range for the specified date
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        tasksQuery = query(
          collection(db, collections.tasks),
          where('dueDate', '>=', startDate),
          where('dueDate', '<=', endDate),
          orderBy('dueDate', 'asc')
        );
      } else {
        tasksQuery = query(
          collection(db, collections.tasks),
          orderBy('dueDate', 'asc')
        );
      }

      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks: Array<Task & {
        patientName: string;
        nurseName: string;
        assignedByName: string;
      }> = [];

      for (const docSnapshot of tasksSnapshot.docs) {
        const taskData = docSnapshot.data() as Task;
        
        // Get patient details
        const patientDoc = await getDoc(doc(db, collections.users, taskData.patientId));
        const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
        
        // Get nurse details
        const nurseDoc = await getDoc(doc(db, collections.users, taskData.assignedTo));
        const nurseData = nurseDoc.exists() ? nurseDoc.data() as User : null;
        
        // Get assigner details
        const assignerDoc = await getDoc(doc(db, collections.users, taskData.assignedBy));
        const assignerData = assignerDoc.exists() ? assignerDoc.data() as User : null;
        
        tasks.push({
          id: docSnapshot.id,
          ...taskData,
          patientName: patientData?.displayName || 'Unknown Patient',
          nurseName: nurseData?.displayName || 'Unknown Nurse',
          assignedByName: assignerData?.displayName || 'Unknown',
          dueDate: taskData.dueDate instanceof Timestamp ? 
            taskData.dueDate.toDate() : 
            new Date(taskData.dueDate),
        });
      }

      return tasks;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  },

  /**
   * Get a specific task by ID
   * @param taskId - The task ID
   * @returns The task data or null if not found
   */
  async getTaskById(taskId: string) {
    try {
      const taskDoc = await getDoc(doc(db, collections.tasks, taskId));
      
      if (!taskDoc.exists()) {
        return null;
      }
      
      const taskData = taskDoc.data() as Task;
      
      // Get patient details
      const patientDoc = await getDoc(doc(db, collections.users, taskData.patientId));
      const patientData = patientDoc.exists() ? patientDoc.data() as User : null;
      
      // Get nurse details
      const nurseDoc = await getDoc(doc(db, collections.users, taskData.assignedTo));
      const nurseData = nurseDoc.exists() ? nurseDoc.data() as User : null;
      
      // Get assigner details
      const assignerDoc = await getDoc(doc(db, collections.users, taskData.assignedBy));
      const assignerData = assignerDoc.exists() ? assignerDoc.data() as User : null;
      
      return {
        id: taskDoc.id,
        ...taskData,
        patientName: patientData?.displayName || 'Unknown Patient',
        nurseName: nurseData?.displayName || 'Unknown Nurse',
        assignedByName: assignerData?.displayName || 'Unknown',
        dueDate: taskData.dueDate instanceof Timestamp ? 
          taskData.dueDate.toDate() : 
          new Date(taskData.dueDate),
      };
    } catch (error) {
      console.error('Error getting task:', error);
      throw error;
    }
  },

  /**
   * Create a new task
   * @param taskData - The task data
   * @returns The created task
   */
  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newTask = {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, collections.tasks), newTask);
      
      return {
        id: docRef.id,
        ...newTask,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  /**
   * Update an existing task
   * @param taskId - The task ID
   * @param taskData - The task data to update
   * @returns Promise that resolves when the operation is complete
   */
  async updateTask(taskId: string, taskData: Partial<Task>) {
    try {
      const taskRef = doc(db, collections.tasks, taskId);
      
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp()
      });
      
      return this.getTaskById(taskId);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  /**
   * Delete a task
   * @param taskId - The task ID
   * @returns Promise that resolves when the operation is complete
   */
  async deleteTask(taskId: string) {
    try {
      await deleteDoc(doc(db, collections.tasks, taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  /**
   * Update task status
   * @param taskId - The task ID
   * @param status - The new status
   * @param completedAt - Optional timestamp for when the task was completed
   * @returns The updated task
   */
  async updateTaskStatus(taskId: string, status: Task['status'], completedAt?: Date) {
    try {
      const updateData: Partial<Task> = { status };
      
      if (status === 'Completed' && !completedAt) {
        updateData.completedAt = new Date();
      } else if (completedAt) {
        updateData.completedAt = completedAt;
      }
      
      return this.updateTask(taskId, updateData);
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  /**
   * Reassign a task to a different nurse
   * @param taskId - The task ID
   * @param nurseId - The new nurse's ID
   * @returns The updated task
   */
  async reassignTask(taskId: string, nurseId: string) {
    try {
      return this.updateTask(taskId, { assignedTo: nurseId });
    } catch (error) {
      console.error('Error reassigning task:', error);
      throw error;
    }
  }
};
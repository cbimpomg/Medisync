import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, collections, User } from '../firebase';
import { taskApi } from '../api/taskApi';

// Task interface
export interface Task {
  id: string;
  title: string;
  patientId: string;
  assignedTo: string;
  assignedBy: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  category: string;
  dueDate: Date;
  dueTime: string;
  description: string;
  notes?: string;
  room?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  patientName?: string;
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
  subscribeToNurseTasks: (nurseId: string, onUpdate: (tasks: Task[]) => void) => {
    const tasksQuery = query(
      collection(db, collections.tasks),
      where('assignedTo', '==', nurseId),
      orderBy('dueDate', 'asc')
    );

    return onSnapshot(tasksQuery, async (snapshot) => {
      const tasks = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const taskData = docSnapshot.data() as Task;
          if (!taskData) return null;

          const patientDoc = await getDoc(doc(db, collections.users, taskData.patientId));
          const patientData = patientDoc.exists() ? patientDoc.data() as User : null;

          return {
            id: docSnapshot.id,
            ...taskData,
            patientName: patientData?.displayName || 'Unknown Patient',
            dueDate: taskData.dueDate instanceof Timestamp ?
              taskData.dueDate.toDate() :
              new Date(taskData.dueDate),
          };
        })
      ).then(tasks => tasks.filter((task): task is Task & { patientName: string } => task !== null));
      onUpdate(tasks);
    });
  },

  /**
   * Get tasks for a specific patient
   * @param patientId - The patient's ID
   * @returns Array of tasks
   */
  // Get all tasks with pagination and filters
  getAllTasks: async (filters?: { status?: Task['status']; date?: Date }) => {
    try {
      let tasksQuery;
      
      if (filters?.status && filters?.date) {
        // Create date range for the specified date (start of day to end of day)
        const startDate = new Date(filters.date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(filters.date);
        endDate.setHours(23, 59, 59, 999);
        
        tasksQuery = query(
          collection(db, collections.tasks),
          where('status', '==', filters.status),
          where('dueDate', '>=', startDate),
          where('dueDate', '<=', endDate),
          orderBy('dueDate', 'asc')
        );
      } else if (filters?.status) {
        tasksQuery = query(
          collection(db, collections.tasks),
          where('status', '==', filters.status),
          orderBy('dueDate', 'asc')
        );
      } else if (filters?.date) {
        // Create date range for the specified date
        const startDate = new Date(filters.date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(filters.date);
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

  // Get a specific task by ID
  getTaskById: async (taskId: string): Promise<(Task & {
    patientName: string;
    nurseName: string;
    assignedByName: string;
  }) | null> => {
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
      
      if (!taskData) return null;
      
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

  // Create a new task
  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
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
      } as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task status or add notes
  updateTask: async (taskId: string, taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const taskRef = doc(db, collections.tasks, taskId);
      
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp()
      });
      
      return taskService.getTaskById(taskId);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
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
  updateTaskStatus: async (taskId: string, status: Task['status'], completedAt?: Date): Promise<Task | null> => {
    try {
      const updateData: Partial<Task> = { status };
      
      if (status === 'Completed' && !completedAt) {
        updateData.completedAt = new Date();
      } else if (completedAt) {
        updateData.completedAt = completedAt;
      }
      
      return taskService.updateTask(taskId, updateData);
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
  reassignTask: async (taskId: string, nurseId: string): Promise<Task | null> => {
    try {
      return taskService.updateTask(taskId, { assignedTo: nurseId });
    } catch (error) {
      console.error('Error reassigning task:', error);
      throw error;
    }
  }


};
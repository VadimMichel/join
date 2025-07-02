import { Timestamp } from "firebase/firestore";

export interface BoardColumn {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'awaiting' | 'done';
  tasks: Task[];
}

export interface Subtask {
  id: string,
  title: string;
  done: boolean;
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'urgent';
  status: 'todo' | 'inprogress' | 'awaiting' | 'done';
  assignedUsers: string[];
  createdDate: Date;
  dueDate?: Date;
  subtasks: Subtask[];
}

export interface FirestoreTask {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'urgent';
  status: 'todo' | 'inprogress' | 'awaiting' | 'done';
  assignedUsers: string[];
  createdDate: Timestamp;
  dueDate: Timestamp | null;
  subtasks: Subtask[];
}

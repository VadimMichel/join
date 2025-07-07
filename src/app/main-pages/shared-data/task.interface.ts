import { Timestamp } from 'firebase/firestore';

export type BoardStatus = 'todo' | 'inprogress' | 'awaiting' | 'done';

// export type TestStatus = '[todo]' | '[inprogress]' | '[awaiting]' | '[done]';

export interface BoardColumn {
  id: string;
  title: string;
  status: BoardStatus;
  tasks: Task[];
  connectedStatuses: BoardStatus[];
  isHovered?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
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

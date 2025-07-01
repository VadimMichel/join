export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'urgent';
    status: 'todo' | 'inprogress' | 'awaiting' | 'done';
    assignedUsers: string[];
    createdDate: Date;
    dueDate?: Date;
    subtasks?: Subtask[];
  }
  
  export interface BoardColumn {
    id: string;
    title: string;
    status: 'todo' | 'inprogress' | 'awaiting' | 'done';
    tasks: Task[];
  }

  export interface TaskTest {
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

  export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
  }
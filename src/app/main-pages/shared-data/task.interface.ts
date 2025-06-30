export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'inprogress' | 'awaiting' | 'done';
    assignedUsers: string[];
    createdDate: Date;
    dueDate?: Date;
  }
  
  export interface BoardColumn {
    id: string;
    title: string;
    status: 'todo' | 'inprogress' | 'awaiting' | 'done';
    tasks: Task[];
  }
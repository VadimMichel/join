import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, BoardColumn, TaskTest, Subtask } from './task.interface';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private columns: BoardColumn[] = [
    { id: '1', title: 'ToDo', status: 'todo', tasks: [] },
    { id: '2', title: 'In Progress', status: 'inprogress', tasks: [] },
    { id: '3', title: 'Awaiting Feedback', status: 'awaiting', tasks: [] },
    { id: '4', title: 'Done', status: 'done', tasks: [] }
  ];

  tasks: TaskTest[] = [];

  constructor(private firestore: Firestore) {
    this.loadDummyData();
  }

  getTasksRef(){
    return collection(this.firestore, 'tasks')
  }

  getTaskDocRef(taskId:string) {
    return doc(this.getTasksRef(), taskId);
  }






  getColumns(): BoardColumn[] {
    const tasks = this.tasksSubject.getValue();
    return this.columns.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.status === column.status)
    }));
  }
  
  // Dummy Data Test
  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    const currentTasks = this.tasksSubject.getValue();
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  private loadDummyData(): void {
    const dummyTasks: Task[] = [
      {
        id: '1',
        title: 'Implement User Login',
        description: 'Create a secure login system with email and password validation',
        category: 'User Story',
        priority: 'urgent',
        status: 'todo',
        assignedUsers: ['John Doe', 'Jane Smith'],
        createdDate: new Date(),
        dueDate: new Date('2024-02-15')
      },
      {
        id: '2',
        title: 'Fix Database Connection',
        description: 'Resolve timeout issues with the database connection pool',
        category: 'Technical Task',
        priority: 'medium',
        status: 'inprogress',
        assignedUsers: ['Mike Johnson'],
        createdDate: new Date(),
        dueDate: new Date('2024-02-10')
      },
      {
        id: '3',
        title: 'Design Review Meeting',
        description: 'Review the new UI designs with the stakeholders',
        category: 'User Story',
        priority: 'low',
        status: 'awaiting',
        assignedUsers: ['Sarah Wilson', 'Alex Brown'],
        createdDate: new Date(),
        dueDate: new Date('2024-02-12')
      },
      {
        id: '4',
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated testing and deployment pipeline',
        category: 'Technical Task',
        priority: 'urgent',
        status: 'done',
        assignedUsers: ['John Doe'],
        createdDate: new Date(),
        dueDate: new Date('2024-02-08')
      }
    ];
    
    this.tasksSubject.next(dummyTasks);
  }
}
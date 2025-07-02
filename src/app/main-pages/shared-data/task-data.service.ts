import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentReference,
  Timestamp,
  UpdateData,
  PartialWithFieldValue,
  collectionData,
} from '@angular/fire/firestore';
import { Task, BoardColumn, Subtask, FirestoreTask } from './task.interface';

// type FirebaseTaskUpdate = PartialWithFieldValue<DocumentData>;

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  private unsubscribeFromTasks?: () => void;

  private columns: BoardColumn[] = [
    { id: '1', title: 'ToDo', status: 'todo', tasks: [] },
    { id: '2', title: 'In Progress', status: 'inprogress', tasks: [] },
    { id: '3', title: 'Awaiting Feedback', status: 'awaiting', tasks: [] },
    { id: '4', title: 'Done', status: 'done', tasks: [] },
  ];
  tasks: Task[] = [];

  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  constructor() {
    this.initTasks();
  }

  initTasks() {
    const taskSubStream = collectionData(this.getTasksRef(), {
      idField: 'id',
    }).subscribe((tasks) => this.tasksSubject.next(tasks as Task[]));

    this.unsubscribeFromTasks = () => taskSubStream.unsubscribe();
  }

  getTasksRef() {
    return collection(this.firestore, 'tasks');
  }

  cleanUp() {
    this.unsubscribeFromTasks?.();
  }

  getBoardColumns(): Observable<BoardColumn[]> {
    return this.tasks$.pipe(
      map((tasks) => {
        return this.columns.map((column) => ({
          ...column,
          tasks: tasks.filter((task) => task.status === column.status),
        }));
      })
    );
  }

  async addTask(task: FirestoreTask): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () =>
        addDoc(this.getTasksRef(), task)
      );
    } catch (error: unknown) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () => {
        const docRef = doc(this.firestore, 'tasks', taskId);
        return deleteDoc(docRef);
      });
    } catch (error: unknown) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updateData: Partial<FirestoreTask>): Promise<void> {
    try {
      await runInInjectionContext(this.injector, () => {
        const docRef = doc(this.firestore, 'tasks', taskId);
        return updateDoc(docRef, updateData);
      });
    } catch (error: unknown) {
      console.error('Error editing task:', error);
      throw error;
    }
  }


  // rests of pre refactoring code:

  // /**
  //  * Prepares task data for Firebase storage
  //  */
  // private prepareTaskForFirebase(task: Omit<Task, 'id'> | Task): FirebaseTaskData {
  //   return {
  //     title: task.title,
  //     description: task.description,
  //     category: task.category,
  //     priority: task.priority,
  //     status: task.status,
  //     assignedUsers: task.assignedUsers,
  //     createdDate: Timestamp.fromDate(task.createdDate),
  //     dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
  //     subtasks: task.subtasks || []
  //   };
  // }

  /**
   * Gets a single task by ID as Observable
   */
  getTaskById(taskId: string): Observable<Task | null> {
    return new Observable<Task | null>((observer) => {
      const subscription = this.tasks$.subscribe(tasks => {
        const task = tasks.find(t => t.id === taskId);
        observer.next(task ?? null);
      });

      return () => subscription.unsubscribe();
    });
  }



  // /**
  //  * Cleanup Firebase listeners
  //  */
  // ngOnDestroy(): void {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }
}
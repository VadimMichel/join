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

// interface FirebaseTaskData {
//   title: string;
//   description: string;
//   category: string;
//   priority: 'low' | 'medium' | 'urgent';
//   status: 'todo' | 'inprogress' | 'awaiting' | 'done';
//   assignedUsers: string[];
//   createdDate: Timestamp;
//   dueDate: Timestamp | null;
// }

// type FirebaseTaskUpdate = PartialWithFieldValue<DocumentData>;

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  // private unsubscribe!: () => void;
  private unsubscribeFromTasks?: () => void;

  private columns: BoardColumn[] = [
    { id: '1', title: 'ToDo', status: 'todo', tasks: [] },
    { id: '2', title: 'In Progress', status: 'inprogress', tasks: [] },
    { id: '3', title: 'Awaiting Feedback', status: 'awaiting', tasks: [] },
    { id: '4', title: 'Done', status: 'done', tasks: [] },
  ];
  tasks: Task[] = [];

  // private firestore = inject(Firestore);
  private readonly firestore = inject(Firestore); // ✅ legal, injection context okay
  private readonly injector = inject(EnvironmentInjector); // ✅ auch okay

  constructor() {
    // this.initializeTaskListener();
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

  getTaskDocRef(taskId: string) {
    return doc(this.getTasksRef(), taskId);
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

  // async addTask(task: FirestoreTask): Promise<void> {
  //   await addDoc(this.getTasksRef(), task);
  // }

  async addTask(task: FirestoreTask): Promise<DocumentReference> {
    return runInInjectionContext(this.injector, () => {
      const tasksRef = collection(this.firestore, 'tasks');
      return addDoc(tasksRef, task);
    });
  }

  // /**
  //  * Sets up the Firebase listener for task updates
  //  */
  // private initializeTaskListener(): void {
  //   this.unsubscribe = onSnapshot(this.getTasksRef(), (snapshot) => {
  //     this.processTaskSnapshot(snapshot);
  //   });
  // }

  // /**
  //  * Processes the Firebase task snapshot
  //  */
  // private processTaskSnapshot(snapshot: QuerySnapshot<DocumentData>): void {
  //   const tasks: Task[] = [];
  //   snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
  //     const task = this.convertFirebaseTask(doc.data(), doc.id);
  //     tasks.push(task);
  //   });
  //   this.tasksSubject.next(tasks);
  // }

  // /**
  //  * Converts Firebase document data to Task object
  //  */
  // private convertFirebaseTask(data: DocumentData, id: string): Task {
  //   const firebaseData = data as Partial<FirebaseTaskData>;

  //   return {
  //     id,
  //     title: firebaseData.title ?? '',
  //     description: firebaseData.description ?? '',
  //     category: firebaseData.category ?? 'Technical Task',
  //     priority: firebaseData.priority ?? 'medium',
  //     status: firebaseData.status ?? 'todo',
  //     assignedUsers: firebaseData.assignedUsers ?? [],
  //     createdDate: firebaseData.createdDate?.toDate() ?? new Date(),
  //     dueDate: firebaseData.dueDate?.toDate() ?? undefined
  //   };
  // }

  // /**
  //  * Gets columns with current tasks
  //  */
  // getColumns(): BoardColumn[] {
  //   const tasks = this.tasksSubject.getValue();
  //   return this.columns.map(column => ({
  //     ...column,
  //     tasks: tasks.filter(task => task.status === column.status)
  //   }));
  // }

  // /**
  //  * Adds a new task to Firebase
  //  */
  // async addTask(task: Omit<Task, 'id'>): Promise<void> {
  //   try {
  //     const taskData = this.prepareTaskForFirebase(task);
  //     await addDoc(this.getTasksRef(), taskData);
  //   } catch (error: unknown) {
  //     console.error('Error adding task:', error);
  //     throw error;
  //   }
  // }

  // /**
  //  * Updates an existing task in Firebase
  //  */
  // async updateTask(task: Task): Promise<void> {
  //   if (!task.id) {
  //     throw new Error('Task ID is required for update');
  //   }

  //   try {
  //     const updateData: FirebaseTaskUpdate = {
  //       title: task.title,
  //       description: task.description,
  //       category: task.category,
  //       priority: task.priority,
  //       status: task.status,
  //       assignedUsers: task.assignedUsers,
  //       createdDate: Timestamp.fromDate(task.createdDate),
  //       dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null
  //     };

  //     const docRef = this.getSingleTaskRef(task.id);
  //     await updateDoc(docRef, updateData);
  //   } catch (error: unknown) {
  //     console.error('Error updating task:', error);
  //     throw error;
  //   }
  // }

  // /**
  //  * Deletes a task from Firebase
  //  */
  // async deleteTask(taskId: string): Promise<void> {
  //   try {
  //     const docRef = this.getSingleTaskRef(taskId);
  //     await deleteDoc(docRef);
  //   } catch (error: unknown) {
  //     console.error('Error deleting task:', error);
  //     throw error;
  //   }
  // }

  // /**
  //  * Updates task status (for drag and drop)
  //  */
  // async updateTaskStatus(taskId: string, newStatus: Task['status']): Promise<void> {
  //   try {
  //     const docRef = this.getSingleTaskRef(taskId);
  //     const updateData: FirebaseTaskUpdate = { status: newStatus };
  //     await updateDoc(docRef, updateData);
  //   } catch (error: unknown) {
  //     console.error('Error updating task status:', error);
  //     throw error;
  //   }
  // }

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
  //     dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null
  //   };
  // }

  // /**
  //  * Gets a single task by ID as Observable
  //  */
  // getTaskById(taskId: string): Observable<Task | null> {
  //   return new Observable<Task | null>((observer) => {
  //     const subscription = this.tasks$.subscribe(tasks => {
  //       const task = tasks.find(t => t.id === taskId);
  //       observer.next(task ?? null);
  //     });

  //     return () => subscription.unsubscribe();
  //   });
  // }

  // WILD!
  // /**
  //  * Cleanup Firebase listeners
  //  */
  // ngOnDestroy(): void {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }
}

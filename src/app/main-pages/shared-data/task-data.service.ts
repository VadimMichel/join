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
  addDoc,
  deleteDoc,
  updateDoc,
  DocumentData,
  CollectionReference,
  Timestamp,
  collectionData,
} from '@angular/fire/firestore';
import { Task, BoardColumn, FirestoreTask } from './task.interface';

// type FirebaseTaskUpdate = PartialWithFieldValue<DocumentData>;

@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  // #region Properties
  /**
   * Holds the current list of Task objects as a reactive data stream.
   */
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  /**
   * Observable stream of all Task objects, updated in real time.
   */
  public tasks$ = this.tasksSubject.asObservable();

  /**
   * Stores the unsubscribe function for the tasks observable.
   * Used for cleanup to avoid memory leaks.
   */
  private unsubscribeFromTasks?: () => void;

  /**
   * Static board columns with status mapping for Kanban UI.
   */
private columns: BoardColumn[] = [
  {
    id: '1',
    title: 'ToDo',
    status: 'todo',
    tasks: [],
    connectedStatuses: ['inprogress', 'awaiting', 'done'],
  },
  {
    id: '2',
    title: 'In Progress',
    status: 'inprogress',
    tasks: [],
    connectedStatuses: ['todo', 'awaiting', 'done'],
  },
  {
    id: '3',
    title: 'Awaiting Feedback',
    status: 'awaiting',
    tasks: [],
    connectedStatuses: ['todo', 'inprogress', 'done'],
  },
  {
    id: '4',
    title: 'Done',
    status: 'done',
    tasks: [],
    connectedStatuses: ['todo', 'inprogress', 'awaiting'],
  },
];

  /**
   * AngularFire Firestore instance for database access (injected).
   */
  private readonly firestore = inject(Firestore);

  /**
   * Angular EnvironmentInjector for running code in the correct injection context.
   */
  private readonly injector = inject(EnvironmentInjector);

  // #endregion

  /**
   * Initializes the TaskDataService and starts the tasks listener.
   */
  constructor() {
    this.initTasks();
  }

  // #region Lifecycle & Init

  /**
   * Initializes the task listener and sets up the tasks stream.
   *
   * - Subscribes to the Firestore tasks collection as an observable stream.
   * - Uses the RxJS `map` operator to transform the stream of FirestoreTask objects.
   * - For each FirestoreTask (using Array.map), converts Firestore Timestamp fields
   *   to native Date objects using `translateTimestampToDate`.
   * - Updates the tasks BehaviorSubject with the converted Task objects for use in the UI.
   * - Stores the unsubscribe function to allow cleanup later.
   */
  initTasks() {
    const taskSubStream = collectionData(this.getTasksRef(), {
      idField: 'id',
    })
      .pipe(
        map((tasks) =>
          (tasks as FirestoreTask[]).map((task) =>
            this.translateTimestampToDate(task)
          )
        )
      )
      .subscribe((tasks) => this.tasksSubject.next(tasks as Task[]));

    this.unsubscribeFromTasks = () => taskSubStream.unsubscribe();
  }

  /**
   * Unsubscribes from the tasks observable stream to prevent memory leaks.
   */
  cleanUp(): void {
    this.unsubscribeFromTasks?.();
  }
  // #endregion

  // #region Getter
  /**
   * Returns a reference to the Firestore 'tasks' collection.
   * @returns {CollectionReference<DocumentData, DocumentData>} Firestore collection reference for tasks.
   */
  getTasksRef(): CollectionReference<DocumentData, DocumentData> {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Returns an observable of board columns, each containing the tasks filtered by their status.
   * @returns {Observable<BoardColumn[]>} Observable stream of board columns with grouped tasks.
   */
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
  // #endregion

  // #region CRUD-Methods
  /**
   * Adds a new task to the Firestore 'tasks' collection.
   * Runs inside the Angular injection context to avoid zone errors.
   * @param {FirestoreTask} task - The task object to add.
   * @returns {Promise<void>} Promise that resolves when the task is added.
   */
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

  /**
   * Deletes a task from the Firestore 'tasks' collection by ID.
   * Runs inside the Angular injection context to avoid zone errors.
   * @param {string} taskId - The ID of the task to delete.
   * @returns {Promise<void>} Promise that resolves when the task is deleted.
   */
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

  /**
   * Updates an existing task in the Firestore 'tasks' collection.
   * Runs inside the Angular injection context to avoid zone errors.
   * @param {string} taskId - The ID of the task to update.
   * @param {Partial<FirestoreTask>} updateData - The data to update (partial task object).
   * @returns {Promise<void>} Promise that resolves when the task is updated.
   */
  async updateTask(
    taskId: string,
    updateData: Partial<FirestoreTask>
  ): Promise<void> {
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
  // #endregion

  // #region Helper
  /**
   * Extracts dueDate from the FirestoreTask object and creates a new object containing all other properties.
   * Converts Firestore Timestamp fields (createdDate, dueDate) to JavaScript Date objects.
   *
   * @param task - The FirestoreTask object as retrieved from Firestore (with Timestamp fields).
   * @returns A Task object where all Timestamps are converted to Date, and dueDate is only set if it exists.
   */
  translateTimestampToDate(task: FirestoreTask): Task {
    const { dueDate, ...taskWithoutDueDate } = task;

    return {
      ...taskWithoutDueDate,
      createdDate:
        task.createdDate instanceof Timestamp
          ? task.createdDate.toDate()
          : task.createdDate,
      ...(dueDate instanceof Timestamp ? { dueDate: dueDate.toDate() } : {}),
    };
  }
  // #endregion
}

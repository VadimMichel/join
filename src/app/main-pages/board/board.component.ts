import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TaskDataService } from '../shared-data/task-data.service';
import {
  BoardColumn,
  Task,
  Subtask,
  FirestoreTask,
  BoardStatus,
} from '../shared-data/task.interface';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { TaskDialogComponent } from './task/task-dialog/task-dialog.component';
import { Timestamp } from '@angular/fire/firestore';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    TaskDialogComponent,
    CdkDrag,
    CdkDropList,
  ], // ReactiveFormsModule entfernt für neue Struktur
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  columns$!: Observable<BoardColumn[]>;
  selectedTask: Task | null = null;
  showTaskDialog: boolean = false;
  isEditMode: boolean = false;

  constructor(
    private taskDataService: TaskDataService,
    private cdr: ChangeDetectorRef // Hinzugefügt zur Behebung von Änderungsdetektionsproblemen // private fb: FormBuilder, // Auskommentiert - wird jetzt von TaskEditForm-Komponente behandelt // // private contactDataService: ContactDataService // Auskommentiert - wird jetzt von TaskEditForm-Komponente behandelt
  ) {}

  ngOnInit(): void {
    this.columns$ = this.taskDataService.getBoardColumns();
  }

  // #region Drag and Drop
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (movedTask.id === undefined) return;

      movedTask.status = event.container.id as BoardStatus;

      this.taskDataService.updateTask(movedTask.id, {
        status: movedTask.status,
      });
    }
  }

  enableHighlighting(column: BoardColumn) {
    column.isHovered = true;
  }

  disableHighlighting(column: BoardColumn) {
    column.isHovered = false;
  }
  // #endregion

  // Task-Dialog-Verwaltungsmethoden (minimal gehalten für neue Struktur)
  openTaskDetails(task: Task): void {
    // console.log('Opening task details for:', task);

    // Ensure clean state before opening dialog
    this.selectedTask = null;
    this.showTaskDialog = false;
    this.isEditMode = false;

    // Force change detection to process the reset
    this.cdr.detectChanges();

    // Set new state
    this.selectedTask = task;
    this.showTaskDialog = true;

    // Force another change detection cycle to ensure dialog appears
    this.cdr.detectChanges();

    // Ursprüngliche Form-Befüllung (auskommentiert - jetzt in TaskEditForm)
    // this.populateEditForm(task);
  }

  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.selectedTask = null;
    this.isEditMode = false;
    // Ursprüngliches Overlay-Schließen (auskommentiert aber beibehalten)
    // this.isOverlayOpen = false;
  }

  editTask(): void {
    this.isEditMode = true;
    // Ursprüngliche Edit-Modus-Einrichtung (auskommentiert - jetzt in TaskEditForm)
    // if (this.selectedTask) {
    //   this.populateEditForm(this.selectedTask);
    // }
  }

  // Vereinfachte Speichermethode (ursprüngliche Form-Behandlung zu TaskEditForm verschoben)
  async saveTask(task: Task): Promise<void> {
    if (!task.id) return;

    try {
      // Ursprüngliche Form-Validierung (auskommentiert - jetzt in TaskEditForm)
      // if (this.editForm.valid) {
      //   const formValue = this.editForm.value;

      const updateData: Partial<Task> = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedUsers: task.assignedUsers,
        dueDate: task.dueDate,
        subtasks: task.subtasks,
      };

      await this.taskDataService.updateTask(task.id, updateData);
      this.selectedTask = task;
      this.isEditMode = false;
      // Ursprüngliche Erfolgsbehandlung (beibehalten)
      // this.closeTaskDialog();
      // }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await this.taskDataService.deleteTask(taskId);
        this.closeTaskDialog();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  }

  async toggleSubtask(subtask: Subtask): Promise<void> {
    subtask.completed = !subtask.completed;
    if (this.selectedTask?.id) {
      const updateData: Partial<Task> = {
        subtasks: this.selectedTask.subtasks,
      };
      await this.taskDataService.updateTask(this.selectedTask.id, updateData);
    }
  }

  // Schnelle Task-Hinzufügen-Methode (beibehalten und funktionsfähig)
  quickAddTask(columnStatus: string): void {
    const title = prompt('Enter task title:');
    if (!title) return;

    const description = prompt('Enter task description:') || '';
    const category =
      prompt('Enter category (User Story/Technical Task):') || 'Technical Task';

    const newTask: FirestoreTask = {
      title,
      description,
      category,
      priority: 'medium',
      status: columnStatus as Task['status'],
      assignedUsers: ['Test User'],
      createdDate: Timestamp.now(),
      dueDate: null,
      subtasks: [],
    };

    this.taskDataService.addTask(newTask);
  }

  // Kann für schnelle Tests auf ein Element per (click)="" gestetzt werden, so lang das addTask form noch nicht bereit ist
  instantAddTask(status: 'todo' | 'inprogress' | 'awaiting' | 'done') {
    const instantTask: FirestoreTask = {
      title: 'Instant-Task',
      description: 'Das ist ein automatisch erzeugtes Beispiel-Task.',
      category: 'User Story',
      priority: 'medium',
      status: status,
      assignedUsers: [
        'Ronald Berger',
        'Zwei Two',
        'Drei Three',
        'Vier Four',
        'Fünf Five',
        'Six Sechs',
      ],
      createdDate: Timestamp.fromDate(new Date()),
      dueDate: Timestamp.fromDate(new Date(Date.now() + 604800000)),
      subtasks: [
        {
          id: 'sub1',
          title: 'Drag and Drop Service integrieren',
          completed: true,
        },
        {
          id: 'sub2',
          title: 'Task-Positionen nach Drop speichern',
          completed: false,
        },
        {
          id: 'sub3',
          title: 'Test my progressbar',
          completed: false,
        },
      ],
    };

    this.taskDataService.addTask(instantTask);
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskDataService } from '../shared-data/task-data.service';
// import { ContactDataService } from '../shared-data/contact-data.service';
import {
  BoardColumn,
  Task,
  Subtask,
  FirestoreTask,
} from '../shared-data/task.interface';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { TaskDialogComponent } from './task/task-dialog/task-dialog.component';
import { Timestamp } from '@angular/fire/firestore';
// import { getRandomColor, getInitials } from '../../shared/color-utils';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, TaskDialogComponent], // ReactiveFormsModule entfernt für neue Struktur
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  // Ursprüngliche Eigenschaften beibehalten
  columns$!: Observable<BoardColumn[]>;
  selectedTask: Task | null = null;
  showTaskDialog = false;
  isEditMode = false;

  // Ursprüngliche Form-bezogene Eigenschaften (auskommentiert aber zur Referenz beibehalten)
  // editForm!: FormGroup;
  // isOverlayOpen = false;
  // contacts: string[] = [];

  // Ursprüngliche Utility-Funktionen (auskommentiert aber beibehalten)
  // getRandomColor = getRandomColor;
  // getInitials = getInitials;

  constructor(
    private taskDataService: TaskDataService,
    private cdr: ChangeDetectorRef // Hinzugefügt zur Behebung von Änderungsdetektionsproblemen // private fb: FormBuilder, // Auskommentiert - wird jetzt von TaskEditForm-Komponente behandelt // private contactDataService: ContactDataService // Auskommentiert - wird jetzt von TaskEditForm-Komponente behandelt
  ) {
    // Ursprüngliche Form-Initialisierung (auskommentiert - jetzt in TaskEditForm)
    // this.initializeEditForm();
  }

  ngOnInit(): void {
    this.columns$ = this.taskDataService.getBoardColumns();
    // Ursprüngliches Kontakte-Laden (auskommentiert - jetzt in TaskEditForm)
    // this.loadContacts();
  }

  // Ursprüngliche Form-Initialisierungsmethode (als Kommentar beibehalten)
  /*
  private initializeEditForm(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['medium'],
      assignedUsers: [[]],
      subtasks: [[]]
    });
  }
  */

  // Ursprüngliche Kontakte-Lademethode (als Kommentar beibehalten)
  /*
  private loadContacts(): void {
    this.contacts = [];
    this.contactDataService.contactlist.forEach(group => {
      group.contacts.forEach(contact => {
        this.contacts.push(contact.name);
      });
    });
  }
  */


  // Kann für schnelle Tests auf ein Element per (click)="" gestetzt werden, so lang das addTask form noch nicht bereit ist
  instantAddTask(status: 'todo' | 'inprogress' | 'awaiting' | 'done') {
    const instantTask: FirestoreTask = {
      title: 'Instant-Task',
      description: 'Das ist ein automatisch erzeugtes Beispiel-Task.',
      category: 'User Story',
      priority: 'medium',
      status: status,
      assignedUsers: ['Ronald Berger', 'Zwei Two', 'Drei Three', 'Vier Four', 'Fünf Five', 'Six Sechs'],
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

  // Ursprüngliche Form-Befüllungsmethode (als Kommentar beibehalten)
  /*
  private populateEditForm(task: Task): void {
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
      priority: task.priority,
      assignedUsers: task.assignedUsers,
      subtasks: task.subtasks || []
    });
  }
  */

  // Ursprüngliche Datumsformatierungsmethode (als Kommentar beibehalten)
  /*
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  */

  // Vereinfachte Speichermethode (ursprüngliche Form-Behandlung zu TaskEditForm verschoben)
  async saveTask(task: Task): Promise<void> {
    if (!task.id) return;

    try {
      // Ursprüngliche Form-Validierung (auskommentiert - jetzt in TaskEditForm)
      // if (this.editForm.valid) {
      //   const formValue = this.editForm.value;

      const updateData: Partial<FirestoreTask> = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedUsers: task.assignedUsers,
        dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
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

  // Ursprüngliche Abbrechen-Methode (als Kommentar beibehalten - wird jetzt von TaskEditForm behandelt)
  /*
  cancelEdit(): void {
    this.isEditMode = false;
    if (this.selectedTask) {
      this.populateEditForm(this.selectedTask);
    }
  }
  */

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
      const updateData: Partial<FirestoreTask> = {
        subtasks: this.selectedTask.subtasks,
      };
      await this.taskDataService.updateTask(this.selectedTask.id, updateData);
    }
  }

  // Ursprüngliche Subtask-Verwaltungsmethoden (als Kommentare beibehalten - jetzt in TaskEditForm)
  /*
  addSubtask(): void {
    const subtaskTitle = prompt('Enter subtask title:');
    if (subtaskTitle) {
      const currentSubtasks = this.editForm.get('subtasks')?.value || [];
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        completed: false
      };
      this.editForm.patchValue({
        subtasks: [...currentSubtasks, newSubtask]
      });
    }
  }

  removeSubtask(index: number): void {
    const currentSubtasks = this.editForm.get('subtasks')?.value || [];
    currentSubtasks.splice(index, 1);
    this.editForm.patchValue({
      subtasks: currentSubtasks
    });
  }
  */

  // Ursprüngliche Benutzerzuweisungsmethoden (als Kommentare beibehalten - jetzt in TaskEditForm)
  /*
  toggleAssignedUser(userName: string): void {
    const currentUsers = this.editForm.get('assignedUsers')?.value || [];
    const userIndex = currentUsers.indexOf(userName);
    
    if (userIndex > -1) {
      currentUsers.splice(userIndex, 1);
    } else {
      currentUsers.push(userName);
    }
    
    this.editForm.patchValue({
      assignedUsers: currentUsers
    });
  }

  isUserAssigned(userName: string): boolean {
    const assignedUsers = this.editForm.get('assignedUsers')?.value || [];
    return assignedUsers.includes(userName);
  }
  */

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

  // Ursprüngliche Utility-Methoden (als Kommentare beibehalten)
  /*
  private getAvailableContacts(): string[] {
    return this.contacts;
  }

  private closeOverlay(): void {
    this.isOverlayOpen = false;
  }
  */
}

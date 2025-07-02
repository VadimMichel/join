import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskDataService } from '../shared-data/task-data.service';
import { BoardColumn, FirestoreTask, Task, Subtask } from '../shared-data/task.interface';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { getRandomColor, getInitials } from '../../shared/color-utils';
import { ContactDataService } from '../shared-data/contact-data.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, ReactiveFormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  selectedTask: Task | null = null;
  showTaskDialog = false;
  isEditMode = false;
  editForm!: FormGroup;
  originalTask: Task | null = null;

  getRandomColor = getRandomColor;
  getInitials = getInitials;

  columns$!: Observable<BoardColumn[]>;

  constructor(
    public taskDataService: TaskDataService,
    private contactDataService: ContactDataService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.columns$ = this.taskDataService.getBoardColumns();
  }

  addTestTask() {
    this.taskDataService.addTask({
      title: 'New Test Title',
      description: 'Test text of descrition',
      category: 'User Story',
      priority: 'low',
      status: 'todo',
      assignedUsers: ['Vader', 'Batman'],
      createdDate: Timestamp.fromDate(new Date()),
      dueDate: null,
      subtasks: [
        {
          title: 'Test Subtask',
          done: false,
        },
      ],
    });
  }

  async testUpdateTask() {
  // Beispiel: vorhandene Task-ID (hier hart eingetragen – bitte anpassen!)
  const taskId = 'nBvhDbZz18ZVMyKGDaiA';

  // Patch-Objekt: nur die Felder, die du ändern möchtest
  const patchObj: Partial<FirestoreTask> = {
    title: 'Geänderter Titel (Test)',
    dueDate: Timestamp.fromDate(new Date('2024-07-10')),
    priority: 'urgent',
    assignedUsers: ['Max', 'Anna'],
    subtasks: [
      { title: 'Test-Subtask', done: false }
    ]
    // Füge hier beliebige Felder hinzu, die du testen möchtest
  };

  try {
    await this.taskDataService.updateTask(taskId, patchObj);
    alert('Update erfolgreich! (Siehe Firestore)');
  } catch (error) {
    console.error('Fehler beim Test-Update:', error);
    alert('Update fehlgeschlagen. Siehe Konsole!');
  }
}

  openTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskDialog = true;
  }

  /**
   * Opens edit dialog for the selected task
   */
  editTask(task: Task): void {
    this.isEditMode = true;
    this.originalTask = { ...task };
    this.populateEditForm(task);
  }

  /**
   * Initializes the edit form
   */
  private initializeForm(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['medium'],
      assignedUsers: [[]],
      subtasks: [[]]
    });
  }

  /**
   * Populates the edit form with task data
   */
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

  /**
   * Formats date for HTML input
   */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Saves the edited task
   */
  async saveTask(): Promise<void> {
    if (this.editForm.valid && this.selectedTask) {
      try {
        const formValue = this.editForm.value;
        const updatedTask: Task = {
          ...this.selectedTask,
          title: formValue.title,
          description: formValue.description,
          dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
          priority: formValue.priority,
          assignedUsers: formValue.assignedUsers,
          subtasks: formValue.subtasks
        };

        await this.taskDataService.updateTask(updatedTask);
        this.selectedTask = updatedTask;
        this.cancelEdit();
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    }
  }

  /**
   * Cancels edit mode
   */
  cancelEdit(): void {
    this.isEditMode = false;
    this.originalTask = null;
    this.editForm.reset();
  }

  /**
   * Closes task dialog and resets edit state
   */
  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.selectedTask = null;
    this.isEditMode = false;
    this.originalTask = null;
    this.editForm.reset();
  }

  /**
   * Adds a new subtask
   */
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

  /**
   * Removes a subtask
   */
  removeSubtask(index: number): void {
    const currentSubtasks = this.editForm.get('subtasks')?.value || [];
    currentSubtasks.splice(index, 1);
    this.editForm.patchValue({
      subtasks: currentSubtasks
    });
  }

  /**
   * Toggles assigned user
   */
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

  /**
   * Checks if user is assigned
   */
  isUserAssigned(userName: string): boolean {
    const assignedUsers = this.editForm.get('assignedUsers')?.value || [];
    return assignedUsers.includes(userName);
  }

  /**
   * Gets available contacts for assignment
   */
  getAvailableContacts(): string[] {
    const contacts: string[] = [];
    this.contactDataService.contactlist.forEach(group => {
      group.contacts.forEach(contact => {
        contacts.push(contact.name);
      });
    });
    return contacts;
  }

  /**
   * Toggles the completion status of a subtask
   */
  toggleSubtask(subtask: Subtask): void {
    subtask.completed = !subtask.completed;
    if (this.selectedTask) {
      this.taskDataService.updateTask(this.selectedTask);
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#44ff44';
      default:
        return '#cccccc';
    }
  }



  /**
   * Deletes the selected task
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
}

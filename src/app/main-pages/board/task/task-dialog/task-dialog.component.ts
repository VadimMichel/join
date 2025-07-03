import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEditFormComponent } from './task-edit-form/task-edit-form.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Task, Subtask } from '../../../shared-data/task.interface';

@Component({
  selector: 'app-task-dialog',
  imports: [CommonModule, TaskEditFormComponent, TaskDetailsComponent],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {
  @Input() task: Task | null = null;
  @Input() isEditMode = false;
  
  @Output() closeClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<string>();
  @Output() saveClicked = new EventEmitter<Task>();
  @Output() subtaskToggled = new EventEmitter<Subtask>();

  closeDialog(): void {
    this.closeClicked.emit();
  }

  onEditClicked(): void {
    this.editClicked.emit();
  }

  onDeleteClicked(taskId: string): void {
    this.deleteClicked.emit(taskId);
  }

  onSaveClicked(task: Task): void {
    this.saveClicked.emit(task);
  }

  onCancelClicked(): void {
    this.closeClicked.emit();
  }

  onSubtaskToggled(subtask: Subtask): void {
    this.subtaskToggled.emit(subtask);
  }
}

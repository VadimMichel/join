import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Subtask } from '../../../../shared-data/task.interface';
import { getRandomColor, getInitials } from '../../../../../shared/color-utils';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  @Input() task: Task | null = null;
  
  @Output() editClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<string>();
  @Output() subtaskToggled = new EventEmitter<Subtask>();

  getRandomColor = getRandomColor;
  getInitials = getInitials;

  onEditClick(): void {
    this.editClicked.emit();
  }

  onDeleteClick(): void {
    if (this.task?.id) {
      this.deleteClicked.emit(this.task.id);
    }
  }

  onSubtaskToggle(subtask: Subtask): void {
    this.subtaskToggled.emit(subtask);
  }
}

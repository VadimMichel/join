import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subtask, Task } from '../../../shared-data/task.interface';
import { CommonModule } from '@angular/common';
import { getRandomColor, getInitials } from '../../../../shared/color-utils';
import { TaskDataService } from '../../../shared-data/task-data.service';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() taskClicked = new EventEmitter<Task>();

  getRandomColor = getRandomColor;
  getInitials = getInitials;

  constructor(public taskDataService: TaskDataService) {}

  deleteTaskViaCard(taskId:string | undefined) {
    if (taskId === undefined) {
      return;
    } else {
      this.taskDataService.deleteTask(taskId);
    }
  }

  getNumberOfAllCompletedSubtasks(subtasks: Subtask[]):number {
    let countOfCompletedSubtasks: number = 0;

    for (let i = 0; i < subtasks.length; i++) {
      const currentSubtask = subtasks[i];
      countOfCompletedSubtasks += this.checkCompleteState(currentSubtask);
    }

    return countOfCompletedSubtasks;
  }

  checkCompleteState(subtask: Subtask): number {
    if (subtask.completed) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Handles task card click
   */
  onTaskClick(): void {
    this.taskClicked.emit(this.task);
  }

  turcanText(text: string): string {
    if (text.length > 50) {
      const index: number = text.indexOf(' ', 50);
      if (index >= 0) {
        return text.slice(0, index) + '...';
      } 
    }
    return text;
  }
}

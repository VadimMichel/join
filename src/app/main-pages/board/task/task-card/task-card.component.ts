import { Component, Input } from '@angular/core';
import { Task } from '../../../shared-data/task.interface';
import { CommonModule } from '@angular/common';
import { getRandomColor, getInitials } from '../../../../shared/color-utils';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Task;

  getRandomColor = getRandomColor;
  getInitials = getInitials;

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

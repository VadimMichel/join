import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDataService } from '../shared-data/task-data.service'; 
import { BoardColumn, Task, Subtask } from '../shared-data/task.interface';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { getRandomColor, getInitials } from '../../shared/color-utils';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  columns: BoardColumn[] = [];
  selectedTask: Task | null = null;
  showTaskDialog = false;

  getRandomColor = getRandomColor;
  getInitials = getInitials;

  constructor(private taskDataService: TaskDataService) {}

  ngOnInit(): void {
    this.loadColumns();
    this.taskDataService.tasks$.subscribe(() => {
      this.loadColumns();
    });
  }

  loadColumns(): void {
    this.columns = this.taskDataService.getColumns();
  }

  quickAddTask(columnStatus: string): void {
    const title = prompt('Enter task title:');
    if (!title) return;

    const description = prompt('Enter task description:') || '';
    const category = prompt('Enter category (User Story/Technical Task):') || 'Technical Task';

    this.taskDataService.addTask({
      title,
      description,
      category,
      priority: 'medium',
      status: columnStatus as Task['status'],
      assignedUsers: ['Test User'],
      createdDate: new Date()
    });
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = task;
    this.showTaskDialog = true;
  }

  closeTaskDialog(): void {
    this.showTaskDialog = false;
    this.selectedTask = null;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44ff44';
      default: return '#cccccc';
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

  /**
   * Opens edit dialog for the selected task
   */
  editTask(task: Task): void {
    this.closeTaskDialog();
    console.log('Edit task:', task);
  }

  truncateDescription(description: string, maxLength: number = 100): string {
    return description.length > maxLength ? 
      description.substring(0, maxLength) + '...' : 
      description;
  }
}
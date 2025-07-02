import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDataService } from '../shared-data/task-data.service';
import { BoardColumn, FirestoreTask, Task } from '../shared-data/task.interface';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  // columns: BoardColumn[] = [];
  selectedTask: Task | null = null;
  showTaskDialog = false;

  columns$!: Observable<BoardColumn[]>;

  constructor(public taskDataService: TaskDataService) {}

  ngOnInit(): void {
    // this.loadColumns();
    // this.taskDataService.tasks$.subscribe(() => {
    // this.loadColumns();
    // });
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



  // loadColumns(): void {
  //   this.columns = this.taskDataService.getColumns();
  // }

  // quickAddTask(columnStatus: string): void {
  //   const title = prompt('Enter task title:');
  //   if (!title) return;

  //   const description = prompt('Enter task description:') || '';
  //   const category = prompt('Enter category (User Story/Technical Task):') || 'Technical Task';

  //   this.taskDataService.addTask({
  //     title,
  //     description,
  //     category,
  //     priority: 'medium',
  //     status: columnStatus as Task['status'],
  //     assignedUsers: ['Test User'],
  //     createdDate: new Date()
  //   });
  // }

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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  // truncateDescription(description: string, maxLength: number = 100): string {
  //   return description.length > maxLength ?
  //     description.substring(0, maxLength) + '...' :
  //     description;
  // }
}

import { Component, inject } from '@angular/core';
import { TaskDataService } from '../shared-data/task-data.service';
import { Observable } from 'rxjs';
import { BoardColumn } from '../shared-data/task.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../shared/services/breakpoint.service';
import { AuthenticationService } from '../../auth/services/authentication.service';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, RouterLink],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  columns$!: Observable<BoardColumn[]>;

  constructor(
    public taskDataService: TaskDataService,
    public breakpointService: BreakpointService,
    private authenticationService: AuthenticationService
  ) {}

  // #region Methodes

  ngOnInit() {
    this.columns$ = this.taskDataService.getBoardColumns();
  }

  getNextDeadline(columns: BoardColumn[]) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };

    const urgentTasksWithDueDate = columns
      .flatMap((col) => col.tasks)
      .filter((task) => task.priority === 'urgent' && task.status !== 'done')
      .filter((task) => task.dueDate !== undefined)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());

    if (urgentTasksWithDueDate.length > 0) {
      return urgentTasksWithDueDate[0].dueDate!.toLocaleDateString(
        'en-US',
        options
      );
    } else {
      return '---';
    }
  }

  countUrgentOpenTasks(columns: BoardColumn[]): number {
    return columns
      .flatMap((col) => col.tasks)
      .filter((task) => task.priority === 'urgent' && task.status !== 'done')
      .length;
  }

  countOpenTaskWithStatus(columns: BoardColumn[], status: string): number {
    if (status === 'incomplete') {
      return columns
        .flatMap((col) => col.tasks)
        .filter((task) => task.status !== 'done').length;
    } else {
      return columns
        .flatMap((col) => col.tasks)
        .filter((task) => task.status === status).length;
    }
  }

  getGreetingMessage(): string {
    const now: Date = new Date();
    const hours: number = Number(String(now.getHours()).padStart(2, '0'));
    const addCommaOrNothing: string =
      this.authenticationService.currentUser?.email === null ? '' : ',';

    if (hours <= 12 && hours > 5) {
      return 'Good morgning' + addCommaOrNothing;
    } else if (hours <= 18) {
      return 'Good afternoon' + addCommaOrNothing;
    } else if (hours <= 23) {
      return 'Good evening' + addCommaOrNothing;
    } else {
      return 'Good night' + addCommaOrNothing;
    }
  }

  getUserName() {
    if (!this.authenticationService.currentUser) return '';
    const userName: string =
      this.authenticationService.currentUser.displayName ?? '';
    return userName;
  }
  // #endregion
}

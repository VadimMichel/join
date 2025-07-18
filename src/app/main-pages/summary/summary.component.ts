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
  // #region Properties
  columns$!: Observable<BoardColumn[]>;
  // #endregion

  constructor(
    public taskDataService: TaskDataService,
    public breakpointService: BreakpointService,
    private authenticationService: AuthenticationService
  ) {}

  // #region Lifecycle
  ngOnInit(): void {
    this.columns$ = this.taskDataService.getBoardColumns();
  }
  // #endregion

  // #region Public Methods
  getNextDeadline(columns: BoardColumn[]): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };

    const urgentTasksWithDueDate = columns
      .flatMap((col) => col.tasks)
      .filter((task) => task.priority === 'urgent' && task.status !== 'done')
      .filter((task) => task.dueDate !== undefined)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());

    if (urgentTasksWithDueDate.length > 0) {
      return urgentTasksWithDueDate[0].dueDate!.toLocaleDateString('en-US', options);
    } else {
      return '---';
    }
  }

  countUrgentOpenTasks(columns: BoardColumn[]): number {
    return columns.flatMap((col) => col.tasks).filter((task) => task.priority === 'urgent' && task.status !== 'done')
      .length;
  }

  countOpenTaskWithStatus(columns: BoardColumn[], status: string): number {
    if (status === 'incomplete') {
      return columns.flatMap((col) => col.tasks).filter((task) => task.status !== 'done').length;
    } else {
      return columns.flatMap((col) => col.tasks).filter((task) => task.status === status).length;
    }
  }

  getGreetingMessage(): string {
    const now: Date = new Date();
    const hours: number = Number(String(now.getHours()).padStart(2, '0'));
    const commaOrEmpty: string = this.authenticationService.currentUser?.email ? '' : ',';

    if (hours <= 5) {
      return 'Good night' + commaOrEmpty;
    } else if (hours <= 12) {
      return 'Good morning' + commaOrEmpty;
    } else if (hours <= 18) {
      return 'Good afternoon' + commaOrEmpty;
    } else {
      return 'Good evening' + commaOrEmpty;
    }
  }

  getUserName(): string {
    if (!this.authenticationService.currentUser) return '';
    const userName: string = this.authenticationService.currentUser.displayName ?? '';
    return userName;
  }
  // #endregion

  // #region Helpers
  truncateName(name: string): string {
    if (name.length >= 40) {
      return name.slice(0, 40) + '...';
    }

    return name;
  }
  // #endregion
}

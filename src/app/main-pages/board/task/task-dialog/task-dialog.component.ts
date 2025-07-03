import { Component } from '@angular/core';
import { TaskEditFormComponent } from './task-edit-form/task-edit-form.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

@Component({
  selector: 'app-task-dialog',
  imports: [TaskEditFormComponent, TaskDetailsComponent],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {

}

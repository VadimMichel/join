import { Component, ViewChild } from '@angular/core';
import { TaskCreateFormComponent } from '../task-create-form/task-create-form.component';

@Component({
  selector: 'app-add-task',
  imports: [TaskCreateFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  @ViewChild(TaskCreateFormComponent) taskCreateForm!: TaskCreateFormComponent;

  closeWindow(){
    this.taskCreateForm.closeWindow()
  }
}

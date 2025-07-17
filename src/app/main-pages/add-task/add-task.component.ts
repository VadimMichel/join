import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskCreateFormComponent } from '../task-create-form/task-create-form.component';
import { ActivatedRoute } from '@angular/router';
import { BoardStatus } from '../shared-data/task.interface';

@Component({
  selector: 'app-add-task',
  imports: [TaskCreateFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit {
  @ViewChild(TaskCreateFormComponent) taskCreateForm!: TaskCreateFormComponent;
  taskStatus: BoardStatus = 'todo';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.taskStatus = params['status'] as BoardStatus;
      }
    });
  }

  closeWindow(){
    this.taskCreateForm.closeWindow()
  }
}

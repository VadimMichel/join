import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDataService } from '../shared-data/contact-data.service';
import { getRandomColor } from '../../shared/color-utils';
import { Contacts } from './../contacts-interface';
import { FormsModule } from '@angular/forms';
import { BoardStatus, Subtask, Task } from '../shared-data/task.interface';
import { TaskDataService } from '../shared-data/task-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-create-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-create-form.component.html',
  styleUrl: './task-create-form.component.scss',
})
export class TaskCreateFormComponent {
  getRandomColor = getRandomColor;
  public isOverlayOpen1: boolean = false;
  public isOverlayOpen2: boolean = false;
  overlay2WasOpen: boolean = false;
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  assignetTo: Contacts[] = [];
  title: string = '';
  date: Date | null = null;
  category: string = 'Select task category';
  showCategoryError: boolean = false;
  addSubtask: string = '';
  subtaskInputFocus: boolean = false;
  subtasks: Subtask[] = [];
  description: string = '';

  constructor(
    public contactDataService: ContactDataService,
    private taskDataService: TaskDataService,
    private router: Router
  ) {}

  toggleOverlay(type: 'assign' | 'category', event: Event) {
    event.stopPropagation();
    if (type === 'assign') {
      this.isOverlayOpen1 = !this.isOverlayOpen1;
      this.isOverlayOpen2 = false;
    } else if (type === 'category') {
      if (this.isOverlayOpen2 == false) {
        this.overlay2WasOpen = true;
      }
      this.isOverlayOpen2 = !this.isOverlayOpen2;
      this.isOverlayOpen1 = false;
    }
  }

  changePriority(priority: 'urgent' | 'medium' | 'low' = 'medium') {
    this.priority = priority;
  }

  selectContact(contact: Contacts, event: Event) {
    event.stopPropagation();
    const index = this.assignetTo.findIndex((c) => c.id === contact.id);
    if (index === -1) {
      this.assignetTo.push(contact);
    } else {
      this.assignetTo.splice(index, 1);
    }
  }

  closeWindow() {
    this.isOverlayOpen1 = false;
    this.isOverlayOpen2 = false;
    if (this.category == 'Select task category' && this.overlay2WasOpen) {
      this.showCategoryError = true;
    }
  }

  onWrapperClick(event: Event) {
    event.stopPropagation();
  }

  selectCategory(category: string) {
    this.category = category;
    this.isOverlayOpen2 = false;
    this.showCategoryError = false;
  }

  addSubtaskToArray() {
    this.subtasks.push(this.getSubtask());
    this.addSubtask = '';
  }

  getSubtask(): Subtask {
    const id = Date.now().toString();
    return {
      id: id,
      title: this.addSubtask,
      completed: false,
    };
  }

  getAssignedUser(): string[] {
    return this.assignetTo.map((n) => this.getName(n));
  }

  getName(n: Contacts): string {
    return n.name;
  }

  getCleanTask(status: BoardStatus): Task {
    return {
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      status: status,
      assignedUsers: this.getAssignedUser(),
      createdDate: new Date(),
      dueDate: this.getDate(),
      subtasks: this.subtasks,
    };
  }

  // getDate() {
  //   let date = this.date;
  //   if (date != null) {
  //     return date;
  //   } else {
  //     return undefined;
  //   }
  // }

  getDate() {
    if (this.date != null) {
      if (this.date instanceof Date) return this.date;
      return new Date(this.date);
    }
    return undefined;
  }

  submitTaskFromForm(status: BoardStatus) {
    if(this.category != 'Select task category'){
      let task = this.getCleanTask(status);
      this.taskDataService.addTask(task);
      this.openBoard();
    }else{
      this.overlay2WasOpen = true;
      this.showCategoryError = true;
    }
  }

  openBoard(){
    this.router.navigateByUrl('/board');
  }


  cleaData(){
    this.assignetTo = [];
    this.category = 'Select task category';
    this.overlay2WasOpen = false;
    this.subtasks = [];
    this.priority = "medium";
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
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
  subtasksInput: string = '';
  changeSubtask: number | null = null;
  minDate: string = '';
  contactSearchTerm: string = '';
 @Input() taskStatus: BoardStatus = 'todo';
 @Input() openFromBoard: boolean = false;
 @Output() closeAddTaskOverlay = new EventEmitter<boolean>();

  constructor(
    public contactDataService: ContactDataService,
    private taskDataService: TaskDataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

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

  /**
   * Gets filtered contacts based on search term
   * @returns Filtered contact list
   */
  getFilteredContacts() {
    if (!this.contactDataService.contactlist || this.contactDataService.contactlist.length === 0) {
      return [];
    }
    
    if (!this.contactSearchTerm || !this.contactSearchTerm.trim()) {
      return this.contactDataService.contactlist;
    }
    
    const searchTerm = this.contactSearchTerm.toLowerCase();
    
    const filtered = this.contactDataService.contactlist.map(group => {
      const filteredContacts = group.contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm)
      );
      return {
        ...group,
        contacts: filteredContacts
      };
    }).filter(group => group.contacts.length > 0);
    
    return filtered;
  }

  /**
   * Clears the contact search term
   */
  clearContactSearch() {
    this.contactSearchTerm = '';
  }

  /**
   * Handles search input changes
   */
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.contactSearchTerm = input.value;
    this.cdr.detectChanges(); // Force change detection
  }

  /**
   * Checks if a contact is currently assigned
   * @param contact - The contact to check
   * @returns True if contact is assigned, false otherwise
   */
  isContactAssigned(contact: Contacts): boolean {
    return this.assignetTo.some(c => c.id === contact.id);
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
    if(this.addSubtask != ''){
      this.subtasks.push(this.getSubtask());
      this.addSubtask = '';
    }
  }

  openSubtaskInput(index: number){
    this.changeSubtask = index;
    this.subtasksInput = this.subtasks[index].title;
  }

  changeSubtaskTitle(index: number){
    this.subtasks[index].title = this.subtasksInput;
    this.changeSubtask = null;
  }

  deleteSubtask(index : number){
    this.subtasks.splice(index, 1);
    this.changeSubtask = null;
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

  getCleanTask(): Task {
    return {
      title: this.title,
      description: this.description,
      category: this.category,
      priority: this.priority,
      status: this.taskStatus,
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

  submitTaskFromForm() {
    if(this.category != 'Select task category'){
      let task = this.getCleanTask();
      this.taskDataService.addTask(task);
      this.openBoard();
      this.colseAddTaskOverlayBoard();
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

  colseAddTaskOverlayBoard(){
    this.closeAddTaskOverlay.emit(false);
  }

  openDropdown(event: Event) {
    event.stopPropagation();
    this.isOverlayOpen1 = true;
  }

}

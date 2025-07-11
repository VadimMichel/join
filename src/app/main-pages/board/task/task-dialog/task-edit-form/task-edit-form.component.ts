import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Task, Subtask } from '../../../../shared-data/task.interface';
import { ContactDataService } from '../../../../shared-data/contact-data.service';
import { getRandomColor, getInitials } from '../../../../../shared/color-utils';

@Component({
  selector: 'app-task-edit-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-edit-form.component.html',
  styleUrl: './task-edit-form.component.scss'
})
export class TaskEditFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  
  @Output() saveClicked = new EventEmitter<Task>();
  @Output() cancelClicked = new EventEmitter<void>();

  @ViewChild('editInput') editInputRef!: ElementRef<HTMLInputElement>;

  editForm!: FormGroup;
  showContactsList = false;
  
  editingSubtaskIndex: number | null = null;
  editingSubtaskText: string = '';
  minDate: string = '';
  
  getRandomColor = getRandomColor;
  getInitials = getInitials;

  constructor(
    private fb: FormBuilder,
    public contactDataService: ContactDataService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.task) {
      this.populateEditForm(this.task);
    }
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  
  ngOnChanges(): void {
    if (this.task) {
      this.populateEditForm(this.task);
    }
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['medium'],
      assignedUsers: [[]],
      subtasks: [[]]
    });
  }

  private populateEditForm(task: Task): void {
    this.editForm.patchValue({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
      priority: task.priority,
      assignedUsers: task.assignedUsers,
      subtasks: task.subtasks || []
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  addSubtask(): void {
    const subtaskTitle = prompt('Enter subtask title:');
    if (subtaskTitle) {
      const currentSubtasks = this.editForm.get('subtasks')?.value || [];
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        completed: false
      };
      this.editForm.patchValue({
        subtasks: [...currentSubtasks, newSubtask]
      });
    }
  }

  removeSubtask(index: number): void {
    const currentSubtasks = this.editForm.get('subtasks')?.value || [];
    currentSubtasks.splice(index, 1);
    this.editForm.patchValue({
      subtasks: currentSubtasks
    });
  }

  toggleAssignedUser(userName: string): void {
    const currentUsers = this.editForm.get('assignedUsers')?.value || [];
    const userIndex = currentUsers.indexOf(userName);
    
    if (userIndex > -1) {
      currentUsers.splice(userIndex, 1);
    } else {
      currentUsers.push(userName);
    }
    
    this.editForm.patchValue({
      assignedUsers: currentUsers
    });
  }

  isUserAssigned(userName: string): boolean {
    const assignedUsers = this.editForm.get('assignedUsers')?.value || [];
    return assignedUsers.includes(userName);
  }

  getAvailableContacts(): string[] {
    const contacts: string[] = [];
    this.contactDataService.contactlist.forEach(group => {
      group.contacts.forEach(contact => {
        contacts.push(contact.name);
      });
    });
    return contacts;
  }

  onSaveClick(): void {
    if (this.editForm.valid && this.task) {
      const formValue = this.editForm.value;
      const updatedTask: Task = {
        ...this.task,
        title: formValue.title,
        description: formValue.description,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        priority: formValue.priority,
        assignedUsers: formValue.assignedUsers,
        subtasks: formValue.subtasks
      };
      this.saveClicked.emit(updatedTask);
    }
  }

  onCancelClick(): void {
    this.cancelClicked.emit();
  }

  setPriority(priority: string): void {
    this.editForm.patchValue({ priority });
  }

  addSubtaskFromInput(inputElement: HTMLInputElement): void {
    const title = inputElement.value.trim();
    if (title) {
      const currentSubtasks = this.editForm.get('subtasks')?.value || [];
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: title,
        completed: false
      };
      this.editForm.patchValue({
        subtasks: [...currentSubtasks, newSubtask]
      });
      inputElement.value = '';
    }
  }

  toggleContactsList(): void {
    this.showContactsList = !this.showContactsList;
  }

  onSubtaskInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.editingSubtaskText = target.value;
  }

  startEditSubtask(index: number): void {
    const currentSubtasks = this.editForm.get('subtasks')?.value || [];
    const subtask = currentSubtasks[index];
    
    if (subtask) {
      this.editingSubtaskIndex = index;
      this.editingSubtaskText = subtask.title;
      
      setTimeout(() => {
        const editInput = document.querySelector('.subtask-edit-input') as HTMLInputElement;
        if (editInput) {
          editInput.focus();
          editInput.select(); 
        }
      }, 10);
    }
  }

  saveSubtaskEdit(index: number): void {
    if (this.editingSubtaskText.trim() !== '') {
      const currentSubtasks = this.editForm.get('subtasks')?.value || [];
      currentSubtasks[index] = {
        ...currentSubtasks[index],
        title: this.editingSubtaskText.trim()
      };
      this.editForm.patchValue({
        subtasks: currentSubtasks
      });
    }
    this.cancelSubtaskEdit();
  }

  cancelSubtaskEdit(): void {
    this.editingSubtaskIndex = null;
    this.editingSubtaskText = '';
  }
}

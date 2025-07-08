import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDataService } from '../shared-data/contact-data.service';
import { getRandomColor } from '../../shared/color-utils';
import { Contacts } from './../contacts-interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-create-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-create-form.component.html',
  styleUrl: './task-create-form.component.scss'
})
export class TaskCreateFormComponent {
  getRandomColor = getRandomColor;
  public isOverlayOpen1 = false;
  public isOverlayOpen2 = false;
  priority: "urgent" | "medium" | "low" = "medium";
  assignetTo: Contacts[] = []; 
  title:string = "";
  date: Date | null = null;
  category: String = 'Select task category';

  constructor(public contactDataService: ContactDataService){}

  toggleOverlay(type: 'assign' | 'category', event: Event) {
    event.stopPropagation();
    if (type === 'assign') {
      this.isOverlayOpen1 = !this.isOverlayOpen1;
      this.isOverlayOpen2 = false;
    } else if (type === 'category') {
      this.isOverlayOpen2 = !this.isOverlayOpen2;
      this.isOverlayOpen1 = false;
    }

  }

  changePriority(priority: "urgent" | "medium" | "low"  = "medium"){
    this.priority = priority;
  }

  selectContact(contact: Contacts, event: Event) {
    event.stopPropagation();
    const index = this.assignetTo.findIndex(c => c.id === contact.id);
    if (index === -1) {
      this.assignetTo.push(contact);
    } else {
      this.assignetTo.splice(index, 1);
    }
  }

  closeWindow(){
    this.isOverlayOpen1 = false;
    this.isOverlayOpen2 = false;
  }

  onWrapperClick(event: Event) {
    event.stopPropagation();
  }

  selectCategory(category: string){
    this.category = category;
    this.isOverlayOpen2 = false;
  }
}

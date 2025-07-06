import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDataService } from '../shared-data/contact-data.service';
import { getRandomColor } from '../../shared/color-utils';

@Component({
  selector: 'app-task-create-form',
  imports: [CommonModule],
  templateUrl: './task-create-form.component.html',
  styleUrl: './task-create-form.component.scss'
})
export class TaskCreateFormComponent {
  getRandomColor = getRandomColor;
  public isOverlayOpen1 = false;
  public isOverlayOpen2 = false;
  priority: "urgent" | "medium" | "low" = "medium";

  constructor(public contactDataService: ContactDataService){}

  toggleOverlay(type: 'assign' | 'category') {
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
}

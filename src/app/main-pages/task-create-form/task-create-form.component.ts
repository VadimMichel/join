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
  public isOverlayOpen = false;

  constructor(public contactDataService: ContactDataService){}

  

  toggleOverlay() {
    this.isOverlayOpen = !this.isOverlayOpen;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDataService } from '../shared-data/contact-data.service';

@Component({
  selector: 'app-task-create-form',
  imports: [CommonModule],
  templateUrl: './task-create-form.component.html',
  styleUrl: './task-create-form.component.scss'
})
export class TaskCreateFormComponent {
constructor(public contactDataService: ContactDataService){

}
}

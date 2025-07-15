import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-help',
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {

  constructor(private location: Location) {}

  /**
   * Navigate back to the previous page
   */
  goBack(): void {
    this.location.back();
  }
}

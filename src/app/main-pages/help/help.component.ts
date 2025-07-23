import { Component } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Help component that provides user assistance and documentation
 * Displays help content and navigation functionality
 */
@Component({
  selector: 'app-help',
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  /**
   * Constructor initializes the help component with location service
   * @param {Location} location - Angular Location service for navigation
   */
  constructor(private location: Location) {}

  /**
   * Navigate back to the previous page
   */
  goBack(): void {
    this.location.back();
  }
}

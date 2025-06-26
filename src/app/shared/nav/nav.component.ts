import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Navigation component that displays the main application navigation menu
 */
@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

}

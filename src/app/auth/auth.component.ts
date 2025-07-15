import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactDataService } from '../main-pages/shared-data/contact-data.service';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  showLogo = false;

  constructor(public contactDataService: ContactDataService){}

  ngOnInit() {
    setTimeout(() => {
      this.showLogo = true;
    }, 3600);
  }
}

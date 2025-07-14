import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-start-redirect',
  imports: [],
  template: ''
})
export class StartRedirectComponent {

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/board'])
    } else {
      this.router.navigate(['/auth/login'])
    }
  }
}

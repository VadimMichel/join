import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactDataService } from '../../contact-data.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent implements OnInit {
  contact$!: Observable<any>;
  contactId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contactDataService: ContactDataService
  ) {}

  ngOnInit() {
    this.contactId = this.route.snapshot.params['id'];
    this.contact$ = this.contactDataService.getContactById(this.contactId);
  }

  goBack() {
    this.router.navigate(['/contacts']);
  }
}

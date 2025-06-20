import { Routes } from '@angular/router';
import { ContactsComponent } from './main-pages/contacts/contacts.component';
import { ContactDetailsComponent } from './main-pages/contacts/contact-details/contact-details.component';

export const routes: Routes = [
      {path: '', component: ContactsComponent},
      {path: 'contacts', component: ContactsComponent},
      {path: 'contacts/:id', component: ContactDetailsComponent},
];

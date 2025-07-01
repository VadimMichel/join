import { Routes } from '@angular/router';
import { ContactsComponent } from './main-pages/contacts/contacts.component';
import { ContactDetailsComponent } from './main-pages/contacts/contact-details/contact-details.component';
import { BoardComponent } from './main-pages/board/board.component';
import { AddTaskComponent } from './main-pages/add-task/add-task.component';

export const routes: Routes = [
      {path: '', component: ContactsComponent},
      {path: 'contacts', component: ContactsComponent},
      {path: 'contacts/:id', component: ContactDetailsComponent},
      {path: 'board', component: BoardComponent},
      {path: 'addTask', component: AddTaskComponent},
];

import { Routes } from '@angular/router';
import { ContactsComponent } from './main-pages/contacts/contacts.component';
import { ContactDetailsComponent } from './main-pages/contacts/contact-details/contact-details.component';
import { BoardComponent } from './main-pages/board/board.component';
import { AddTaskComponent } from './main-pages/add-task/add-task.component';
import { LegalNoticeComponent } from './legal-pages/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './legal-pages/privacy-policy/privacy-policy.component';
import { HelpComponent } from './main-pages/help/help.component';

export const routes: Routes = [
      {path: '', component: BoardComponent},
      {path: 'contacts', component: ContactsComponent},
      {path: 'contacts/:id', component: ContactDetailsComponent},
      {path: 'board', component: BoardComponent},
      {path: 'addTask', component: AddTaskComponent},
      {path: 'legal-notice', component: LegalNoticeComponent},
      {path: 'privacy-policy', component: PrivacyPolicyComponent},
      {path: 'help', component: HelpComponent},
];

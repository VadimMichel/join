import { Routes } from '@angular/router';
import { ContactsComponent } from './main-pages/contacts/contacts.component';
import { ContactDetailsComponent } from './main-pages/contacts/contact-details/contact-details.component';
import { BoardComponent } from './main-pages/board/board.component';
import { AddTaskComponent } from './main-pages/add-task/add-task.component';
import { LegalNoticeComponent } from './legal-pages/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './legal-pages/privacy-policy/privacy-policy.component';
import { HelpComponent } from './main-pages/help/help.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/guards/auth.guard';
import { StartRedirectComponent } from './start-redirect/start-redirect.component';
import { SummaryComponent } from './main-pages/summary/summary.component';
import { MobileGreetingComponent } from './shared/widgets/mobile-greeting/mobile-greeting.component';

export const routes: Routes = [
  { path: '' , component: StartRedirectComponent }, 
  {
    path: 'auth',
    component: AuthComponent, 
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: 'mobile-greeting', component: MobileGreetingComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [authGuard] },
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] },
  { path: 'contacts/:id', component: ContactDetailsComponent , canActivate: [authGuard] },
  { path: 'board', component: BoardComponent, canActivate: [authGuard] },
  { path: 'addTask', component: AddTaskComponent, canActivate: [authGuard] },
  { path: 'legal-notice', component: LegalNoticeComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'help', component: HelpComponent },
];

import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RaiseTicketComponent } from './pages/raise-ticket/raise-ticket.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'raise-ticket', component: RaiseTicketComponent, canActivate: [AuthGuard] },
  { path: 'my-tickets', component: MyTicketsComponent, canActivate: [AuthGuard], data: { roles: ['USER'] } },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'ticket/:id', component: TicketDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];

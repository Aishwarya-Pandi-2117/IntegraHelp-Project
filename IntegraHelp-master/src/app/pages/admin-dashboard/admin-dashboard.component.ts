import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Ticket } from '../../core/models/ticket.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge.component';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatSelectModule, MatButtonModule, MatSnackBarModule, StatusBadgeComponent, MatCardModule, HeaderComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  filtered: Ticket[] = [];
  filterStatus = 'ALL';
  user: any;
  api = 'http://localhost:8084/api';

  constructor(private http: HttpClient, private auth: AuthService,
    private snack: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log('Admin dashboard - current user:', this.user);
    if (!this.user) {
      console.error('No user logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    this.loadTickets();
  }

  loadTickets() {
    const url = this.user?.departmentId
      ? `${this.api}/tickets/department/${this.user.departmentId}`
      : `${this.api}/tickets/all`;
    console.log('Loading tickets from:', url);
    this.http.get<Ticket[]>(url).subscribe({
      next: t => {
        console.log('Loaded tickets:', t);
        // If API succeeds but returns empty array, use mock data for development
        if (!t || t.length === 0) {
          console.log('API returned empty tickets, using mock data');
          this.loadMockTickets();
        } else {
          this.tickets = t;
          this.applyFilter();
        }
      },
      error: err => {
        console.error('Failed to load tickets:', err);
        this.snack.open('Failed to load tickets', 'Close', { duration: 3000 });
        // Fallback: mock tickets for development
        this.loadMockTickets();
      }
    });
  }

  private loadMockTickets() {
    console.log('Loading fallback mock tickets for department:', this.user?.departmentId);
    const deptTickets: Record<number, any[]> = {
      1: [ // Infrastructure
        {
          id: 1,
          ticketNumber: 'INF-001',
          issueType: 'Temperature Issue',
          departmentName: 'Infrastructure',
          description: 'AC not working in ODC-5, temperature is 30°C',
          status: 'SUBMITTED',
          anonymous: false,
          priority: 'HIGH',
          raisedBy: 'emp1',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          ticketNumber: 'INF-002',
          issueType: 'Lighting Issue',
          departmentName: 'Infrastructure',
          description: 'Lights flickering in floor 3, area A',
          status: 'IN_PROGRESS',
          anonymous: false,
          priority: 'MEDIUM',
          raisedBy: 'emp2',
          createdAt: new Date().toISOString()
        }
      ],
      2: [ // IT Support
        {
          id: 3,
          ticketNumber: 'IT-001',
          issueType: 'Hardware Failure',
          departmentName: 'IT Support',
          description: 'Laptop keyboard not working, asset tag: LT-12345',
          status: 'SUBMITTED',
          anonymous: false,
          priority: 'MEDIUM',
          raisedBy: 'emp1',
          createdAt: new Date().toISOString()
        }
      ],
      3: [ // HR
        {
          id: 4,
          ticketNumber: 'HR-001',
          issueType: 'Payroll Issue',
          departmentName: 'HR',
          description: 'Salary not credited for March 2024',
          status: 'RESOLVED',
          anonymous: false,
          priority: 'HIGH',
          raisedBy: 'emp2',
          createdAt: new Date().toISOString()
        }
      ],
      4: [ // Finance
        {
          id: 5,
          ticketNumber: 'FIN-001',
          issueType: 'Reimbursement',
          departmentName: 'Finance',
          description: 'Travel expense reimbursement pending for ₹5000',
          status: 'IN_PROGRESS',
          anonymous: false,
          priority: 'MEDIUM',
          raisedBy: 'emp1',
          createdAt: new Date().toISOString()
        }
      ],
      5: [ // Security
        {
          id: 6,
          ticketNumber: 'SEC-001',
          issueType: 'Access Card Issue',
          departmentName: 'Security',
          description: 'Access card not working for main entrance',
          status: 'SUBMITTED',
          anonymous: false,
          priority: 'HIGH',
          raisedBy: 'emp2',
          createdAt: new Date().toISOString()
        }
      ]
    };

    // Load department-specific tickets, or all tickets if no department specified
    if (this.user?.departmentId && deptTickets[this.user.departmentId]) {
      this.tickets = deptTickets[this.user.departmentId];
    } else {
      // Load all tickets for admins without specific department
      this.tickets = Object.values(deptTickets).flat();
    }
    console.log('Loaded fallback tickets:', this.tickets.length, 'tickets');
    this.applyFilter();
  }

  applyFilter() {
    this.filtered = this.filterStatus === 'ALL'
      ? this.tickets
      : this.tickets.filter(t => t.status === this.filterStatus);
  }

  updateStatus(ticket: Ticket, status: string) {
    console.log('Updating ticket', ticket.id, 'to status:', status);
    this.http.patch(`${this.api}/tickets/${ticket.id}/status`, { status }).subscribe({
      next: () => {
        console.log('Status updated successfully');
        this.snack.open('Status updated', 'OK', { duration: 2000 });
        this.loadTickets();
      },
      error: err => {
        console.error('Failed to update status:', err);
        this.snack.open('Update failed', 'Close', { duration: 2000 });
        // Fallback: update locally for development
        ticket.status = status as any;
        this.applyFilter();
        this.snack.open('Status updated (local)', 'OK', { duration: 2000 });
      }
    });
  }
}

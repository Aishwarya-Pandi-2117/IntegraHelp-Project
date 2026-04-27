import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { RouterModule, Router } from "@angular/router";
import { Ticket } from "../../core/models/ticket.model";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { StatusBadgeComponent } from "../../shared/status-badge/status-badge.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { AuthService } from "../../core/auth/auth.service";

@Component({ selector: "app-my-tickets",
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule, StatusBadgeComponent, HeaderComponent],
  templateUrl: "./my-tickets.component.html" })
export class MyTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = true;
  user: any;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    console.log("My Tickets - current user:", this.user);
    if (!this.user) {
      console.error("No user logged in, redirecting to login");
      this.router.navigate(['/login']);
      return;
    }
    console.log("Loading my tickets for user:", this.user?.username);
    this.http.get<Ticket[]>("http://localhost:8084/api/tickets/my")
      .subscribe({ 
        next: t => { 
          console.log("Loaded my tickets:", t);
          // If API succeeds but returns empty array, use mock data for development
          if (!t || t.length === 0) {
            console.log("API returned empty tickets, using mock data");
            this.tickets = this.getMockTicketsForUser();
          } else {
            this.tickets = t;
          }
          this.loading = false; 
        },
        error: err => {
          console.error("Failed to load my tickets:", err);
          // Fallback: mock tickets for development
          console.log("Loading fallback mock tickets for user:", this.user?.username);
          this.tickets = this.getMockTicketsForUser();
          console.log("Loaded fallback tickets:", this.tickets.length, "tickets");
          this.loading = false;
        }
      });
  }

  private getMockTicketsForUser(): Ticket[] {
    if (!this.user) return [];
    
    const username = this.user.username;
    const mockTickets: Record<string, Ticket[]> = {
      "emp1": [
        {
          id: 1,
          ticketNumber: "TICK-001",
          issueType: "Temperature Issue",
          departmentName: "Infrastructure",
          description: "AC not working in my office",
          status: "SUBMITTED",
          anonymous: false,
          priority: "HIGH",
          raisedBy: "emp1",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          ticketNumber: "TICK-002", 
          issueType: "Hardware Failure",
          departmentName: "IT Support",
          description: "Laptop keyboard not responding",
          status: "IN_PROGRESS",
          anonymous: false,
          priority: "MEDIUM",
          raisedBy: "emp1",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      "emp2": [
        {
          id: 3,
          ticketNumber: "TICK-003",
          issueType: "Payroll Issue",
          departmentName: "HR",
          description: "Salary not credited this month",
          status: "RESOLVED",
          anonymous: false,
          priority: "HIGH",
          raisedBy: "emp2",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          ticketNumber: "TICK-004",
          issueType: "Reimbursement",
          departmentName: "Finance", 
          description: "Travel expense reimbursement pending",
          status: "SUBMITTED",
          anonymous: false,
          priority: "MEDIUM",
          raisedBy: "emp2",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    return mockTickets[username] || [];
  }
}

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { Department } from "../../core/models/ticket.model";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({ selector: "app-home",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, HeaderComponent],
  templateUrl: "./home.component.html" })
export class HomeComponent implements OnInit {
  departments: Department[] = [];
  user :any;

  constructor(private http: HttpClient,
    private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user=this.auth.getUser();
    this.http.get<Department[]>("http://localhost:8084/api/departments")
      .subscribe({
        next: d => {
          console.log("Loaded departments:", d);
          this.departments = d;
        },
        error: err => {
          console.error("Failed to load departments:", err);
          // Fallback: mock departments for development
          this.departments = [
            { 
              id: 1, 
              name: "Infrastructure", 
              code: "INFRA", 
              icon: "build", 
              description: "Facility and infrastructure support",
              issueTypesJson: '["Temperature Issue", "Lighting Issue", "Air Conditioning", "Power Supply"]'
            },
            { 
              id: 2, 
              name: "IT Support", 
              code: "IT", 
              icon: "computer", 
              description: "Technical support and IT services",
              issueTypesJson: '["Hardware Failure", "Network Issue", "Software Installation", "Printer Issue"]'
            },
            { 
              id: 3, 
              name: "HR", 
              code: "HR", 
              icon: "people", 
              description: "Human resources and employee services",
              issueTypesJson: '["Payroll Issue", "Leave Request", "Employee Records", "Training"]'
            },
            { 
              id: 4, 
              name: "Finance", 
              code: "FIN", 
              icon: "account_balance", 
              description: "Financial services and reimbursements",
              issueTypesJson: '["Reimbursement", "Invoice Processing", "Budget Query", "Payment Issue"]'
            },
            { 
              id: 5, 
              name: "Security", 
              code: "SEC", 
              icon: "security", 
              description: "Security and access control",
              issueTypesJson: '["Access Card Issue", "Security Breach", "Visitor Access", "Surveillance"]'
            }
          ];
        }
      });
  }

  selectDept(dept: Department) {
    this.router.navigate(["/raise-ticket"],
      { queryParams: { deptId: dept.id, deptName: dept.name } });
  }

  goAdmin() { this.router.navigate(["/admin"]); }
  goMyTickets() { this.router.navigate(["/my-tickets"]); }
  logout() { this.auth.logout(); this.router.navigate(["/login"]); }
  isAdmin() { return this.auth.isAdmin(); }
  isGuest() { return this.auth.isGuest(); }
}

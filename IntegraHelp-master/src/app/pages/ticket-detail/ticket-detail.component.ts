import { Component, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AuthService } from "../../core/auth/auth.service";
import { Ticket } from "../../core/models/ticket.model";
import { StatusBadgeComponent } from "../../shared/status-badge/status-badge.component";

interface AuditLog {
  id: number;
  ticketNumber: string;
  action: string;
  oldStatus: string;
  newStatus: string;
  performedBy: string;
  timestamp: string;
}

@Component({
  selector: "app-ticket-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatSelectModule, MatSnackBarModule, StatusBadgeComponent],
  templateUrl: "./ticket-detail.component.html",
  styleUrls: ["./ticket-detail.component.scss"]
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  auditLogs: AuditLog[] = [];
  loading = true;
  updatingStatus = false;
  ticketId!: number;
  api = "http://localhost:8084/api";

  // Status steps in order — used to render the progress stepper
  statusSteps = [
    { key: "SUBMITTED",   label: "Submitted",   icon: "send" },
    { key: "IN_PROGRESS", label: "In Progress", icon: "engineering" },
    { key: "RESOLVED",    label: "Resolved",    icon: "check_circle" },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get("id"));
    this.loadTicket();
    this.loadAudit();
  }

  loadTicket(): void {
    // Try fetching from the "all" endpoint (admin) or "my" endpoint (user)
    const endpoint = this.auth.isAdmin()
      ? `${this.api}/tickets/all`
      : `${this.api}/tickets/my`;

    this.http.get<Ticket[]>(endpoint).subscribe({
      next: (tickets) => {
        this.ticket = tickets.find(t => t.id === this.ticketId) ?? null;
        this.loading = false;
        if (!this.ticket) {
          this.snack.open("Ticket not found", "Close", { duration: 3000 });
          this.router.navigate(["/home"]);
        }
      },
      error: () => {
        this.loading = false;
        this.snack.open("Failed to load ticket", "Close", { duration: 3000 });
      }
    });
  }

  loadAudit(): void {
    // Audit is only visible to admins
    if (!this.auth.isAdmin()) return;
    // We need ticketNumber — fetch after ticket loads
    setTimeout(() => {
      if (this.ticket?.ticketNumber) {
        this.http.get<AuditLog[]>(
          `${this.api}/audit/${this.ticket.ticketNumber}`
        ).subscribe({ next: l => this.auditLogs = l, error: () => {} });
      }
    }, 1200);
  }

  updateStatus(newStatus: string): void {
    this.updatingStatus = true;
    this.http.patch(
      `${this.api}/tickets/${this.ticketId}/status`,
      { status: newStatus }
    ).subscribe({
      next: (updated: any) => {
        this.updatingStatus = false;
        this.ticket = updated;
        this.loadAudit();
        this.snack.open(
          `Status updated to ${newStatus.replace("_"," ")}`, "OK",
          { duration: 3000 }
        );
      },
      error: () => {
        this.updatingStatus = false;
        this.snack.open("Update failed. Try again.", "Close", { duration: 3000 });
      }
    });
  }

  // Returns the index of the current status in statusSteps
  get currentStepIndex(): number {
    return this.statusSteps.findIndex(s => s.key === this.ticket?.status);
  }

  isStepDone(index: number): boolean {
    return index < this.currentStepIndex;
  }

  isStepActive(index: number): boolean {
    return index === this.currentStepIndex;
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toUpperCase()) {
      case "HIGH":   return "#EF4444";
      case "MEDIUM": return "#F59E0B";
      case "LOW":    return "#10B981";
      default:       return "#6B7280";
    }
  }

  goBack(): void {
    this.router.navigate([this.auth.isAdmin() ? "/admin" : "/my-tickets"]);
  }

  isAdmin(): boolean { return this.auth.isAdmin(); }

  canMarkInProgress(): boolean {
    return this.isAdmin() && this.ticket?.status === "SUBMITTED";
  }

  canMarkResolved(): boolean {
    return this.isAdmin() && this.ticket?.status === "IN_PROGRESS";
  }
}

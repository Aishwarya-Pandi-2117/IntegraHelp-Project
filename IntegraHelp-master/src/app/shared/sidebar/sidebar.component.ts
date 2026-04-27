import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { User } from "../../core/models/user.model";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // which roles can see this link
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  user: User | null = null;
  initials = "";

  navItems: NavItem[] = [
    {
      label: "Home",
      icon: "home",
      route: "/home",
      roles: ["ADMIN", "USER", "GUEST"]
    },
    {
      label: "Raise a Ticket",
      icon: "add_circle_outline",
      route: "/home",       // redirects to home to pick dept first
      roles: ["USER", "GUEST"]
    },
    {
      label: "My Tickets",
      icon: "confirmation_number",
      route: "/my-tickets",
      roles: ["USER"]
    },
    {
      label: "Admin Dashboard",
      icon: "dashboard",
      route: "/admin",
      roles: ["ADMIN"]
    },
  ];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    if (this.user?.fullName) {
      const parts = this.user.fullName.trim().split(" ");
      this.initials = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : parts[0][0];
      this.initials = this.initials.toUpperCase();
    }
  }

  // Filter nav items by the current user's role
  get visibleItems(): NavItem[] {
    const role = this.user?.role ?? "GUEST";
    return this.navItems.filter(item => item.roles.includes(role));
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route ||
      (route !== "/home" && this.router.url.startsWith(route));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }

  getRoleBadgeColor(): string {
    switch (this.user?.role) {
      case "ADMIN": return "#1E3A8A";
      case "USER":  return "#065F46";
      case "GUEST": return "#6B21A8";
      default:      return "#374151";
    }
  }
}

import { Component , OnInit} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({ selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: "./header.component.html" })
export class HeaderComponent {
  user:any;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(){ this.user=this.auth.getUser();}
  logout() { this.auth.logout(); this.router.navigate(["/login"]); }
  home() { this.router.navigate(["/home"]); }
}

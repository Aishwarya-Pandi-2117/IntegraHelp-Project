import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";

@Component({ selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule, MatIconModule],
  templateUrl: "./login.component.html" })
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService,
    private router: Router, private snack: MatSnackBar) {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;
    this.loading = true;
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: u => {
        this.loading = false;
        this.router.navigate([u.role === "ADMIN" ? "/admin" : "/home"]);
      },
      error: () => {
        this.loading = false;
        this.snack.open("Invalid credentials", "Close", { duration: 3000 });
      }
    });
  }

  guestLogin() {
    this.loading = true;
    this.auth.guestLogin().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/home"]);
      },
      error: (err) => {
        this.loading = false;
        console.error("Guest login failed:", err);
        this.snack.open("Guest login failed. Please try again.", "Close", { duration: 3000 });
      }
    });
  }
}

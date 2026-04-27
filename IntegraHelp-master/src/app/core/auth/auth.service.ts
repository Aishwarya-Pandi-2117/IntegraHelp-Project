import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, catchError, of } from "rxjs";
import { throwError } from "rxjs";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private api = "http://localhost:8084/api/auth";
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem("ih_user");
    if (saved) this.userSubject.next(JSON.parse(saved));
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, { username, password }).pipe(
      tap(user => {
        console.log("Login successful:", user);
        this.setUser(user);
      }),
      catchError(err => {
        console.error("Login error:", err);
        console.error("Error status:", err.status);
        console.error("Error message:", err.message);
        if (err.error) console.error("Error response:", err.error);
        
        // Fallback for development: create mock users with specific credentials
        const mockUsers: Record<string, User> = {
          "admin.infra": {
            username: "admin.infra",
            fullName: "Infrastructure Admin",
            role: "ADMIN",
            departmentId: 1,
            departmentName: "Infrastructure",
            token: "mock_admin_infra_token_" + Date.now()
          },
          "admin.it": {
            username: "admin.it", 
            fullName: "IT Admin",
            role: "ADMIN",
            departmentId: 2,
            departmentName: "IT Support",
            token: "mock_admin_it_token_" + Date.now()
          },
          "admin.hr": {
            username: "admin.hr",
            fullName: "HR Admin", 
            role: "ADMIN",
            departmentId: 3,
            departmentName: "HR",
            token: "mock_admin_hr_token_" + Date.now()
          },
          "admin.fin": {
            username: "admin.fin",
            fullName: "Finance Admin",
            role: "ADMIN", 
            departmentId: 4,
            departmentName: "Finance",
            token: "mock_admin_fin_token_" + Date.now()
          },
          "admin.sec": {
            username: "admin.sec",
            fullName: "Security Admin",
            role: "ADMIN",
            departmentId: 5,
            departmentName: "Security", 
            token: "mock_admin_sec_token_" + Date.now()
          },
          "emp1": {
            username: "emp1",
            fullName: "Employee 1",
            role: "USER",
            token: "mock_emp1_token_" + Date.now()
          },
          "emp2": {
            username: "emp2", 
            fullName: "Employee 2",
            role: "USER",
            token: "mock_emp2_token_" + Date.now()
          }
        };

        const userKey = `${username}`;
        const mockUser = mockUsers[userKey];
        
        if (mockUser && 
            ((username.startsWith("admin.") && password === "Admin@123") ||
             (username.startsWith("emp") && password === "Emp@123"))) {
          console.warn(`Backend not available. Using mock ${mockUser.role} user for development.`);
          this.setUser(mockUser);
          return of(mockUser);
        }
        
        return throwError(() => err);
      })
    );
  }

  guestLogin(): Observable<User> {
    console.log("Attempting guest login to:", `${this.api}/guest`);
    return this.http.post<User>(`${this.api}/guest`, {}).pipe(
      tap(user => {
        console.log("Guest login successful:", user);
        this.setUser(user);
      }),
      catchError(err => {
        console.error("Guest login error:", err);
        console.error("Error status:", err.status);
        console.error("Error message:", err.message);
        if (err.error) console.error("Error response:", err.error);
        
        // Fallback for development: create a mock guest user
        console.warn("Backend not available. Using mock guest user for development.");
        const mockGuestUser: User = {
          username: "guest",
          fullName: "Guest User",
          role: "GUEST",
          token: "mock_guest_token_" + Date.now()
        };
        this.setUser(mockGuestUser);
        return of(mockGuestUser);
      })
    );
  }

  private setUser(user: User) {
    localStorage.setItem("ih_user", JSON.stringify(user));
    localStorage.setItem("ih_token", user.token);
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem("ih_user");
    localStorage.removeItem("ih_token");
    this.userSubject.next(null);
  }

  getToken(): string | null { return localStorage.getItem("ih_token"); }
  getUser(): User | null { return this.userSubject.value; }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.getUser()?.role === "ADMIN"; }
  isGuest(): boolean { return this.getUser()?.role === "GUEST"; }
}

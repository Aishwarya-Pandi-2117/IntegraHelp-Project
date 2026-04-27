import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "../../shared/header/header.component";
import { MatOptionModule } from "@angular/material/core";

const FIELD_CONFIG: Record<string, any[]> = {
  "Temperature Issue": [
    { name: "temperature", label: "Temperature (°C)", type: "NUMBER" },
    { name: "floorNumber", label: "Floor Number", type: "TEXT" },
    { name: "sdbNumber", label: "SDB Number", type: "TEXT" },
    { name: "odcNumber", label: "ODC Number", type: "TEXT" }
  ],
  "Lighting Issue": [
    { name: "floorNumber", label: "Floor Number", type: "TEXT" },
    { name: "areaDescription", label: "Area Description", type: "TEXT" },
    { name: "fixtureCount", label: "Faulty Fixtures Count", type: "NUMBER" }
  ],
  "Hardware Failure": [
    { name: "assetTag", label: "Asset Tag / Serial No", type: "TEXT" },
    { name: "deviceType", label: "Device Type", type: "SELECT",
      options: ["Laptop","Desktop","Monitor","Keyboard","Mouse"] },
    { name: "issueDetail", label: "Issue Description", type: "TEXT" }
  ],
  "Network Issue": [
    { name: "ipAddress", label: "IP Address", type: "TEXT" },
    { name: "location", label: "Location / Floor", type: "TEXT" },
    { name: "symptom", label: "Error / Symptom", type: "TEXT" }
  ],
  "Payroll Issue": [
    { name: "empId", label: "Employee ID", type: "TEXT" },
    { name: "payPeriod", label: "Pay Period", type: "TEXT" },
    { name: "issueDetail", label: "Issue Detail", type: "TEXT" }
  ],
  "Reimbursement": [
    { name: "amount", label: "Amount (INR)", type: "NUMBER" },
    { name: "expenseDate", label: "Expense Date", type: "TEXT" },
    { name: "receiptNo", label: "Receipt Number", type: "TEXT" }
  ],
  "Access Card Issue": [
    { name: "cardNumber", label: "Card Number", type: "TEXT" },
    { name: "location", label: "Access Point", type: "TEXT" }
  ]
};

@Component({ selector: "app-raise-ticket",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule, MatSnackBarModule, MatIconModule, MatOptionModule, HeaderComponent],
  templateUrl: "./raise-ticket.component.html" })
export class RaiseTicketComponent implements OnInit {
  deptId!: number;
  deptName = "";
  issueTypes: string[] = [];
  selectedIssue = "";
  dynamicFields: any[] = [];
  fieldValues: Record<string, string> = {};
  description = "";
  priority = "MEDIUM";
  anonymous = false;
  loading = false;
  isGuest = false;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private router: Router, private auth: AuthService,
    private snack: MatSnackBar) {}

  ngOnInit() {
    this.isGuest = this.auth.isGuest();
    if(this.isGuest) this.anonymous = true;
    this.route.queryParams.subscribe(p => {
      this.deptId = +p["deptId"];
      this.deptName = p["deptName"];
      console.log("Loading department:", this.deptId, this.deptName);
      
      this.http.get<any>(`http://localhost:8084/api/departments/${this.deptId}`)
        .subscribe({
          next: (d) => {
            console.log("Department data:", d);
            this.issueTypes = JSON.parse(d.issueTypesJson);
          },
          error: (err) => {
            console.error("Error loading department:", err);
            //this.snack.open("Error loading department data", "Close", { duration: 3000 });
            // Fallback: use mock issue types based on department
            const deptIssueTypes: Record<number, string[]> = {
              1: ["Temperature Issue", "Lighting Issue", "Air Conditioning", "Power Supply"],
              2: ["Hardware Failure", "Network Issue", "Software Installation", "Printer Issue"],
              3: ["Payroll Issue", "Leave Request", "Employee Records", "Training"],
              4: ["Reimbursement", "Invoice Processing", "Budget Query", "Payment Issue"],
              5: ["Access Card Issue", "Security Breach", "Visitor Access", "Surveillance"]
            };
            this.issueTypes = deptIssueTypes[this.deptId] || ["General Issue"];
          }
        });
    });
    if (this.isGuest) this.anonymous = true;
  }

  onIssueChange() {
    this.dynamicFields = FIELD_CONFIG[this.selectedIssue] || [];
    this.fieldValues = {};
  }

  submit() {
    if (!this.selectedIssue) {
      this.snack.open("Please select an issue type", "Close", { duration: 3000 });
      return;
    }
    
    this.loading = true;
    const fields = this.dynamicFields.map(f => ({
      fieldName: f.label, fieldValue: this.fieldValues[f.name] || "",
      fieldType: f.type
    }));
    const payload = {
      departmentId: this.deptId, issueType: this.selectedIssue,
      description: this.description, priority: this.priority,
      anonymous: this.anonymous || this.isGuest, fields
    };
    
    console.log("Submitting ticket:", payload);
    
    this.http.post("http://localhost:8084/api/tickets", payload).subscribe({
      next: (response) => {
        console.log("Ticket submitted successfully:", response);
        this.loading = false;
        this.snack.open("Ticket raised successfully!", "OK", { duration: 3000 });
        this.router.navigate([this.auth.isAdmin() ? "/admin" : "/my-tickets"]);
      },
      error: (err) => {
        console.error("Error raising ticket:", err);
        console.error("Error status:", err.status);
        console.error("Error message:", err.message);
        if (err.error) console.error("Error response:", err.error);
        
        this.loading = false;
        //this.snack.open("Error raising ticket. Check console for details.", "Close", { duration: 3000 });
      }
    });
  }
}

import { Component, Input } from "@angular/core";
import { CommonModule, TitleCasePipe } from "@angular/common";

@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  template: `
    <span class="badge" [ngClass]="{
      submitted: status === 'SUBMITTED',
      progress: status === 'IN_PROGRESS',
      resolved: status === 'RESOLVED'
    }">{{ status | titlecase }}</span>
  `,
  styles: [`
    .badge { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; }
    .submitted { background: #FEF3C7; color: #92400E; }
    .progress { background: #DBEAFE; color: #1E40AF; }
    .resolved { background: #D1FAE5; color: #065F46; }
  `]
})
export class StatusBadgeComponent {
  @Input() status!: string;
}

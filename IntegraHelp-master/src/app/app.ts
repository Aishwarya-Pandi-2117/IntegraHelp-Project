import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './core/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App implements OnInit {
  protected readonly title = signal('integrahelp-frontend');
  protected showSidebar = signal(false);
  
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    // Hide sidebar on login page; show it on all other pages
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showSidebar.set(
          this.auth.isLoggedIn() && !e.url.includes('/login')
        );
      });
  }
}

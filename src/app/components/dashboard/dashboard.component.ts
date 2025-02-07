import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  



  ngOnInit(): void {
    // Wait briefly to allow token exchange to complete
    setTimeout(() => {
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['/']);
      } else {
        this.user = this.authService.userProfile;
        console.log(this.user);
        
      }
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }


}

import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { FacebookAuthService } from '../../facebook-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router,private fbAuthService:FacebookAuthService) {}



  loginWithGoogle(): void {
    this.authService.loginWith('google');
  }

  loginWithMicrosoft(): void {
    this.authService.loginWith('microsoft');
  }

  loginWithFacebook(): void {
    this.authService.loginWith('facebook');
  }

}

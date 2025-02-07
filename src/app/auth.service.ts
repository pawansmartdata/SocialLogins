

import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

import { MsalService } from '@azure/msal-angular';
import { FacebookAuthService } from './facebook-auth.service';
import { Router } from '@angular/router';
import { googleAuthConfig } from './auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private lastUsedProvider: 'google' | 'microsoft' | 'facebook' | null = null;

  constructor(
    private oauthService: OAuthService,
    private msalService: MsalService,
    private fbAuthService: FacebookAuthService,
    private router: Router
  ) {
    // Restore last used provider from localStorage if available.
    const storedProvider = localStorage.getItem('lastUsedProvider');
    if (storedProvider === 'google' || storedProvider === 'microsoft' || storedProvider === 'facebook') {
      this.lastUsedProvider = storedProvider;
    }

    // For Google, initialize OAuth configuration
    this.oauthService.configure(googleAuthConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => console.log('Google discovery document loaded'))
      .catch(err => console.error('Google discovery error', err));
  }

  public loginWith(provider: 'google' | 'microsoft' | 'facebook'): void {
    // Persist the selected provider so it survives a page refresh
    localStorage.setItem('lastUsedProvider', provider);
    this.lastUsedProvider = provider;

    if (provider === 'google') {
      console.log('Starting Google login...');
      this.oauthService.configure(googleAuthConfig);
      this.oauthService.loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          this.oauthService.initCodeFlow();
        })
        .catch(err => console.error('Google login error', err));
    } else if (provider === 'microsoft') {
      console.log('Starting Microsoft login...');
      this.msalService.loginPopup({ scopes: ['user.read'] })
        .subscribe({
          next: (response) => {
            console.log('Microsoft login successful:', response);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => console.error('Microsoft login error:', err)
        });
    } else if (provider === 'facebook') {
      console.log('Starting Facebook login...');
      this.fbAuthService.login()
        .then((userDetails) => {
          console.log('Facebook login complete, user details:', userDetails);
          this.router.navigate(['/dashboard']);
        })
        .catch(error => {
          console.error('Facebook login error:', error);
        });
    }
  }

  logout(): void {
    // Use the persisted provider to determine which logout to perform.
    if (this.lastUsedProvider === 'microsoft') {
      this.msalService.logoutPopup();
    } else if (this.lastUsedProvider === 'facebook') {
      this.fbAuthService.logout()
        .then(() => {
          localStorage.removeItem('lastUsedProvider');
          this.router.navigate(['/login']);
        });
    } else {
      // Default to Google logout
      this.oauthService.logOut();
    }
    // Clear the persisted provider on logout.
    localStorage.removeItem('lastUsedProvider');
    this.lastUsedProvider = null;
  }

  // For Google/Facebook (using OAuthService) check token in storage.
  private getOAuthToken(): string | null {
    return this.oauthService.getAccessToken() || null;
  }

  // Returns the Google user (or Facebook user if using OAuthService) if available.
  getGoogleUser(): any {
    if (this.oauthService.hasValidAccessToken()) {
      return this.oauthService.getIdentityClaims();
    }
    return null;
  }

  // Returns the Microsoft user if available.
  getMicrosoftUser(): any {
    const accounts = this.msalService.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  // Combined user profile getter.
  get userProfile(): any {
    if (this.lastUsedProvider === 'microsoft') {
      return this.getMicrosoftUser();
    } else if (this.lastUsedProvider === 'facebook') {
      const fbUser = localStorage.getItem('fb_user');
      return fbUser ? JSON.parse(fbUser) : null;
    } else {
      return this.getGoogleUser();
    }
  }

  // Updated isLoggedIn getter.
  get isLoggedIn(): boolean {
    if (this.lastUsedProvider === 'microsoft') {
      return this.msalService.instance.getAllAccounts().length > 0;
    } else if (this.lastUsedProvider === 'facebook') {
      return !!localStorage.getItem('fb_access_token');
    } else {
      return this.oauthService.hasValidAccessToken();
    }
  }
}

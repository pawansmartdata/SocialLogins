// src/app/facebook-auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare const FB: any; // Declare the global FB object

@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {
  constructor(private router: Router) {
    this.loadFbSDK();
  }

  // Load the Facebook SDK if it isn't already loaded.
  loadFbSDK(): void {
    if (document.getElementById('facebook-jssdk')) {
      return;
    }
    const js = document.createElement('script');
    js.id = 'facebook-jssdk';
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    js.async = true;
    js.defer = true;
    document.body.appendChild(js);
    js.onload = () => {
      FB.init({
        appId      : '', // Replace with your Facebook App ID
        cookie     : true,                    // Enable cookies for server access to the session
        xfbml      : true,                    // Parse social plugins on this webpage
        version    : 'v12.0'                  // Use the desired Graph API version
      });
      console.log('Facebook SDK initialized.');
    };
  }

  // Trigger Facebook login in a popup
  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          console.log('Facebook login successful:', response);
         localStorage.setItem('fb_access_token', response.authResponse.accessToken);
          // Retrieve user details using the Graph API
          FB.api('/me', { fields: 'id,name,email' }, (userResponse: any) => {
            console.log('Facebook user details:', userResponse);
            localStorage.setItem('fb_user', JSON.stringify(userResponse));
            resolve(userResponse);
          });
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'public_profile' });
    });
  }

  // Optionally, implement logout using FB.logout
  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.logout((response: any) => {
        localStorage.removeItem('fb_access_token');
                localStorage.removeItem('fb_user');
                resolve(response);
      });
    });
  }
}



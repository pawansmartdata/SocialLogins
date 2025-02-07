
import { AuthConfig } from 'angular-oauth2-oidc';

export const googleAuthConfig: AuthConfig = {
  // Google's OpenID Connect discovery document URL.
  // (Angular-oauth2-oidc will fetch endpoints automatically.)
  issuer: 'https://accounts.google.com',
  
  // The URL of your application to which Google redirects after login.
  redirectUri: window.location.origin + '/dashboard',
  
  // Your client id from Google Developers Console.
  clientId: '',
  
  // Define the scopes (openid is required for OIDC)
  scope: 'openid profile email',

  // In development, you may disable strict discovery document validation.

  strictDiscoveryDocumentValidation: false,
  
};

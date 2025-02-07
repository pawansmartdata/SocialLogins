
// src/app/msal-config.ts
import { InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
  MsalService
} from '@azure/msal-angular';
// src/app/msal-config.ts
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '', // Replace with your Application (client) ID
      authority: 'https://login.microsoftonline.com/common', // Replace with your Directory (tenant) ID
      redirectUri: 'http://localhost:4200/dashboard' // Should match one of your registered redirect URIs
    },
    cache: {
      cacheLocation: 'localStorage', // or 'sessionStorage'
      storeAuthStateInCookie: false, // Set to true for IE11 or Edge legacy support
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect, // or InteractionType.Popup
    authRequest: {
      scopes: ['user.read'] // Adjust scopes as required
    }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // Example: Protect Microsoft Graph API endpoint. Adjust or add additional endpoints as needed.
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  return {
    interactionType: InteractionType.Redirect, // or InteractionType.Popup
    protectedResourceMap
  };

}

export function initializeMsalFactory(msalService: MsalService) {
  return () => msalService.instance.initialize();
}



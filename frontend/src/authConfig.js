/**
 * Microsoft Identity Platform (MSAL) Configuration
 *
 * SETUP STEPS:
 * 1. Go to https://portal.azure.com → Azure Active Directory → App registrations → New registration
 * 2. Name: "Smart Markdown System"
 * 3. Account types: "Accounts in any organizational directory and personal Microsoft accounts"
 * 4. Redirect URI → Platform: SPA → Add BOTH of these URIs:
 *    - http://localhost:5173
 *    - https://ec2-35-154-159-107.ap-south-1.compute.amazonaws.com
 * 5. Click Register, then copy the "Application (client) ID" and paste below.
 */

export const msalConfig = {
    auth: {
        // ⚠️ REPLACE THIS with your Application (client) ID from Azure Portal
        clientId: "YOUR_CLIENT_ID_HERE",

        // Use "common" to allow both personal and organizational Microsoft accounts
        authority: "https://login.microsoftonline.com/common",

        // Automatically picks localhost for local dev or the HTTPS domain for production
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

// The permissions your app needs from Microsoft (basic profile info)
export const loginRequest = {
    scopes: ["User.Read"],
};

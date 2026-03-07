/**
 * Microsoft Identity Platform (MSAL) Configuration
 *
 * HOW TO COMPLETE SETUP:
 * 1. Go to https://portal.azure.com
 * 2. Navigate to Azure Active Directory > App registrations > New registration
 * 3. Name: "Smart Markdown System", Account Types: "Any Azure AD + personal accounts"
 * 4. Redirect URI: Select "SPA" and add:
 *    - http://localhost:5173
 *    - http://35.154.159.107:5173  (your live AWS IP)
 * 5. After registering, copy the "Application (client) ID" and "Directory (tenant) ID" below.
 */

export const msalConfig = {
    auth: {
        // ⚠️ REPLACE THIS with your Application (client) ID from Azure Portal
        clientId: "YOUR_CLIENT_ID_HERE",

        // ⚠️ REPLACE THIS with your Directory (tenant) ID, OR use "common" for all MS accounts
        authority: "https://login.microsoftonline.com/common",

        // This MUST exactly match a Redirect URI you added in the Azure Portal
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

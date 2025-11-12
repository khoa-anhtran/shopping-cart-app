import { config } from "@/config";
import { InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";

const { authority, clientId, redirectUri } = config

export const msalClient = new PublicClientApplication({
    auth: { clientId, redirectUri, authority },
    cache: {
        cacheLocation: "sessionStorage",
    }
})

// Call once on app start
export function initAccount() {
    const active = msalClient.getActiveAccount();
    if (active) return active;

    const accounts = msalClient.getAllAccounts();
    if (accounts.length === 1) {
        msalClient.setActiveAccount(accounts[0]);
        return accounts[0];
    }
    
    return null;
}

export async function getApiToken(scope: string) {
    let account = msalClient.getActiveAccount() ?? initAccount();
    if (!account) {
        // Optional silent SSO if you have a loginHint or sid from a previous login
        try {
            const sso = await msalClient.ssoSilent({ loginHint: "<optional-email>" });
            account = sso.account ?? null;
            if (account) msalClient.setActiveAccount(account);
        } catch {
            throw new Error("no_account");
        }
    }

    try {
        const { accessToken, account: myAccount } = await msalClient.acquireTokenSilent({ account, scopes: [scope] });
        const { username } = myAccount

        return { accessToken, email: username };
    } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
            const { accessToken, account: myAccount } = await msalClient.acquireTokenPopup({ account, scopes: [scope] });
            const { username } = myAccount

            return { accessToken, email: username };
        }
        throw e;
    }
}
import { App as VueApp } from "vue";
interface SDKState {
    token: string;
    isAuthenticated: boolean;
    messages: any[];
    isAuthenticating: boolean;
    logout: () => void;
    request: (rl: string, data?: any) => Promise<any>;
    initiateSSOAuthentication: (service: "google" | "github" | "azure") => void;
}
interface AppLoaderOptions {
    authServiceUrl: string;
    token?: string;
    authCookie?: string;
}
declare function useSDK(): SDKState;
declare function createAppLoader(app: VueApp, { authServiceUrl, token, authCookie }: AppLoaderOptions): void;
export { createAppLoader, useSDK };

import { reactive, inject, App as VueApp, toRefs } from "vue";
import SDK from "@zesty-io/app-sdk"; // Import your SDK
import Cookies from "js-cookie";

interface SDKState {
  token: string;
  isAuthenticated: boolean;
  messages: any[];
  isAuthenticating: boolean;
  logout: () => void;
  request: (rl: string, data?: any) => Promise<any>;
  initiateSSOAuthentication: (service: "google" | "github" | "azure") => void;
  ssoErrorMessage: string;
}

interface AppLoaderOptions {
  authServiceUrl: string;
  token?: string;
  authCookie?: string;
}

function useSDK(): SDKState {
  const sdk = inject<SDKState>("AppLoader");
  if (!sdk) {
    throw new Error("useSDK must be used within the AppLoader");
  }
  return sdk;
}

function createAppLoader(
  app: VueApp,
  { authServiceUrl, token, authCookie }: AppLoaderOptions
) {
  const state = reactive<SDKState>({
    token: token || Cookies.get(authCookie || "") || "",
    isAuthenticated: false,
    messages: [],
    isAuthenticating: false,
    logout: () => {},
    request: () => Promise.resolve({}),
    initiateSSOAuthentication: () => {},
    ssoErrorMessage: "",
  });

  function init() {
    state.isAuthenticating = true;

    SDK.setMessageReceivedCallback((newMessages: any[]) => {
      state.messages = newMessages;
    });

    // On SSO success get token from cookie and re-init SDK
    SDK.setSSOSuccessCallback(() => {
      state.ssoErrorMessage = "";
      state.token = Cookies.get(authCookie || "") || "";
      init();
    });

    // On SSO failure store error message
    SDK.setSSOErrorCallback((errorMessage: string) => {
      state.ssoErrorMessage = errorMessage;
    });

    SDK.init(authServiceUrl, state.token)
      .then((response: { token: string }) => {
        state.token = response.token;
        state.isAuthenticated = true;
        SDK.startTokenKeepAlive(5000);
      })
      .catch((error: Error) => {
        console.error("SDK Initialization Error:", error);
        state.token = "";
      })
      .finally(() => {
        state.isAuthenticating = false;
      });

    return () => {
      SDK.stopTokenKeepAlive();
    };
  }

  function logout() {
    SDK.logout().then(() => {
      state.token = "";
      state.isAuthenticated = false;
      SDK.stopTokenKeepAlive();
    });
  }

  init();

  app.provide("AppLoader", {
    ...toRefs(state),
    logout,
    request: SDK.request,
    initiateSSOAuthentication: SDK.initiateSSOAuthentication,
  });
}

export { createAppLoader, useSDK };

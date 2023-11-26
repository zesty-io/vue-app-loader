import { reactive, inject, toRefs } from "vue";
import SDK from "@zesty-io/app-sdk"; // Import your SDK
import Cookies from "js-cookie";
function useSDK() {
  const sdk = inject("AppLoader");
  if (!sdk) {
    throw new Error("useSDK must be used within the AppLoader");
  }
  return sdk;
}
function createAppLoader(app, {
  authServiceUrl,
  token,
  authCookie
}) {
  const state = reactive({
    token: token || Cookies.get(authCookie || "") || "",
    isAuthenticated: false,
    messages: [],
    isAuthenticating: false,
    logout: () => {},
    request: () => Promise.resolve({}),
    initiateSSOAuthentication: () => {}
  });
  function init() {
    state.isAuthenticating = true;
    SDK.setMessageReceivedCallback(newMessages => {
      state.messages = newMessages;
    });

    // On SSO success get token from cookie and re-init SDK
    SDK.setSSOSuccessCallback(() => {
      state.token = Cookies.get(authCookie || "") || "";
      init();
    });
    SDK.init(authServiceUrl, state.token).then(response => {
      state.token = response.token;
      state.isAuthenticated = true;
      SDK.startTokenKeepAlive(5000);
    }).catch(error => {
      console.error("SDK Initialization Error:", error);
      state.token = "";
    }).finally(() => {
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
    initiateSSOAuthentication: SDK.initiateSSOAuthentication
  });
}
export { createAppLoader, useSDK };
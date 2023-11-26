"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAppLoader = createAppLoader;
exports.useSDK = useSDK;
var _vue = require("vue");
var _appSdk = _interopRequireDefault(require("@zesty-io/app-sdk"));
var _jsCookie = _interopRequireDefault(require("js-cookie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // Import your SDK
function useSDK() {
  var sdk = (0, _vue.inject)("AppLoader");
  if (!sdk) {
    throw new Error("useSDK must be used within the AppLoader");
  }
  return sdk;
}
function createAppLoader(app, _ref) {
  var authServiceUrl = _ref.authServiceUrl,
    token = _ref.token,
    authCookie = _ref.authCookie;
  var state = (0, _vue.reactive)({
    token: token || _jsCookie["default"].get(authCookie || "") || "",
    isAuthenticated: false,
    messages: [],
    isAuthenticating: false,
    logout: function logout() {},
    request: function request() {
      return Promise.resolve({});
    },
    initiateSSOAuthentication: function initiateSSOAuthentication() {}
  });
  function init() {
    state.isAuthenticating = true;
    _appSdk["default"].setMessageReceivedCallback(function (newMessages) {
      state.messages = newMessages;
    });

    // On SSO success get token from cookie and re-init SDK
    _appSdk["default"].setSSOSuccessCallback(function () {
      state.token = _jsCookie["default"].get(authCookie || "") || "";
      init();
    });
    _appSdk["default"].init(authServiceUrl, state.token).then(function (response) {
      state.token = response.token;
      state.isAuthenticated = true;
      _appSdk["default"].startTokenKeepAlive(5000);
    })["catch"](function (error) {
      console.error("SDK Initialization Error:", error);
      state.token = "";
    })["finally"](function () {
      state.isAuthenticating = false;
    });
    return function () {
      _appSdk["default"].stopTokenKeepAlive();
    };
  }
  function logout() {
    _appSdk["default"].logout().then(function () {
      state.token = "";
      state.isAuthenticated = false;
      _appSdk["default"].stopTokenKeepAlive();
    });
  }
  init();
  app.provide("AppLoader", _objectSpread(_objectSpread({}, (0, _vue.toRefs)(state)), {}, {
    logout: logout,
    request: _appSdk["default"].request,
    initiateSSOAuthentication: _appSdk["default"].initiateSSOAuthentication
  }));
}
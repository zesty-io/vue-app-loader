## Overview
This Vue SDK plugin provides an easy integration with the Zesty.io App SDK. It includes features like SSO authentication, request handling, and state management for Vue.js applications.

## Features
- SSO Authentication: Supports Google, GitHub, and Azure for Single Sign-On.
- State Management: Reactive state management using Vue's composition API.
- Request Handling: Simplified API request mechanism.
- Token Management: Automatic handling of authentication tokens.

## Installation
1. Install the package:

```bash
npm install @zesty-io/vue-app-loader

```

2. Import the plugin in your Vue application.

## Usage
### Initializing the App Loader
```ts
import { createApp } from 'vue'

import {createAppLoader} from '@zesty-io/vue-app-loader';

const app = createApp(App);

app.use(createAppLoader, {
  authServiceUrl: 'YOUR_AUTH_SERVICE_URL',
  authCookie: 'YOUR_AUTH_COOKIE_NAME',
  token: 'OPTIONAL_INITIAL_TOKEN',
});

app.mount('#app')
```


### Using SDK in Components
```ts
<script setup lang="ts">
import { useSDK } from "@zesty-io/vue-app-loader"; 
const {isAuthenticated, isAuthenticating, token, logout, initiateSSOAuthentication} = useSDK();
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Token: {{ token }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <p>User is not authenticated</p>
    <button @click="initiateSSOAuthentication('google')">Log in with google</button>
  </div>
</template>
```


## API
### useSDK()
Provides access to SDK state and functions within a Vue component.

### createAppLoader(app, options)
Initializes the SDK within the Vue application context.

- __app__: Vue application instance.
- __options__: Configuration options for SDK initialization.

### Options
- __authServiceUrl__: URL to the authentication service.
- __token (optional)__: Initial token for authentication.
- __authCookie (optional)__: Name of the cookie to retrieve SSO token from.

### Methods
- __logout()__: Logs the user out of the application.
- __request(url, data)__: Makes an API request.
- __initiateSSOAuthentication(service)__: Initiates SSO authentication.

### States
- __token__: Current authentication token.
- __isAuthenticated__: Boolean indicating if the user is authenticated.
- __messages__: Array of messages received from the SDK via postMessage.
- __isAuthenticating__: Boolean indicating if the authentication is in progress.
- __ssoErrorMessage__: Error message related to SSO authentication.

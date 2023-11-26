Sample usage:

```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue';

import {createAppLoader} from '@zesty-io/vue-app-loader';

const app = createApp(App);

app.use(createAppLoader, {
  authServiceUrl: 'YOUR_AUTH_SERVICE_URL',
  authCookie: 'YOUR_AUTH_COOKIE_NAME',
});

app.mount('#app')
```

In component:

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
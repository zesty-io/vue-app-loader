<script setup lang="ts">
import { useSDK } from "./appLoaderPlugin"; // Make sure to adjust the import path
const {isAuthenticated, isAuthenticating, token, logout, initiateSSOAuthentication} = useSDK();
console.log("isAuthenticated", isAuthenticated, token, isAuthenticating);
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

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

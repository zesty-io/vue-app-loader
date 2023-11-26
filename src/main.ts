import { createApp } from 'vue'
import './style.css'
import App from './App.vue';

import {createAppLoader} from './appLoaderPlugin'; // Adjust the import path as needed

const app = createApp(App);

app.use(createAppLoader, {
  authServiceUrl: 'https://auth.api.dev.zesty.io',
  authCookie: 'DEV_APP_SID'
});

app.mount('#app')

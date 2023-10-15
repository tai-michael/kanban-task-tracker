import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { auth } from './firebaseInit';

let app: ReturnType<typeof createApp>;

// NOTE necessary for clearing the state after user logs out
auth.onAuthStateChanged(user => {
  console.log('User', user);
  if (!app) {
    app = createApp(App);

    app.use(createPinia()).use(router);

    app.mount('#app');
  }
});

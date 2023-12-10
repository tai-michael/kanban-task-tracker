import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebaseInit'

import App from './App.vue'
import router from './router'

import './assets/main.css'

let app: ReturnType<typeof createApp>

// NOTE necessary for clearing the state after user logs out
auth.onAuthStateChanged((user) => {
  console.log('User', user)

  if (!app) {
    app = createApp(App)
    app.use(createPinia()).use(router)
    app.directive('focus', {
      mounted: (el) => el.focus(),
    })
    app.mount('#app')
  }

  if (!user && router.currentRoute.value.path !== '/sign-in') {
    router.push('/sign-in')
  }
})

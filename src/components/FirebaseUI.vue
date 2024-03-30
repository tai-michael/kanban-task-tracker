<template>
  <div
    id="firebaseui-auth-container"
    class="flex justify-center items-center h-[127px]"
  ></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { auth } from '@/firebaseInit'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

onMounted(() => {
  // console.log('Sign in view mounted')
  const uiConfig = {
    // Redirect route; necessary if 'signInSuccessWithAuthResult' set to true
    signInSuccessUrl: import.meta.env.VITE_SIGN_IN_SUCCESS_URL,
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    // Setting this to false makes it so that page won't refresh after sign in
    callbacks: {
      signInSuccessWithAuthResult: () => true,
      // uiShown: function () {
      //   // The widget is rendered.
      //   // Hide the loader.
      //   // console.log('uiShown') // set breakpoint to inspect loading bar
      //   // document.getElementById('loader').style.display = 'none'
      // },
    },
  }

  const ui =
    firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
  ui.start('#firebaseui-auth-container', uiConfig)

  // ui.disableAutoSignIn()
})
</script>
<style lang="scss">
.firebaseui-container {
  width: 280px;
}

// NOTE see https://github.com/firebase/firebaseui-web/issues/121
.mdl-card .firebaseui-callback-indicator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 200px;
}

.mdl-card.firebaseui-container {
  min-height: 2px;
  background-color: transparent;
}

.mdl-shadow--2dp {
  box-shadow: none;
}

.firebaseui-info-bar {
  margin-top: 20px;
}

// div.mdl-progress::after {
//   display: block;
//   color: #a748ff;
//   margin: 50px auto;
//   content: 'Authenticating...';
//   text-align: center;
// }

.firebaseui-callback-indicator-container .firebaseui-busy-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main-purple);
  margin: 0 50px;
  width: 180px;
}

.mdl-progress.firebaseui-busy-indicator {
  height: 3px;
}

.mdl-progress > .progressbar {
  background-color: var(--main-purple) !important;
}

.mdl-progress > .bufferbar {
  background-image: linear-gradient(
      90deg,
      hsla(0, 0%, 100%, 0.7),
      hsla(0, 0%, 100%, 0.7)
    ),
    linear-gradient(90deg, var(--main-purple), var(--main-purple)) !important;
  z-index: 0;
  left: 0;
}

.mdl-progress:not(.mdl-progress--indeterminate) > .auxbar,
.mdl-progress:not(.mdl-progress__indeterminate) > .auxbar {
  background-image: linear-gradient(
      90deg,
      hsla(0, 0%, 100%, 0.9),
      hsla(0, 0%, 100%, 0.9)
    ),
    linear-gradient(90deg, var(--main-purple), var(--main-purple)) !important;
}

.mdl-button--primary.mdl-button--primary {
  color: var(--main-purple);
}

.mdl-button--raised.mdl-button--colored,
.firebaseui-textfield.mdl-textfield .firebaseui-label::after {
  background-color: var(--main-purple);
}
</style>

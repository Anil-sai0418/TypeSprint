/* eslint-env serviceworker */
/* global importScripts, firebase */

// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyD1hy7NZk4N5_HRm8krQYqzEqLHCajr55U",
  authDomain: "typevex-app.firebaseapp.com",
  projectId: "typevex-app",
  storageBucket: "typevex-app.firebasestorage.app",
  messagingSenderId: "341416469724",
  appId: "1:341416469724:web:c1b397084099fac7320019"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/Type-logo.png' // Use your app logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1hy7NZk4N5_HRm8krQYqzEqLHCajr55U",
  authDomain: "typevex-app.firebaseapp.com",
  projectId: "typevex-app",
  storageBucket: "typevex-app.firebasestorage.app",
  messagingSenderId: "341416469724",
  appId: "1:341416469724:web:c1b397084099fac7320019"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "BBMeh1fk3Y2BAHl6EqYAk-Uv8e4y990-GIBj-mv_VcZexUfa7f17R4EQ7mCnWB2TFUpR5CKFr9hUlnpcf4egp54" })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Got FCM device token:', currentToken);
        // You would normally send this token to your server here
        return currentToken;
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      return null;
    });
};

// Setup listener for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
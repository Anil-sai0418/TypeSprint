import React, { useEffect } from 'react';
import { requestForToken, onMessageListener } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import { registerDeviceToken } from '../../services/api';

const PushNotificationSetup = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Also check localStorage directly in case user object doesn't have token property directly
    const storedToken = localStorage.getItem("token");
    
    if (isAuthenticated || storedToken) {
      // Request permission and get token
      requestForToken().then(async (token) => {
        if (token) {
           console.log("Token generated:", token);
           // Send the token to the backend
           try {
             await registerDeviceToken(token, storedToken);
             console.log("Token registered successfully");
           } catch (error) {
             console.error("Error registering token:", error);
           }
        }
      });
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    // Listen for foreground notifications
    onMessageListener().then((payload) => {
      console.log('Received foreground message:', payload);
      
      // Check if the browser supports notifications and permission is granted
      if ("Notification" in window && Notification.permission === "granted") {
        const notificationTitle = payload?.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload?.notification?.body,
          icon: '/Type-logo.png' // Adjust if your logo path is different
        };
        
        // Show native browser notification even when app is in foreground
        new Notification(notificationTitle, notificationOptions);
      }
    }).catch((err) => console.log('failed: ', err));
  }, []);

  return null; // This component doesn't render anything
};

export default PushNotificationSetup;
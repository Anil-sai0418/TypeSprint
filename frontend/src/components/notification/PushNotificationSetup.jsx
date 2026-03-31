import React, { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from '../../firebase';
import { useAuth } from '../../context/useAuth';
import { registerDeviceToken } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Award, Trophy, Info } from 'lucide-react';

const PushNotificationSetup = () => {
  const { user, isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
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

  const addToast = (payload) => {
    const id = Date.now();
    const notificationTitle = payload?.notification?.title || 'New Notification';
    const notificationBody = payload?.notification?.body || '';
    
    // Choose icon based on title keywords
    let Icon = Info;
    let iconColor = 'text-blue-500';
    let bgColor = 'bg-blue-500/10';
    
    if (notificationTitle.toLowerCase().includes('badge') || notificationTitle.toLowerCase().includes('achievement')) {
      Icon = Award;
      iconColor = 'text-amber-500';
      bgColor = 'bg-amber-500/10';
    } else if (notificationTitle.toLowerCase().includes('leaderboard') || notificationTitle.toLowerCase().includes('rank')) {
      Icon = Trophy;
      iconColor = 'text-violet-500';
      bgColor = 'bg-violet-500/10';
    }

    setToasts((prev) => [...prev, { id, title: notificationTitle, body: notificationBody, Icon, iconColor, bgColor }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // Listen for foreground notifications
    onMessageListener().then((payload) => {
      console.log('Received foreground message:', payload);
      
      // Show beautiful styled in-app toast
      addToast(payload);

      // Check if document is hidden, and if so, show native browser notification too
      if (document.hidden && "Notification" in window && Notification.permission === "granted") {
        const notificationTitle = payload?.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload?.notification?.body,
          icon: '/Type-logo.png' 
        };
        new Notification(notificationTitle, notificationOptions);
      }
    }).catch((err) => console.log('failed mapping notification listener: ', err));
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex w-96 max-w-[calc(100vw-2rem)] items-start gap-4 rounded-2xl bg-popover/80 backdrop-blur-xl p-4 text-popover-foreground shadow-2xl border border-border ring-1 ring-black/5 dark:ring-white/10"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toast.bgColor} ${toast.iconColor}`}>
              <toast.Icon size={20} strokeWidth={2.5} />
            </div>
            
            <div className="flex-1 pt-1">
              <h3 className="font-semibold text-sm leading-none tracking-tight">{toast.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-snug">{toast.body}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="mt-0.5 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PushNotificationSetup;
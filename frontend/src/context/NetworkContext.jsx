import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NetworkContext } from './NetworkContextConfig';

function NetworkProvider({ children }) {
  const [networkStatus, setNetworkStatus] = useState('online');
  const [isConnected, setIsConnected] = useState(navigator.onLine);
  const [slowNetworkDetected, setSlowNetworkDetected] = useState(false);
  const [showReconnecting, setShowReconnecting] = useState(false);
  const pendingRequestsRef = useRef([]);
  const reconnectTimeoutRef = useRef(null);
  const slowNetworkTimeoutRef = useRef(null);

  /**
   * Retry pending requests
   */
  const retryPendingRequests = useCallback(() => {
    const requests = [...pendingRequestsRef.current];
    pendingRequestsRef.current = [];

    requests.forEach(({ retry }) => {
      if (typeof retry === 'function') {
        retry();
      }
    });
  }, []);

  /**
   * Handle online event
   */
  const handleOnline = useCallback(() => {
    setIsConnected(true);
    setNetworkStatus('reconnecting');
    setShowReconnecting(true);

    // Clear slow network flag
    setSlowNetworkDetected(false);
    if (slowNetworkTimeoutRef.current) {
      clearTimeout(slowNetworkTimeoutRef.current);
    }

    // Update status after brief delay to show "reconnecting" state
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      setNetworkStatus('online');
      setShowReconnecting(false);
      
      // Retry pending requests
      retryPendingRequests();
    }, 800);
  }, [retryPendingRequests]);

  /**
   * Handle offline event
   */
  const handleOffline = useCallback(() => {
    setIsConnected(false);
    setNetworkStatus('offline');
    setSlowNetworkDetected(false);
    
    if (slowNetworkTimeoutRef.current) {
      clearTimeout(slowNetworkTimeoutRef.current);
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  /**
   * Detect slow network using resource timing
   */
  const detectSlowNetwork = useCallback(() => {
    if (!isConnected || networkStatus === 'offline') return;

    // If slow network not already detected, set timeout to detect
    if (!slowNetworkDetected && networkStatus !== 'slow') {
      slowNetworkTimeoutRef.current = setTimeout(() => {
        setNetworkStatus('slow');
        setSlowNetworkDetected(true);
      }, 3000); // 3 seconds without response = slow network
    }
  }, [isConnected, networkStatus, slowNetworkDetected]);

  /**
   * Clear slow network detection timeout
   */
  const clearSlowNetworkDetection = useCallback(() => {
    if (slowNetworkTimeoutRef.current) {
      clearTimeout(slowNetworkTimeoutRef.current);
      slowNetworkTimeoutRef.current = null;
    }

    if (slowNetworkDetected) {
      setSlowNetworkDetected(false);
      if (networkStatus !== 'offline' && networkStatus !== 'reconnecting') {
        setNetworkStatus('online');
      }
    }
  }, [slowNetworkDetected, networkStatus]);

  /**
   * Register a pending request for retry
   */
  const addPendingRequest = useCallback((retryFn) => {
    pendingRequestsRef.current.push({ retry: retryFn });
  }, []);

  /**
   * Clear pending requests
   */
  const clearPendingRequests = useCallback(() => {
    pendingRequestsRef.current = [];
  }, []);

  /**
   * Set up event listeners
   */
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (slowNetworkTimeoutRef.current) {
        clearTimeout(slowNetworkTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    networkStatus,
    isConnected,
    slowNetworkDetected,
    showReconnecting,
    detectSlowNetwork,
    clearSlowNetworkDetection,
    addPendingRequest,
    clearPendingRequests,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkProvider;

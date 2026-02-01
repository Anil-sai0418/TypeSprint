import { useContext } from 'react';
import { NetworkContext } from './NetworkContextConfig';

/**
 * Hook to use Network Status
 */
export const useNetworkStatus = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within NetworkProvider');
  }
  return context;
};

export default useNetworkStatus;

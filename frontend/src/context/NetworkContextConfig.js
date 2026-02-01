import { createContext } from 'react';

/**
 * Network Status Context
 * 
 * States:
 * - 'online': Normal connectivity
 * - 'offline': No internet connection
 * - 'slow': Slow or unstable network
 * - 'reconnecting': Attempting to reconnect
 */
export const NetworkContext = createContext();

export default NetworkContext;

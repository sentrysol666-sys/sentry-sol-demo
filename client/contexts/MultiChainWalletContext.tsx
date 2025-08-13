import React, { createContext, useContext, ReactNode } from 'react';
import { SolanaWalletContext } from './SolanaWalletContext';
import { MetaMaskWalletProvider } from './EthereumWalletContext';

interface MultiChainWalletContextProps {
  children: ReactNode;
}

const MultiChainWalletContext = createContext<{}>({});

export const MultiChainWalletProvider: React.FC<MultiChainWalletContextProps> = ({ children }) => {
  return (
    <MultiChainWalletContext.Provider value={{}}>
      <MetaMaskWalletProvider>
        <SolanaWalletContext>
          {children}
        </SolanaWalletContext>
      </MetaMaskWalletProvider>
    </MultiChainWalletContext.Provider>
  );
};

export const useMultiChainWallet = () => {
  const context = useContext(MultiChainWalletContext);
  if (!context) {
    throw new Error('useMultiChainWallet must be used within a MultiChainWalletProvider');
  }
  return context;
};

export default MultiChainWalletProvider;

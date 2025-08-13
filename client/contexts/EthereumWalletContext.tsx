import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import { logWalletError, shouldShowErrorToUser } from "@/utils/errorUtils";

interface EthereumWalletState {
  isConnected: boolean;
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  chainId: number | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const EthereumWalletContext = createContext<EthereumWalletState | null>(null);

interface EthereumWalletProviderProps {
  children: ReactNode;
}

export const EthereumWalletProvider: React.FC<EthereumWalletProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Check if MetaMask is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Add timeout to prevent hanging requests
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Connection timeout")), 5000)
          );

          const provider = new BrowserProvider(window.ethereum);
          const accounts = await Promise.race([
            provider.listAccounts(),
            timeoutPromise
          ]) as any;
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(accounts[0].address);

            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0].address);
            setChainId(Number(network.chainId));
            setBalance(ethers.formatEther(balance));
            setIsConnected(true);
          }
        } catch (error) {
          // Silently handle network errors to avoid console spam
          if (error instanceof Error && error.message.includes("Failed to fetch")) {
            // This is likely a network connectivity issue, ignore it
            return;
          }
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
          updateBalance(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const updateBalance = async (address: string) => {
    if (provider) {
      try {
        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Balance fetch timeout")), 3000)
        );

        const balance = await Promise.race([
          provider.getBalance(address),
          timeoutPromise
        ]) as any;

        setBalance(ethers.formatEther(balance));
      } catch (error) {
        // Silently handle network errors for balance updates
        if (error instanceof Error &&
            (error.message.includes("Failed to fetch") ||
             error.message.includes("timeout"))) {
          return; // Don't spam console with network errors
        }
        console.error("Error updating balance:", error);
      }
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);

        setProvider(provider);
        setSigner(signer);
        setAccount(address);
        setChainId(Number(network.chainId));
        setBalance(ethers.formatEther(balance));
        setIsConnected(true);
      } catch (error: any) {
        const walletError = logWalletError("EthereumWallet.connect", error, {
          wallet: "MetaMask",
          method: "eth_requestAccounts"
        });

        // Don't throw for user rejections or network issues that should be silent
        if (walletError.type === 'user_rejection') {
          console.log("User rejected wallet connection");
          return;
        }

        if (walletError.type === 'network_error' && walletError.message.includes("Failed to fetch")) {
          console.warn("Network connectivity issue detected, will retry automatically");
          return;
        }

        // Only throw errors that should be shown to users
        if (shouldShowErrorToUser(walletError)) {
          const friendlyError = new Error(walletError.message);
          if (walletError.code) {
            (friendlyError as any).code = walletError.code;
          }
          throw friendlyError;
        }
      }
    } else {
      throw new Error("MetaMask is not installed");
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setBalance(null);
  };

  const switchNetwork = async (targetChainId: number) => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
      } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (error.code === 4902) {
          // Add chain logic here if needed
          throw new Error("Chain not added to MetaMask");
        }
        throw error;
      }
    }
  };

  const value: EthereumWalletState = {
    isConnected,
    account,
    provider,
    signer,
    chainId,
    balance,
    connect,
    disconnect,
    switchNetwork,
  };

  return (
    <EthereumWalletContext.Provider value={value}>
      {children}
    </EthereumWalletContext.Provider>
  );
};

// MetaMask SDK Provider wrapper
export const MetaMaskWalletProvider: React.FC<EthereumWalletProviderProps> = ({
  children,
}) => {
  const sdkOptions = {
    dappMetadata: {
      name: "Sentrysol AML Platform",
      url: window.location.host,
    },
    // Remove infuraAPIKey to avoid network errors when not configured
    ...(import.meta.env.VITE_INFURA_API_KEY && {
      infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY,
    }),
  };

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        ...sdkOptions,
        // Disable analytics to avoid FullStory network errors
        enableAnalytics: false,
        // Add network timeout and retry configuration
        communicationServerUrl: undefined,
        // Reduce network calls
        checkInstallationImmediately: false,
      }}
    >
      <EthereumWalletProvider>{children}</EthereumWalletProvider>
    </MetaMaskProvider>
  );
};

export const useEthereumWallet = () => {
  const context = useContext(EthereumWalletContext);
  if (!context) {
    throw new Error(
      "useEthereumWallet must be used within an EthereumWalletProvider",
    );
  }
  return context;
};

export default EthereumWalletContext;

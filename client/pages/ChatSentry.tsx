import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWalletIntegration } from "@/hooks/useWalletIntegration";
import {
  ArrowBack,
  Send,
  Mic,
  Edit,
  ContentCopy,
  MoreHoriz,
} from "@mui/icons-material";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatSentry() {
  const navigate = useNavigate();
  const { connectedWallets, activeWallet } = useWalletIntegration();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "user",
      content: "Is there Any Suspicious Tx on my wallet, and How to secure from dusting attack?",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "assistant",
      content: `Subject: Suspicious Transaction Analysis & Dusting Attack Mitigation
Status: Active Monitoring

PHASE 1: Suspicious Transaction Identification
Initial Indicators of Dusting or Targeted Reconnaissance:
• Unsolicited Token Transfers: Tokens or NFTs appear in your wallet that were never purchased, claimed, or approved.
• Zero-Value Transactions: Micro-transactions (e.g., 0.00001 SOL/ETH) from unknown addresses designed to bypass user scrutiny.
• Metadata Traps: Some tokens include clickable URLs or misleading metadata intended to lure users into phishing attempts.
• Unverified Program Interactions: Wallet activity shows interaction with contracts or dApps without user initiation.

Objective: Identify if your wallet was probed or marked for follow-up attacks (social engineering, phishing, behavioral mapping).

PHASE 2: Defensive Security Measures
If any dusting activity is confirmed or suspected, immediately implement the following countermeasures:

1. Segregate Wallets
Use separate wallets for testing, minting, trading, and long-term asset holding.
Isolate critical funds from daily-use wallets.

2. Revoke Suspicious Authorizations
Use tools like Revoke.cash (EVM) or the trusted dApp manager in Phantom/Backpack (Solana) to remove unknown permissions.

3. Avoid Interaction
Do not send, trade, or open links related to suspicious tokens.
Interaction confirms activity and may trigger automated or manual attacks.

4. Hide or Blacklist Tokens
Use your wallet's interface to hide or mark suspicious assets to prevent accidental interaction.

5. Review Connected dApps
Disconnect from all unnecessary dApps. Limit exposure to only essential, verified applications.

6. Hardware Wallet Enforcement
Store long-term assets in a hardware wallet (Ledger, Trezor) with transaction confirmation verification.

7. Disable Autoconnect Features
Prevent dApps from automatically connecting to your wallet upon page load.

PHASE 3: Forensic Analysis Offer
If you'd like a full threat analysis, please submit your wallet address. A complete report will be compiled, covering:
• Transaction history review
• Token metadata inspection
• Rogue program identification
• Behavioral fingerprinting patterns
• Dust propagation origin trace

PHASE 4: Operational Advisory
Dusting is not an asset theft method—it's a signal intelligence technique. The primary threat surface is user behavior. All attack vectors begin with a signature—never authorize transactions unless verified.`,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm analyzing your request and will provide a detailed security assessment shortly. Please wait while I examine your wallet activity and potential threat indicators...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className="mb-1">
        {line.includes('Subject:') || line.includes('Status:') || line.includes('PHASE') ? (
          <div className="font-semibold text-white">{line}</div>
        ) : line.startsWith('•') ? (
          <div className="ml-4 text-white/90">{line}</div>
        ) : line.match(/^\d+\./) ? (
          <div className="font-medium text-white mt-2">{line}</div>
        ) : (
          <div className="text-white/90">{line}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-sentry-teal/50 to-black flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute -top-48 -left-96 w-full h-full" viewBox="0 0 440 784" fill="none">
          <defs>
            <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="75" />
            </filter>
          </defs>
          <g filter="url(#blur1)">
            <path 
              d="M271 -132.011C244.2 -104.944 186.5 -67.9691 161 -52.8649C271 35.3434 471 1.51009 540 -38.9691C609 -79.4482 519.5 -176.719 457 -193.636C394.5 -210.552 304.5 -165.844 271 -132.011Z" 
              fill="url(#gradient1)" 
            />
          </g>
          <defs>
            <linearGradient id="gradient1" x1="362.971" y1="2.62402" x2="362.971" y2="-197.333">
              <stop stopColor="#000" />
              <stop offset="0.5" stopColor="#395B64" />
              <stop offset="0.75" stopColor="#395B64" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-4 text-white relative z-10">
        <div className="text-base font-medium">9:41</div>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-1 h-3 bg-white rounded-full ${i < 3 ? 'opacity-100' : 'opacity-50'}`} />
            ))}
          </div>
          <div className="ml-2 w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-2 bg-white rounded-xs m-0.5" />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 p-0"
        >
          <ArrowBack className="w-6 h-6 text-white" />
        </Button>
        
        <div className="bg-white/10 backdrop-blur-lg border border-sentry-ice/30 rounded-full px-3 py-1">
          <span className="text-white text-sm font-medium">Sentry 1.0</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 p-0"
        >
          <MoreHoriz className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto relative z-10">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`mb-6 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "assistant" && (
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sentry-mint to-sentry-ice flex items-center justify-center flex-shrink-0 mt-1 border border-white/20">
                    <div className="w-4 h-4 bg-white/20 rounded-full" />
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl rounded-tl-sm p-4">
                    <div className="text-white font-poppins text-sm leading-relaxed">
                      {formatMessageContent(message.content)}
                    </div>
                  </div>
                </div>
              )}
              
              {message.type === "user" && (
                <div className="flex items-end space-x-2 max-w-[85%]">
                  <div className="bg-white backdrop-blur-lg rounded-2xl rounded-tr-sm p-4">
                    <div className="text-black font-poppins text-sm font-medium leading-relaxed">
                      {message.content}
                    </div>
                    <div className="flex items-center space-x-6 mt-3 opacity-50">
                      <button className="flex items-center space-x-1 text-xs text-black">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-black">
                        <ContentCopy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 border border-white/20">
                    <div className="w-4 h-4 bg-white/20 rounded-full" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-6"
          >
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sentry-mint to-sentry-ice flex items-center justify-center flex-shrink-0 mt-1 border border-white/20">
                <div className="w-4 h-4 bg-white/20 rounded-full" />
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl rounded-tl-sm p-4">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="flex-1 flex items-center bg-white/5 backdrop-blur-lg border border-white/20 rounded-full px-4 py-3">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write anything here ..."
              className="flex-1 bg-transparent border-0 text-white placeholder:text-white/30 text-sm focus:ring-0 focus:outline-none font-inter"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              variant="ghost"
              size="sm"
              className="p-0 hover:bg-transparent"
            >
              <Send className="w-6 h-6 text-white/40" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-lg border border-white/20 hover:bg-white/10 p-0"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
          </Button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2 relative z-10">
        <div className="w-36 h-1 bg-white rounded-full" />
      </div>
    </div>
  );
}

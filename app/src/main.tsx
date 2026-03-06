import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivyProvider } from '@privy-io/react-auth'
import { Buffer } from 'buffer'
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

globalThis.Buffer = Buffer;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets"
          },
        },
        //supportedChains: ["solana:devnet"],
        appearance: { walletChainType: "solana-only", theme: 'dark'},
        solana: {
          rpcs: {
            "solana:devnet": {
              rpc: createSolanaRpc("https://api.devnet.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions(
                "wss://api.devnet.solana.com",
              ),
            },
          },
        },
      }}
      > 
          <App />
    </PrivyProvider>
  </StrictMode>
)

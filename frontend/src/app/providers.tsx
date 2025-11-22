'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, localhost } from 'wagmi/chains';
import { injected, walletConnect } from '@wagmi/connectors';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, localhost],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}


import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";

import '@rainbow-me/rainbowkit/styles.css';
import './polyfills';
import {
  rainbowWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { getDefaultConfig, RainbowKitProvider, darkTheme, Theme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import merge from 'lodash.merge';

import {supportedChains} from "./mud/supportedChains";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let chainIndex = supportedChains.findIndex((c) => c.id === 690);
const redstone = supportedChains[chainIndex];
chainIndex = supportedChains.findIndex((c) => c.id ===31338);
const local = supportedChains[chainIndex];

const config = getDefaultConfig({
  appName: 'PixeLAW',
  projectId: 'YOUR_PROJECT_ID',
  wallets: [{
    groupName: 'Recommended',
    wallets: [ metaMaskWallet],
  }],
  chains: [
    local,
  ],
  ssr: true,
});

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);


const myTheme = merge(darkTheme(), {
  colors: {
    accentColor: '#07296d',
  },
} as Theme);
const queryClient = new QueryClient();

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
// 初始化 manifest

setup().then(async (result) => {
  root.render(
    // <MUDProvider value={result}>
    //   <App />
    // </MUDProvider>
      <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myTheme}>
          <MUDProvider value={result}>
          <App />
        </MUDProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );

  // https://vitejs.dev/guide/env-and-mode.html
  
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.systemContract.address,
      worldAbi: result.network.systemContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});

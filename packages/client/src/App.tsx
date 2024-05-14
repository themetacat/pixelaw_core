import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import Header from "./components/herder";
import toast, { Toaster } from "react-hot-toast";
import { SyncStep } from "@latticexyz/store-sync";
import style from "./app.module.css";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
// import '../styles/globals.css';
// import '@rainbow-me/rainbowkit/styles.css';
// import merge from 'lodash.merge';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { WagmiProvider } from 'wagmi';
// import { SessionProvider } from 'next-auth/react';
// import type { Session } from 'next-auth';

// import { getDefaultConfig, RainbowKitProvider, darkTheme, Theme, Chain } from '@rainbow-me/rainbowkit';
// import {supportedChains} from "./mud/supportedChains";
// import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
// import { AppProps } from 'next/app';

// let chainIndex = supportedChains.findIndex((c) => c.id === 690);
// const redstone = supportedChains[chainIndex];
// chainIndex = supportedChains.findIndex((c) => c.id === 17069);
// const garnet = supportedChains[chainIndex];
// const config = getDefaultConfig({
//   appName: 'PixeLAW',
//   projectId: 'YOUR_PROJECT_ID',
//   chains: [
//     redstone,
//     garnet
//   ],
//   ssr: true,
// });

// const client = new QueryClient();

// const myTheme = merge(darkTheme(), {
//   colors: {
//     accentColor: '#07296d',
//   },
// } as Theme);

export const App = () => {
  const {
    components: {
      SyncProgress,
    },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity) as any;
  const [hoveredData, setHoveredData] = useState<{
    x: any;
    y: any;
  } | null>(null);

  const handleMouseDown = (event: any) => {
    setHoveredData(event);
  };

  return (
    // <WagmiProvider config={config}>
    //   <SessionProvider refetchInterval={0} session={pageProps.session}>
    // <QueryClientProvider client={client}>
    // <RainbowKitSiweNextAuthProvider>
    //   <RainbowKitProvider theme={myTheme}>
      <div className={style.page}>
      {/* {syncProgress ? (
        syncProgress.step !== SyncStep.LIVE ? (
          <div style={{ color: "#fff" }} className={style.GameBoard}>
            {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
          </div>
        ) : ( */}
          <Header hoveredData={hoveredData} handleData={handleMouseDown} />
        {/* ) */}
      {/* ) : (
        <div style={{ color: "#000" }}>Hydrating from RPC(0)</div>
      )} */}
      <Toaster
        toastOptions={{
          duration: 2000,
          style: {
            background: "linear-gradient(90deg, #dedfff,#8083cb)",
            color: "black",
            borderRadius: "8px",
            zIndex: "9999999999999",
            marginTop:"50px"
          },
        }}
      />
     
    </div>
  //     </RainbowKitProvider>
  //     </RainbowKitSiweNextAuthProvider>
  //   </QueryClientProvider>
  //   </SessionProvider>
  // </WagmiProvider>
    
  );
};

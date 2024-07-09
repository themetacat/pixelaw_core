/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - latticeTestnet, our public test network.
 *

 */

import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";
import {defineChain} from "viem/utils"
const holesky = defineChain({
    id: 17_001,
    name: 'REDSTONE HOLESKY',
    network: 'redstone-holesky',
    nativeCurrency: {
      name: 'redstone holesky Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.holesky.redstone.xyz'],
        webSocket: ['wss://rpc.holesky.redstone.xyz/ws']
      },
      public: {
        http: ['https://rpc.holesky.redstone.xyz'],
        webSocket: ['wss://rpc.holesky.redstone.xyz/ws']
      },
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://explorer.holesky.redstone.xyz',
      },
    },
    testnet: true,
})

const core_foundry = defineChain({
  id: 31_338,
  name: 'Core Anvil',
  network: 'core anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://api.metacat.world/rpc'],
      webSocket: ['ws://api.metacat.world/rpc'],
    },
    public: {
      http: ['http://api.metacat.world/rpc'],
      webSocket: ['ws://api.metacat.world/rpc'],
    },
  },
})

const garnet = defineChain({
  id: 17069,
  name: 'Garnet',
  network: 'garnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.garnet.qry.live'],
      webSocket: ['wss://rpc.garnet.qry.live'],
    },
    public: {
      http: ['https://rpc.garnet.qry.live'],
      webSocket: ['wss://rpc.garnet.qry.live'],
    },
  },
})

const redstone = defineChain({
  id: 690,
  name: 'Redstone',
  network: 'redstone',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.redstonechain.com'],
      webSocket: ['wss://rpc.redstonechain.com'],
    },
    public: {
      http: ['https://rpc.redstonechain.com'],
      webSocket: ['wss://rpc.redstonechain.com'],
    },
  },
})

/*
 * See https://mud.dev/tutorials/minimal/deploy#run-the-user-interface
 * for instructions on how to add networks.
 */
export const supportedChains: MUDChain[] = [mudFoundry, latticeTestnet, holesky, core_foundry, garnet, redstone];

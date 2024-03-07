/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import { createPublicClient, fallback, webSocket, http, createWalletClient, Hex, parseEther, ClientConfig } from "viem";
import { createFaucetService } from "@latticexyz/services/faucet";
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs";

import { getNetworkConfig } from "./getNetworkConfig";
import { world } from "./world";
// import IWorldAbi from "../../../../packages/call_system/out/IWorld.sol/IWorld.abi.json";
// import IWorldAbi from "../../../../packages/call_system/out/world/IWorld.sol/IWorld.abi.json";
// import SnakeSystemAbi from "../../../../packages/snake/out/SnakeSystem.sol/SnakeSystem.abi.json";
// import SnakeSystemAbi from "contracts/out/SnakeSystem.sol/SnakeSystem.abi.json";
import { createBurnerAccount, getContract, transportObserver, ContractWrite } from "@latticexyz/common";

import { Subject, share } from "rxjs";

/*
 * Import our MUD config, which includes strong types for
 * our tables and other config options. We use this to generate
 * things like RECS components and get back strong types for them.
 *
 * See https://mud.dev/templates/typescript/contracts#mudconfigts
 * for the source of this information.
 */
import mudConfig from "../../../contracts/mud.config";



//console.log(mudConfig,555)

export type SetupNetworkResult = {
  world: any;
  components: any;
  playerEntity: any;
  publicClient: any;
  walletClient: any;
  latestBlock$: any;
  storedBlockLogs$: any;
  waitForTransaction: any;
  worldContract: any;
  systemContract: any;
  write$: any;
};

export async function setupNetwork(): Promise<SetupNetworkResult> {
  return new Promise<SetupNetworkResult>((resolve, reject) => {
    const networkConfigPromise = getNetworkConfig();
    networkConfigPromise.then(networkConfig => {
      // const baseUrl = "https://pixelaw-game.vercel.app";
      const passedValue = localStorage.getItem("manifest") as any;
      // 使用模板字符串拼接字符串
      const fullPath = `https://pixelaw-game.vercel.app/${passedValue?.replace("BASE/", "")}`;

      /*
       * Create a viem public (read only) client
       * (https://viem.sh/docs/clients/public.html)
       */
      const clientOptions = {
        chain: networkConfig.chain,
        transport: transportObserver(fallback([webSocket(), http()])),
        pollingInterval: 1000,
      } as const satisfies ClientConfig;

      const publicClient = createPublicClient(clientOptions);

      /*
       * Create a temporary wallet and a viem client for it
       * (see https://viem.sh/docs/clients/wallet.html).
       */
      const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex);
      const burnerWalletClient = createWalletClient({
        ...clientOptions,
        account: burnerAccount,
      });

      /*
       * Create an observable for contract writes that we can
       * pass into MUD dev tools for transaction observability.
       */
      const write$ = new Subject<ContractWrite>();
console.log(networkConfig.worldAddress,'-------------------')
      /*
      * Create an object for communicating with the deployed World.
      */
     
      const worldContract = getContract({
        address: networkConfig.worldAddress as Hex, 
        // abi: IWorldAbi,
        abi: [],
        publicClient,
        walletClient: burnerWalletClient,
        onWrite: (write) => write$.next(write),
      });

      /*
       * Create an object for communicating with the deployed World.
       */
      const worldAbiUrl = "https://pixelaw-game.vercel.app/Snake.abi.json";
      fetch(worldAbiUrl)
        .then(response => response.json())
        .then(abi => {

          // 将获取到的ABI作为contract参数传递
          const systemContract = getContract({
            address: networkConfig.worldAddress as Hex,
            abi:abi,
            publicClient,
            walletClient: burnerWalletClient,
            onWrite: (write) => write$.next(write),
          });

          /*
           * Sync on-chain state into RECS and keeps our client in sync.
           * Uses the MUD indexer if available, otherwise falls back
           * to the viem publicClient to make RPC calls to fetch MUD
           * events from the chain.
           */
                   //console.log(networkConfig.worldAddress,'address')
                   //console.log(mudConfig,'config')
                   //console.log(world,'world')
            //console.log(publicClient,'publicClient')

          syncToRecs({
            world,
            config: mudConfig,
            address: networkConfig.worldAddress as Hex,
            publicClient,
            startBlock: BigInt(networkConfig.initialBlockNumber),
          }).then(({ components, latestBlock$, storedBlockLogs$, waitForTransaction }) => {
            //console.log(components,'components')
   
            /*
             * If there is a faucet, request (test) ETH if you have
             * less than 1 ETH. Repeat every 20 seconds to ensure you don't
             * run out.
             */
            if (networkConfig.faucetServiceUrl) {
              const address = burnerAccount.address;
              console.info("[Dev Faucet]: Player address -> ", address);

              const faucet = createFaucetService(networkConfig.faucetServiceUrl);

              const requestDrip = async () => {
                const balance = await publicClient.getBalance({ address });
                console.info(`[Dev Faucet]: Player balance -> ${balance}`);
                const lowBalance = balance < parseEther("1");
                if (lowBalance) {
                  console.info("[Dev Faucet]: Balance is low, dripping funds to player");
                  // Double drip
                  await faucet.dripDev({ address });
                  await faucet.dripDev({ address });
                }
              };

              requestDrip();
              // Request a drip every 20 seconds
              setInterval(requestDrip, 20000);
            }

            resolve({
              world,
              components,
              playerEntity: encodeEntity({ address: "address" }, { address: burnerWalletClient.account.address }),
              publicClient,
              walletClient: burnerWalletClient,
              latestBlock$,
              storedBlockLogs$,
              waitForTransaction,
              worldContract,
              systemContract,
              write$: write$.asObservable().pipe(share()),
            });
          }).catch(reject);
        })
        .catch(reject);
    }).catch(reject);
  });
}

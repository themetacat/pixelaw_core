/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */

import { pad, createPublicClient, fallback, webSocket, http, createWalletClient, Hex, parseEther, ClientConfig, createTestClient } from "viem";
      
import { createFaucetService } from "@latticexyz/services/faucet";
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs";
import { getNetworkConfig } from "./getNetworkConfig";
import { world } from "./world";
// import IWorldAbi from "../../../contracts/out/IWorld.sol/IWorld.abi.json";
const response = await fetch('https://pixelaw-game.vercel.app/IWorld.abi.json');
const IWorldAbi = await response.json();
import { createBurnerAccount, getContract, transportObserver, ContractWrite, resourceToHex } from "@latticexyz/common";
import { Subject, share } from "rxjs";
import { resolveConfig } from "@latticexyz/store/internal";
import tcmpopstarConfig from "./tcmpopstar.config";
/*
 * Import our MUD config, which includes strong types for
 * our tables and other config options. We use this to generate
 * things like RECS components and get back strong types for them.
 *
 * See https://mud.dev/templates/typescript/contracts#mudconfigts
 * for the source of this information.
 */
import mudConfig from "../../../contracts/mud.config";
import { useEffect } from "react";


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
  palyerAddress: any;
  write$: any;
  write_sub: any;
  abi: any;
  clientOptions:any
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
        pollingInterval: 3000,
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

      const testClient = createTestClient({
        // ...clientOptions,
        chain: networkConfig.chain,
        mode: 'anvil',
        transport: transportObserver(fallback([webSocket(), http()])),
      })

      /*
       * Create an observable for contract writes that we can
       * pass into MUD dev tools for transaction observability.
       */
      const write$ = new Subject<ContractWrite>();
// console.log(networkConfig.worldAddress,'-------------------')
      /*
      * Create an object for communicating with the deployed World.
      */
      
      const worldContract = getContract({
        address: networkConfig.worldAddress as Hex, 
        abi: IWorldAbi,
        publicClient,
        walletClient: burnerWalletClient,
        onWrite: (write) => write$.next(write),
      });

      /*
       * Create an object for communicating with the deployed World.
       */
      const appName = localStorage.getItem('manifest')  as any
      
      const parts = appName?.split("/") as any;
      let worldAbiUrl:any;
      // console.log(parts[0]); // 输出 "Base"
      if(appName){
        if(parts[0] === 'BASE'){
          worldAbiUrl = "https://pixelaw-game.vercel.app/"+`${parts[1].replace(/\.abi\.json/g, '')}`+".abi.json" as any;
        }else{
          worldAbiUrl =appName
        }
      }else{
        worldAbiUrl="https://pixelaw-game.vercel.app/Snake.abi.json"
      }

      let indexerUrl = ""
      
      if (networkConfig.chain.id === 690) {
        indexerUrl = "https://indexer.pixelaw.world/";
      }else if(networkConfig.chain.id === 31338){
        indexerUrl = "https://indexerdev.pixelaw.world/";
      }else if(networkConfig.chain.id === 17069){
        indexerUrl = "https://indexertest.pixelaw.world/";
      }
  
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

          syncToRecs({
            world,
            config: mudConfig,
            address: networkConfig.worldAddress as Hex,
            publicClient,
            startBlock: BigInt(networkConfig.initialBlockNumber),
            indexerUrl: indexerUrl,
            tables: resolveConfig(tcmpopstarConfig).tables,
            filters: [
              {
                tableId: resourceToHex({ type: "table", namespace: "", name: "Pixel" }),
              },
              {
                tableId: resourceToHex({ type: "table", namespace: "", name: "App" }),
              },
              {
                tableId: resourceToHex({ type: "table", namespace: "", name: "AppName" }),
              },
              {
                tableId: resourceToHex({ type: "table", namespace: "", name: "Instruction" }),
              },
              {
                tableId: resourceToHex({ type: "table", namespace: "", name: "Alert" }),
              },
              {
                tableId: resourceToHex({ type: "table", namespace: "popCraft", name: "TCMPopStar" }),
              },
              {
                tableId: resourceToHex({ type: "table", namespace: "popCraft", name: "TokenBalance" }),
              },
            ],
          }).then(({ components, latestBlock$, storedBlockLogs$, waitForTransaction }) => {
   
            /*
             * If there is a faucet, request (test) ETH if you have
             * less than 1 ETH. Repeat every 20 seconds to ensure you don't
             * run out.
             */
            const account_addr = burnerWalletClient.account.address
            
              const requestDrip = async () => {
                
                const balance = await publicClient.getBalance({ address: account_addr });
                console.info(`[Dev Faucet]: Player balance -> ${balance}`);
                const lowBalance = balance < parseEther("1");
                if (lowBalance) {
                  console.info("[Dev Faucet]: Balance is low, dripping funds to player");
                  await testClient.setBalance({ address: account_addr, value: parseEther('10') });
                };
              };
     
              async function sendPostRequest() {
                const balance = await publicClient.getBalance({ address: account_addr });
                console.info(`[Dev Faucet]: Player balance -> ${balance}`);
                const lowBalance = balance < parseEther("0.001");
                if(lowBalance){
                  console.info("[Dev Faucet]: Balance is low, dripping funds to player");
                  const url = 'https://17001-faucet.quarry.linfra.xyz/trpc/drip';
                
                  const data = {
                      address: account_addr
                  };
              
                  const response = await fetch(url, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                  });
              
                  const responseData = await response.json();
                  console.log(responseData);
                }
               
            }
            if(networkConfig.chain.id === 31337){
              
              requestDrip();
              setInterval(requestDrip, 20000)
              
            }else if(networkConfig.chain.id === 17069){
              sendPostRequest();
              setInterval(sendPostRequest, 40000)
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
              palyerAddress:burnerWalletClient.account.address,
              write$: write$.asObservable().pipe(share()),
              write_sub: write$,
              abi: abi,
              clientOptions
            });
          
          }).catch(reject);
        })
        .catch(reject);
    }).catch(reject);
  
  });
}

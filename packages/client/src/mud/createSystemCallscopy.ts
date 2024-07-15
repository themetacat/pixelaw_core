/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */
import { useContext } from "react";
import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { resourceToHex, ContractWrite, getContract } from "@latticexyz/common";
import { SetupNetworkResult } from './setupNetwork'
import { encodeSystemCall, SystemCall, encodeSystemCallFrom } from '@latticexyz/world';
import { Abi, encodeFunctionData, parseEther, decodeErrorResult, toHex } from "viem";
import {
  getBurnerPrivateKey,
  createBurnerAccount,
  transportObserver,
} from "@latticexyz/common";
import { callWithSignature } from "@latticexyz/world-modules";
// import { callWithSignatureTypes } from "@latticexyz/world/internal";
import { Subject, share } from "rxjs";
import { useWalletClient } from 'wagmi'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import CallWithSignatureAbi from "@latticexyz/world-modules/out/Unstable_CallWithSignatureSystem.sol/Unstable_CallWithSignatureSystem.abi.json";
let args_index: number = -1;

export const update_app_value = (index: number) => {
  args_index = index;
}

export let abi_json = {};

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { worldContract, waitForTransaction, publicClient, walletClient, abi,clientOptions }: SetupNetworkResult,
  { }: ClientComponents,
) {
  const app_name: string = window.localStorage.getItem('app_name') || 'paint';

  abi_json[app_name] = abi
  const update_abi = (value: any, common = false) => {
    const app_name: string = window.localStorage.getItem('app_name') || 'paint';
    if(common){
      abi_json[app_name+'Common'] = value;
    }else{
      abi_json[app_name] = value;
    }
  }

  const entityVal = localStorage.getItem("entityVal") as any;
  if (entityVal === null) {
    localStorage.setItem(
      "entityVal",
      '0xc96BedB3C0f9aB47E50b53bcC03E5D7294C97cf2'
    );
  }
  // const system_name = window.localStorage.getItem('system_name') as string;
  // const namespace = window.localStorage.getItem('namespace') as string;
  const namespace = "tcmPopStar"
  const system_name = "TcmPopStar"
  const SYSTEM_ID = resourceToHex({
    type: "system",
    namespace: namespace,
    name: system_name,
  });
  const SYSTEMBOUND_DELEGATION = resourceToHex({
    type: "system",
    namespace: "",
    name: "unlimited",
  });


  const ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "delegatee",
          type: "address",
        },
        {
          internalType: "ResourceId",
          name: "systemId",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "numCalls",
          type: "uint256",
        },
      ],
      name: "initDelegation",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    }
  ];

  const ABI2 = [
    {
      "type": "function",
      "name": "callWithSignature",
      "inputs": [
        {
          "name": "signer",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "systemId",
          "type": "bytes32",
          "internalType": "ResourceId"
        },
        {
          "name": "callData",
          "type": "bytes",
          "internalType": "bytes"
        },
        {
          "name": "signature",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bytes",
          "internalType": "bytes"
        }
      ],
      "stateMutability": "payable"
    }
  ]

  const getEoaContract = async() => {
    const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' })
    
    const eoaWalletClient = createWalletClient({
      // ...clientOptions,
      chain: clientOptions.chain,
      transport: custom(window.ethereum!),
      account: account
    });
    const callData = encodeFunctionData({
      abi: ABI,
      functionName: "initDelegation",
      args: ["0xF59f26309Fb4416D0bA7989D3d0ae64f503E927A", SYSTEM_ID, 2],
    });
 
    try{
      const hash = await eoaWalletClient.writeContract({
        address: worldContract.address,
        // address: "0x4AB7E8B94347cb0236e3De126Db9c50599F7DB2d",
        abi: worldContract.abi,
        functionName: 'registerDelegation',
        args: ['0xF59f26309Fb4416D0bA7989D3d0ae64f503E927A', SYSTEMBOUND_DELEGATION, callData]
      })
      console.log(hash);
    }catch(error){
      console.error('Failed to setup network:', error.message);
    }
    // console.log(eoaWalletClient.chain.id);

    // const callWithSignatureTypes = {
    //   Call: [
    //     { name: "signer", type: "address" },
    //     { name: "systemNamespace", type: "string" },
    //     { name: "systemName", type: "string" },
    //     { name: "callData", type: "bytes" },
    //     { name: "nonce", type: "uint256" },
    //   ],
    // } as const;
    // const callData = encodeFunctionData({
    //   abi: worldContract.abi,
    //   functionName: "registerDelegation",
    //   args: ["0xF59f26309Fb4416D0bA7989D3d0ae64f503E927A", SYSTEMBOUND_DELEGATION, "0x"],
    // });
    // const systemId = resourceToHex({ type: "system", namespace: "", name: "Registration" });
    
    // const nonce = 0n;
    // // Sign registration call message
    // const signature = await eoaWalletClient.signTypedData({
    //   domain: {
    //     verifyingContract: worldContract.address,
    //     salt: toHex(eoaWalletClient.chain.id, { size: 32 }),
    //   },
    //   types: callWithSignatureTypes,
    //   primaryType: "Call",
    //   message: {
    //     signer: account,
    //     systemNamespace: "",
    //     systemName: "Registration",
    //     callData,
    //     nonce,
    //   },
    // });
    // console.log(signature);
    // console.log(worldContract.address);
    
    // try{
    //   await walletClient.writeContract({
    //     address: worldContract.address,
    //     abi: ABI2,
    //     functionName: "callWithSignature",
    //     args: [account, systemId, callData, signature],
    //   })
    // }catch(error){
    //   console.log(error.message);
    // }
  }
  
  const interact = async (
    coordinates: any,
    addressData: any,
    selectedColor: any,
    action: string,
    other_params: any) => {
    const app_name = window.localStorage.getItem('app_name') || 'paint';
    const system_name = window.localStorage.getItem('system_name') as string;
    const namespace = window.localStorage.getItem('namespace') as string;

    let args;
    let allArgs = [];
    // other_params = [0]
    if(args_index !== -1){
      args = {
        for_player: addressData,
        for_app: app_name,
        position: {
          x: coordinates.x,
          y: coordinates.y
        },
        color: selectedColor
      }
      allArgs = [args];
    }
    
    if (other_params !== null) {
      if(args_index !== -1){
        other_params.splice(args_index, 0, args);
      }
      allArgs = other_params;
    }

    let tx, hashValpublic;
    // const eoa = await getEoaContract();
    try {
      const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' })
      // 0xbf6b2089 getQuoteError
      // 0xfa964245 Inventory_shortage
      // 0xc1c4cde8 Token_InsufficientBalance

      // const encodeData = encodeFunctionData({
      //   abi: abi_json[app_name],
      //   functionName: action,
      //   args: allArgs
      // })
      
      // const encodeData = encodeFunctionData({
      //   abi: abi_json[app_name],
      //   functionName: "buyToken",
      //   args: ["0xC750a84ECE60aFE3CBf4154958d18036D3f15786", 2]
      // })
      // const txData = await worldContract.write.call([resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData])
      // const txData1 = await worldContract.write.setTokenBalanceForNamespace([["0xC750a84ECE60aFE3CBf4154958d18036D3f15786"], [20000000000000000000], "0x6e7374636d506f70537461720000000000000000000000000000000000000000"])
      // const txData = await worldContract.write.transferERC20TokenToAddress(["0x6e7374636d506f70537461720000000000000000000000000000000000000000", "0xC750a84ECE60aFE3CBf4154958d18036D3f15786", "0x60EA96f57B3a5715A90DAe1440a78f8bb339C92e", 1000000000000000000])

      const encodeData = encodeFunctionData({
        abi: abi_json[app_name],
        functionName: action,
        args: allArgs
      })
      const txData = await worldContract.write.callFrom([account, resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData])

      // const encodequoteOutputData = encodeFunctionData({
      //   abi: abi_json[app_name],
      //   functionName: "quoteOutput",
      //   args: [["0xC750a84ECE60aFE3CBf4154958d18036D3f15786"], [8000000000000000000]]
      // })
      // // const txData = await worldContract.write.callFrom([account, resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData])
      // const quoteOutput = await worldContract.read.call([resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodequoteOutputData])
      // const ethInPrice = Number(quoteOutput) / 10**18;
      // console.log(ethInPrice);
      
      // const encodeData = encodeFunctionData({
      //   abi: abi_json[app_name],
      //   functionName: "buyToken",
      //   args: [["0xC750a84ECE60aFE3CBf4154958d18036D3f15786"], [8000000000000000000]]
      // })
      // const txData = await worldContract.write.callFrom([account, resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData],{value: parseEther(ethInPrice.toString())})
      
      //  const encodeData = encodeFunctionData({
      //   abi: abi_json[app_name],
      //   functionName: "withDrawToken",
      //   args: [["0xC750a84ECE60aFE3CBf4154958d18036D3f15786"], [2000000000000000000]]
      // })
      // const txData = await worldContract.write.callFrom([account, resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData])
      
      // const encodeData = encodeFunctionData({
      //   abi: abi_json[app_name],
      //   functionName: "quote",
      //   args: []
      // })
      // const txData = await worldContract.write.call([resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData])
      
      // const txData = null;

      hashValpublic = publicClient.waitForTransactionReceipt({ hash: txData })
      console.log(await publicClient.waitForTransactionReceipt({ hash: txData }));
      
    } catch (error) {
      console.error('Failed to setup network:', error.message);
      return [null, null];
    }
    return [tx, hashValpublic]
  };

  return {
    update_abi,
    interact,
  };

}

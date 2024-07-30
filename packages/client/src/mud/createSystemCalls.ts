/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */
import { useContext } from "react";
import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { resourceToHex, ContractWrite, getContract } from "@latticexyz/common";
import { SetupNetworkResult } from "./setupNetwork";
import {
  encodeSystemCall,
  SystemCall,
  encodeSystemCallFrom,
} from "@latticexyz/world";
import {
  Abi,
  encodeFunctionData,
  parseEther,
  decodeErrorResult,
  toHex,
} from "viem";
import {
  getBurnerPrivateKey,
  createBurnerAccount,
  transportObserver,
} from "@latticexyz/common";
import { callWithSignature } from "@latticexyz/world-modules";
// import { callWithSignatureTypes } from "@latticexyz/world/internal";
import { Subject, share } from "rxjs";
import { useWalletClient } from "wagmi";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import CallWithSignatureAbi from "@latticexyz/world-modules/out/Unstable_CallWithSignatureSystem.sol/Unstable_CallWithSignatureSystem.abi.json";
let args_index: number = -1;

export const update_app_value = (index: number) => {
  args_index = index;
};

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
  {
    worldContract,
    waitForTransaction,
    publicClient,
    palyerAddress,
    walletClient,
    abi,
    clientOptions,
  }: SetupNetworkResult,
  {}: ClientComponents
) {
  const app_name: string = window.localStorage.getItem("app_name") || "paint";

  abi_json[app_name] = abi;
  const update_abi = (value: any, common = false) => {
    const app_name: string = window.localStorage.getItem("app_name") || "paint";
    if (common) {
      abi_json[app_name + "Common"] = value;
    } else {
      abi_json[app_name] = value;
    }
  };

  const entityVal = localStorage.getItem("entityVal") as any;
  if (entityVal === null) {
    localStorage.setItem(
      "entityVal",
      "0xc96BedB3C0f9aB47E50b53bcC03E5D7294C97cf2"
    );
  }

  const namespace = "tcmPopStar";
  const system_name = "TcmPopStar";
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
    },
  ];

  const registerDelegation = async () => {
    const callData = encodeFunctionData({
      abi: ABI,
      functionName: "initDelegation",
      args: [palyerAddress, SYSTEM_ID, 2],
    });
    
    const eoaWalletClient = await getEoaContractFun();
    try {
      const hash = await eoaWalletClient.writeContract({
        address: worldContract.address,
        // address: "0x4AB7E8B94347cb0236e3De126Db9c50599F7DB2d",
        abi: worldContract.abi,
        functionName: "registerDelegation",
        args: [palyerAddress, SYSTEMBOUND_DELEGATION, callData],
      });
    } catch (error) {
      console.error("Failed to setup network:", error.message);
    }
  };

  const getEoaContractFun = async () => {
    const [account] = await window.ethereum!.request({
      method: "eth_requestAccounts",
    });

    const eoaWalletClient = createWalletClient({
      chain: clientOptions.chain,
      transport: custom(window.ethereum!),
      account: account,
    });

    return eoaWalletClient;
  };

  const interact = async (
    coordinates: any,
    addressData: any,
    selectedColor: any,
    action: string,
    other_params: any
  ) => {
    const app_name = window.localStorage.getItem("app_name") || "paint";
    const system_name = window.localStorage.getItem("system_name") as string;
    const namespace = window.localStorage.getItem("namespace") as string;

    let args;
    let allArgs = [];
    if (args_index !== -1) {
      args = {
        for_player: addressData,
        for_app: app_name,
        position: {
          x: coordinates.x,
          y: coordinates.y,
        },
        color: selectedColor,
      };
      allArgs = [args];
    }

    if (other_params !== null) {
      if (args_index !== -1) {
        other_params.splice(args_index, 0, args);
      }
      allArgs = other_params;
    }

    let tx, hashValpublic;
    try {
      const [account] = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });

      const encodeData = encodeFunctionData({
        abi: abi_json[app_name],
        functionName: action,
        args: allArgs
      })

      const txData = await worldContract.write.call([resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData])

      hashValpublic = publicClient.waitForTransactionReceipt({ hash: txData });
    } catch (error) {
      console.error("Failed to setup network:", error.message);
      return [null, null];
    }
    return [tx, hashValpublic];
  };
  const interactTCM = async (
    coordinates: any,
    addressData: any,
    selectedColor: any,
    action: string,
    other_params: any
  ) => {
    
    const app_name = window.localStorage.getItem("app_name") || "paint";
    const system_name = window.localStorage.getItem("system_name") as string;
    const namespace = window.localStorage.getItem("namespace") as string;

    let allArgs = [];
    // const txData1 = await worldContract.write.setTokenBalanceForNamespace([['0x9c0153C56b460656DF4533246302d42Bd2b49947', '0xC750a84ECE60aFE3CBf4154958d18036D3f15786', '0x65638Aa354d2dEC431aa851F52eC0528cc6D84f3', '0x1ca53886132119F99eE4994cA9D0a9BcCD2bB96f', '0x7Ea470137215BDD77370fC3b049bd1d009e409f9', '0xca7f09561D1d80C5b31b390c8182A0554CF09F21', '0xdCc7Bd0964B467554C9b64d3eD610Dff12AF794e', '0x54b31D72a658A5145704E8fC2cAf5f87855cc1Cd', '0xF66D7aB71764feae0e15E75BAB89Bd0081a7180d'], [20000000000000000000, 20000000000000000000, 20000000000000000000, 20000000000000000000, 20000000000000000000, 20000000000000000000, 20000000000000000000, 20000000000000000000, 20000000000000000000], "0x6e73706f70437261667400000000000000000000000000000000000000000000"])
    // console.log( await publicClient.waitForTransactionReceipt({ hash: txData1 }));
    
     const args = {
        for_player: addressData,
        for_app: app_name,
        position: {
          x: coordinates.x,
          y: coordinates.y,
        },
        color: selectedColor,
      };
      allArgs = [args];
   
    if (other_params !== null) {
        other_params.splice(args_index, 0, args);
      allArgs = other_params;
    }

    let tx, hashValpublic;
    try {
      const [account] = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });
      console.log(account);
      

      const encodeData = encodeFunctionData({
        abi: abi_json[app_name],
        functionName: action,
        args: allArgs,
      });
      if(action === 'interact'){
        const txData = await worldContract.write.callFrom([
          account,
          resourceToHex({
            type: "system",
            namespace: namespace,
            name: system_name,
          }),
          encodeData,
        ], {gas: 50000000n});
        
        hashValpublic = publicClient.waitForTransactionReceipt({ hash: txData });
        console.log(await publicClient.waitForTransactionReceipt({ hash: txData }));
        
      }else{
        const txData = await worldContract.write.callFrom([
          account,
          resourceToHex({
            type: "system",
            namespace: namespace,
            name: system_name,
          }),
          encodeData,
        ]);
        console.log(account);
        
        hashValpublic = publicClient.waitForTransactionReceipt({ hash: txData });
        console.log(await publicClient.waitForTransactionReceipt({ hash: txData }));
      }
     
    } catch (error) {
      console.error("Failed to setup network:", error.message);
      return [null, null];
    }
    return [tx, hashValpublic];
  };

  const payFunction = async (selectedName: any, numberData: any) => {
    const system_name = window.localStorage.getItem("system_name") as string;
    const namespace = window.localStorage.getItem("namespace") as string;
    const [account] = await window.ethereum!.request({
      method: "eth_requestAccounts",
    });

    const ethInPrice =await forMent(selectedName, numberData);

    const encodeData = encodeFunctionData({
      abi: abi_json[app_name],
      functionName: "buyToken",
      args: [[selectedName], [numberData * 10 ** 18]],
    });

    let hashValpublic = null;

    const eoaWalletClient = await getEoaContractFun();
    try {
      const hash = await eoaWalletClient.writeContract({
        address: worldContract.address,
        abi: worldContract.abi,
        functionName: "call",
        args: [ resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }), encodeData],
        value:parseEther(ethInPrice.toString())
      });

      hashValpublic = publicClient.waitForTransactionReceipt({ hash: hash })

    } catch (error) {
      console.error("Failed to setup network:", error.message);
    }

    return hashValpublic;
  };

  const forMent = async (selectedName: any, numberData: any) => {
    const app_name = window.localStorage.getItem("app_name") || "PopCraft";
    const system_name = window.localStorage.getItem("system_name") as string;
    const namespace = window.localStorage.getItem("namespace") as string;
    
    const encodequoteOutputData = encodeFunctionData({
      abi: abi_json[app_name],
      functionName: "quoteOutput",
      args: [[selectedName], [numberData * 10 ** 18]],
    });

    try {
      const quoteOutput = await worldContract.read.call([
        resourceToHex({
          type: "system",
          namespace: namespace,
          name: system_name,
        }),
        encodequoteOutputData,
      ]);
      const ethInPrice = Number(quoteOutput) / 10 ** 18;
      return ethInPrice;
    } catch (error) {
      console.log(error.message);
      return 0;
    }
  };

  return {
    forMent,
    update_abi,
    interact,
    interactTCM,
    payFunction,
    registerDelegation,
  };
}
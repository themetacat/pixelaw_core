/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */
import { useContext } from "react";
import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { resourceToHex } from "@latticexyz/common";
import { SetupNetworkResult } from './setupNetwork'
// import SnakeSystemAbi from "contracts/out/SnakeSystem.sol/SnakeSystem.abi.json";
import { getContract } from "@latticexyz/common";
import { encodeSystemCall, SystemCall } from '@latticexyz/world';
// import interact_abi from "../../../paint/out/IPaintSystem.sol/IPaintSystem.abi.json";
// import interact_abi from "../../../paint/out/PaintSystem.sol/PaintSystem.abi.json";
import { Abi, encodeFunctionData } from "viem";

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
  { worldContract, waitForTransaction, publicClient, walletClient, write_sub, abi }: SetupNetworkResult,
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
    console.log(allArgs,'allArgs');
    
    try {
      const txData = await worldContract.write.call(encodeSystemCall({
        abi: abi_json[app_name],
        systemId: resourceToHex({ "type": "system", "namespace": namespace, "name": system_name }),
        functionName: action,
        args: allArgs
      }))
      const tx = await waitForTransaction(txData);

      hashValpublic = publicClient.waitForTransactionReceipt({ hash: txData })

    } catch (error) {
      console.error('Failed to setup network:', error);
      return [null, null];
    }
    return [tx, hashValpublic]
  };


  return {
    update_abi,
    interact,
  };

}

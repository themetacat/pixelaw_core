/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */
import React, { useContext } from 'react';
import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { ManifestContext ,} from '../components/rightPart';
import { encodeSystemCall, encodeSystemCalls } from '@latticexyz/world';
import { resourceToHex } from "@latticexyz/common";


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
  { worldContract, waitForTransaction,publicClient ,playerEntity}: SetupNetworkResult,
  { Counter }: ClientComponents,
) {

const entityVal = localStorage.getItem("entityVal") as any;
if(entityVal===null){
  localStorage.setItem(
    "entityVal",
    '0xc96BedB3C0f9aB47E50b53bcC03E5D7294C97cf2'
  );
}
  function convertHexToCase(hexValue:any, uppercase:any) {
    let hexString = hexValue.slice(2); // 去掉 "0x" 前缀
    if (uppercase) {
      hexString = hexString.toUpperCase(); // 转换为大写形式
    } else {
      hexString = hexString.toLowerCase(); // 转换为小写形式
    }
    
    // 去掉多余的零
    while (hexString.startsWith("0")) {
      hexString = hexString.slice(1);
    }
    
    return '0x' + hexString;
  }
  const increment = async () => {
    /*
     * Because IncrementSystem
     * (https://mud.dev/templates/typescript/contracts#incrementsystemsol)
     * is in the root namespace, `.increment` can be called directly
     * on the World contract.
     */
    // const txData = await worldContract.write.paint_PaintSystem_init()
    // const tx = await worldContract?.write?.paint_PaintSystem_interact([{for_player: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', for_system:entityVal,position: {x: xDATA, y: yData}, color: color}]);
    const txData = await worldContract.write.snake_SnakeSystem_move(['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'])
    await waitForTransaction(txData);

  };
  // increment()

  // new
  interface QueueData {
    name: string;
    namespace: string;
    functionName: string;
    args: any
  }
  const execute_queue = async (queue_data: QueueData) => {

    const txData = await worldContract.write.call(encodeSystemCall({
      abi: worldContract.abi,
      systemId: resourceToHex({"type": "system", "namespace": queue_data.namespace, "name": queue_data.name}),
      functionName: queue_data.functionName,
      args: ['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc']
      })
    )
    await waitForTransaction(txData);
    setTimeout(() => execute_queue(queue_data), 1000);

  };
  const queue_data: QueueData = {
    name: "SnakeSystem",
    namespace: "snake",
    functionName: "move",
    args: ['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc']
  };

  execute_queue(queue_data)
  return {
    increment,
    execute_queue
  };
}

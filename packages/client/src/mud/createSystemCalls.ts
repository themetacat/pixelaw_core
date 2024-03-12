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
// import SnakeSystemAbi from "contracts/out/SnakeSystem.sol/SnakeSystem.abi.json";

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
  { worldContract, systemContract, waitForTransaction,publicClient ,playerEntity}: SetupNetworkResult,
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
  const increment = async (incrementData:any,coordinates:any,entityaData:any,addressData:any,selectedColor:any) => {
    
    // const tx = await systemContract.write?.snake_SnakeSystem_init();
    // const tx1 = await systemContract.write?.paint_PaintSystem_init();
    // const tx = await systemContract.write.paint_PaintSystem_interact([{for_player: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', for_system: '0x2a264F26859166C5BF3868A54593eE716AeBC848',position: {x: 8, y: 2}, color: "#ffffff"}]);
    
    const appName = localStorage.getItem('manifest')  as any
    
    if(appName&& appName.includes('Paint')){
      
    const tx = await systemContract.write.paint_PaintSystem_interact([{for_player: '0x41DF5a174c25550EEEeEd53307f83b3fe9F5747b', for_system: "0xf7Cd8fa9b94DB2Aa972023b379c7f72c65E4De9D", position: {x:coordinates.x,y:coordinates.y},  color: {selectedColor}}]);
    }else if(appName&& appName.includes('Snake')){
      
      const tx = await systemContract.write.snake_SnakeSystem_interact([{for_player: 
        // '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'
      {addressData}, for_system:
      //  '0x8ce361602B935680E8DeC218b820ff5056BeB7af'
      {entityaData},
      position: {x:coordinates.x,y:coordinates.y}, color: {selectedColor}}, incrementData]);
    }

    // const txData = await systemContract.write.snake_SnakeSystem_move(['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'])
    // await waitForTransaction(tx);

  };

  // increment()
  // const execute_instruction = async () => {
  //     // SnakeSystemAbi 使用 setupNetwork中worldAbiUrl中的abi

  //     const txData = await worldContract.write.call(encodeSystemCall({
  //     abi: SnakeSystemAbi,
  //     systemId: resourceToHex({"type": "system", "namespace": queue_data.namespace, "name": queue_data.name}),
  //     functionName: queue_data.functionName,
  //     args: ['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc']
  //     })
  //   )
  //   await waitForTransaction(txData);

  // };

  interface QueueData {
    id: any,
    name: any;
    namespace: any;
    timestamp: any;
    call_data: any
  }

  const execute_queue = async(queue_data: QueueData) => {

    // const txData = await worldContract.write.call(encodeSystemCall({
    //   abi: SnakeSystemAbi,
    //   systemId: resourceToHex({"type": "system", "namespace": queue_data.namespace, "name": queue_data.name}),
    //   functionName: queue_data.functionName,
    //   args: ['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc']
    //   })
    // )
    // await waitForTransaction(txData);
    //console.log(queue_data.id, queue_data.timestamp, queue_data.namespace, queue_data.name, queue_data.call_data);
    
    const txData = await worldContract.write?.call_CallOtherSystem_call_world_process_queue([queue_data.id, queue_data.timestamp, queue_data.namespace, queue_data.name, queue_data.call_data])
    // const txData = await worldContract.write.process_queue([queue_data.id, queue_data.timestamp, queue_data.namespace, queue_data.name, queue_data.call_data])

    await waitForTransaction(txData);
    // setTimeout(() => execute_queue(queue_data), 1000);
  };


  // execute_queue(queue_data)
  return {
    increment,
    execute_queue
  };
}

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
import interact_abi from "../../../paint/out/IPaintSystem.sol/IPaintSystem.abi.json";
import { Abi, encodeFunctionData } from "viem";
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
  { worldContract, waitForTransaction,publicClient, walletClient,write_sub, abi}: SetupNetworkResult,
  { }: ClientComponents,
) {
  let abi_json: any = abi;
  const update_abi = (value: any) => {
    abi_json = value;
  }

  let app_value: any;

  const update_app_value = (value: any) => {
    abi_json = value;
  }
  
  // //console.log(systemContract,'55555555555')
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


const increment = async (incrementData: any, coordinates: any, entityaData: any, addressData: any, selectedColor: any) => {
// console.log(coordinates,'=================',selectedColor)

  const systemContract = getContract({
    address: "0xC44504Ab6a2C4dF9a9ce82aecFc453FeC3C8771C",
    abi: abi_json,
    publicClient,
    walletClient: walletClient,
    onWrite: (write) => write_sub.next(write),
  });
  let tx;
  let hashValpublic = null; 
  try {
    const appName = localStorage.getItem('manifest') as any;
    const entityaData = localStorage.getItem('entityVal') as any;
    
    if (appName.includes('Paint')) {
       tx = await systemContract.write.paint_PaintSystem_interact([{ for_player: addressData, for_app: app_name, position: { x: coordinates.x, y: coordinates.y }, color: selectedColor }]);

    } else if (appName && appName.includes('Snake')) {
      // console.log(224444)
      if(incrementData){
      // console.log('snake', systemContract);
      tx = await systemContract.write.snake_SnakeSystem_interact([{ for_player: addressData, for_system: entityaData, position: { x: coordinates.x, y: coordinates.y }, color: selectedColor }, incrementData]);
      } 
      
    }else if (appName && appName.includes('Pix2048')) {
      tx = await systemContract.write.pix2048_Pix2048System_interact([{ for_player: addressData, for_system: entityaData, position: { x: coordinates.x, y: coordinates.y }, color: selectedColor }]);

    }
    hashValpublic =  publicClient.waitForTransactionReceipt({hash:tx});

  } catch (error) {
    console.error('Failed to setup network:', error);
    return[null, null]
  }
  
  return [tx,hashValpublic]

};
  interface AppData {
    id: any,
    name: any;
    namespace: any;
    timestamp: any;
    call_data: any
  }

  const interact = async (
     coordinates: any, 
     addressData: any, 
     selectedColor: any, 
     other_params: any) => {
      const app_name =  window.localStorage.getItem('app_name'); 
      const system_name =  window.localStorage.getItem('system_name') as string; 
      const namespace =  window.localStorage.getItem('namespace') as string; 
      
      const args = [{ for_player: addressData, for_app: app_name, position: { x: coordinates.x, y: coordinates.y }, color: selectedColor }]
      if(other_params){
        args.push(other_params);
      }
      let tx, hashValpublic;
      console.log(args);

      console.log(resourceToHex({"type": "system", "namespace": namespace, "name": system_name}));
      // const x = namespace + '_' + system_name + '_interact';
      // type MyFunctionName = `${string}_${string}_interact`; // 定义期望的格式

      const x = `${namespace}_${system_name}_interact`;
      const z = encodeFunctionData({
        abi: interact_abi,
        functionName: x,
        args: args,
      })
      console.log(z);
    
      // const myCall: SystemCall<Abi, typeof interact_function_ame> = {
      //   abi: interact_abi,
      //   systemId: resourceToHex({"type": "system", "namespace": namespace, "name": system_name}),
      //   functionName: interact_function_ame,
      //   args: args,
      // };
      try{
        const txData = await worldContract.write.call(encodeSystemCall({
          abi: interact_abi,
          systemId: resourceToHex({"type": "system", "namespace": namespace, "name": system_name}),
          functionName: x,
          args: args
        }))
        // const txData = await worldContract.write.call(encodeSystemCall(myCall))
        const tx = await waitForTransaction(txData);
        hashValpublic = publicClient.waitForTransactionReceipt({hash:tx})

      }catch(error){
        console.error('Failed to setup network:', error);
        return[null, null];
      }
    return [tx,hashValpublic]
  };


  // const systemContract = getContract({
  //   address: '0xc44504ab6a2c4df9a9ce82aecfc453fec3c8771c', 
  //   abi: ICallSystemAbi,
  //   publicClient,
  //   walletClient: walletClient,
  //   onWrite: (write) => write$.next(write),
  // });

 
  return {
    increment,
    update_abi,
    interact
  };
  
}

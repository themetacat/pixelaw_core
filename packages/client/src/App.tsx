import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import Header from "./components/herder";
import PopUpBox from "./components/popUpBox";
import toast, { Toaster } from "react-hot-toast";
import { SyncStep } from "@latticexyz/store-sync";
import style from "./app.module.css";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Hex } from "viem";
import { ethers } from "ethers";
import {
  ComponentValue,
  Entity,
  Has,
  HasValue,
  getComponentValueStrict,
  removeComponent,
  getComponentValue,
} from "@latticexyz/recs";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
  hexKeyTupleToEntity,
} from "@latticexyz/store-sync/recs";
import { addToQueue, getQueue, delQueue } from "./bot/queue";
import { error } from "@latticexyz/common/src/debug";
const stringToBytes32 = (inputString: string) => {
  // Pad the UTF-8 encoded bytes to 32 bytes
  const paddedBytes = ethers.utils.formatBytes32String(inputString);

  return paddedBytes;
};

export const App = () => {
  const {
    components: {
      App,
      Pixel,
      AppName,
      SyncProgress,
      QueueScheduled,
      QueueProcessed,
      Instruction
    },
    network: { playerEntity, publicClient },
    systemCalls: { increment, execute_queue },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity) as any;
  const [hoveredData, setHoveredData] = useState<{
    x: any;
    y: any;
  } | null>(null);
  const [allData, setAllData] = useState<ComponentValue[]>([]);
  // const syncProgress = useComponentValue(SyncProgress, singletonEntity) as any;
  const playerEntityNum = BigInt(playerEntity);
  const hexString = ("0x" + playerEntityNum.toString(16)) as any;
  const [balance, setBalance] = useState<bigint | null>(null);

  const chainName = publicClient.chain.name;
  const balanceFN = publicClient.getBalance({ address: hexString });
  balanceFN.then((a: any) => {
    setBalance(a);
  });
  const natIve = publicClient.chain.nativeCurrency.decimals;

  const addressData =
    hexString.substring(0, 6) +
    "..." +
    hexString.substring(hexString.length - 4).toUpperCase();


  const entities_queue_scheduled = useEntityQuery([Has(QueueScheduled)]);
  const lastProcessedIndexRef = useRef<number>(0); // 用于记录上次处理的位置

  useEffect(() => {
    // 从上次处理的位置开始遍历
    //console.log('entryentryentryentryentryentryentryentryentryentry');
    
    for (let i = lastProcessedIndexRef.current; i < entities_queue_scheduled.length; i++) {
      const entity = entities_queue_scheduled[i] as any;
      const res = getComponentValueStrict(QueueScheduled, entity);
      const res_processed = getComponentValue(QueueProcessed, entity);
      // if (lastProcessedIndexRef.current !== entities_queue_scheduled.length) {
      //   //console.log(entity);
        
      //   addToQueue([entity, res.timestamp, res.name_space, res.name, res.call_data,]);
      // }
      // //console.log(res_processed);
      
      // //console.log(res_processed);
      if (!res_processed) {
        // //console.log(entities_queue_scheduled, 111, res);
        // //console.log(entity);

        // //console.log(res);

        addToQueue([entity, res.timestamp, res.name_space, res.name, res.call_data,]);
        // execute_queue({ id: entity, timestamp: res.timestamp, namespace: res.name_space, name: res.name, call_data: res.call_data });
        // removeComponent(QueueScheduled, entity);
      }
    }

    // 更新上次处理的位置
    lastProcessedIndexRef.current = entities_queue_scheduled.length;
  }, [entities_queue_scheduled, QueueProcessed, QueueScheduled]);

  // getQueue();


    // setTimeout(() => {
    //   //console.log("============setTimeout==============");

    //   const getQueueData = getQueue();

    //   getQueueData.then((q) => {
    //     //console.log(q);
    //     const unlockables = Object.values(q).sort((a, b) => Number(a.timestamp - b.timestamp));
    //     //console.log(unlockables);
        
    //     for (const res of unlockables) {
    //     try {
    //       // //console.log(res);
          
    //       execute_queue({ id: res.id, timestamp: res.timestamp, namespace: res.namespace, name: res.name, call_data: res.call_data });
    //       delQueue(res.id);
    //       //console.log("-----------");
          
          
    //     }catch(error){
    //       //console.error("Error while processing ", res, error)
    //     }
    //   }
    //   })
    // }, 3000);


  // 定时执行queue中的方法
  // async function loop() {
  //   try {
  //     await addToQueue()
  //   } catch (e) {
  //     //console.error('QueueBot failed to process unlockables due to: ', e)
  //   }
  // setTimeout(loop, config.refreshRate);
  // }
  // get queue!!!!!!!!!!!!!!!!!!!!!!!

  // const entities_app = useEntityQuery([Has(App)])
  // // //console.log(entities_app,'-------------------')
  // entities_app.map((entity) =>{
  //   // key {x: 6, y: 2}
  //   // //console.log(decodeEntity({ app_addr: "address"}, entity));
  //   // // value
  //   // //console.log(getComponentValueStrict(App, entity));

  // })
  // const entities = useEntityQuery([Has(Pixel)])
  // //console.log(entities,'====1====')
  // entities.map((entity) =>{
  //   // key {x: 6, y: 2}
  //   //console.log(decodeEntity({ x: "uint32", y: "uint32" }, entity));//每个块坐标
  //   // value
  //   //console.log(getComponentValueStrict(Pixel, entity));//快内容和68 一样
  //   const data = getComponentValueStrict(Pixel, entity);
  //   setAllData((prevData) => [...prevData, data]);
  // })

  // const appName = useComponentValue(AppName, stringToEntityID("0x7061696e74000000000000000000000000000000000000000000000000000000"));
  // //console.log(stringToBytes32("paint"));

  // //console.log(counter);
  // //console.log(pixel);//块内容，点击以后赋值上去(单个)
  // //console.log(appName);

  // useEffect(()=>{
  //   setHoveredData(hoveredData)
  //   //console.log(hoveredData,99999999)
  // },[hoveredData])
  const handleMouseDown = (event: any) => {
    // //console.log(event)
    setHoveredData(event);
    // setHoveredData(hoveredData);
  };
  return (
    <div className={style.page}>
      {syncProgress ? (
        syncProgress.step !== SyncStep.LIVE ? (
          <div style={{ color: "#fff" }} className={style.GameBoard}>
            {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
          </div>
        ) : (
          <Header hoveredData={hoveredData} handleData={handleMouseDown} />
       
        )
      ) : (
        <div style={{ color: "#000" }}>Hydrating from RPC(0) </div>
      )}
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
      {/* <div>
      
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>  */}
      {/* <button
        style={{zIndex: "99999999999999999999999999"}}
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          //console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button> */}
    </div>
  );
};

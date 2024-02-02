import React, { useState, useEffect, useRef,useCallback } from "react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import Header from './components/herder'
import toast, { Toaster } from "react-hot-toast";

import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import {Hex} from "viem";
import { ethers } from "ethers";
import { ComponentValue, Entity, Has, HasValue, getComponentValueStrict  } from "@latticexyz/recs"
import { encodeEntity, syncToRecs, decodeEntity, hexKeyTupleToEntity } from "@latticexyz/store-sync/recs";

const stringToBytes32 = (inputString: string) => {

  // Pad the UTF-8 encoded bytes to 32 bytes
  const paddedBytes = ethers.utils.formatBytes32String(inputString);

  return paddedBytes;
};

export const App = () => {
  const {
    components: {  App,Pixel,AppName},
    network: { playerEntity, publicClient },
    systemCalls: { increment },
  } = useMUD();
  const [hoveredData, setHoveredData] = useState<{
    x: any;
    y: any;
  } | null>(null);
  const [allData, setAllData] = useState<ComponentValue[]>([]);
  // const syncProgress = useComponentValue(SyncProgress, singletonEntity) as any;
  const playerEntityNum = BigInt(playerEntity);
  const hexString = "0x" + playerEntityNum.toString(16) as any;
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


 

  // const entities_app = useEntityQuery([Has(App)])
  // // console.log(entities_app,'-------------------')
  // entities_app.map((entity) =>{
  //   // key {x: 6, y: 2}
  //   // console.log(decodeEntity({ app_addr: "address"}, entity));
  //   // // value
  //   // console.log(getComponentValueStrict(App, entity));
    
  // })
  // const entities = useEntityQuery([Has(Pixel)])
  // console.log(entities,'====1====')
  // entities.map((entity) =>{
  //   // key {x: 6, y: 2}
  //   console.log(decodeEntity({ x: "uint32", y: "uint32" }, entity));//每个块坐标
  //   // value
  //   console.log(getComponentValueStrict(Pixel, entity));//快内容和68 一样
  //   const data = getComponentValueStrict(Pixel, entity);
  //   setAllData((prevData) => [...prevData, data]);
  // })

  // const appName = useComponentValue(AppName, stringToEntityID("0x7061696e74000000000000000000000000000000000000000000000000000000"));
  // console.log(stringToBytes32("paint"));
  
  // console.log(counter);
  // console.log(pixel);//块内容，点击以后赋值上去(单个)
  // console.log(appName);


  // useEffect(()=>{
  //   setHoveredData(hoveredData)
  //   console.log(hoveredData,99999999)
  // },[hoveredData])
  const handleMouseDown = (event:any) => {
    // ...其他逻辑
    console.log(event)
    setHoveredData(event)
    // setHoveredData(hoveredData);
    
  };
  return (
    <>
    <Header hoveredData = {hoveredData} handleData={handleMouseDown} />
    <Toaster
          toastOptions={{
            duration: 2000,
            style: {
              background: "linear-gradient(90deg, #dedfff,#8083cb)",
              color: "black",
              borderRadius: "8px",
              zIndex:"9999999999999"
            },
          }}
        />
      {/* <div>
      
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button> */}
    </>
  );
};

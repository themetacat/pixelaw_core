/* eslint-disable react/no-unknown-property */
import React, { useEffect,useContext , useState } from "react";

import style from "./index.module.css";

import {
  ComponentValue,
  Entity,
  Has,
  HasValue,
  getComponentValueStrict,
  getComponentValue,
} from "@latticexyz/recs";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
  hexKeyTupleToEntity,
} from "@latticexyz/store-sync/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import leftIcon from "../../images/zuojiantou.png";
import rightIcon from "../../images/youjiantou.png";
import { setup } from "../..//mud/setup";
import { Hex } from "viem";
import {setupNetwork,SetupNetworkResult } from '../../mud/setupNetwork'
interface Props {
  onHandleExe: any;
  addressData: any;
  selectedColor: any;
  coordinates: { x: number; y: number };
}
export default function PopUpBox({ addressData,selectedColor,onHandleExe,coordinates }: Props) {
  const {
    components: { App, Pixel, AppName, Instruction },
    network: { playerEntity, publicClient ,palyerAddress},
    systemCalls: { increment },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
const [receivedInstruction, setReceivedInstruction] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const networkData: SetupNetworkResult = await setupNetwork();
        // 在这里可以访问 systemContract
        setReceivedInstruction(networkData.systemContract);
      } catch (error) {
        console.error('Error setting up network:', error);
      }
    }

    fetchData();
  }, []);
  const [instruC, setInstruC] = useState(null);
  const [entityaData, setEntityaData] = useState('');
// console.log(selectedColor,555)

useEffect(() => {
  entities_app.map((entitya) => {
    // console.log(entities_app,3333333333)
    const entityaData = entities_app[1]
    const instruction = getComponentValue(Instruction, entityaData) as any;
    // console.log(instruction, "=111111==========");
    const num = BigInt(entityaData); // 将 16 进制字符串转换为 BigInt 类型的数值
const result = "0x" + num.toString(16); // 将 BigInt 转换为 16 进制字符串，并添加前缀 "0x"
// console.log(instruction);
    setInstruC(instruction?.instruction);
    setEntityaData(result)
  });
}, []);

  const appName = localStorage.getItem('manifest')  as any
  // const appName = "BASE/Paint"
  
  const parts = appName?.split("/") as any;
  let worldAbiUrl:any;
  if(appName){
    if(parts[0] === 'BASE'){
      worldAbiUrl = "https://pixelaw-game.vercel.app/"+`${parts[1].replace(/\.abi\.json/g, '')}`+".abi.json" as any;
    }else{
      worldAbiUrl =appName
    }
  }else{
    worldAbiUrl="https://pixelaw-game.vercel.app/Paint.abi.json"
  }

  const onHandleLeft = ()=>{
    increment(1,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    onHandleExe()
  }
  const onHandleRight = ()=>{
    increment(2,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    onHandleExe()
  }
  const onHandleUp = ()=>{
    increment(3,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    onHandleExe()
  }
  const onHandleDown = ()=>{
    increment(4,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    onHandleExe()
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h2 className={style.title}>
          {instruC}
        </h2>
        <div>
          <div className={style.bottomBox}>
            <label
              className={style.direction}
            >
              direction
            </label>
            <div className={style.btnBox}>
              <button className={style.btn} onClick={onHandleLeft}>Left</button>
              <button className={style.btn} onClick={onHandleRight}>Right</button>
              <button className={style.btn} onClick={onHandleUp}>Up</button>
              <button className={style.btn} onClick={onHandleDown}>Down</button>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={style.closeBtn}
          onClick={() => onHandleExe()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}

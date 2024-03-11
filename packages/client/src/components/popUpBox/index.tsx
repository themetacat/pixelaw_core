/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";

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
import { Hex } from "viem";
interface Props {
  onHandleExe: any;
  addressData: any;
  coordinates: { x: number; y: number };
}
export default function PopUpBox({ addressData,onHandleExe,coordinates }: Props) {
  const {
    components: { App, Pixel, AppName, Instruction },
    network: { playerEntity, publicClient },
    systemCalls: { increment },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);

  const [instruC, setInstruC] = useState(null);
  const [entityaData, setEntityaData] = useState('');
// console.log(coordinates,555)
  useEffect(() => {
    entities_app.map((entitya) => {
      const instruction = getComponentValue(Instruction, entitya) as any;
      // console.log(entitya, "=111111==========");
      const num = BigInt(entitya); // 将 16 进制字符串转换为 BigInt 类型的数值
const result = "0x" + num.toString(16); // 将 BigInt 转换为 16 进制字符串，并添加前缀 "0x"
// console.log(result);
      setInstruC(instruction?.instruction);
      setEntityaData(result)
    });
  }, []);


  const onHandleLeft = ()=>{
    // console.log('点了没有',addressData)
    increment(1,coordinates,entityaData,addressData)
  }
  const onHandleRight = ()=>{
    // console.log('点了没有',addressData)
    increment(2,coordinates,entityaData,addressData)
  }
  const onHandleUp = ()=>{
    // console.log('点了没有',addressData)
    increment(3,coordinates,entityaData,addressData)
  }
  const onHandleDown = ()=>{
    // console.log('点了没有',addressData)
    increment(4,coordinates,entityaData,addressData)
  }

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h2 className={style.title}>
          {/* //    className="text-[#FFC400] text-center uppercase text-[32px] font-silkscreen" */}
          {/* select direction for snake2222 */}
          {instruC}
        </h2>
        <div>
          <div className={style.bottomBox}>
            <label
              // className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-center text-white capitalize"
              // for="enum-group-direction"
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
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

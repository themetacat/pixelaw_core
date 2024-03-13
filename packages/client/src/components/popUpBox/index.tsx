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
import toast, { Toaster } from "react-hot-toast";
import { Hex } from "viem";
import {setupNetwork,SetupNetworkResult } from '../../mud/setupNetwork'
import loadingImg from '../../images/loading.png'
interface Props {
  onHandleExe: any;
  addressData: any;
  selectedColor: any;
  onHandleLoading: any;
  coordinates: { x: number; y: number };
}
export default function PopUpBox({ addressData,selectedColor,onHandleLoading,onHandleExe,coordinates }: Props) {
  const {
    components: { App, Pixel, AppName, Instruction },
    network: { playerEntity, publicClient ,palyerAddress},
    systemCalls: { increment },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
const [receivedInstruction, setReceivedInstruction] = useState({});
// console.log(coordinates,"传进来的")
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
    // console.log(entityaData, "=111111==========");
    const num = BigInt(entityaData); // 将 16 进制字符串转换为 BigInt 类型的数值
const result = "0x" + num?.toString(16); // 将 BigInt 转换为 16 进制字符串，并添加前缀 "0x"
// console.log(num);
    setInstruC(instruction?.instruction);
    setEntityaData(result)
  });

}, []);

  const appName = localStorage.getItem('manifest')  as any
  // const appName = "BASE/Paint"
  const [loading, setLoading] = useState(false);
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
    setLoading(true)
   const increData=   increment(1,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
   increData.then((increDataVal:any)=>{

    increDataVal[1].then((a:any)=>{
    if(a.status=== "success"){
      onHandleLoading()
    }else{
      onHandleLoading()
      toast.error('An error was reported')
    }
    })
          })
      onHandleExe()
  }
  const onHandleRight = ()=>{
    setLoading(true)
    const increData=   increment(2,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    increData.then((increDataVal:any)=>{

      increDataVal[1].then((a:any)=>{
      if(a.status=== "success"){
        onHandleLoading()
      }else{
        onHandleLoading()
        toast.error('An error was reported')
      }
      })
            })
    onHandleExe()
  }
  const onHandleUp = ()=>{
    setLoading(true)
    const increData=  increment(3,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    increData.then((increDataVal:any)=>{

      increDataVal[1].then((a:any)=>{
      if(a.status=== "success"){
        onHandleLoading()
      }else{
        onHandleLoading()
        toast.error('An error was reported')
      }
      })
            })
    onHandleExe()
  }
  const onHandleDown = ()=>{
    setLoading(true)
    const increData=  increment(4,receivedInstruction,coordinates,entityaData,palyerAddress,selectedColor)
    increData.then((increDataVal:any)=>{

      increDataVal[1].then((a:any)=>{
      if(a.status=== "success"){
        onHandleLoading()
      }else{
        onHandleLoading()
        toast.error('An error was reported')
      }
      })
            })
    onHandleExe()
  }

  return (
    <>
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
     <div style={{position:"absolute",right:"260px",top:"20px",width:"100px",height:"100px",zIndex:"9999999999999999"}}> {loading ===true ?<img src={loadingImg} alt="" />:null}</div>
     </>
  );
}

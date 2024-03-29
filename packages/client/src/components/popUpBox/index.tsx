
import React, { useEffect, useContext, useState } from "react";
import style from "./index.module.css";

import {
  Has,
  getComponentValue,
} from "@latticexyz/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import toast, { Toaster } from "react-hot-toast";
interface Props {
  onHandleExe: any;
  addressData: any;
  selectedColor: any;
  onHandleLoading: any;
  onHandleLoadingFun: any;
  coordinates: { x: number; y: number };
}
export default function PopUpBox({
  addressData,
  selectedColor,
  onHandleLoading,
  onHandleExe,
  coordinates,
  onHandleLoadingFun,
}: Props) {
  const {
    components: { App, Pixel, AppName, Instruction },
    network: { playerEntity, publicClient, palyerAddress },
    systemCalls: { increment },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [instruC, setInstruC] = useState(null);
  const [entityaData, setEntityaData] = useState("");

//  console.log(coordinates,9999999)

  const appName = localStorage.getItem("manifest") as any;
  const parts = appName?.split("/") as any;
  let worldAbiUrl: any;
  if (appName) {
    if (parts[0] === "BASE") {
      worldAbiUrl = ("https://pixelaw-game.vercel.app/" +
        `${parts[1].replace(/\.abi\.json/g, "")}` +
        ".abi.json") as any;
    } else {
      worldAbiUrl = appName;
    }
  } else {
    worldAbiUrl = "https://pixelaw-game.vercel.app/Paint.abi.json";
  }

  const onHandleLeft = () => {
    onHandleLoadingFun()
    const increData = increment(
      1,
      coordinates,
      entityaData,
      palyerAddress,
      selectedColor
    );
    increData.then((increDataVal: any) => {
      increDataVal[1].then((a: any) => {
        if (a.status === "success") {
          onHandleLoading();
        } else {
          onHandleLoading();
          alert("An error was reported");
        }
      });
    });
    onHandleExe();
  };
  const onHandleRight = () => {
    onHandleLoadingFun()
    const increData = increment(
      2,
      coordinates,
      entityaData,
      palyerAddress,
      selectedColor
    );
    increData.then((increDataVal: any) => {
      increDataVal[1].then((a: any) => {
        if (a.status === "success") {
          onHandleLoading();
        } else {
          onHandleLoading();
          toast.error("An error was reported");
        }
      });
    });
    onHandleExe();
  };
  const onHandleUp = () => {
    onHandleLoadingFun()
    const increData = increment(
      3,
      coordinates,
      entityaData,
      palyerAddress,
      selectedColor
    );
    increData.then((increDataVal: any) => {
      increDataVal[1].then((a: any) => {
        if (a.status === "success") {
          onHandleLoading();
        } else {
          onHandleLoading();
          toast.error("An error was reported");
        }
      });
    });
    onHandleExe();
  };
  const onHandleDown = () => {
    onHandleLoadingFun()
    const increData = increment(
      4,
      coordinates,
      entityaData,
      palyerAddress,
      selectedColor
    );
    increData.then((increDataVal: any) => {
      increDataVal[1].then((a: any) => {
        if (a.status === "success") {
          onHandleLoading();
        } else {
          onHandleLoading();
          toast.error("An error was reported");
        }
      });
    });
    onHandleExe();
  };

  const handleKeyDown = (e:any) => {
    switch (e.key) {
      case 'ArrowLeft':
        onHandleLeft();
        break;
      case 'ArrowRight':
        onHandleRight();
        break;
      case 'ArrowUp':
        onHandleUp();
        break;
      case 'ArrowDown':
        onHandleDown();
        break;
      default:
        break;
    }
  };


  useEffect(() => {
    entities_app.map((entitya) => {
      const entityaData = entities_app[0];
      const instruction = getComponentValue(Instruction, entityaData) as any;
      const num = BigInt(entityaData); 
      const result = "0x" + num?.toString(16);
      setInstruC(instruction?.instruction);
      setEntityaData(result);
    });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [entities_app,Instruction,entityaData]);


  return (
      <div className={style.container}   style={{ zIndex: 99999999999999 }} >
        <div className={style.content}>
          <h2 className={style.title}>{instruC}</h2>
            <div className={style.bottomBox}>
              <label className={style.direction}>direction</label>
              <div className={style.btnBox}>
                <button className={style.btn} onClick={onHandleLeft}>
                  Left
                </button>
                <button className={style.btn} onClick={onHandleRight}>
                  Right
                </button>
                <button className={style.btn} onClick={onHandleUp}>
                  Up
                </button>
                <button className={style.btn} onClick={onHandleDown}>
                  Down
                </button>
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
           
          </button>
        </div>
      </div>
   
  );
}

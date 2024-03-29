import React, { createContext, useContext, useEffect, useState } from "react";
import style from "./index.module.css";
import {
  Has,
  getComponentValueStrict,
  getComponentValue
} from "@latticexyz/recs";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
} from "@latticexyz/store-sync/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import leftIcon from "../../images/zuojiantou.png";
import rightIcon from "../../images/youjiantou.png";
import { Hex } from "viem";
import { SetupNetworkResult } from "../../mud/setupNetwork";
import loadingImg from "../../images/loading.png";
export const ManifestContext = createContext<string>("");


interface Props {
  coordinates: { x: number; y: number };
  entityData: any;
  setPanningState: any;
  loading: any;
}
export default function RightPart({ coordinates, loading,entityData ,setPanningState}: Props) {
  const {
    components: { App, Pixel },
    systemCalls: { update_abi },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [panning, setPanning] = useState(false);
  const manifestVal = window.localStorage.getItem("manifest")

  const addressToEntityID = (address: Hex) => encodeEntity({ address: "address" }, { address });

  const coorToEntityID = (x: number, y: number) => encodeEntity({ x: "uint32", y: "uint32" }, { x, y });
  //console.log(decodeEntity({ x: "uint32", y: "uint32" }, entity));//每个块坐标

  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const handleIconClick = (index: number) => {
    setSelectedIcon(index);
  };
  const updateAbiUrl = async (manifest: string) => {
    const parts = manifest?.split("/") as any;
    let worldAbiUrl: any;
    if (manifest) {
      if (parts[0] === "BASE") {
        worldAbiUrl = ("https://pixelaw-game.vercel.app/" +
          `${parts[1].replace(/\.abi\.json/g, "")}` +
          ".abi.json") as any;
      } else {
        worldAbiUrl = manifest;
      }
    } else {
      worldAbiUrl = "https://pixelaw-game.vercel.app/Paint.abi.json";
    }
    const response = await fetch(worldAbiUrl); // 获取 ABI JSON 文件
    const systemData = await response.json();
    update_abi(systemData);
  };

  function capitalizeFirstLetter(str:any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const coor_entity = coorToEntityID(coordinates.x, coordinates.y);
  const pixel_value = getComponentValue(Pixel, coor_entity) as any;
  let app_value, truncatedOwner;
  
  if(pixel_value){

    const address_entity = addressToEntityID(pixel_value.app);
    app_value = getComponentValue(App, address_entity) as any;
    const owner = pixel_value.owner;
    truncatedOwner = `${owner?.substring(
      0,
      6
    )}...${owner.substring(owner.length - 4)}`;
  }

  

  return (
    <div
      className={panning === false ? style.container : style.container1}
      onClick={(e) => {
        e.stopPropagation();
        setPanning(!panning);
        setPanningState(!panning);
      }}
    >
      <img
        src={panning === false ? rightIcon : leftIcon}
        alt=""
        className={panning === false ? style.pointer : style.pointer1}
      />

      {entities_app.map((entitya, index) => {
        const value = getComponentValueStrict(App, entitya) as any;
        // console.log(value)
        return (
          <div
            key={`${index}`}
            onClick={() => {
              if (loading===true) {
                return; // 禁止点击
              }
              handleIconClick(index);
              updateAbiUrl(value.manifest);
              localStorage.setItem("manifest", value.manifest);
              localStorage.setItem(
                "entityVal",
                decodeEntity({ app_addr: "address" }, entitya).app_addr
              );
            }}
            className={style.btnGame}
          >
            <div
              className={selectedIcon === index ||manifestVal?.includes(capitalizeFirstLetter(value.app_name))? style.imgCon1 : style.imgCon}
              style={{
                fontSize: "32px",
                lineHeight: "50px",
                fontFamily: "Arial Unicode MS",   
              }}
            >
                {loading === true&&manifestVal?.includes(capitalizeFirstLetter(value.app_name)) ? (
          <img
            src={loadingImg}
            alt=""
            className={`${style.commonCls1} ${style.spinAnimation}`}
          />
        ) : <>
              {value.icon && /^U\+[0-9A-Fa-f]{4,}$/.test(value.icon)
                ? String.fromCodePoint(parseInt(value.icon.substring(2), 16))
                : null}</>}
            </div>
            {panning === false ? null : (
              <span className={style.appName}>{value.app_name}</span>
            )}
          </div>
        );
      })}
      {panning === false ? (
        <div style={{ position: "fixed", bottom: "12.4px" }}>
          <span className={style.coordinates} style={{ color: "#fff" }}>
            <span className={style.a}>X:</span>
            <span className={style.fontCon}>{coordinates.x}</span>
          </span>
          <span className={style.coordinates} style={{ color: "#fff" }}>
            <span className={style.a}>Y:</span>
            <span className={style.fontCon}>{coordinates.y}</span>
          </span>
        </div>
      ) : (
        <div className={style.bottomCon}>
          <p>
            <span className={style.a}>Coordinates: </span>
            <span className={style.fontCon}>
              {coordinates.x},{coordinates.y}
            </span>
          </p>
          <p key={`Type-${coordinates.x}-${coordinates.y}`}>
            <span className={style.a}>Type: </span>
            <span className={style.fontCon}>{app_value?.app_name}</span>
            
          </p>
          <p key={`Owner-${coordinates.x}-${coordinates.y}`}>
            <span className={style.a}>Owner: </span>
            <span className={style.fontCon}> {truncatedOwner}</span>
          </p>
          {/* 不使用该方法 */}
          {/* {
            item
          } */}
          {/* {entityData.map((item: any) => {
            if (
              item.coordinates.x === coordinates.x &&
              item.coordinates.y === coordinates.y
            ) {
              const address_entity = addressToEntityID(item.value.app);
            
              const app_value = getComponentValue(App, address_entity) as any;
           
              const owner = item.value.owner;
              const truncatedOwner = `${owner.substring(
                0,
                6
              )}...${owner.substring(owner.length - 4)}`;
              return (
                <>
                  <p key={`Type-${item.coordinates.x}-${item.coordinates.y}`}>
                    <span className={style.a}>Type: </span>
                    <span className={style.fontCon}>{app_value?.app_name}</span>
                  </p>
                  <p key={`Owner-${item.coordinates.x}-${item.coordinates.y}`}>
                    <span className={style.a}>Owner: </span>
                    <span className={style.fontCon}> {truncatedOwner}</span>
                  </p>
                </>
              );
            } else {
              return null;
            }
          })} */}

          {/* {entityData.some(
            (item: any) =>
              item.coordinates.x === coordinates.x &&
              item.coordinates.y === coordinates.y
          ) ? null : (
            <>
              <p key={`Type`}>
                <span className={style.a}>Type :</span>{" "}
                <span className={style.fontCon}>null</span>
              </p>
              <p key={`Owner`}>
                <span className={style.a}>Owner :</span>
                <span className={style.fontCon}>null</span>
              </p>
            </>
          )} */}
        </div>
      )}
    </div>
  );
}

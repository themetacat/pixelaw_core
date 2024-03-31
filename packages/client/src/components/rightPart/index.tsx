import React, { createContext, useContext, useEffect, useState } from "react";
import style from "./index.module.css";
import { Has, getComponentValueStrict ,  getComponentValue} from "@latticexyz/recs";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
} from "@latticexyz/store-sync/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import leftIcon from "../../images/zuojiantou.png";
import rightIcon from "../../images/youjiantou.png";
import { Hex, fromBytes, hexToString, isHex } from "viem";
import { SetupNetworkResult } from "../../mud/setupNetwork";
import loadingImg from "../../images/loading.png";
import { hexToUtf8 } from 'web3-utils';
// import {setEntityaData } from "../herder/index"
export const ManifestContext = createContext<string>("");

interface Props {
  coordinates: { x: number; y: number };
  entityData: any;
  setPanningState: any;
  loading: any;
  onHandleExe: any;
}
export function convertToString(bytes32Value: string) {

    const byteArray = new Uint8Array(bytes32Value.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
    const filteredByteArray = byteArray.filter(byte => byte !== 0);
          const result = fromBytes(filteredByteArray, 'string');
    return result;
  }
  
export default function RightPart({
  coordinates,
  loading,
  onHandleExe,
  entityData,
  setPanningState,
}: Props) {
  const {
    components: { App, Pixel },
    systemCalls: { update_abi },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [panning, setPanning] = useState(false);
  const manifestVal = window.localStorage.getItem("manifest");

  const addressToEntityID = (address: Hex) => encodeEntity({ address: "address" }, { address });

  const coorToEntityID = (x: number, y: number) => encodeEntity({ x: "uint32", y: "uint32" }, { x, y });
  //console.log(decodeEntity({ x: "uint32", y: "uint32" }, entity));//每个块坐标

  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  const handleIconClick = (index: number, value: any) => {
    setSelectedIcon(index);
    localStorage.setItem("app_name", value.app_name);
    localStorage.setItem("system_name", value.system_name);
    localStorage.setItem("namespace", value.namespace);
    localStorage.setItem("manifest", value.manifest);
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

  function capitalizeFirstLetter(str: any) {
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
        if ((e.target as HTMLElement).classList.contains("btnGame")) {
          return;
        }
        setPanning(!panning);
        setPanningState(!panning);
      }}
    >
      <div style={{ display: "flex", position: "relative",}}>
        <img
          src={
            panning === false
              ? "https://dojo.pixelaw.xyz/assets/svg/icon_chevron_left.svg"
              : "https://dojo.pixelaw.xyz/assets/svg/icon_chevron_right.svg"
          }
          alt=""
          className={panning === false ? style.pointer : style.pointer1}
        
        />
        <div
          style={{
            backgroundColor: "#2a0d39",
            height: "100vh",
            // width: panning === true ? "180px" : "auto",
          }}
          className={style.contBox}
        >
          {entities_app.map((entitya, index) => {
            const value = getComponentValueStrict(App, entitya) as any;
            const app_name =  convertToString(entitya);

            value.app_name = app_name;

            return (
              <div
                key={`${index}`}
                onClick={(e) => {
                  if (loading === true) {
                    return; // 禁止点击
                  }
                  handleIconClick(index, value);
                  updateAbiUrl(value.manifest);
                  localStorage.setItem(
                    "entityVal",
                    decodeEntity({ app_addr: "address" }, entitya).app_addr
                  );
                  onHandleExe()
                    e.stopPropagation(); // 防止事件继续传播到外层容器
                }}
                className={style.btnGame}
                style={{marginRight:panning === false ?"0px":"35px",paddingRight: panning === false ?"0px":"15px"}}
              >
                <div
                  className={
                    selectedIcon === index ||
                    manifestVal?.includes(capitalizeFirstLetter(value.app_name))
                      ? style.imgCon1
                      : style.imgCon
                  }
                >
                  {loading === true &&
                  manifestVal?.includes(
                    capitalizeFirstLetter(value.app_name)
                  ) ? (
                    <img
                      src={loadingImg}
                      alt=""
                      className={`${style.commonCls1} ${style.spinAnimation}`}
                    />
                  ) : (
                    <div
                      style={{
                        width: "48px",
                        display: "inline-block",
                        marginRight: "15px",
                      }}
                    >
                      {value.icon && /^U\+[0-9A-Fa-f]{4,}$/.test(value.icon)
                        ? String.fromCodePoint(
                            parseInt(value.icon.substring(2), 16)
                          )
                        : null}
                    </div>
                  )}
                </div>
                {panning === false ? null : (
                  <div
                    className={
                      manifestVal?.includes(
                        capitalizeFirstLetter(value.app_name)
                      )
                        ? style.appName1
                        : style.appName
                    }
                  >
                    {value.app_name}
                  </div>
                )}
              </div>
            );
          })}
          {panning === false ? (
            <div style={{ position: "fixed", bottom: "12.4px" }}>
              <span className={style.coordinates} style={{ color: "#fff" }}>
                <span className={style.a}>x:</span>
                <span className={style.fontCon}>{coordinates.x}</span>
              </span>
              <span className={style.coordinates} style={{ color: "#fff" }}>
                <span className={style.a}>y:</span>
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
            <span className={style.fontCon}>{app_value?.app_name?app_value?.app_name:'null'}</span>

          </p>
          <p key={`Owner-${coordinates.x}-${coordinates.y}`}>
            <span className={style.a}>Owner: </span>
            <span className={style.fontCon}> {truncatedOwner?truncatedOwner:'N/A'}</span>
          </p>
              {/* {entityData.map((item: any) => {
                if (
                  item.coordinates.x === coordinates.x &&
                  item.coordinates.y === coordinates.y
                ) {
                  const entityID = addressToEntityID(item.value.app);
                  const type = `${app_info}`;
                  const owner = item.value.owner;
                  const truncatedOwner = `${owner.substring(
                    0,
                    6
                  )}...${owner.substring(owner.length - 4)}`;
                  return (
                    <>
                      <p
                        key={`Type-${item.coordinates.x}-${item.coordinates.y}`}
                      >
                        <span className={style.a}>Type: </span>
                        <span className={style.fontCon}>{type}</span>
                      </p>
                      <p
                        key={`Owner-${item.coordinates.x}-${item.coordinates.y}`}
                      >
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
      </div>
    </div>
  );
}
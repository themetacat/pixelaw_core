import React, { createContext, useContext, useEffect, useState } from "react";
import style from "./index.module.css";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
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
  onHandleExe: any;
}
export default function RightPart({
  coordinates,
  loading,
  onHandleExe,
  entityData,
  setPanningState,
}: Props) {
  const {
    components: { App },
    systemCalls: { update_abi },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [panning, setPanning] = useState(false);
  const manifestVal = window.localStorage.getItem("manifest");

  const addressToEntityID = (address: Hex) =>
    encodeEntity({ address: "address" }, { address });
  const app_info = useComponentValue(
    App,
    addressToEntityID("0xb40422217F29Ec33b4EB2b6d790b6932601671eB")
  );

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

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
            return (
              <div
                key={`${index}`}
                onClick={(e) => {
                  if (loading === true) {
                    return; // 禁止点击
                  }
                  handleIconClick(index);
                  updateAbiUrl(value.manifest);
                  localStorage.setItem("manifest", value.manifest);
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
              {entityData.map((item: any) => {
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
              })}

              {entityData.some(
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

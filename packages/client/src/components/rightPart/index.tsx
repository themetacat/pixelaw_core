import React, { createContext, useContext, useEffect, useState } from "react";
import style from "./index.module.css";
import {
  Has,
  getComponentValueStrict,
  getComponentValue,
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
import { Hex, fromBytes, hexToString, isHex } from "viem";
import { SetupNetworkResult } from "../../mud/setupNetwork";
import loadingImg from "../../images/loading.png";

import { hexToUtf8 } from "web3-utils";
import { abi_json, update_app_value } from "../../mud/createSystemCalls";
import { element } from "@rainbow-me/rainbowkit/dist/css/reset.css";
export const ManifestContext = createContext<string>("");

interface Props {
  coordinates: { x: number; y: number };
  entityData: any;
  setPanningState: any;
  loading: any;
  onUpdateAbiJson: any;
  onHandleExe: any;
  handlePageClickIs: any;
  onUpdateAbiCommonJson: any;
  onHandleLoading: any;
  onHandleLoadingFun: any;
  onHandleOwner: any;
  setPageClick: any;
}
export function convertToString(bytes32Value: string) {
  const byteArray = new Uint8Array(
    bytes32Value.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16))
  );
  const filteredByteArray = byteArray.filter((byte) => byte !== 0);
  const result = fromBytes(filteredByteArray, "string");
  return result;
}
export function coorToEntityID(x: number, y: number) {
  return encodeEntity({ x: "uint32", y: "uint32" }, { x, y });
}
export const addressToEntityID = (address: Hex) =>
  encodeEntity({ address: "address" }, { address });


export default function RightPart({
  coordinates,
  loading,
  onHandleOwner,
  onHandleExe,
  entityData,
  onUpdateAbiJson,
  setPanningState,
  handlePageClickIs,
  onHandleLoading,
  onHandleLoadingFun,
  setPageClick,
  onUpdateAbiCommonJson,
}: Props) {
  const {
    components: { App, Pixel, AppName },
    systemCalls: { update_abi },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [panning, setPanning] = useState(true);
  const loacl_app_name = window.localStorage.getItem("app_name");
  const [update_abi_jsonData, setUpdate_abi_json] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
  
  const handleIconClick = (index: number, value: any) => {

    setSelectedIcon(index);

    localStorage.setItem("app_name", value.app_name);    
    localStorage.setItem("system_name", value.system_name);
    localStorage.setItem("namespace", value.namespace);
    localStorage.setItem("manifest", value.manifest);
    update_app_value(-1)
    const newUrl = `/${value.app_name}`; // 可以根据需要修改 URL 结构   
    window.history.pushState(null, "", newUrl); //
  };

  //
  useEffect(() => {
    const handleUrlChange = () => {
      const newUrl = window.location.pathname;
      console.log("URL changed to:", newUrl);
      const appNameFromUrl = newUrl.replace(/^\//, ''); 
      localStorage.setItem("app_name", appNameFromUrl);
      entities_app.forEach((entitya:any,index:any) => {
        const value = getComponentValueStrict(App,entitya) as any;
        const app_name = convertToString(entitya);
        value.app_name =app_name as string;
        if (app_name.toLowerCase() === appNameFromUrl.toLowerCase()) {
          handleIconClick(index, value);
        }
      })
      updateAbiUrl(`BASE/${capitalizeFirstLetter(appNameFromUrl)}System`);
    };

    window.addEventListener("popstate", handleUrlChange);
    handleUrlChange(); 
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);
  
  
  const updateAbiUrl = async (manifest: string) => {
    const app_name = localStorage.getItem("app_name");
    const parts = manifest?.split("/") as any;
    let worldAbiUrl = "https://pixelaw-game.vercel.app/PaintSystem.abi.json";
    let worldCommonAbiUrl =
      "https://pixelaw-game.vercel.app/PaintSystemCommon.abi.json";
    if (manifest) {
      if (parts[0] === "BASE") {
        worldAbiUrl = ("https://pixelaw-game.vercel.app/" +
          `${parts[1].replace(/\.abi\.json/g, "")}` +
          ".abi.json") as any;
        worldCommonAbiUrl = ("https://pixelaw-game.vercel.app/" +
          `${parts[1].replace(/\.json/g, "")}` +
          "Common.json") as any;
      } else {
        worldAbiUrl = manifest;
      }
    }
    let systemData = [];
    let common_abi = [];
    if (app_name in abi_json) {
      systemData = abi_json[app_name];
    } else {
      try {
        onHandleLoadingFun();
        setPageClick();
        const response = await fetch(worldAbiUrl); 
        systemData = await response.json();
        if (systemData) {
          onHandleLoading();
          handlePageClickIs();
        }

        update_abi(systemData);
      } catch (error) {
        onHandleLoading();
        console.log("error:", error);
      }
    }

    onUpdateAbiJson(systemData);

    if (app_name + "Common" in abi_json) {
      common_abi = abi_json[app_name + "Common"];
    } else {
      try {
        const response = await fetch(worldCommonAbiUrl); 
        common_abi = await response.json();
        update_abi(common_abi, true);
      } catch (error) {
        console.log("error:", error);
      }
    }

    onUpdateAbiCommonJson(common_abi);
  };
  useEffect(() => {
    updateAbiUrl(localStorage.getItem("manifest"));
    window.localStorage.setItem("panning", true);
    if (!loacl_app_name) {
      window.localStorage.setItem("app_name", "popStar");
      window.localStorage.setItem("system_name", "PopStarSystem");
      window.localStorage.setItem("namespace", "popStar");
      window.localStorage.setItem("manifest", "BASE/PopStarSystem");
    }
  }, []);

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const coor_entity = coorToEntityID(coordinates.x, coordinates.y);
  const pixel_value = getComponentValue(Pixel, coor_entity) as any;
  let app_name, truncatedOwner;

  if (pixel_value) {
    app_name = pixel_value.app;
    const owner = pixel_value.owner;
    onHandleOwner(owner)
    truncatedOwner = `${owner?.substring(0, 6)}...${owner.substring(
      owner.length - 4
    )}`;
  }

  return (
    <div
      className={panning === false ? style.container : style.container1}
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("btnGame")) {
          return;
        }
        window.localStorage.setItem("panning", !panning);
        setPanning(!panning);
        setPanningState(!panning);
      }}
    >
      <div style={{ display: "flex", position: "relative" }}>
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
          }}
          className={panning === true ? style.contBox1 : style.contBox}
        >
          {entities_app.map((entitya, index) => {
            const value = getComponentValueStrict(App, entitya) as any;

            const app_name = convertToString(entitya);
            value.app_name = app_name as string;

            return (
              <div  
                key={`${index}`}
                onClick={(e) => {
                  if (loading === true) {
                    return;
                  }
                  handleIconClick(index, value);
                  updateAbiUrl(value.manifest);
                  localStorage.setItem(
                    "entityVal",
                    decodeEntity({ app_addr: "address" }, entitya).app_addr
                  );
                  onHandleExe();
                  e.stopPropagation();
                }}
                className={style.btnGame}
                style={{
                  marginRight: panning === false ? "0px" : "35px",
                  paddingRight: panning === false ? "0px" : "15px",
                }}
              >
                <div
                  className={
                    selectedIcon === index ||
                    loacl_app_name
                      ?.toLowerCase()===
                        capitalizeFirstLetter(
                          (value.app_name as string) !== undefined
                            ? (value.app_name as string)
                            : (value.namespace as string)
                        ).toLowerCase()
                      ? style.imgCon1
                      : style.imgCon
                  }
                >
                  {loading === true &&
                  loacl_app_name
                    ?.toLowerCase()===
                      capitalizeFirstLetter(
                        (value.app_name as string) !== undefined
                          ? (value.app_name as string)
                          : (value.namespace as string)
                      ).toLowerCase()
                     ? (
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
                        color: "white",
                        fontFamily: "NotoEmoji, sans-serif",
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
                      loacl_app_name
                        ?.toLowerCase()===
                          capitalizeFirstLetter(
                            (value.app_name as string) !== undefined
                              ? (value.app_name as string)
                              : (value.namespace as string)
                          ).toLowerCase()
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
                <span className={style.fontCon}>
                  {app_name ? app_name : "null"}
                </span>
              </p>
              <p key={`Owner-${coordinates.x}-${coordinates.y}`}>
                <span className={style.a}>Owner: </span>
                <span className={style.fontCon}>
                  {" "}
                  {truncatedOwner ? truncatedOwner : "N/A"}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

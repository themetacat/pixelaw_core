import React, { createContext, useContext, useState } from "react";
import style from "./index.module.css";
import {
  ComponentValue,
  Entity,
  Has,
  HasValue,
  getComponentValueStrict,
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
export const ManifestContext = createContext<string>("");

// function UseManifestValue() {
//   const manifestValue = useContext(ManifestContext);
//   return manifestValue;
// }
interface Props {
  coordinates: { x: number; y: number };
  entityData: any;
}
export default function RightPart({ coordinates, entityData }: Props) {
  const {
    components: { App, Pixel, AppName },
    network: { playerEntity, publicClient },
    systemCalls: { increment },
  } = useMUD();
  const [value, setValue] = useState("");
  const [manifestValue, setManifestValue] = useState("");
  const entities_app = useEntityQuery([Has(App)]);
  // const manifestValue = UseManifestValue();
  const [panning, setPanning] = useState(false);
  // console.log(coordinates,)
  // console.log(entities_app, manifestValue, "-------------------");
  const addressToEntityID = (address: Hex) =>
    encodeEntity({ address: "address" }, { address });
  const app_info = useComponentValue(
    App,
    addressToEntityID("0xb40422217F29Ec33b4EB2b6d790b6932601671eB")
  );
  // console.log(entityData, "右边！！！！");

  // console.log(app_info,66666)
  return (
    <div className={panning === false ? style.container : style.container1}>
      <img
        onClick={() => {
          setPanning(!panning);
        }}
        src={panning === false ? rightIcon :  leftIcon}
        alt=""
        className={panning === false ? style.pointer : style.pointer1}
      />
      {entities_app.map((entitya, index) => {
        const value = getComponentValueStrict(App, entitya) as any;
        return (
          <button
            key={`${index}`}
            onClick={() => {
              setManifestValue(value.manifest);
              localStorage.setItem("manifest", value.manifest);
              localStorage.setItem(
                "entityVal",
                decodeEntity({ app_addr: "address" }, entitya).app_addr
              );
            }}
          >
            <img className={style.imgCon} src={value?.icon} />
            <span>{value.app_name}</span>
          </button>
        );
      })}
      {panning === false ? (
        <div style={{ position: "fixed", bottom: "20px" }}>
          <span className={style.coordinates} style={{ color: "#fff" }}>
            <span className={style.a}>X:</span>
            {coordinates.x}
          </span>
          <span className={style.coordinates} style={{ color: "#fff" }}>
            <span className={style.a}>Y:</span>
            {coordinates.y}
          </span>
        </div>
      ) : (
        <div className={style.bottomCon}>
          <p>
            <span className={style.a}>Coordinates: </span>
            {coordinates.x},{coordinates.y}
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
                  <p key={item.coordinates.x&&item.coordinates.y}>
                    <span className={style.a}>Type: </span>
                    {type}
                  </p>
                  <p key={item.coordinates.x&&item.coordinates.y}>
                    <span className={style.a}>Owner: </span>
                    {truncatedOwner}
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
              <p>
                <span className={style.a}>Type :</span>null
              </p>
              <p>
                <span className={style.a}>Owner :</span>null
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

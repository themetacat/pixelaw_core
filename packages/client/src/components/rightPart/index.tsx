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

export const ManifestContext = createContext<string>("");

// function UseManifestValue() {
//   const manifestValue = useContext(ManifestContext);
//   return manifestValue;
// }
export default function RightPart() {
  const {
    components: { App, Pixel, AppName },
    network: { playerEntity, publicClient },
    systemCalls: { increment },
  } = useMUD();
  const [value, setValue] = useState("");
  const [manifestValue, setManifestValue] = useState("");
  const entities_app = useEntityQuery([Has(App)]);
  // const manifestValue = UseManifestValue();

  // console.log(entities_app, manifestValue, "-------------------");

  return (
    <ManifestContext.Provider value={manifestValue}>
      <div className={style.container}>
        {entities_app.map((entitya, index) => {
          // console.log(getComponentValueStrict(App, entitya));
          // console.log(decodeEntity({ app_addr: "address" }, entitya));

          const value = getComponentValueStrict(App, entitya) as any;
          return (
            <button
              key={`${index}`}
              onClick={() => {
                setManifestValue(value.manifest),
                  localStorage.setItem("manifest", value.manifest);
                localStorage.setItem(
                  "entityVal",
                  decodeEntity({ app_addr: "address" }, entitya).app_addr
                );
                // const entityIndex = entities_app.findIndex((item, idx) => idx === index); // 获取当前按钮对应的实体索引
                // localStorage.setItem("entityIndex", `${entityIndex}`);
              }}
            >
              <img className={style.imgCon} src={value?.icon} />
              <span>{value.app_name}</span>
            </button>
          );
        })}
      </div>
    </ManifestContext.Provider>
  );
}

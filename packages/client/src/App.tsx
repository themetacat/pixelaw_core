import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import Header from "./components/herder";
import toast, { Toaster } from "react-hot-toast";
import { SyncStep } from "@latticexyz/store-sync";
import style from "./app.module.css";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";

export const App = () => {
  const {
    components: {
      SyncProgress,
    },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity) as any;
  const [hoveredData, setHoveredData] = useState<{
    x: any;
    y: any;
  } | null>(null);

  const handleMouseDown = (event: any) => {
    setHoveredData(event);
  };

  return (

      <div className={style.page}>
      {syncProgress ? (
        syncProgress.step !== SyncStep.LIVE ? (
          <div style={{ color: "#fff" }} className={style.GameBoard}>
            {syncProgress.message} ({Math.floor(syncProgress.percentage)}%)
          </div>
        ) : (
          <Header hoveredData={hoveredData} handleData={handleMouseDown} />
        )
      ) : (
        <div style={{ color: "#000" }}>Hydrating from RPC(0)</div>
      )}
      <Toaster
        toastOptions={{
          duration: 2000,
          style: {
            background: "linear-gradient(90deg, #dedfff,#8083cb)",
            color: "black",
            borderRadius: "8px",
            zIndex: "999999999999",
            marginTop:"50px"
          },
        }}
      />
     
    </div>
    
  );
};

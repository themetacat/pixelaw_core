import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import Header from './components/herder'
import { Entity, Has, HasValue, getComponentValueStrict  } from "@latticexyz/recs"
import { encodeEntity, syncToRecs, decodeEntity, hexKeyTupleToEntity } from "@latticexyz/store-sync/recs";
import {Hex} from "viem";
import { ethers } from "ethers";

const stringToBytes32 = (inputString: string) => {

  // Pad the UTF-8 encoded bytes to 32 bytes
  const paddedBytes = ethers.utils.formatBytes32String(inputString);

  return paddedBytes;
};


export const App = () => {
  const {
    components: { App, Pixel, AppName },
    systemCalls: { increment },
  } = useMUD();

  const addressToEntityID = (address: Hex) => encodeEntity({ address: "address" }, { address });
  const valueToEntityID = (x: number, y: number) => encodeEntity({ x: "uint32", y: "uint32" }, { x, y });
  // const stringToEntityID = (name: string) => encodeEntity({ name: "bytes32" }, { name });
  const counter = useComponentValue(App, addressToEntityID("0x4d8E02BBfCf205828A8352Af4376b165E123D7b0"));
  const pixel = useComponentValue(Pixel, valueToEntityID(1, 2));
  // const appName = useComponentValue(AppName, hexKeyTupleToEntity(Hex["paint"]));
  const appName = useComponentValue(AppName, stringToBytes32("paint") as Entity);
  console.log(Has(Pixel));
  
  const entities = useEntityQuery([Has(Pixel)])
  entities.map((entity) =>{
    // key {x: 6, y: 2}
    console.log(decodeEntity({ x: "uint32", y: "uint32" }, entity));
    // value
    console.log(getComponentValueStrict(Pixel, entity));
    
  })

  const entities_app = useEntityQuery([Has(App)])
  entities_app.map((entity) =>{
    // key {x: 6, y: 2}
    console.log(decodeEntity({ app_addr: "address"}, entity));
    // value
    console.log(getComponentValueStrict(App, entity));
    
  })
  
  console.log(stringToBytes32("paint"));
  
  console.log(counter);
  console.log(pixel);
  console.log(appName);
  
  
  return (
    <>
    {/* <Header/> 
      {/* <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button> */}
    </>
  );
};

import React, { useEffect, useContext, useState, useCallback } from "react";
import style from "./index.module.css";
import { addressToEntityID } from "../rightPart";
import { convertToString } from "../rightPart/index";
import {
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import toast, { Toaster } from "react-hot-toast";
interface Props {
  ppp: any;
  bgfd: any;
  asfgb: any;
  mmn: any;
  enumValue: any;
  action: any;
  vbs: any;
  l: any;
  afgd: any;
  v: any;
  avb: { x: number; y: number };
}
export default function PopUpBox({
  bgfd,
  asfgb,
  mmn,
  v,
  ppp,
  vbs,
  action,
  z,
  afgd,
  l,
  enumValue,
}: Props) {
  const {
    components: { App, Pixel, AppName, Instruction },
    network: { playerEntity, publicClient, palyerAddress },
    systemCalls: { interact },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [instruC, setInstruC] = useState({});
  const [entityaData, setEntityaData] = useState("");
  const [keyDown, setKeyDown] = useState(null);
  const [formData, setFormData] = useState([]);
  const [hasRenderedSpecialContent, setHasRenderedSpecialContent] =
    useState(false);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [InputsData, setInputsData] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [content, setContent] = useState(null);
  const [resultContent, setResultContent] = useState([]);
  const [clickedButtons, setClickedButtons] = useState([]);
  const buttonInfoRef = React.useRef([]) as any;
  const app_name = localStorage.getItem("app_name");

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

 
  const [buttonInfoArray, setButtonInfoArray] = React.useState<
    { key: any; value: any }[]
  >([]);

  const onFunction = (
    numData: any,
    item: any,
    renderedInputs: any,
    InputsData: any
  ) => {
    const buttonInfo = { key: numData, value: item }; 
    l();

    const keyArray = [buttonInfo.key];

    setKeyDown(buttonInfo.key);
    setButtonInfoArray((prevArray) => {
      const newArray = [...prevArray];

      const index = newArray.findIndex((obj) => obj.key === buttonInfo.key);
      if (index !== -1) {
        newArray[index] = buttonInfo;
      } else {
        newArray.push(buttonInfo);
      }
      return newArray;
    });

    const args = [
      avb,
      palyerAddress,
      asfgb,
      action,
      buttonInfo.key,
    ];

    if (
      (renderedInputs == null && renderedInputs.length === 0) ||
      InputsData === 1
    ) {
      v(
        avb,
        palyerAddress,
        asfgb,
        action,
        keyArray
      );
      ppp();
    }
  };

  const renderInputsAndSpecialContent = (data: any) => {
    const renderedInputs: JSX.Element[] = [];
    const specialContent: JSX.Element[] = [];
    let hasRenderedSpecialContent = false; 
    const numGroups = Object.keys(data).length;
    setInputsData(numGroups);
    const r = Math.random();
    let formDataContentArr = [];
    let formDataContentObj = {};
    let formDataContent = {};

    Object.entries(data).forEach(([key, value], index) => {
      if (key === "type") {
        return;
      }
      if (
        !value.internalType.includes("struct ") &&
        !value.internalType.includes("enum ")
      ) {
        renderedInputs.push(
          <input
            key={`${key + r.toString()}`} 
            type={value.type === "number" ? "number" : "text"}
            className={style.inputData}
            placeholder={value.name.toUpperCase()}
            
            value={formData[value.name] as any}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (value.type === "number") {
                if (isNaN(Number(inputValue))) {
                  return;
                } else {
                  formDataContent[value.name] = Number(inputValue);
                }
              } else {
                formDataContent[value.name] = inputValue;
              }
              // // 如果输入框类型为 "number"，且输入值不是数字，则不更新 formData
              // if (value.type === "number" && )) {
              //   return;
              // }
            }}
          />
        );
      } else if (value.internalType.includes("enum ")) {
        if (Array.isArray(value.enum_value) && value.enum_value.length !== 0) {
          setResultContent(value as any);
          specialContent.push(
            <label className={style.direction}>{value.name}</label>
          )
          value.enum_value.forEach((eunm_value, enum_index) => {
            specialContent.push(
              <button
                ref={buttonInfoRef}
                className={style.btn}
                key={eunm_value}
                // style={{backgroundColor:  selectedButton===enum_index?'#353' :'#000'}}
                onClick={() => {
                  formDataContent[value.name] = enum_index;
                  formDataContentArr.push(key);
                  if (inputs?.length === 0 || inputs?.length === undefined) {
                    onFunction(
                      enum_index,
                      eunm_value,
                      renderedInputs,
                      numGroups
                    );
                  }
                }}
              >
                {eunm_value}
              </button>
            );
          });
        }
      } else {
        const { inputs, formContent } = renderInputsAndSpecialContent(
          value.components
        );
        formDataContent[value.name] = formContent;

        renderedInputs.push(...inputs);
      }
      if (Object.keys(formDataContent).length > 0) {
        formDataContentArr.push(formDataContent);
        // formDataContentObj[key] =formDataContent;
      }
    });

    return {
      inputs: renderedInputs,
      formContent: formDataContent,
      content: specialContent,
      formContentArr: formDataContentArr,
    };
  };

  useEffect(() => {}, [clickedButtons]);
  function handleConfirm() {
    const args = formData;

    let otherParams = [];
    const buttonInfo = buttonInfoRef.current;

    Object.entries(vbs).forEach(([key, value], index) => {
      otherParams.push(args[value.name])
    })
  

    v(
      avb,
      palyerAddress,
      asfgb,
      action,
      otherParams
    );

    ppp();
  }

  useEffect(() => {
    entities_app.map((entitya) => {
      const instruction = getComponentValue(Instruction, entitya) as any;
      const num = BigInt(entityaData);
      const result = "0x" + num?.toString(16);
      if (instruction?.instruction) {
        const value = getComponentValueStrict(App, entitya) as any;
        const app_name =  convertToString(entitya);
        // const app_name = getComponentValue(
        //   AppName,
        //   addressToEntityID(value.system_addr)
        // )?.app_name;
        instruC[app_name] = instruction?.instruction;
        setInstruC(instruC);
      }

      setEntityaData(result);
    });
   
  }, [entities_app, Instruction, entityaData]);

  const fon = async () => {
    let formContentArr = [];
    const { inputs, content, formContent } =
      renderInputsAndSpecialContent(vbs);

    setFormData(formContent);

    setInputs(inputs);

    const result = Object.values(vbs);
    const hasResultContent = result.some(
      (r) => Array.isArray(r) && r.length > 0
    );
    if (hasResultContent) {
      setResultContent(result.flat()); // 更新 resultContent 状态
    }

    setContent(content);
  };

  useEffect(() => {
    if(Object.keys(instruC).length !== 0){
      fon()
    }
  }, [instruC]);

  return (
    <div className={style.content}>
      {vbs !== null ? (
        <div className={style.btnBoxYo6jt}>
          {/* {renderInputsAndSpecialContent(vbs).inputs}*/}
       <div  className={style.inputsBox} style={{maxWidth:"460px"}}>{inputs}</div>
          {/* {resultContent.length!==0?inputs:''} */}
          <h2 className={style.title}>{instruC[app_name]}</h2>
          <div className={style.buttonContainer} style={{maxWidth:"480px"}}>{content}</div>
          {inputs?.length !== 0 || InputsData > 1 ? (
            <button onClick={handleConfirm} className={style.confirmBtn}>
              Confirm
            </button>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className={style.closeBtn}
        onClick={() => ppp()}
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
  );
}

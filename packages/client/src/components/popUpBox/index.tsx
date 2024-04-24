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
  onHandleExe: any;
  addressData: any;
  selectedColor: any;
  onHandleLoading: any;
  enumValue: any;
  action: any;
  convertedParamsData: any;
  onHandleLoadingFun: any;
  paramInputs: any;
  interactHandle: any;
  coordinates: { x: number; y: number };
}
export default function PopUpBox({
  addressData,
  selectedColor,
  onHandleLoading,
  interactHandle,
  onHandleExe,
  convertedParamsData,
  action,
  coordinates,
  paramInputs,
  onHandleLoadingFun,
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

  const handleKeyDown = (e: any) => {
    // enumValue.map((item: any, index: any) => {
    //   if (e.key.includes(item)) {
    //     switch (e.key) {
    //       case "ArrowLeft":
    //         // onHandleLeft();
    //         onFunction(index + 1, "Left", inputs);
    //         break;
    //       case "ArrowRight":
    //         onFunction(index + 1, "Right", inputs);
    //         // onHandleRight();
    //         break;
    //       case "ArrowUp":
    //         onFunction(index + 1, "Up", inputs);
    //         // onHandleUp();
    //         break;
    //       case "ArrowDown":
    //         onFunction(index + 1, "Down", inputs);
    //         // onHandleDown();
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // });
  };
  const [buttonInfoArray, setButtonInfoArray] = React.useState<
    { key: any; value: any }[]
  >([]);

  const onFunction = (
    numData: any,
    item: any,
    renderedInputs: any,
    InputsData: any
  ) => {
    const buttonInfo = { key: numData, value: item }; // 保存用户选择的按钮信息
    onHandleLoadingFun();

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
      coordinates,
      palyerAddress,
      selectedColor,
      action,
      buttonInfo.key,
    ]; // 使用buttonInfo.key作为参数之一

    if (
      (renderedInputs == null && renderedInputs.length === 0) ||
      InputsData === 1
    ) {
      interactHandle(
        coordinates,
        palyerAddress,
        selectedColor,
        action,
        keyArray
      );
      onHandleExe();
    }
  };

  // let enumItemsCount = 0; // 初始化为 0
  const renderInputsAndSpecialContent = (data: any) => {
    const renderedInputs: JSX.Element[] = [];
    // let specialContent: JSX.Element | null = null;
    const specialContent: JSX.Element[] = [];
    let hasRenderedSpecialContent = false; // 添加状态来跟踪是否已经渲染过 specialContent
    const numGroups = Object.keys(data).length;
    setInputsData(numGroups);
    // 生成一个0到1之间的随机数
    const randomNumber = Math.random();
    let formDataContentArr = [];
    let formDataContentObj = {};
    let formDataContent = {};

    Object.entries(data).forEach(([key, value], index) => {
      if (key === "type") {
        return;
      }
      // formDataContent = {};

      // 如果值不是对象，则渲染输入框
      if (
        !value.internalType.includes("struct ") &&
        !value.internalType.includes("enum ")
      ) {
        renderedInputs.push(
          <input
            key={`${key + randomNumber.toString()}`} // 使用key值和索引的组合作为唯一标识符
            type={value.type === "number" ? "number" : "text"}
            className={style.inputData}
            placeholder={value.name.toUpperCase()}
            // style={{borderRadius:"35px"}}
            // placeholder={value}
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

    Object.entries(convertedParamsData).forEach(([key, value], index) => {
      otherParams.push(args[value.name])
    })
  

    interactHandle(
      coordinates,
      palyerAddress,
      selectedColor,
      action,
      otherParams
    );

    onHandleExe();
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
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entities_app, Instruction, entityaData]);

  const fon = async () => {
    let formContentArr = [];
    const { inputs, content, formContent } =
      renderInputsAndSpecialContent(convertedParamsData);

    setFormData(formContent);

    setInputs(inputs);

    const result = Object.values(convertedParamsData);
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
      {convertedParamsData !== null ? (
        <div className={style.btnBoxYo6jt}>
          {/* {renderInputsAndSpecialContent(convertedParamsData).inputs}*/}
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
  );
}

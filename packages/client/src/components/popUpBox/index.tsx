import React, { useEffect, useContext, useState, useCallback } from "react";
import style from "./index.module.css";
import { addressToEntityID } from "../rightPart";
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
    systemCalls: { increment, interact },
  } = useMUD();
  const entities_app = useEntityQuery([Has(App)]);
  const [instruC, setInstruC] = useState({});
  const [entityaData, setEntityaData] = useState("");
  const [keyDown, setKeyDown] = useState(null);
  const [formData, setFormData] = useState([]);
  const [hasRenderedSpecialContent, setHasRenderedSpecialContent] =
    useState(false);
  const [InputsData, setInputsData] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [content, setContent] = useState(null);
  const [resultContent, setResultContent] = useState([]);
  const [clickedButtons, setClickedButtons] = useState<{ [groupIndex: number]: number }>({});
  const buttonInfoRef = React.useRef([]) as any;

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

    setKeyDown(buttonInfo.key); // 设置 keyDown 状态为按钮信息的 key 属性
    // 更新 buttonInfoArray，确保键与 numData + 1 对应
    setButtonInfoArray((prevArray) => {
      const newArray = [...prevArray];
      // 查找是否已经存在具有相同键的对象，如果是，则替换，否则添加到数组中
      const index = newArray.findIndex((obj) => obj.key === buttonInfo.key);
      if (index !== -1) {
        // 如果已经存在相同键的对象，则替换它
        newArray[index] = buttonInfo;
      } else {
        // 如果不存在相同键的对象，则添加到数组末尾
        newArray.push(buttonInfo);
      }
      //console.log(newArray, "newArray"); // 打印更新后的数组
      return newArray; // 返回更新后的数组作为状态
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
        buttonInfo.key
      );
      onHandleExe();
    }
  };
  // let enumItemsCount = 0; // 初始化为 0
  const renderInputsAndSpecialContent = (data: any, flag = false) => {
    const renderedInputs: JSX.Element[] = [];
    // let specialContent: JSX.Element | null = null;
    const specialContent: JSX.Element[] = [];
    let hasRenderedSpecialContent = false; // 添加状态来跟踪是否已经渲染过 specialContent
    const numGroups = Object.keys(data).length;
    setInputsData(numGroups);
    // 生成一个0到1之间的随机数
    const randomNumber = Math.random();
    let formDataContentArr = [];
    let formDataContent;
    console.log(data);

    Object.entries(data).forEach(([key, value], index) => {
      flag = false;
      formDataContent = {};
      if (Array.isArray(value) && value.length !== 0) {
        setResultContent(value as any);
      }
      // 如果值不是对象，则渲染输入框
      if (typeof value !== "object" || value === null) {
        renderedInputs.push(
          <input
            key={`${key + randomNumber.toString()}`} // 使用key值和索引的组合作为唯一标识符
            type={value === "number" ? "number" : "text"}
            className={style.inputData}
            placeholder={key.toUpperCase()}
            // placeholder={value}
            value={formData[key] as any}
            onChange={(e) => {
              const inputValue = e.target.value;
              formDataContent[key] = inputValue;
              // 如果输入框类型为 "number"，且输入值不是数字，则不更新 formData
              if (value === "number" && isNaN(Number(inputValue))) {
                return;
              }

              // 否则更新 formData
              // setFormData((prevFormData) => ({
              //   ...prevFormData,
              //   [key]: inputValue,
              // }));
            }}
          />
        );
      } else if (!Array.isArray(value)) {
        // 如果值是对象，则递归渲染子内容
        const { inputs, formContent } = renderInputsAndSpecialContent(
          value,
          (flag = true)
        );
        formDataContent[key] = formContent;
        renderedInputs.push(...inputs);
      }
  
      const app_name = localStorage.getItem("app_name");
      // //console.log(instruC.app_name);
      if (
        !hasRenderedSpecialContent &&
        Object.keys(value).length > 0 
        &&flag === false
      ) {
        specialContent.push(
          <div>
            <h2 className={style.title}>{instruC.app_name}</h2>
            {paramInputs.map((itemInputs: any, keyInputs: any) => {
              if (itemInputs.internalType.includes("enum ")) {
                const enumItems = enumValue[itemInputs.name]?.[itemInputs.name]?.map(
                  (item: any, key: any) => (
                    <button
                      ref={buttonInfoRef}
                      className={style.btn}
                      key={key}
                      onClick={() => {
                     // 使用数组过滤方法来筛选出包含枚举类型的项
// const enumInputs = paramInputs.filter(itemInputs => itemInputs.internalType.includes("enum ")).length;
// console.log(enumCount);

    //        const buttonIndex = key;
    //        console.log(`Clicked group ${keyInputs -1}, button ${buttonIndex}`);
             
    // // 判断formDataContentArr中是否包含数字
    // const hasNumber = formDataContentArr.some(item => typeof item === 'number');
    
    // // 如果formDataContentArr中包含数字，则先移除数字
    // if (hasNumber) {
    //   formDataContentArr = formDataContentArr.filter(item => typeof item !== 'number');
    // }
    
    // 将新的值push进formDataContentArr
    formDataContentArr.push(key);
    console.log(formDataContentArr);
    
                        if(inputs?.length  === 0||inputs?.length === undefined ){
                          onFunction(key, item, renderedInputs, numGroups)
                        }
                       
                      }}
                    >
                      {item}
                    </button>
                  )
                );
                return (
                  <React.Fragment key={`${key + randomNumber.toString()}`}>
                    <label className={style.direction}>{itemInputs.name}</label>

                    <div className={style.bottomBox}> {enumItems}</div>
                  </React.Fragment>
                );
              }
              return null; // 如果不是枚举类型，则返回 null
            })}
          </div>
        );
        hasRenderedSpecialContent = true;
        setHasRenderedSpecialContent(true);
        // 在需要提交表单时，您可以直接使用 clickedButtons 状态对象

      } else {
        if (Object.keys(formDataContent).length > 0) {
          formDataContentArr.push(formDataContent);
        }
      }
    });



    return {
      inputs: renderedInputs,
      formContent: formDataContent,
      content: specialContent,
      formContentArr: formDataContentArr,
    };
  };


  function handleConfirm() {
    // 获取表单数据
    // const formDataCopy = { ...formData };
    const args = formData;
    // console.log(formDataCopy);
    // 获取按钮点击的信息
    // const { inputs,formContentArr, content } =
    // renderInputsAndSpecialContent(convertedParamsData);
    // console.log(formDataCopy);
    console.log(9999999, formData);
    console.log(formData);

    const buttonInfo = buttonInfoRef.current;
    // const args = formDataCopy;
    // const buttonInfoArrayCopy = buttonInfoArray?.map((obj) => obj.key); // 提取每个对象的 key 属性
    // console.log(args,buttonInfoArrayCopy);
    // args.push(...buttonInfoArrayCopy);
    const result = Object.values(convertedParamsData);
    // 构建 args 数组
    console.dir(args);
    console.log(result, "resultresult");

    let sortedArgs = [];
    result.forEach((item) => {
      console.log(item);

      if (Array.isArray(item)) {
        const foundNum = args.find((arg) => typeof arg === "number");
        if (foundNum !== undefined) {
          sortedArgs.push(foundNum); // 将找到的数字推入sortedArgs中
          args.splice(args.indexOf(foundNum), 1); // 从args中移除已匹配的元素
        }
      } else if (typeof item === "object" && !Array.isArray(item)) {
        // 找到对象类型的元素
        const foundObj = args.find(
          (arg) =>
            typeof arg === "object" &&
            !Array.isArray(arg) &&
            Object.keys(arg).length
        );
        if (foundObj !== undefined) {
          sortedArgs.push(foundObj); // 将找到的对象推入sortedArgs中
          args.splice(args.indexOf(foundObj), 1); // 从args中移除已匹配的元素
        } 
      }
    });

    sortedArgs = sortedArgs.concat(args);

    // 使用 flatMap 将对象提取到一个新数组中
    const extractedObjects = sortedArgs.flatMap((item) => {
      if (typeof item === "object" && item !== null) {
        return Object.values(item); // 获取对象的值并返回
      }
      return item; // 如果不是对象，则返回空数组
    });

    console.log(extractedObjects);

    interactHandle(
      coordinates,
      palyerAddress,
      selectedColor,
      action,
      extractedObjects
    );

    onHandleExe();
  }

  useEffect(() => {
    entities_app.map((entitya) => {
      const instruction = getComponentValue(Instruction, entitya) as any;
      const num = BigInt(entityaData);
      const result = "0x" + num?.toString(16);
      //console.log(instruction?.instruction);
      if (instruction?.instruction) {
        const value = getComponentValueStrict(App, entitya) as any;
        // const app_name =  convertToString(entitya);
        const app_name = getComponentValue(
          AppName,
          addressToEntityID(value.system_addr)
        )?.app_name;
        setInstruC({ app_name: instruction?.instruction });
      }

      setEntityaData(result);
    });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entities_app, Instruction, entityaData]);

  const fon = async () => {
    //console.log("1111111111111111");
    const { inputs, formContentArr, content } =
      renderInputsAndSpecialContent(convertedParamsData);
    console.log(convertedParamsData);

    // if(Object.keys(formContent).length > 0){
    //   formData.push(formContent)
    //   console.log(formContent);
    //   const arr = Object.values(formContent);
    //   console.log(arr);

    setFormData(formContentArr);
    // }
    setInputs(inputs);
    // const result = await Promise.all(Object.values(convertedParamsData)); // 等待所有异步操作完成

    const result = Object.values(convertedParamsData);
    const hasResultContent = result.some(
      (r) => Array.isArray(r) && r.length > 0
    );
    if (hasResultContent) {
      setResultContent(result.flat()); // 更新 resultContent 状态
    }
    setContent(content);
  };

  // useEffect(() => {
  //   if(Object.keys(instruC).length !== 0){
  //     fon()
  //   }
  // }, [instruC]);

  useEffect(() => {
    fon();
    // handleConfirm()
  }, []);

  return (
    <div className={style.content}>
      {convertedParamsData !== null ? (
        <div className={style.contest}>
          {/* {renderInputsAndSpecialContent(convertedParamsData).inputs}*/}
          {inputs}
          {/* {resultContent.length!==0?inputs:''} */}
          {content}
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

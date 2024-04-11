import React, { useEffect, useContext, useState, useCallback } from "react";
import style from "./index.module.css";
import { addressToEntityID } from "../rightPart"
import { Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
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
  const [formData, setFormData] = useState({});
  const [hasRenderedSpecialContent, setHasRenderedSpecialContent] = useState(false);
  const [activeItem, setActiveItem] = useState(false);
  const [inputs, setInputs] = useState(null);
  const [content, setContent] = useState(null);
  const [resultContent, setResultContent] = useState([]);

  const buttonInfoRef = React.useRef(null) as any;

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
  
    enumValue.map((item:any,index:any)=>{
      if(  e.key.includes(item)){
        switch (e.key) {
          case "ArrowLeft":
            // onHandleLeft();
            onFunction(index+1,'Left',inputs);
            break;
          case "ArrowRight":
            onFunction(index+1,'Right',inputs);
            // onHandleRight();
            break;
          case "ArrowUp":
            onFunction(index+1,'Up',inputs);
            // onHandleUp();
            break;
          case "ArrowDown":
            onFunction(index+1,'Down',inputs);
            // onHandleDown();
            break;
          default:
            break;
        }
      }
     
    
    })

  };

  const onFunction = (numData: any,item:any,renderedInputs:any) => {
    buttonInfoRef.current = { key: numData + 1, value: item }; // 保存用户选择的按钮信息
    onHandleLoadingFun();
    setKeyDown(buttonInfoRef.current.key)
    const args = [coordinates, palyerAddress, selectedColor, action, [numData + 1]];
    console.log(args,inputs)
    console.log(   coordinates,
      palyerAddress,
      selectedColor,
      action,numData + 1
    )
    if(renderedInputs==null||renderedInputs.length===0){
      console.log('jinlail')
      interactHandle( coordinates,
        palyerAddress,
        selectedColor,
        action,numData + 1);
        onHandleExe()
    }

  };

  

  const renderInputsAndSpecialContent = (data: any) => {
    const renderedInputs: JSX.Element[] = [];
    let specialContent: JSX.Element | null = null;
    let hasRenderedSpecialContent = false; // 添加状态来跟踪是否已经渲染过 specialContent
    console.log(data)
    
    Object.entries(data).forEach(([key, value]) => {
      
        if (Array.isArray(value) && value.length !== 0){
          console.log(value);
          
          setResultContent(value as any)
          console.log(resultContent);
          
        }

      // 如果值不是对象，则渲染输入框
      if (typeof value !== 'object' || value === null) {
        renderedInputs.push(
          <input
            key={key}
            type="text"
            className={style.inputData}
            placeholder={key.toUpperCase()}
            value={formData[key] as any}
            onChange={(e) => {
              const updatedValue = e.target.value;
              // setFormData({ ...formData, [key]: updatedValue });
              
              setFormData((prevFormData) => ({ ...prevFormData, [key]: updatedValue }));
            }}
          />
        );
      }
       else if(!Array.isArray(value)) {
        // 如果值是对象，则递归渲染子内容
        const { inputs } = renderInputsAndSpecialContent(value);
        renderedInputs.push(...inputs);
      }
      // 设置特殊内容，但只有在没有渲染过且 resultContent 长度大于 0 时才渲染
    const app_name = localStorage.getItem("app_name");
    // console.log(instruC.app_name);
    
    if (!hasRenderedSpecialContent && value.length > 0) {
      specialContent = (
        <div>
          <h2 className={style.title}>{instruC.app_name}</h2>
          <div className={style.bottomBox}>
            {paramInputs.map((item: any, key: any) => {
              if (item.internalType.includes("enum ")) {
                return (
                  <label key={key} className={style.direction}>
                    {item.name}
                  </label>
                );
              }
            })}
            <div className={style.btnBox}>
              {enumValue?.map((item: any, key: any) => {
                return (
                  <button className={style.btn} key={key} onClick={() => {
                    onFunction(key , item,renderedInputs) 
                    console.log(8888888888,inputs,renderedInputs)
                    }}>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
      setHasRenderedSpecialContent(true);
    }
    });
  
    
    return { inputs: renderedInputs, content: specialContent };
  };



 function handleConfirm() {
    // 获取表单数据
    const formDataCopy = { ...formData };
console.log(formDataCopy)
    // 获取按钮点击的信息
    const buttonInfo = buttonInfoRef.current; 

    if ('x' in formDataCopy && 'y' in formDataCopy) {
        // 解构赋值获取 x 和 y 的值
        const { x, y, ...rest } = formDataCopy;

        const newData = {
            ...rest, 
            position: { x, y } 
        };

        const propertyOrder = ['for_player', 'for_app', 'position', 'color'];

        const args = [propertyOrder.reduce((obj, key) => {
            if (key === 'position') {
                obj[key] = {
                    x: newData.position.x,
                    y: newData.position.y
                };
            } else {
                obj[key] = newData[key];
            }
            return obj;
        }, {})];
        args.push(buttonInfo.key);

    interactHandle(  coordinates,
      palyerAddress,
      selectedColor,
      action,args);
    } 
    onHandleExe()

    // else {
    //     console.log('formDataCopy 中缺少 x 或 y 属性');
    // }
}

  
  useEffect(() => {

    entities_app.map((entitya) => {
      const instruction = getComponentValue(Instruction, entitya) as any;
      const num = BigInt(entityaData);
      const result = "0x" + num?.toString(16);
      console.log(instruction?.instruction);
      if(instruction?.instruction){
        const value = getComponentValueStrict(App, entitya) as any;
        // const app_name =  convertToString(entitya);
        const app_name = getComponentValue(AppName, addressToEntityID(value.system_addr))?.app_name;
        setInstruC({app_name: instruction?.instruction});
      }
      
      setEntityaData(result);
    });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entities_app, Instruction, entityaData]);


 

  

  const fon = async () => {
    const { inputs, content } = renderInputsAndSpecialContent(convertedParamsData);
    setInputs(inputs);
    // const result = await Promise.all(Object.values(convertedParamsData)); // 等待所有异步操作完成
    const result = Object.values(convertedParamsData);
    
    const hasResultContent = result.some(r => Array.isArray(r) && r.length > 0);
    if (hasResultContent) {
      setResultContent(result.flat()); // 更新 resultContent 状态
    }
    setContent(content);
  }

  useEffect(() => {
    if(Object.keys(instruC).length !== 0){
      fon()
    }
  }, [instruC]);

  return (
    <div className={style.content}>
     {convertedParamsData !== null ? (
      <div className={style.contest}>
        {/* {renderInputsAndSpecialContent(convertedParamsData).inputs}*/}
          {inputs}
          {/* {resultContent.length!==0?inputs:''} */}
          {content}
          {
            inputs?.length!==0?
            <button onClick={handleConfirm} ref={buttonInfoRef} className={style.confirmBtn}>Confirm</button>:
            null
          }
         
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

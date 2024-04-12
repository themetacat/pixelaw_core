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
  const [keyDown, setKeyDown] = useState(null);
  const [formData, setFormData] = useState({});
  const [hasRenderedSpecialContent, setHasRenderedSpecialContent] = useState(false);
  const [activeItem, setActiveItem] = useState(false);
  const [inputs, setInputs] = useState(null);
  const [content, setContent] = useState(null);
  const [resultContent, setResultContent] = useState([]);

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
  const [buttonInfoArray, setButtonInfoArray] = React.useState<{ key: any; value: any; }[]>([]);
   
  const onFunction = (numData: any, item: any, renderedInputs: any) => {
    const buttonInfo = { key: numData + 1, value: item }; // 保存用户选择的按钮信息
    onHandleLoadingFun();
    console.log(buttonInfo, 6666666);
    
    setKeyDown(buttonInfo.key); // 设置 keyDown 状态为按钮信息的 key 属性

    // 更新 buttonInfoArray，确保键与 numData + 1 对应
    setButtonInfoArray(prevArray => {
        const newArray = [...prevArray];
        // 查找是否已经存在具有相同键的对象，如果是，则替换，否则添加到数组中
        const index = newArray.findIndex(obj => obj.key === buttonInfo.key);
        if (index !== -1) {
            // 如果已经存在相同键的对象，则替换它
            newArray[index] = buttonInfo;
        } else {
            // 如果不存在相同键的对象，则添加到数组末尾
            newArray.push(buttonInfo);
        }
        console.log(newArray, 'newArray'); // 打印更新后的数组
        return newArray; // 返回更新后的数组作为状态
    });

    const args = [coordinates, palyerAddress, selectedColor, action, numData + 1];

  
    if (renderedInputs == null || renderedInputs.length === 0) {
        console.log('jinlail');
        interactHandle(coordinates, palyerAddress, selectedColor, action, numData + 1);
        onHandleExe();
    }
};

  const renderInputsAndSpecialContent = (data: any,flag=false) => {
    const renderedInputs: JSX.Element[] = [];
    // let specialContent: JSX.Element | null = null;
    const specialContent:JSX.Element[] = [];
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
            type={value === 'number'?'number':'text'}
            className={style.inputData}
            placeholder={key.toUpperCase()}
            // placeholder={value}
            value={formData[key] as any}
            onChange={(e) => {
              const inputValue = e.target.value;
              // 如果输入框类型为 "number"，且输入值不是数字，则不更新 formData
              if (value === 'number' && isNaN(Number(inputValue))) {
                console.log('能不能进来啊')
                return;
              }
              // 否则更新 formData
              setFormData((prevFormData) => ({ ...prevFormData, [key]: inputValue }));
            }}
          />
        );
      }
      
       else if(!Array.isArray(value)) {
        // 如果值是对象，则递归渲染子内容
        const { inputs } = renderInputsAndSpecialContent(value,flag=true);
        
        renderedInputs.push(...inputs);
      }
      // 设置特殊内容，但只有在没有渲染过且 resultContent 长度大于 0 时才渲染
    const app_name = localStorage.getItem("app_name");
    // console.log(instruC.app_name);
    if (!hasRenderedSpecialContent && Object.keys(value).length > 0&&flag===false) {
      specialContent.push(
        <div>
          <h2 className={style.title}>{instruC.app_name}</h2>
 
            {paramInputs.map((item: any, key: any,) => {
         
              if (item.internalType.includes("enum ")) {
            
                  const enumItems = enumValue[item.name]?.[item.name]?.map((item: any, key: any) => (
                  <button
                  ref={buttonInfoRef} 
                    className={style.btn}
                    key={key}
                    onClick={() => {
                      onFunction(key , item,renderedInputs) 
                    }}
                  >
                    {item}
                  </button>
                ));
console.log(enumItems,65545)
                return (
                  <React.Fragment key={key}>
                    <label className={style.direction}>
                      {item.name}
                    </label>
                  
                    <div className={style.bottomBox} > {enumItems}</div>
                  </React.Fragment>
                );

              }
              return null; // 如果不是枚举类型，则返回 null
            })}
           
        </div>
      );
       setHasRenderedSpecialContent(true);
    }
    });
  
    
    return { inputs: renderedInputs, content: specialContent };
  };




function handleConfirm() {
  console.log(buttonInfoArray, 'buttonInfoArray',formData);
  // 获取表单数据
  const formDataCopy = { ...formData };
console.log( buttonInfoRef.current)
  // 获取按钮点击的信息
  const buttonInfo = buttonInfoRef.current; 
  const buttonInfoArrayCopy = buttonInfoArray?.map(obj => obj.key); // 提取每个对象的 key 属性
  if ('x' in formDataCopy && 'y' in formDataCopy) {
      // 将 x 和 y 移到 position 对象中
      formDataCopy.position = { x: formDataCopy.x, y: formDataCopy.y };
      delete formDataCopy.x;
      delete formDataCopy.y;

      // 构建 args 数组
      const args = [formDataCopy];
      args.push(...buttonInfoArrayCopy);

      interactHandle(coordinates, palyerAddress, selectedColor, action, args);
  } 

  onHandleExe();
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
    console.log('1111111111111111')
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

  // useEffect(() => {
  //   if(Object.keys(instruC).length !== 0){
  //     fon()
  //   }
  // }, [instruC]);


  useEffect(() => {
      fon()
  }, []);

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
            <button onClick={handleConfirm} className={style.confirmBtn}>Confirm</button>:
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

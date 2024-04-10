import React, { useEffect, useContext, useState } from "react";
import style from "./index.module.css";

import { Has, getComponentValue } from "@latticexyz/recs";
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
  const [instruC, setInstruC] = useState(null);
  const [entityaData, setEntityaData] = useState("");
  const [formData, setFormData] = useState({});
  const [hasRenderedSpecialContent, setHasRenderedSpecialContent] = useState(false);
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

  // getFunction_param()
  // const onHandleLeft = () => {
  //   onHandleLoadingFun();
  //   // const increData = increment(
  //   //   1,
  //   //   coordinates,
  //   //   entityaData,
  //   //   palyerAddress,
  //   //   selectedColor
  //   // );
  //   interactHandle(coordinates, palyerAddress, selectedColor, "interact", 1);
  //   // const interact_data = interact(
  //   //   coordinates,
  //   //   palyerAddress,
  //   //   selectedColor,
  //   //   'interact',
  //   //   1
  //   // );
  //   // interact_data.then((increDataVal: any) => {
  //   //   increDataVal[1].then((a: any) => {
  //   //     if (a.status === "success") {
  //   //       onHandleLoading();
  //   //     } else {
  //   //       onHandleLoading();
  //   //       alert("An error was reported");
  //   //     }
  //   //   });
  //   // });
  //   onHandleExe();
  // };
  // const onHandleRight = () => {
  //   onHandleLoadingFun();
  //   interactHandle(coordinates, palyerAddress, selectedColor, "interact", 2);
  //   // const increData = increment(
  //   //   2,
  //   //   coordinates,
  //   //   entityaData,
  //   //   palyerAddress,
  //   //   selectedColor
  //   // );
  //   // increData.then((increDataVal: any) => {
  //   //   increDataVal[1].then((a: any) => {
  //   //     if (a.status === "success") {
  //   //       onHandleLoading();
  //   //     } else {
  //   //       onHandleLoading();
  //   //       toast.error("An error was reported");
  //   //     }
  //   //   });
  //   // });
  //   onHandleExe();
  // };
  // const onHandleUp = () => {
  //   onHandleLoadingFun();
  //   interactHandle(coordinates, palyerAddress, selectedColor, "interact", 3);
  //   // const increData = increment(
  //   //   3,
  //   //   coordinates,
  //   //   entityaData,
  //   //   palyerAddress,
  //   //   selectedColor
  //   // );
  //   // increData.then((increDataVal: any) => {
  //   //   increDataVal[1].then((a: any) => {
  //   //     if (a.status === "success") {
  //   //       onHandleLoading();
  //   //     } else {
  //   //       onHandleLoading();
  //   //       toast.error("An error was reported");
  //   //     }
  //   //   });
  //   // });
  //   onHandleExe();
  // };
  // const onHandleDown = () => {
  //   onHandleLoadingFun();
  //   interactHandle(coordinates, palyerAddress, selectedColor, "interact", 4);
  //   // const increData = increment(
  //   //   4,
  //   //   coordinates,
  //   //   entityaData,
  //   //   palyerAddress,
  //   //   selectedColor
  //   // );
  //   // increData.then((increDataVal: any) => {
  //   //   increDataVal[1].then((a: any) => {
  //   //     if (a.status === "success") {
  //   //       onHandleLoading();
  //   //     } else {
  //   //       onHandleLoading();
  //   //       toast.error("An error was reported");
  //   //     }
  //   //   });
  //   // });
  //   onHandleExe();
  // };

  const handleKeyDown = (e: any) => {
    switch (e.key) {
      case "ArrowLeft":
        // onHandleLeft();
        onFunction(1,'Left');
        break;
      case "ArrowRight":
        onFunction(2,'Right');
        // onHandleRight();
        break;
      case "ArrowUp":
        onFunction(3,'Up');
        // onHandleUp();
        break;
      case "ArrowDown":
        onFunction(4,'Down');
        // onHandleDown();
        break;
      default:
        break;
    }
  };

  const onFunction = (numData: any,item:any) => {
  
    buttonInfoRef.current = { key: numData + 1, value: item }; // 保存用户选择的按钮信息
    onHandleLoadingFun();
    interactHandle(coordinates, palyerAddress, selectedColor, action, numData);

  };

  const renderInputsAndSpecialContent = (data: any) => {
    const renderedInputs: JSX.Element[] = [];
    let specialContent: JSX.Element | null = null;
    let hasRenderedSpecialContent = false; // 添加状态来跟踪是否已经渲染过 specialContent
  
    Object.entries(data).forEach(([key, value]) => {
      const promiseData = Promise.resolve(value);
      promiseData.then(result => {
        if (Array.isArray(result) && result.length !== 0){
          setResultContent(result as any)
        }
  
      });

      // 如果值不是对象，则渲染输入框
      if (typeof value !== 'object' || value === null) {
        renderedInputs.push(
          <input
            key={key}
            type="text"
            className={style.inputData}
            placeholder={key.toUpperCase()}
            value={formData[key] || ''}
            onChange={(e) => {
              const updatedValue = e.target.value;
              setFormData({ ...formData, [key]: updatedValue });
            }}
          />
        );
      } else {
        // 如果值是对象，则递归渲染子内容
        const { inputs } = renderInputsAndSpecialContent(value);
        renderedInputs.push(...inputs);
      }
    });
  
    // 设置特殊内容，但只有在没有渲染过且 resultContent 长度大于 0 时才渲染
    if (!hasRenderedSpecialContent && resultContent.length > 0) {
      specialContent = (
        <div>
          <h2 className={style.title}>{instruC}</h2>
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
                  <button className={style.btn} key={key} onClick={() => { onFunction(key , item) }}>
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
    return { inputs: renderedInputs, content: specialContent };
  };
  

  useEffect(() => {
    entities_app.map((entitya) => {
      const entityaData = entities_app[0];
      const instruction = getComponentValue(Instruction, entityaData) as any;
      const num = BigInt(entityaData);
      const result = "0x" + num?.toString(16);
      setInstruC(instruction?.instruction);
      setEntityaData(result);
    });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entities_app, Instruction, entityaData]);


  function handleConfirm() {
    // 获取表单数据
    const formDataCopy = { ...formData };

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

    } 
    // else {
    //     console.log('formDataCopy 中缺少 x 或 y 属性');
    // }
}


  
  const [inputs, setInputs] = useState(null);
  const [content, setContent] = useState(null);
  const fon = async () => {
    const { inputs, content } = renderInputsAndSpecialContent(convertedParamsData);
    setInputs(inputs);
    const result = await Promise.all(Object.values(convertedParamsData)); // 等待所有异步操作完成
    const hasResultContent = result.some(r => Array.isArray(r) && r.length > 0);
    if (hasResultContent) {
      setResultContent(result.flat()); // 更新 resultContent 状态
    }
    setContent(content);
  }

  useEffect(() => {
    fon()
   // const { inputs, content } = renderInputsAndSpecialContent(convertedParamsData);
    // 其他操作...
  }, [convertedParamsData, resultContent, hasRenderedSpecialContent]);

  return (
    <div className={style.content}>
     {convertedParamsData !== null ? (
      <div className={style.contest}>
        {/* {renderInputsAndSpecialContent(convertedParamsData).inputs}*/}
          {/* {inputs} */}
          {resultContent.length!==0?inputs:''}
          {content}
          {
            inputs?.length!==0?
            <button onClick={handleConfirm} ref={buttonInfoRef} className={style.confirmBtn}>Confirm</button>:
            null
          }
         

          {/* {content} */}
      </div>
    ) : null}
    

      {/* <div>
        <h2 className={style.title}>{instruC}</h2>
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
                <button className={style.btn} key={key} onClick={()=>{onFunction(key+1)}}>
                  {item}
                </button>
              );
            })}
          </div>
      
        </div>
        </div> */}

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

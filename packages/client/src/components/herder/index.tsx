import React, { useState, useEffect, useRef, useCallback } from "react";
import style from "./index.module.css";
// import { useDrawPanel } from '@/providers/DrawPanelProvider.tsx'
import { clsx } from "clsx";
import { useRenderGrid } from "../../hooks/useRenderGrid";
import DrawPanel from "../shared/DrawPanel";
import {setupNetwork,SetupNetworkResult } from '../../mud/setupNetwork'
import {
  ComponentValue,
  Entity,
  Has,
  HasValue,
  getComponentValueStrict,
  getComponentValue
} from "@latticexyz/recs";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
  hexKeyTupleToEntity,
} from "@latticexyz/store-sync/recs";
import { formatUnits } from "viem";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import toast, { Toaster } from "react-hot-toast";
import RightPart from "../rightPart";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_ROWS_COLS,
} from "../../global/constants";
import { useMUD } from "../../MUDContext";

import PopUpBox from '../popUpBox'

import powerIcon from '../../images/jian_sekuai.png'
import AddIcon from '../../images/jia.png'
const colorOptionsData = [
  { color: "#4d4d4d", title: "Option 1" },
  { color: "#999999", title: "Option 1" },
  { color: "#ffffff", title: "Option 2" },
  { color: "#f44e3b", title: "Option 3" },
  { color: "#fe9200", title: "Option 3" },
  { color: "#fcdc00", title: "Option 3" },
  { color: "#dbdf00", title: "Option 3" },
  { color: "#a4dd00", title: "Option 3" },
  { color: "#68ccca", title: "Option 3" },
  { color: "#73d8ff", title: "Option 3" },
  { color: "#aea1ff", title: "Option 3" },
  { color: "#fda1ff", title: "Option 3" },
  { color: "#333333", title: "Option 3" },
  { color: "#808080", title: "Option 3" },
  { color: "#cccccc", title: "Option 3" },
  { color: "#d33115", title: "Option 3" },
  { color: "#e27300", title: "Option 3" },
  { color: "#fcc400", title: "Option 3" },
  { color: "#b0bc00", title: "Option 3" },
  { color: "#68bc00", title: "Option 3" },
  { color: "#16a5a5", title: "Option 3" },
  { color: "#009ce0", title: "Option 3" },
  { color: "#7b64ff", title: "Option 3" },
  { color: "#fa28ff", title: "Option 3" },
  { color: "#000000", title: "Option 3" },
  { color: "#666666", title: "Option 3" },
  { color: "#b3b3b3", title: "Option 3" },
  { color: "#9f0500", title: "Option 3" },
  { color: "#c45100", title: "Option 3" },
  { color: "#fb9e00", title: "Option 3" },
  { color: "#808900", title: "Option 3" },
  { color: "#194d33", title: "Option 3" },
  { color: "#0c797d", title: "Option 3" },
  { color: "#0062b1", title: "Option 3" },
  { color: "#653294", title: "Option 3" },
  { color: "#ab149e", title: "Option 3" },
  // 其他颜色选项...
];

interface Props {
  hoveredData: { x: number; y: number } | null;
  handleData: (data: { x: number; y: number }) => void;
  // instruction:any
}

export default function Header({ hoveredData, handleData }: Props) {
  const {
    components: { App, Pixel, AppName ,Instruction},
    network: { playerEntity, publicClient,palyerAddress },
    systemCalls: { increment },
  } = useMUD();
  const [numberData, setNumberData] = useState(50);
  const gridCanvasRef = React.useRef(null);
  const [popExhibit, setPopExhibit] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
//获取地址
  // const playerEntityNum = palyerAddress;
  // const hexString = ("0x" + playerEntityNum.toString(16)) as any;
  // console.log(palyerAddress)
  const addressData =
  palyerAddress.substring(0, 6) +
    "..." +
    palyerAddress.substring(palyerAddress.length - 4);
    //获取网络名称
  const chainName = publicClient.chain.name;
  const capitalizedString = chainName.charAt(0).toUpperCase() + chainName.slice(1).toLowerCase();
    //获取余额
    const balanceFN = publicClient.getBalance({ address: palyerAddress });
    balanceFN.then((a: any) => {
      setBalance(a);
    });
    const natIve = publicClient.chain.nativeCurrency.decimals;
  const [GRID_SIZE, setGRID_SIZE] = useState(64);
  const btnLower = () => {
    setNumberData(numberData - 5); // 每次点击减号减少5
    setGRID_SIZE(GRID_SIZE - 5);
    setScrollOffset({ x: 0, y: 0 }); // 或者根据实际情况设置合适的值
    setTranslateX(0);
    setTranslateY(0);
  };
  const btnAdd = () => {
    setNumberData(numberData + 5); // 每次点击加号增加5
    setGRID_SIZE(GRID_SIZE + 5);
    setScrollOffset({ x: 0, y: 0 }); // 或者根据实际情况设置合适的值
    setTranslateX(0);
    setTranslateY(0);
  };
  const CANVAS_WIDTH = window.innerWidth;
  // 计算每行可容纳的网格数量
  const gridCount = Math.floor(CANVAS_WIDTH / GRID_SIZE);

  // 根据每行的网格数量计算内容区域的宽度
  const CONTENT_WIDTH = gridCount * GRID_SIZE;
  // const CANVAS_WIDTH = window.innerWidth;
  // const CANVAS_HEIGHT = window.innerHeight;

  // const [offsetX, setOffsetX] = useState(0);
  // const [offsetY, setOffsetY] = useState(0);
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // const startXRef = useRef<number>(0);
  // const startYRef = useRef<number>(0);
  // const offsetXRef = useRef<number>(offsetX);
  // const offsetYRef = useRef<number>(offsetY);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  // 点击事件处理程序
  function handleColorOptionClick(color: any) {
    setSelectedColor(color);
  }

  const handleLeave = () => {
    setHoveredSquare(null);
  };
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [instruC, setInstruC] = useState('');
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  // const [receivedInstruction, setReceivedInstruction] = useState('');

  const handleInstruction = (instructionValue:any) => {
    // 在这里处理接收到的instruction值
    // console.log(instructionValue,'============================');
    // setReceivedInstruction(instructionValue);
  };
  const [receivedInstruction, setReceivedInstruction] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const networkData: SetupNetworkResult = await setupNetwork();
        // 在这里可以访问 systemContract
        setReceivedInstruction(networkData.systemContract);
      } catch (error) {
        console.error('Error setting up network:', error);
      }
    }

    fetchData();
  }, []);
  const [entityaData, setEntityaData] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleAreaRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
//console.log(Has(Pixel),'Has(Pixel)',Has(App))
  const entities = useEntityQuery([Has(Pixel)]);   
  const entities_app = useEntityQuery([Has(App)]);
  useEffect(() => {
    entities_app.map((entitya) => {
      // console.log(entities_app,3333333333)
      const entityaData = entities_app[0]
      const instruction = getComponentValue(Instruction, entityaData) as any;
      // console.log(entityaData, "=111111==========");
      const num = BigInt(entityaData); // 将 16 进制字符串转换为 BigInt 类型的数值
const result = "0x" + num.toString(16); // 将 BigInt 转换为 16 进制字符串，并添加前缀 "0x"
// console.log(result);
      setInstruC(instruction?.instruction);
      setEntityaData(result)
    });
  }, []);

  // console.log(entities,'-----')
  const entityData: { coordinates: { x: number; y: number }; value: any }[] =
    [];
  if (entities.length !== 0) {
    entities.forEach((entity) => {
      const coordinates = decodeEntity({ x: "uint32", y: "uint32" }, entity);
      const value = getComponentValueStrict(Pixel, entity);

      if(value.text === "_none"){
        value.text = ""
      }
      if(value.color === "0"){
        value.color = "#2f1643"
      }
      entityData.push({ coordinates, value }); // 将数据添加到数组中
    });

    // console.log(entityData); // 打印数组
  }

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      hoveredSquare: { x: number; y: number } | null,
      mouseX: number,
      mouseY: number
    ) => {
      // 清除之前绘制的格子
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#2e1140"; 
      for (let x = 0.5; x < 12000; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 12000);
        ctx.stroke();
      }
 
      for (let y = 0.5; y < 12000; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(12000, y);
        ctx.stroke();
      }

      ctx.font = "10px Arial";
      ctx.fillStyle = "#2f1643";

      for (let i = 0; i <= 12000 / GRID_SIZE; i++) {
        for (let j = 0; j <= 12000 / GRID_SIZE; j++) {
          ctx.fillStyle = "#2f1643"; // 设置背景色
          ctx.fillRect(
            i * GRID_SIZE - scrollOffset.x,
            j * GRID_SIZE - scrollOffset.y,
            GRID_SIZE - 1,
            GRID_SIZE - 1
          );
          const currentCoordinates = { x: i, y: j };
          const entity = entityData.find((entity) => {
            return (
              entity.coordinates.x === currentCoordinates.x &&
              entity.coordinates.y === currentCoordinates.y
            );
          });
          if (entity) {
            ctx.fillStyle = entity.value.color;
            ctx.fillRect(
              i * GRID_SIZE - scrollOffset.x,
              j * GRID_SIZE - scrollOffset.y,
              GRID_SIZE - 1,
              GRID_SIZE - 1
            );
          }
          // ctx.fillStyle = "#fff"; // 设置文字颜色
      
          // ctx.fillText(
          //   `${i},${j}`,
          //   i * GRID_SIZE + 2 - scrollOffset.x,
          //   j * GRID_SIZE + 10 - scrollOffset.y
          // );
          if (entity && entity.value.text) {
            ctx.fillStyle = "#000"; // 设置文本颜色
            ctx.fillText(
              entity.value.text,
              i * GRID_SIZE + 2 - scrollOffset.x,
              j * GRID_SIZE + 20 - scrollOffset.y
            );
          }
        }
      }

      if (selectedColor && hoveredSquare) {
        ctx.fillStyle = selectedColor;
        ctx.fillRect(
          hoveredSquare.x * GRID_SIZE - scrollOffset.x,
          hoveredSquare.y * GRID_SIZE - scrollOffset.y,
          GRID_SIZE,
          GRID_SIZE
        );
      }

      // 改变鼠标样式为小手
      if (hoveredSquare) {
        ctx.canvas.style.cursor = "pointer";
      } else {
        ctx.canvas.style.cursor = "default";
      }
    },
    [GRID_SIZE, CANVAS_WIDTH, selectedColor, entityData, scrollOffset]
  );


  const handleChildValue = ()=>{
    // console.log(1)
  }

  useEffect(() => {
    // setInstruC(instruction)
    const handleScroll = () => {
      setScrollOffset({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && entityData.length > 0) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
        drawGrid(ctx, hoveredSquare, mouseX, mouseY);
      }
    }
  }, [
    drawGrid,
    CANVAS_WIDTH,
    entityData.length,
    hoveredSquare,
    mouseX,
    mouseY,
  ]);
  const appName = localStorage.getItem('manifest')  as any
  // const appName = "BASE/Paint"
  
  const parts = appName?.split("/") as any;
  let worldAbiUrl:any;
  // console.log(parts[0]); // 输出 "Base"
  if(appName){
    if(parts[0] === 'BASE'){
      worldAbiUrl = "https://pixelaw-game.vercel.app/"+`${parts[1].replace(/\.abi\.json/g, '')}`+".abi.json" as any;
    }else{
      worldAbiUrl =appName
    }
  }else{
    worldAbiUrl="https://pixelaw-game.vercel.app/Paint.abi.json"
  }
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    //console.log("是点击事件吗");
    setTranslateX(event.clientX);
    setTranslateY(event.clientY);
    if (hoveredSquare && selectedColor) {
      // //console.log(hoveredSquare.x,hoveredSquare.y,selectedColor,)
      const increData = increment(
  null,
  receivedInstruction,
  coordinates,
  entityaData,
  palyerAddress,
selectedColor
      );
      // console.log(increData)
      // hoveredData({ x:hoveredSquare.x,y:hoveredSquare.y })
      // 调用handleData方法并传递需要的参数

      handleData(hoveredSquare);
    } else {
      //console.log("hoveredSquare或selectedColor为空");
    }
  };

  const handleMouseUp = () => {
    // console.log('我点了！！！')
    setPopExhibit(true)
    setTranslateX(0);
    setTranslateY(0);
  };
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {

      if (!visibleAreaRef.current || !canvasRef.current) return;

      const rect = visibleAreaRef.current.getBoundingClientRect();
      mouseXRef.current = event.clientX - rect.left;
      mouseYRef.current = event.clientY - rect.top;

      // 计算网格位置
      const gridX = Math.floor(mouseXRef.current / GRID_SIZE);
      const gridY = Math.floor(mouseYRef.current / GRID_SIZE);

      // 更新hoveredSquare状态
      setHoveredSquare({ x: gridX, y: gridY });

      // 绘制蓝色背景
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawGrid(ctx, hoveredSquare, mouseXRef.current, mouseYRef.current); // 重新绘制网格并传递hoveredSquare和鼠标位置
      }
    },
    [drawGrid, hoveredSquare]
  );
  const handleMouseMoveData = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {

      setMouseX(event.clientX);
      setMouseY(event.clientY);
      if (event.buttons !== 1 || !visibleAreaRef.current) return;

      const dx = event.clientX - translateX;
      const dy = event.clientY - translateY;

      setTranslateX(event.clientX);
      setTranslateY(event.clientY);

      visibleAreaRef.current.scrollLeft -= dx;
      visibleAreaRef.current.scrollTop -= dy;

      // 更新鼠标位置
      if (!canvasRef.current) return;
      const rect = visibleAreaRef.current.getBoundingClientRect();
      mouseXRef.current = event.clientX - rect.left;
      mouseYRef.current = event.clientY - rect.top;
    },
    [translateX, translateY]
  );
  useEffect(() => {
    const canvas = canvasRef.current as any;

    // 在合适的地方注册鼠标移动事件和滚动条滚动事件
    const handleMouseMove = (event: any) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const gridX = Math.floor((mouseX + scrollOffset.x) / GRID_SIZE);
      const gridY = Math.floor((mouseY + scrollOffset.y) / GRID_SIZE);
      setCoordinates({ x: gridX, y: gridY });
      setHoveredSquare({ x: gridX, y: gridY });
    };

    const handleScroll = () => {
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      setScrollOffset({ x: scrollX, y: scrollY });
    };

    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [canvasRef, scrollOffset]);

  const addressDataCopy = (text: any) => {
    navigator.clipboard.writeText(text).then(
      function () {
        toast.success("Text copied to clipboard");
      },
      function (err) {
        toast.error("Error in copying text");
      }
    );
  };



const onHandleExe= ()=>{
  // console.log('dianle')
  setPopExhibit(false)
}

  return (
    <>
    
      <div className={style.container}>
        <img  className={style.containerImg}
          // src="https://demo.pixelaw.xyz/assets/logo/pixeLaw-logo.png"
          src="https://dojo.pixelaw.xyz/assets/logo/pixeLaw-logo.png"
          alt=""
        />
        <div className={style.content}>
          <button  className={style.btnBox}
            disabled={numberData === 25}
            onClick={btnLower}
          >
           <img  className={numberData === 25?style.gray:style.btn1} src={powerIcon} alt="" /> 
          </button>
          <span className={style.spanData}>{numberData}%</span>
          <button
            className={style.btnBox}
            disabled={numberData === 100}
            onClick={btnAdd}
          >
            <img  className={numberData === 100?style.gray:style.btn1} src={AddIcon} alt="" />
          </button>
          
        </div>
        {/* <button
        style={{zIndex: "9999999999"}}
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          // console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button> */}
        <div
          className={style.addr}
          style={{
            cursor: "pointer",
            marginLeft: "32px",
          }}
       
        >
          <span>{capitalizedString}</span>
          <span    onClick={() => {
            addressDataCopy(palyerAddress);
          }} className={style.balanceNum}>{addressData}</span>
          <span className={style.balanceNum}> {publicClient && balance != null ? (
                  <>
                    {formatUnits(balance, natIve).replace(
                      /(\.\d{4})\d+$/,
                      "$1"
                    )}{" "}
                    {publicClient.chain.nativeCurrency.symbol}
                  </>
                ) : null}</span>
        </div>
     
      </div>
<div style={{display:'flex'}}>
      <div
        style={{
          width: `calc(100vw)`,
          overflow: "hidden",
          position: "relative",
          display: "flex",
        }}
        className={style.bodyCon}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMoveData}
        onMouseLeave={handleLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div
          ref={visibleAreaRef}
          className={style.canvasWrapper}
          style={{
            width: `${CONTENT_WIDTH}px`,
            height: `900px`,
            overflow: "auto",
          }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_WIDTH}
            style={{ border: "1px solid black" }}
          />
        
        </div>
     
      </div>
      <div
        style={{
          position: "absolute",
          left: "5%",
          bottom: "0px",
          cursor: "pointer",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor:"#230732",
          padding:"6px 6px 6px 6px"
        }}
      >
        {Array.from(colorOptionsData).map((option, index) => (
          <span
            key={index}
            className={`color-option${
              selectedColor === option.color ? " selected" : ""
            }`}
            data-color={option.color}
            style={{
              backgroundColor: option.color,
              width: "48px",
              height: "48px",
              display: "inline-block",
            }}
            onClick={() => handleColorOptionClick(option.color)}
          >                                                             
            {selectedColor === option.color && (
              <div
                className="selected-circle"
                style={{
                  backgroundColor: "black",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  margin: "5px auto",
                }}
              ></div>
            )}
          </span>
        ))}
      </div>

        <RightPart coordinates={coordinates} entityData={entityData}/>
    
      </div>
      {localStorage.getItem('manifest')?.includes('Snake')&&popExhibit === true ? <PopUpBox addressData={addressData} coordinates={coordinates}  onHandleExe={onHandleExe} selectedColor={selectedColor}/>:''}
    </>
  );
}

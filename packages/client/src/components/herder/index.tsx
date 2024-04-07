import React, { useState, useEffect, useRef, useCallback } from "react";
import style from "./index.module.css";
import {
  Has,
  getComponentValueStrict,
  getComponentValue,
  AnyComponentValue,
} from "@latticexyz/recs";
import { formatUnits } from "viem";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import toast, { Toaster } from "react-hot-toast";
import RightPart from "../rightPart";
import { useMUD } from "../../MUDContext";
import {convertToString, coorToEntityID} from "../rightPart/index"
import PopUpBox from "../popUpBox";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
} from "@latticexyz/store-sync/recs";
import powerIcon from "../../images/jian_sekuai.png";
import AddIcon from "../../images/jia.png";
import { CANVAS_HEIGHT } from "../../global/constants";
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
    components: { App, Pixel, AppName, Instruction },
    network: { playerEntity, publicClient, palyerAddress },
    systemCalls: { increment, interact },
  } = useMUD();

  const [numberData, setNumberData] = useState(25);
  const gridCanvasRef = React.useRef(null);
  const [popExhibit, setPopExhibit] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [instruC, setInstruC] = useState("");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [coordinatesData, setCoordinatesData] = useState({ x: 0, y: 0 });
  const [entityaData, setEntityaData] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleAreaRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [panningFromChild, setPanningFromChild] = useState(false);
  const [GRID_SIZE, setGRID_SIZE] = useState(30);
  const entities = useEntityQuery([Has(Pixel)]);
  const entities_app = useEntityQuery([Has(App)]);
  const CANVAS_WIDTH = document.documentElement.clientWidth; // 获取整个页面的宽度
  const CANVAS_HEIGHT = document.documentElement.clientHeight; // 获取整个页面的高度
  const gridCount = Math.floor(CANVAS_WIDTH / GRID_SIZE);
  const CONTENT_WIDTH = gridCount * GRID_SIZE;
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const hoveredSquareRef = useRef<{ x: number; y: number } | null>(null);

  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  // const coorToEntityID = (x: number, y: number) => encodeEntity({ x: "uint32", y: "uint32" }, { x, y });

  const addressData =
    palyerAddress.substring(0, 6) +
    "..." +
    palyerAddress.substring(palyerAddress.length - 4);
  //获取网络名称
  const chainName = publicClient.chain.name;
  const capitalizedString =
    chainName.charAt(0).toUpperCase() + chainName.slice(1).toLowerCase();
  //获取余额
  const balanceFN = publicClient.getBalance({ address: palyerAddress });
  balanceFN.then((a: any) => {
    setBalance(a);
  });
  const natIve = publicClient.chain.nativeCurrency.decimals;
  const btnLower = () => {
    setNumberData(numberData - 5);
    setGRID_SIZE(GRID_SIZE - 5);
    setScrollOffset({ x: 0, y: 0 });
    setTranslateX(0);
    setTranslateY(0);
  };
  const btnAdd = () => {
    setNumberData(numberData + 5);
    setGRID_SIZE(GRID_SIZE + 5);
    setScrollOffset({ x: 0, y: 0 });
    setTranslateX(0);
    setTranslateY(0);
  };

  function handleColorOptionClick(color: any) {
    setSelectedColor(color);
  }

  const handleLeave = () => {
    setHoveredSquare(null);
    if (downTimerRef.current) {
      clearTimeout(downTimerRef.current);
      downTimerRef.current = null;
    }
    setIsLongPress(false);
  };

  // //console.log(entities,'-----')
  const entityData: { coordinates: { x: number; y: number }; value: any }[] =
    [];
  if (entities.length !== 0) {
    entities.forEach((entity) => {
      const coordinates = decodeEntity({ x: "uint32", y: "uint32" }, entity);
      const value = getComponentValueStrict(Pixel, entity);
      if (value.text === "_none") {
        value.text = "";
      }
      if (value.color === "0") {
        value.color = "#2f1643";
      }
      entityData.push({ coordinates, value }); // 将数据添加到数组中
    });

    //console.log(entityData); // 打印数组
  }

  // const drawGrid = useCallback(
  //   (
  //     ctx: CanvasRenderingContext2D,
  //     hoveredSquare: { x: number; y: number } | null,
  //     mouseX: number,
  //     mouseY: number
  //   ) => {
  //     // 清除之前绘制的格子
  //     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
  //     ctx.lineWidth = 10;
  //     ctx.strokeStyle = "#2e1140";
  //     for (let x = 0.5; x < CANVAS_WIDTH; x += GRID_SIZE) {
  //       ctx.beginPath();
  //       ctx.moveTo(x, 0);
  //       ctx.lineTo(x, CANVAS_WIDTH);
  //       ctx.stroke();
  //     }

  //     for (let y = 0.5; y < CANVAS_WIDTH; y += GRID_SIZE) {
  //       ctx.beginPath();
  //       ctx.moveTo(0, y);
  //       ctx.lineTo(CANVAS_WIDTH, y);
  //       ctx.stroke();
  //     }

  //     ctx.font = "10px Arial";
  //     ctx.fillStyle = "#2f1643";

  //     for (let i = 0; i <= CANVAS_WIDTH / GRID_SIZE; i++) {
  //       for (let j = 0; j <= CANVAS_WIDTH / GRID_SIZE; j++) {
  //         ctx.fillStyle = "#2f1643"; // 设置背景色
  //         ctx.fillRect(
  //           i * GRID_SIZE - scrollOffset.x,
  //           j * GRID_SIZE - scrollOffset.y,
  //           GRID_SIZE - 1,
  //           GRID_SIZE - 1
  //         );
  //         const currentCoordinates = { x: i, y: j };
  //         const entity = entityData.find((entity) => {
  //           return (
  //             entity.coordinates.x === currentCoordinates.x &&
  //             entity.coordinates.y === currentCoordinates.y
  //           );
  //         });
  //         if (entity) {
  //           ctx.fillStyle = entity.value.color;
  //           ctx.fillRect(
  //             i * GRID_SIZE - scrollOffset.x,
  //             j * GRID_SIZE - scrollOffset.y,
  //             GRID_SIZE - 1,
  //             GRID_SIZE - 1
  //           );
  //         }
  //         if (entity && entity.value.text) {
  //           ctx.fillStyle = "#000"; // 设置文本颜色
  //           ctx.fillText(
  //             entity.value.text,
  //             i * GRID_SIZE + 2 - scrollOffset.x,
  //             j * GRID_SIZE + 20 - scrollOffset.y
  //           );
  //         }
  //       }
  //     }

  //     if (selectedColor && hoveredSquare) {
  //       ctx.fillStyle = selectedColor;
  //       ctx.fillRect(
  //         hoveredSquare.x * GRID_SIZE - scrollOffset.x,
  //         hoveredSquare.y * GRID_SIZE - scrollOffset.y,
  //         GRID_SIZE,
  //         GRID_SIZE
  //       );
  //     }

  //     if (hoveredSquare) {
  //       ctx.canvas.style.cursor = "pointer";
  //     } else {
  //       ctx.canvas.style.cursor = "default";
  //     }
  //   },
  //   [GRID_SIZE, CANVAS_WIDTH, selectedColor, entityData, scrollOffset]
  // );
  //console.log(entityData)
  const getEntityAtCoordinates = (x: number, y: number) => {
    return entityData.find(
      (entity) => entity.coordinates.x === x && entity.coordinates.y === y
    );
  };
  const appName = localStorage.getItem("manifest") as any;
  // const appName = "BASE/Paint"

  const parts = appName?.split("/") as any;
  let worldAbiUrl: any;
  // //console.log(parts[0]); // 输出 "Base"
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

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      hoveredSquare: { x: number; y: number } | null,
      mouseX: number,
      mouseY: number
    ) => {
      let pix_text ;
      // setHoveredSquare(hoveredSquare)
      // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      //console.log(hoveredSquare,99999,coordinates,selectedColor)
      // 填充整个画布背景色
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.lineWidth = 10;
      ctx.strokeStyle  = "#000000";
      
      // 绘制竖条纹
      for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x - scrollOffset.x, 0);
        ctx.lineTo(x - scrollOffset.x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      // 绘制横条纹
      for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y - scrollOffset.y);
        ctx.lineTo(CANVAS_WIDTH, y - scrollOffset.y);
        ctx.stroke();
      }
      ctx.font = "10px Arial";
      const visibleArea = {
        x: Math.max(0, Math.floor(scrollOffset.x / GRID_SIZE)),
        y: Math.max(0, Math.floor(scrollOffset.y / GRID_SIZE)),
        width: Math.ceil(document.documentElement.clientWidth / GRID_SIZE),
        height: Math.ceil(document.documentElement.clientHeight / GRID_SIZE),
      };
      for (let i = visibleArea.x; i < visibleArea.x + visibleArea.width; i++) {
        for (
          let j = visibleArea.y;
          j < visibleArea.y + visibleArea.height;
          j++
        ) {
          const currentX = i * GRID_SIZE - scrollOffset.x;
          const currentY = j * GRID_SIZE - scrollOffset.y;
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#2e1043";
          ctx.strokeRect(currentX, currentY, GRID_SIZE, GRID_SIZE);
  
          // 绘制背景色
          ctx.fillStyle = "#2f1643";
          ctx.fillRect(currentX, currentY, GRID_SIZE, GRID_SIZE);

          const entity = getEntityAtCoordinates(i, j);

          if (entity) {
            ctx.fillStyle = entity.value.color;
            ctx.fillRect(currentX, currentY, GRID_SIZE, GRID_SIZE);
            if (entity.value.text) {
              ctx.fillStyle = "#000"; // 设置文本颜色
              ctx.textAlign = "center"; // 设置文本水平居中
              ctx.textBaseline = "middle"; // 设置文本垂直居中
   
              if(entity.value.text && /^U\+[0-9A-Fa-f]{4,}$/.test(entity.value.text)){
                pix_text = String.fromCodePoint(parseInt(entity.value.text.substring(2), 16));
              }else{
                pix_text = entity.value.text
              }
              const textX = currentX + GRID_SIZE / 2;
              const textY = currentY + GRID_SIZE / 2;
              // ctx.fillText(pix_text, currentX + 2, currentY + 20);
              ctx.fillText(pix_text, textX, textY);
            }
          }
        }
      }

      if (selectedColor && hoveredSquare) {
        //console.log(hoveredSquare)
        //console.log(coordinates.x * GRID_SIZE - scrollOffset.x,
        // coordinates.y * GRID_SIZE - scrollOffset.y,6968888)
        ctx.fillStyle = selectedColor;
        ctx.fillRect(
          coordinates.x * GRID_SIZE - scrollOffset.x,
          coordinates.y * GRID_SIZE - scrollOffset.y,
          GRID_SIZE,
          GRID_SIZE
        );
      }

      if (hoveredSquare) {
        ctx.canvas.style.cursor = "pointer";
      } else {
        ctx.canvas.style.cursor = "default";
      }
    },
    [
      GRID_SIZE,
      coordinates,
      CANVAS_WIDTH,
      getEntityAtCoordinates,
      CANVAS_HEIGHT,
      selectedColor,
      scrollOffset,
    ]
  );

  // let timer: NodeJS.Timeout | null = null;
  // let isLongPress = false;
  const LongPressThreshold = 500; // 定义长按的时间阈值，单位为毫秒
  let timeout: NodeJS.Timeout;
  const [isDragging, setIsDragging] = useState(false);
  const downTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastDragEndX, setLastDragEndX] = useState(0);
const [lastDragEndY, setLastDragEndY] = useState(0);
  const ClickThreshold = 300; // 定义点击的时间阈值，单位为毫秒
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setTranslateX(event.clientX);
    setTranslateY(event.clientY);
    downTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      // 这里执行长按事件逻辑
      // console.log("长按");
    }, ClickThreshold);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    //console.log('我点了！！！')
    setIsLongPress(false);
    setIsDragging(false);
  
    if (downTimerRef.current) {
      clearTimeout(downTimerRef.current);
      downTimerRef.current = null;
    }
    if (!isLongPress) {
      // console.log("我点了！！！");
    }
    if (isLongPress) {
      // 长按事件的逻辑
      // console.log("长按事件的逻辑");
      setIsLongPress(false);
      setIsDragging(false);
      
    } else {
      // 点击事件的逻辑
      // console.log("点击事件的逻辑");
   
      const canvas = canvasRef.current as any;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const gridX = Math.floor(mouseX / GRID_SIZE);
      const gridY = Math.floor(mouseY / GRID_SIZE);
      setCoordinatesData({ x: gridX, y: gridY });
      const newHoveredSquare = { x: gridX, y: gridY };
      setHoveredSquare(newHoveredSquare);

      if (selectedColor && coordinates) {
        hoveredSquareRef.current = coordinates;
        if (parts[1] !== "Snake") {
          setLoading(true);
          setIsDragging(false);
          // const increData = increment(
          //   null,
          //   coordinates,
          //   entityaData,
          //   palyerAddress,
          //   selectedColor
          // );
          const coor_entity = coorToEntityID(coordinates.x, coordinates.y);
          const pixel_value = getComponentValue(Pixel, coor_entity) as any;
          const action = pixel_value && pixel_value.action ? pixel_value.action : 'interact';
          
          const interact_data = interact(
            coordinates,
            palyerAddress,
            selectedColor,
            action,
            null
          );
          interact_data.then((increDataVal: any) => {

            if (increDataVal[1]) {
              increDataVal[1].then((a: any) => {
                if (a.status === "success") {
                  setLoading(false);
                } else {
                  handleError();
                }
              });
            } else {
              handleError();
            }
          });
        }
        mouseXRef.current = mouseX;
        mouseYRef.current = mouseY;
        handleData(hoveredSquare as any);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const { x, y } = coordinates;
          ctx.fillStyle = selectedColor;
          ctx.fillRect(
            x * GRID_SIZE - scrollOffset.x,
            y * GRID_SIZE - scrollOffset.y,
            GRID_SIZE,
            GRID_SIZE
          );
          drawGrid(ctx, coordinates, mouseXRef.current, mouseYRef.current);
        }
      } else {
        ////console.log("hoveredSquare或selectedColor为空");
      }
      setIsDragging(false);
      setPopExhibit(true);
      setShowOverlay(true);
      if (parts[1] !== "Snake") {
        setLoading(true);
      }

      // e.stopPropagation();
      setTranslateX(0);
      setTranslateY(0);
    }
  };

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
      if (!visibleAreaRef.current || !isDragging) return;

      const dx =  translateX-event.clientX ;
      const dy =  translateY-event.clientY ;

      setTranslateX(event.clientX);
      setTranslateY(event.clientY);

      setScrollOffset((prevOffset) => ({
        x: Math.max(0, prevOffset.x + dx),
        y: Math.max(0, prevOffset.y + dy),
      }));

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        setMouseX(mouseX);
        setMouseY(mouseY);

        const gridX = Math.floor((mouseX + scrollOffset.x) / GRID_SIZE);
        const gridY = Math.floor((mouseY + scrollOffset.y) / GRID_SIZE);

        setHoveredSquare({ x: gridX, y: gridY });
     
        const ctx = canvas.getContext("2d");
        if (ctx) {
          drawGrid(ctx, hoveredSquare, mouseX, mouseY); // 重新绘制画布并传入更新后的参数
        }
      }
    },
    [
      translateX,
      translateY,
      visibleAreaRef,
      drawGrid,
      hoveredSquare,
      isDragging,
      scrollOffset,
      GRID_SIZE,
    ]
  );
  const get_function_param = async(abi_json:any[], function_name: string, common_json: string) => {
    // const response = await fetch(abi_url); // 获取 ABI JSON 文件
    // const systemData = await response.json();
    if(!abi_json){
      return []
    }
    if(!function_name){
      return []
    }
    let funciont_def = abi_json.filter(entry => entry.name === function_name && entry.type === 'function');
    if (!funciont_def) {
      funciont_def = abi_json.filter(entry => entry.name === 'interact' && entry.type === 'function');
      if (!funciont_def) {
        return []
      }
    }

  }

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

  const handlePanningChange = (newPanningValue: any) => {
    // //console.log(newPanningValue)
    setPopExhibit(false);
    setShowOverlay(false);
    setPanningFromChild(newPanningValue);
  };
  const handleError = () => {
    setLoading(false);
    onHandleLoading();
    toast.error("An error was reported");
  };
  

  const onHandleExe = () => {
    // //console.log('dianle')
    setPopExhibit(false);
    setShowOverlay(false);
    // setLoading(false)
  };

  const onHandleLoading = () => {
    setLoading(false);
  };

  const onHandleLoadingFun = () => {
    setLoading(true);
  };

  useEffect(() => {
    entities_app.map((entitya) => {
     
      const instruction = getComponentValue(Instruction, entitya) as any;
      if(instruction?.instruction){
        // ！！！要用对象存值，有n个游戏存在instruction
        setInstruC(instruction?.instruction);
      }
      const result = convertToString(entitya);
      setEntityaData(result);

    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && entityData.length > 0) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        //console.log(coordinates,'-----',coordinates)
        // setHoveredSquare(hoveredSquareRef.current)
        // setHoveredSquare(coordinates)
        drawGrid(ctx, hoveredSquare, mouseX, mouseY);
      }
    }
  }, [
    drawGrid,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    entityData.length,
    hoveredSquare,
    mouseX,
    mouseY,
  ]);

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

      // setHoveredSquare({ x: gridX, y: gridY });
      hoveredSquareRef.current = { x: gridX, y: gridY };
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

  return (
    <>
      <div className={style.container}>
        <img
          className={style.containerImg}
          src="https://dojo.pixelaw.xyz/assets/logo/pixeLaw-logo.png"
          alt=""
        />
        <div className={style.content}>
          <button
            className={numberData === 25 ? style.btnBoxY : style.btnBox}
            disabled={numberData === 25}
            onClick={btnLower}
          >
            −
          </button>
          <span className={style.spanData}>{numberData}%</span>
          <button
            className={numberData === 100 ? style.btnBoxY : style.btnBox}
            disabled={numberData === 100}
            onClick={btnAdd}
          >
            +
          </button>
        </div>
  
        <div
          className={style.addr}
          style={{
            cursor: "pointer",
            marginLeft: "32px",
          }}
        >
          {/* <span>{capitalizedString}</span> */}
          <span
            onClick={() => {
              addressDataCopy(palyerAddress);
            }}
            className={style.balanceNum}
          >
            {addressData}
          </span>
          <span className={style.balanceNum}>
            {" "}
            {publicClient && balance != null ? (
              <>
                {formatUnits(balance, natIve).replace(/(\.\d{4})\d+$/, "$1")}{" "}
                {publicClient.chain.nativeCurrency.symbol}
              </>
            ) : null}
          </span>
        </div>
      </div>
      
      <div style={{ display: "flex" }}>
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
              // overflow: "auto",
            }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_WIDTH}
              // style={{ border: "1px solid black" }}
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
            backgroundColor: "#230732",
            padding: "6px 6px 6px 6px",
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
        <RightPart
          coordinates={coordinates}
          entityData={entityData}
          setPanningState={handlePanningChange}
          loading={loading}
          onHandleExe={onHandleExe}
        />
      </div>



      {localStorage.getItem("manifest")?.includes("Snake") &&
      popExhibit === true ? (
        <>
          {showOverlay && <div className={style.overlay} />}
          <PopUpBox
            addressData={addressData}
            coordinates={coordinates}
            onHandleExe={onHandleExe}
            selectedColor={selectedColor}
            onHandleLoading={onHandleLoading}
            onHandleLoadingFun={onHandleLoadingFun}
          />
        </>
      ) : (
        ""
      )}

            {/* <div className={style.loadingContainer}>
        {" "}
        {loading === true ? (
          <img
            src={loadingImg}
            alt=""
            className={`${style.commonCls1} ${style.spinAnimation}`}
          />
        ) : null}
      </div> */}
    </>
  );
}

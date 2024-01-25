import React, { useState, useEffect, useRef,useCallback } from "react";
import style from "./index.module.css";
// import { useDrawPanel } from '@/providers/DrawPanelProvider.tsx'
import { clsx } from "clsx";
import { useRenderGrid } from "../../hooks/useRenderGrid";
import DrawPanel from "../shared/DrawPanel";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_ROWS_COLS,
} from "../../global/constants";
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

export default function Header() {
 
  const [numberData, setNumberData] = useState(50);
  const gridCanvasRef = React.useRef(null);
  const [panning, setPanning] = useState(false);

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
  const renderGrid = useRenderGrid();
  const CANVAS_WIDTH = window.innerWidth;
  // 计算每行可容纳的网格数量
  const gridCount = Math.floor(CANVAS_WIDTH / GRID_SIZE);
  
  // 根据每行的网格数量计算内容区域的宽度
  const CONTENT_WIDTH = gridCount * GRID_SIZE;
  // const CANVAS_WIDTH = window.innerWidth;
  // const CANVAS_HEIGHT = window.innerHeight;

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const offsetXRef = useRef<number>(offsetX);
  const offsetYRef = useRef<number>(offsetY);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  // // 为每个颜色选项添加点击事件监听器
  // const colorOptions = document.querySelectorAll('.color-option');
  // colorOptions.forEach((option) => {
  //   option.addEventListener('click', handleColorOptionClick);
  // });
  // 点击事件处理程序
  function handleColorOptionClick(color: any) {
    setSelectedColor(color);
  }

  // useEffect(() => {
  //   const canvas = gridCanvasRef.current as any;
  //   const ctx = canvas.getContext("2d");

  //   // 设置画布大小
  //   canvas.width = CANVAS_WIDTH;
  //   canvas.height = CANVAS_HEIGHT;

  //   // 清空画布
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   // 移动画布坐标系

  //   ctx.translate(offsetX, offsetY);
  //   // 绘制小方格
  //   for (let x = GRID_SIZE; x <= CANVAS_WIDTH; x += GRID_SIZE) {
  //     for (let y = GRID_SIZE; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
  //       ctx.strokeStyle = "#ffffff";
  //       ctx.fillStyle = "#2f1643";
  //       ctx.strokeRect(x - GRID_SIZE, y - GRID_SIZE, GRID_SIZE, GRID_SIZE);
  //       ctx.fillRect(x - GRID_SIZE, y - GRID_SIZE, GRID_SIZE, GRID_SIZE);
  //     }
  //   }

  //   // 绘制鼠标悬停的方格背景色为蓝色
  //   if (hoveredSquare) {
  //     const { x, y } = hoveredSquare;
  //     ctx.fillStyle = selectedColor;
  //     ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
  //   }

  //   // 检查鼠标位置是否在画布范围内
  // }, [
  //   hoveredSquare,
  //   offsetX,
  //   offsetY,
  //   selectedColor,
  //   CANVAS_HEIGHT,
  //   CANVAS_WIDTH,
  //   GRID_SIZE,
  // ]);
  // const handleMouseDown = (event: any) => {
  //   setPanning(true);
  //   startXRef.current = event.clientX;
  //   startYRef.current = event.clientY;
  // };
  // const handleMouseMove = (event: any) => {
  //   const canvas = gridCanvasRef.current as any;
  //   const rect = canvas.getBoundingClientRect();
  //   const mouseX = event.clientX - rect.left;
  //   const mouseY = event.clientY - rect.top;

  //   if (panning) {
  //     const offsetXChange = event.clientX - startXRef.current;
  //     const offsetYChange = event.clientY - startYRef.current;
  //     setOffsetX((prevOffsetX) => prevOffsetX + offsetXChange);
  //     setOffsetY((prevOffsetY) => prevOffsetY + offsetYChange);
  //     startXRef.current = event.clientX;
  //     startYRef.current = event.clientY;
  //   }

  //   if (
  //     mouseX >= 0 &&
  //     mouseY >= 0 &&
  //     mouseX <= canvas.width &&
  //     mouseY <= canvas.height
  //   ) {
  //     const squareX = Math.floor((mouseX - offsetX) / GRID_SIZE) * GRID_SIZE;
  //     const squareY = Math.floor((mouseY - offsetY) / GRID_SIZE) * GRID_SIZE;

  //     setHoveredSquare({ x: squareX, y: squareY });
  //   } else {
  //     setHoveredSquare(null);
  //   }
  // };

  // const handleMouseUp = () => {
  //   offsetXRef.current = offsetX;
  //   offsetYRef.current = offsetY;
  //   startXRef.current = 0;
  //   startYRef.current = 0;
  //   setPanning(false);
  // };
  const handleLeave = () => {
    setHoveredSquare(null);
  };
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleAreaRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
 const drawGrid = useCallback(
  (
    ctx: CanvasRenderingContext2D,
    hoveredSquare: { x: number; y: number } | null,
    mouseX: number,
    mouseY: number
  ) => {
    // 清除之前绘制的格子
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black"; // 将网格线颜色设置为黑色

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
        ctx.fillStyle = "#fff"; // 设置文字颜色
        ctx.fillText(
          `${i},${j}`,
          i * GRID_SIZE + 2 - scrollOffset.x,
          j * GRID_SIZE + 10 - scrollOffset.y
        );
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
  [GRID_SIZE, CANVAS_WIDTH, selectedColor, scrollOffset]
);

  
  

  useEffect(() => {
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
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
      drawGrid(ctx, hoveredSquare, mouseX, mouseY);
    }
  }
}, [drawGrid,CANVAS_WIDTH, hoveredSquare, mouseX, mouseY]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setTranslateX(event.clientX);
    setTranslateY(event.clientY);
  };

  const handleMouseUp = () => {
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
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
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
  }, [translateX, translateY]);
  useEffect(() => {
    const canvas = canvasRef.current as any;
  
    // 在合适的地方注册鼠标移动事件和滚动条滚动事件
    const handleMouseMove = (event:any) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
  
      const gridX = Math.floor((mouseX + scrollOffset.x) / GRID_SIZE);
      const gridY = Math.floor((mouseY + scrollOffset.y) / GRID_SIZE);
  
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
  
  return (
    <>
      <div className={style.container}>
        <img
          src="https://demo.pixelaw.xyz/assets/logo/pixeLaw-logo.png"
          alt=""
        />
        <div className={style.content}>
          <button
            className={style.btn1}
            disabled={numberData === 25}
            onClick={btnLower}
          >
            -
          </button>
          <span className={style.spanData}>{numberData}%</span>
          <button
            className={style.btn1}
            disabled={numberData === 100}
            onClick={btnAdd}
          >
            +
          </button>
        </div>
        <div className={style.addr}>address</div>
      </div>

      {/* <DrawPanel/> */}
      {/* <div className={style.bodyCon}>
        <canvas
          ref={gridCanvasRef}
          id="gridCanvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={clsx(["cursor-pointer", { "!cursor-grab": panning }])}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleLeave}
        />
        <div
          style={{
            position: "absolute",
            left: '5%',
            bottom: "5px",
            cursor:"pointer"
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
                    width: "20px",
                    height: "20px",
                    margin: "14px auto",
                  }}
                ></div>
              )}
            </span>
          ))}
        </div>
      </div> */}
       <div
      style={{
        width: `100vw` ,
        // height: `${CONTENT_WIDTH}px`,
        overflow: "hidden",
        position: "relative",
        // margin: "0 auto",
      }}
      className={style.bodyCon}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleMouseEnter} // 添加这一行
    >
      <div
        ref={visibleAreaRef}
        style={{
          width: `${CONTENT_WIDTH}px`,
          height: `900px`,
          overflow: "auto",
        }}
      >
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_WIDTH} style={{ border: "1px solid black" }} />
      </div>
     
    </div>
    <div
          style={{
            position: "absolute",
            left: '5%',
            bottom: "15px",
            cursor:"pointer",
            zIndex:'9999999999'
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
                    width: "20px",
                    height: "20px",
                    margin: "14px auto",
                  }}
                ></div>
              )}
            </span>
          ))}
        </div>
    </>
  );
}

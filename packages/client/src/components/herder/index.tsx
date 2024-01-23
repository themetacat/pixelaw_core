import React, { useState, useEffect, useRef } from "react";
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


export default function Header() {
  const [numberData, setNumberData] = useState(50);
  const gridCanvasRef = React.useRef(null);
  const [panning, setPanning] = useState(false);

  const [GRID_SIZE, setGRID_SIZE] = useState(64);
  const btnLower = () => {
    setNumberData(numberData - 5); // 每次点击减号减少5
    setGRID_SIZE(GRID_SIZE - 5);
  };
  const btnAdd = () => {
    setNumberData(numberData + 5); // 每次点击加号增加5
    setGRID_SIZE(GRID_SIZE + 5);
  };
  const renderGrid = useRenderGrid();

  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;

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
  const [selectedColor, setSelectedColor] = useState("#2f1643");
  // // 为每个颜色选项添加点击事件监听器
  // const colorOptions = document.querySelectorAll('.color-option');
  // colorOptions.forEach((option) => {
  //   option.addEventListener('click', handleColorOptionClick);
  // });
  // 点击事件处理程序
  function handleColorOptionClick(color: any) {
    setSelectedColor(color);
  }

  useEffect(() => {
    const canvas = gridCanvasRef.current as any;
    const ctx = canvas.getContext("2d");

    // 设置画布大小
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 移动画布坐标系

    ctx.translate(offsetX, offsetY);
    // 绘制小方格
    for (let x = GRID_SIZE; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      for (let y = GRID_SIZE; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#2f1643";
        ctx.strokeRect(x - GRID_SIZE, y - GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.fillRect(x - GRID_SIZE, y - GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }
    }

    // 绘制鼠标悬停的方格背景色为蓝色
    if (hoveredSquare) {
      const { x, y } = hoveredSquare;
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
    }

    // 检查鼠标位置是否在画布范围内
  }, [
    hoveredSquare,
    offsetX,
    offsetY,
    selectedColor,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    GRID_SIZE,
  ]);
  const handleMouseDown = (event: any) => {
    setPanning(true);
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
  };
  const handleMouseMove = (event: any) => {
    const canvas = gridCanvasRef.current as any;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (panning) {
      const offsetXChange = event.clientX - startXRef.current;
      const offsetYChange = event.clientY - startYRef.current;
      setOffsetX((prevOffsetX) => prevOffsetX + offsetXChange);
      setOffsetY((prevOffsetY) => prevOffsetY + offsetYChange);
      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
    }

    if (
      mouseX >= 0 &&
      mouseY >= 0 &&
      mouseX <= canvas.width &&
      mouseY <= canvas.height
    ) {
      const squareX = Math.floor((mouseX - offsetX) / GRID_SIZE) * GRID_SIZE;
      const squareY = Math.floor((mouseY - offsetY) / GRID_SIZE) * GRID_SIZE;

      setHoveredSquare({ x: squareX, y: squareY });
    } else {
      setHoveredSquare(null);
    }
  };

  const handleMouseUp = () => {
    offsetXRef.current = offsetX;
    offsetYRef.current = offsetY;
    startXRef.current = 0;
    startYRef.current = 0;
    setPanning(false);
  };
  const handleLeave = () => {
    setHoveredSquare(null);
  };
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
      <div className={style.bodyCon}>
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
       
      </div>
    </>
  );
}

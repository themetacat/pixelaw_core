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
const colorOptionsData = [
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
  // const {
  //     cellSize,
  //     coordinates,
  //     selectedHexColor,
  //     data,
  //     panOffsetX,
  //     panOffsetY,
  //     setPanOffsetX,
  //     setPanOffsetY,
  //     onCellClick,
  //     onVisibleAreaCoordinate,
  //     onHover,
  //   } = useDrawPanel()

  const [numberData, setNumberData] = useState(50);
  const gridCanvasRef = React.useRef(null);
  const [panning, setPanning] = useState(false);
  // const [panOffsetX, setPanOffsetX] = useState(0);
  // const [panOffsetY, setPanOffsetY] = useState(0);
  const panOffsetX = useRef(0);
  const panOffsetY = useRef(0);
  const [GRID_SIZE, setGRID_SIZE] = useState(64);

  //   const [ initialPositionX, setInitialPositionX ] = React.useState<number>(0)
  //   const [ initialPositionY, setInitialPositionY ] = React.useState<number>(0)
  //   const visibleAreaXStart = Math.max(0, Math.floor(-panOffsetX / cellSize))
  //   const visibleAreaYStart = Math.max(0, Math.floor(-panOffsetY / cellSize))

  //   // max: [x,y]: [20,20]
  //   const visibleAreaXEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_WIDTH - panOffsetX) / cellSize))
  //   const visibleAreaYEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_HEIGHT - panOffsetY) / cellSize))

  // Add a new state for storing the mousedown time
  const [mouseDownTime, setMouseDownTime] = React.useState<number>(0);
  const btnLower = () => {
    setNumberData(numberData - 5); // 每次点击减号减少5
    setGRID_SIZE(GRID_SIZE - 5);
  };
  const btnAdd = () => {
    setNumberData(numberData + 5); // 每次点击加号增加5
    setGRID_SIZE(GRID_SIZE + 5);
  };
  //   const gridCanvasRef = React.useRef<HTMLCanvasElement>() as any
  const renderGrid = useRenderGrid();
  //   React.useEffect(() => {
  //     if (gridCanvasRef.current) {
  //       const ctx = gridCanvasRef.current.getContext('2d', { willReadFrequently: true })
  //       if (!ctx) return

  //       renderGrid(ctx, {
  //         width: gridCanvasRef.current.width,
  //         height: gridCanvasRef.current.height,
  //         cellSize,
  //         coordinates,
  //         panOffsetX,
  //         panOffsetY,
  //         selectedHexColor,
  //         visibleAreaXStart,
  //         visibleAreaXEnd,
  //         visibleAreaYStart,
  //         visibleAreaYEnd,
  //         pixels: data,
  //         focus
  //       })
  //     }
  //   }, [ coordinates, panOffsetX, panOffsetY, cellSize, selectedHexColor, data, renderGrid, visibleAreaXStart, visibleAreaXEnd, visibleAreaYStart, visibleAreaYEnd ])
  // function onClickCoordinates(clientX: number, clientY: number) {
  //     if (!gridCanvasRef.current) return

  //     const rect = gridCanvasRef.current.getBoundingClientRect()
  //     const x = Math.abs(panOffsetX) + clientX - rect.left  // pixel
  //     const y = Math.abs(panOffsetY) + clientY - rect.top  // pixel

  //     const gridX = Math.floor(x / cellSize)
  //     const gridY = Math.floor(y / cellSize)

  //     onCellClick?.([ gridX, gridY ])
  //   }

  //   function onMouseLeave() {
  //     setPanning(false)

  //     onVisibleAreaCoordinate?.([ visibleAreaXStart, visibleAreaYStart ], [ visibleAreaXEnd, visibleAreaYEnd ])
  //   }

  //   function onMouseUp(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
  //     setPanning(false)
  //     onVisibleAreaCoordinate?.([ visibleAreaXStart, visibleAreaYStart ], [ visibleAreaXEnd, visibleAreaYEnd ])

  //     // If the time difference between mouse down and up is less than a threshold (e.g., 200ms), it's a click
  //     if (Date.now() - mouseDownTime < 300) {
  //       onClickCoordinates(event.clientX, event.clientY)
  //     }
  //   }

  //   function onMouseDown(clientX: number, clientY: number) {
  //     setPanning(true)
  //     setInitialPositionX(clientX - panOffsetX)
  //     setInitialPositionY(clientY - panOffsetY)

  //     // Record the current time when mouse is down
  //     setMouseDownTime(Date.now())
  //   }

  //   function onMouseMove(clientX: number, clientY: number) {
  //     if (panning) {
  //     // this is a negative value
  //     const offsetX = clientX - initialPositionX;
  //     const offsetY = clientY - initialPositionY;

  //     const maxOffsetX = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH) ; // Maximum allowed offset in X direction
  //     const maxOffsetY = -(MAX_ROWS_COLS * cellSize - CANVAS_WIDTH) ; // Maximum allowed offset in Y direction

  //     setPanOffsetX(offsetX > 0 ? 0 : Math.abs(offsetX) > Math.abs(maxOffsetX) ? maxOffsetX : offsetX)
  //     setPanOffsetY(offsetY > 0 ? 0 : Math.abs(offsetY) > Math.abs(maxOffsetY) ? maxOffsetY : offsetY)
  //     } else {
  //       onMouseHover(clientX, clientY)
  //     }
  //   }
  //   function onMouseHover(clientX: number, clientY: number) {
  //     if (!gridCanvasRef.current) return

  //     const rect = gridCanvasRef.current.getBoundingClientRect()
  //     const x = Math.abs(panOffsetX) + clientX - rect.left  // pixel
  //     const y = Math.abs(panOffsetY) + clientY - rect.top  // pixel

  //     const gridX = Math.floor(x / cellSize)
  //     const gridY = Math.floor(y / cellSize)

  //     // Now you have the grid coordinates on hover, you can use them as you need
  //     onHover?.([ gridX, gridY ])
  //   }
  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;
  // const GRID_SIZE = 64;

  // React.useEffect(() => {
  //   const canvas = gridCanvasRef.current as any;
  //   const ctx = canvas.getContext('2d');

  //   // 定义变量和状态
  //   let panStartX = 0;
  //   let panStartY = 0;
  //   let panning = false;

  //   // 绘制网格函数
  //   const renderGrid = (gridSize: number) => {
  //     // 清空画布
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // 绘制格子和文本
  //     for (let x = -panOffsetX; x < canvas.width - panOffsetX; x += gridSize) {
  //       for (let y = -panOffsetY; y < canvas.height - panOffsetY; y += gridSize) {
  //         // 绘制方格背景
  //         ctx.fillStyle = 'gray';
  //         ctx.fillRect(x, y, gridSize, gridSize);

  //         // 绘制边框线
  //         ctx.strokeStyle = 'black';
  //         ctx.lineWidth = 1;
  //         ctx.strokeRect(x, y, gridSize, gridSize);

  //         ctx.font = `15px Arial`;
  //         ctx.fillStyle = 'black';
  //         ctx.textBaseline = 'middle';
  //         ctx.textAlign = 'center';
  //         const text = `(${x / gridSize},${y / gridSize})`;
  //         ctx.fillText(text, x + gridSize / 2, y + gridSize / 2);
  //       }
  //     }

  //     // 绘制拖动方块
  //     if (panning) {
  //       const rect = canvas.getBoundingClientRect();
  //       const offsetX = panStartX + panOffsetX;
  //       const offsetY = panStartY + panOffsetY;

  //       const gridX = Math.floor(offsetX / gridSize);
  //       const gridY = Math.floor(offsetY / gridSize);

  //       // 计算方块的坐标
  //       const squareX = Math.round(gridX * gridSize);
  //       const squareY = Math.round(gridY * gridSize);

  //       ctx.fillStyle = 'blue';
  //       ctx.fillRect(squareX, squareY, gridSize, gridSize);
  //     }
  //   };

  //   // 绑定鼠标事件
  //   const handleMouseMove = (event: MouseEvent) => {
  //     if (panning) {
  //       const rect = canvas.getBoundingClientRect();
  //       const offsetX = event.clientX - rect.left;
  //       const offsetY = event.clientY - rect.top;
  //       const deltaX = offsetX - panStartX;
  //       const deltaY = offsetY - panStartY;

  //       setPanOffsetX((prevOffsetX) => prevOffsetX + deltaX);
  //       setPanOffsetY((prevOffsetY) => prevOffsetY + deltaY);

  //       panStartX = offsetX;
  //       panStartY = offsetY;

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);

  //       renderGrid(GRID_SIZE);

  //       const gridX = Math.floor(offsetX / GRID_SIZE);
  //       const gridY = Math.floor(offsetY / GRID_SIZE);

  //       const squareX = Math.round(gridX * GRID_SIZE);
  //       const squareY = Math.round(gridY * GRID_SIZE);

  //       ctx.fillStyle = 'blue';
  //       ctx.fillRect(squareX, squareY, GRID_SIZE, GRID_SIZE);
  //     }
  //   };

  //   const handleMouseDown = (event: MouseEvent) => {
  //     panning = true;
  //     panStartX = event.clientX - canvas.getBoundingClientRect().left;
  //     panStartY = event.clientY - canvas.getBoundingClientRect().top;

  //     const offsetX = panStartX + panOffsetX;
  //     const offsetY = panStartY + panOffsetY;

  //     const gridX = Math.floor(offsetX / GRID_SIZE);
  //     const gridY = Math.floor(offsetY / GRID_SIZE);

  //     // 清除整个画布
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     renderGrid(GRID_SIZE); // 重新绘制网格和文本

  //     ctx.fillStyle = 'blue';
  //     ctx.fillRect(gridX * GRID_SIZE, gridY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  //   };

  //   const handleMouseUp = () => {
  //     panning = false;
  //     renderGrid(GRID_SIZE); // 重新绘制网格和文本
  //   };

  //   const handleMouseLeave = () => {
  //     panning = false;
  //   };

  //   canvas.addEventListener('mousemove', handleMouseMove);
  //   canvas.addEventListener('mousedown', handleMouseDown);
  //   canvas.addEventListener('mouseup', handleMouseUp);
  //   canvas.addEventListener('mouseleave', handleMouseLeave);

  //   renderGrid(GRID_SIZE); // 初始绘制网格和文本

  //   return () => {
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //     canvas.removeEventListener('mousedown', handleMouseDown);
  //     canvas.removeEventListener('mouseup', handleMouseUp);
  //     canvas.removeEventListener('mouseleave', handleMouseLeave);
  //   };
  // }, [GRID_SIZE, panOffsetX, panOffsetY]);
  // console.log( Array.from(colorOptionsData).map((option, index) => {
  //   console.log(option, index);
  //   return (
  //     <div key={index} style={{ backgroundColor: option.color }}>
  //       {option.title}
  //     </div>
  //   );
  // }))
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  // 可以实现移动，但是小方格框线有问题
  // useEffect(() => {
  //   const canvas = gridCanvasRef.current as any;
  //   const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  //   let panStartX = 0;
  //   let panStartY = 0;
  //   let panning = false;

  //   const renderGrid = (gridSize: number) => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     const offsetX = panOffsetX.current % gridSize;
  //     const offsetY = panOffsetY.current % gridSize;

  //     for (let x = -offsetX; x < canvas.width; x += gridSize) {
  //       for (let y = -offsetY; y < canvas.height; y += gridSize) {
  //         ctx.lineWidth = 1;
  //         ctx.strokeRect(x, y, gridSize, gridSize);

  //         // ctx.font = `15px Arial`;
  //         // ctx.fillStyle = 'black';
  //         // ctx.textBaseline = 'middle';
  //         // ctx.textAlign = 'center';
  //         // const text = `(${Math.floor((x + offsetX) / gridSize)},${Math.floor((y + offsetY) / gridSize)})`;
  //         // ctx.fillText(text, x + gridSize / 2, y + gridSize / 2);
  //       }
  //     }
  //   };

  //   const handleMouseMove = (event: MouseEvent) => {
  //     if (panning) {
  //       const rect = canvas.getBoundingClientRect();
  //       const offsetX = event.clientX - rect.left;
  //       const offsetY = event.clientY - rect.top;
  //       const deltaX = offsetX - panStartX;
  //       const deltaY = offsetY - panStartY;

  //       panOffsetX.current += deltaX;
  //       panOffsetY.current += deltaY;

  //       panStartX = offsetX;
  //       panStartY = offsetY;

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       renderGrid(GRID_SIZE);

  //       const gridX = Math.floor((offsetX - panOffsetX.current) / GRID_SIZE);
  //       const gridY = Math.floor((offsetY - panOffsetY.current) / GRID_SIZE);
  //       console.log(`Selected square: (${gridX},${gridY})`);
  //       const squareX = Math.round(gridX * GRID_SIZE);
  //       const squareY = Math.round(gridY * GRID_SIZE);

  //       ctx.fillStyle = 'blue';
  //       ctx.fillRect(squareX, squareY, GRID_SIZE, GRID_SIZE);
  //     }
  //   };

  //   const handleMouseDown = (event: MouseEvent) => {
  //     panning = true;
  //     panStartX = event.clientX - canvas.getBoundingClientRect().left;
  //     panStartY = event.clientY - canvas.getBoundingClientRect().top;

  //     const offsetX = panStartX + panOffsetX.current;
  //     const offsetY = panStartY + panOffsetY.current;

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     renderGrid(GRID_SIZE);

  //     const gridX = Math.floor((offsetX - panOffsetX.current) / GRID_SIZE);
  //     const gridY = Math.floor((offsetY - panOffsetY.current) / GRID_SIZE);

  //     const squareX = Math.round(gridX * GRID_SIZE);
  //     const squareY = Math.round(gridY * GRID_SIZE);

  //     ctx.fillStyle = 'blue';
  //     ctx.fillRect(squareX, squareY, GRID_SIZE, GRID_SIZE);
  //   };

  //   const handleMouseUp = () => {
  //     panning = false;
  //     renderGrid(GRID_SIZE);
  //   };

  //   const handleMouseLeave = () => {
  //     panning = false;
  //   };

  //   canvas.addEventListener('mousemove', handleMouseMove);
  //   canvas.addEventListener('mousedown', handleMouseDown);
  //   canvas.addEventListener('mouseup', handleMouseUp);
  //   canvas.addEventListener('mouseleave', handleMouseLeave);

  //   renderGrid(GRID_SIZE);

  //   return () => {
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //     canvas.removeEventListener('mousedown', handleMouseDown);
  //     canvas.removeEventListener('mouseup', handleMouseUp);
  //     canvas.removeEventListener('mouseleave', handleMouseLeave);
  //   };
  // }, [GRID_SIZE]);

  // const panOffsetX = useRef(0);
  // const panOffsetY = useRef(0);
  // 在函数组件中添加以下代码
  // const [gridX, setGridX] = useState(0);
  // const [gridY, setGridY] = useState(0);

  // let gridX = 0;
  // let gridY = 0;
  // useEffect(() => {
  //   const canvas = document.getElementById('gridCanvas') as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  //   let panStartX = 0;
  //   let panStartY = 0;
  //   let panning = false;

  //   const renderGrid = (gridSize: number) => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     const offsetX = panOffsetX.current % gridSize;
  //     const offsetY = panOffsetY.current % gridSize;

  //     for (let x = -offsetX; x < canvas.width; x += gridSize) {
  //       for (let y = -offsetY; y < canvas.height; y += gridSize) {
  //         ctx.lineWidth = 1;
  //         ctx.strokeRect(x, y, gridSize, gridSize);
  //       }
  //     }
  //   };

  //   const handleMouseMove = (event: MouseEvent) => {
  //     if (panning) {
  //       const rect = canvas.getBoundingClientRect();
  //       const offsetX = event.clientX - rect.left + panOffsetX.current;
  //       const offsetY = event.clientY - rect.top + panOffsetY.current;
  //       const deltaX = offsetX - panStartX;
  //       const deltaY = offsetY - panStartY;

  //       panOffsetX.current += deltaX;
  //       panOffsetY.current += deltaY;

  //       panStartX = offsetX;
  //       panStartY = offsetY;

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       renderGrid(GRID_SIZE);

  //       const gridX = Math.floor((offsetX - panOffsetX.current) / GRID_SIZE);
  //       const gridY = Math.floor((offsetY - panOffsetY.current) / GRID_SIZE);

  //       const squareX = Math.round(gridX * GRID_SIZE + panOffsetX.current);
  //       const squareY = Math.round(gridY * GRID_SIZE + panOffsetY.current);

  //       ctx.fillStyle = 'blue';
  //       ctx.fillRect(squareX, squareY, GRID_SIZE, GRID_SIZE);
  //     }
  //   };

  //   const handleMouseDown = (event: MouseEvent) => {
  //     panning = true;
  //     panStartX = event.clientX - canvas.getBoundingClientRect().left;
  //     panStartY = event.clientY - canvas.getBoundingClientRect().top;

  //     const offsetX = panStartX + panOffsetX.current;
  //     const offsetY = panStartY + panOffsetY.current;

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     renderGrid(GRID_SIZE);

  //     const gridX = Math.floor((offsetX - panOffsetX.current) / GRID_SIZE);
  //     const gridY = Math.floor((offsetY - panOffsetY.current) / GRID_SIZE);

  //     const squareX = Math.round(gridX * GRID_SIZE);
  //     const squareY = Math.round(gridY * GRID_SIZE);

  //     ctx.fillStyle = 'blue';
  //     ctx.fillRect(squareX, squareY, GRID_SIZE, GRID_SIZE);
  //   };

  //   const handleMouseUp = () => {
  //     panning = false;
  //     renderGrid(GRID_SIZE);
  //   };

  //   const handleMouseLeave = () => {
  //     panning = false;
  //   };

  //   canvas.addEventListener('mousemove', handleMouseMove);
  //   canvas.addEventListener('mousedown', handleMouseDown);
  //   canvas.addEventListener('mouseup', handleMouseUp);
  //   canvas.addEventListener('mouseleave', handleMouseLeave);

  //   renderGrid(GRID_SIZE);

  //   return () => {
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //     canvas.removeEventListener('mousedown', handleMouseDown);
  //     canvas.removeEventListener('mouseup', handleMouseUp);
  //     canvas.removeEventListener('mouseleave', handleMouseLeave);
  //   };
  // }, [GRID_SIZE]);
  // const [lastMouseX, setLastMouseX] = useState(0);
  // const [lastMouseY, setLastMouseY] = useState(0);
  // const gridCanvasRef = useRef(null); // canvas引用
  // useEffect(() => {
  //   const canvas = gridCanvasRef.current as any;
  //   const ctx = canvas.getContext('2d');

  //   const drawGrid = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     const offsetX = gridX % GRID_SIZE;
  //     const offsetY = gridY % GRID_SIZE;

  //     for (let x = -offsetX; x < canvas.width; x += GRID_SIZE) {
  //       for (let y = -offsetY; y < canvas.height; y += GRID_SIZE) {
  //         ctx.lineWidth = 1;
  //         ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
  //       }
  //     }
  //   };

  //   drawGrid();

  //   let lastMouseX = 0;
  // let lastMouseY = 0;

  // const handleMouseDown = (event: any) => {
  //   setIsMouseDown(true);

  //   const rect = canvas.getBoundingClientRect();
  //   const mouseX = event.clientX - rect.left;
  //   const mouseY = event.clientY - rect.top;

  //   lastMouseX = mouseX;
  //   lastMouseY = mouseY;
  // };

  // const handleMouseMove = (event: any) => {
  //   if (isMouseDown) {
  //     const rect = canvas.getBoundingClientRect();
  //     const mouseX = event.clientX - rect.left;
  //     const mouseY = event.clientY - rect.top;

  //     const moveX = mouseX - lastMouseX;
  //     const moveY = mouseY - lastMouseY;

  //     gridX += moveX;
  //     gridY += moveY;

  //     // 清除之前的绘制
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     drawGrid();

  //     lastMouseX = mouseX;
  //     lastMouseY = mouseY;
  //   } else {
  //     const rect = canvas.getBoundingClientRect();
  //     const mouseX = event.clientX - rect.left;
  //     const mouseY = event.clientY - rect.top;

  //     // 获取当前鼠标所在的小方格的索引
  //     const gridIndexX = Math.floor((mouseX - gridX) / GRID_SIZE);
  //     const gridIndexY = Math.floor((mouseY - gridY) / GRID_SIZE);

  //     // 清除之前的绘制
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     drawGrid();

  //     // 绘制蓝色背景的小方格
  //     ctx.fillStyle = 'blue';
  //     ctx.fillRect(
  //       gridX + gridIndexX * GRID_SIZE,
  //       gridY + gridIndexY * GRID_SIZE,
  //       GRID_SIZE,
  //       GRID_SIZE
  //     );

  //     // 绘制黑色框线的小方格
  //     ctx.strokeStyle = 'black';
  //     ctx.lineWidth = 2;
  //     ctx.strokeRect(
  //       gridX + gridIndexX * GRID_SIZE,
  //       gridY + gridIndexY * GRID_SIZE,
  //       GRID_SIZE,
  //       GRID_SIZE
  //     );
  //   }
  // };

  // const handleMouseUp = (event: MouseEvent) => {
  //   setIsMouseDown(false);

  //   const rect = canvas.getBoundingClientRect();
  //   const mouseX = event.clientX - rect.left;
  //   const mouseY = event.clientY - rect.top;

  //   const moveX = mouseX - lastMouseX;
  //   const moveY = mouseY - lastMouseY;

  //   gridX += moveX;
  //   gridY += moveY;

  //   lastMouseX += moveX;
  //   lastMouseY += moveY;

  //   // 清除之前的绘制
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   drawGrid();
  // };
  //   canvas.addEventListener('mousemove', handleMouseMove);
  //   canvas.addEventListener('mousedown', handleMouseDown);
  //   canvas.addEventListener('mouseup', handleMouseUp);

  //   return () => {
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //     canvas.removeEventListener('mousedown', handleMouseDown);
  //     canvas.removeEventListener('mouseup', handleMouseUp);
  //   };
  // }, [GRID_SIZE, gridX, gridY, isMouseDown, lastMouseX, lastMouseY]);

  // let lastMouseX = 0;
  // let lastMouseY = 0;
  // useEffect(() => {
  //   const canvas = gridCanvasRef.current as any;
  //   const ctx = canvas.getContext('2d');

  //   const drawGrid = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     const offsetX = gridX % GRID_SIZE;
  //     const offsetY = gridY % GRID_SIZE;

  //     for (let x = -offsetX; x < canvas.width; x += GRID_SIZE) {
  //       for (let y = -offsetY; y < canvas.height; y += GRID_SIZE) {
  //         ctx.lineWidth = 1;
  //         ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
  //       }
  //     }
  //   };
  //   drawGrid();

  //   const handleMouseDown = (event: any) => {
  //     setIsMouseDown(true);

  //     const rect = canvas.getBoundingClientRect();
  //     const mouseX = event.clientX - rect.left;
  //     const mouseY = event.clientY - rect.top;

  //     lastMouseX = mouseX;
  //     lastMouseY = mouseY;
  //   };

  //   const handleMouseMove = (event: any) => {
  //     if (isMouseDown) {
  //       const rect = canvas.getBoundingClientRect();
  //       const mouseX = event.clientX - rect.left;
  //       const mouseY = event.clientY - rect.top;

  //       const moveX = mouseX - lastMouseX;
  //       const moveY = mouseY - lastMouseY;

  //       gridX += moveX;
  //       gridY += moveY;

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       drawGrid();

  //       lastMouseX = mouseX;
  //       lastMouseY = mouseY;
  //     } else {
  //       const rect = canvas.getBoundingClientRect();
  //       const mouseX = event.clientX - rect.left;
  //       const mouseY = event.clientY - rect.top;

  //       const gridIndexX = Math.floor((mouseX - gridX) / GRID_SIZE);
  //       const gridIndexY = Math.floor((mouseY - gridY) / GRID_SIZE);

  //       const offsetX = gridX % GRID_SIZE;
  //       const offsetY = gridY % GRID_SIZE;
  //       const startX = gridX - offsetX + gridIndexX * GRID_SIZE;
  //       const startY = gridY - offsetY + gridIndexY * GRID_SIZE;

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //       drawGrid();

  //       const blueGridIndexX = Math.floor((startX - gridX) / GRID_SIZE);
  //       const blueGridIndexY = Math.floor((startY - gridY) / GRID_SIZE);

  //       ctx.fillStyle = 'blue';
  //       if (gridIndexX === blueGridIndexX && gridIndexY === blueGridIndexY) {
  //         ctx.fillRect(startX, startY, GRID_SIZE, GRID_SIZE);
  //       }

  //       ctx.strokeStyle = 'black';
  //       ctx.lineWidth = 2;
  //       for (let x = startX - gridX; x < canvas.width; x += GRID_SIZE) {
  //         for (let y = startY - gridY; y < canvas.height; y += GRID_SIZE) {
  //           ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
  //         }
  //       }

  //       if (gridIndexX === blueGridIndexX && gridIndexY === blueGridIndexY) {
  //         console.log(`Current mouse position: (${startX}, ${startY})`);
  //       }
  //     }
  //   };

  //   const handleMouseUp = (event: MouseEvent) => {
  //     setIsMouseDown(false);

  //     const rect = canvas.getBoundingClientRect();
  //     const mouseX = event.clientX - rect.left;
  //     const mouseY = event.clientY - rect.top;

  //     const moveX = mouseX - lastMouseX;
  //     const moveY = mouseY - lastMouseY;

  //     gridX += moveX;
  //     gridY += moveY;

  //     lastMouseX += moveX;
  //     lastMouseY += moveY;

  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     drawGrid();
  //   };

  //   canvas.addEventListener('mousemove', handleMouseMove);
  //   canvas.addEventListener('mousedown', handleMouseDown);
  //   canvas.addEventListener('mouseup', handleMouseUp);

  //   return () => {
  //     canvas.removeEventListener('mousemove', handleMouseMove);
  //     canvas.removeEventListener('mousedown', handleMouseDown);
  //     canvas.removeEventListener('mouseup', handleMouseUp);
  //   };
  // }, [GRID_SIZE]);

  // const gridCanvasRef = useRef(null);
  // const [panning, setPanning] = useState(false);

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
      console.log(selectedColor, 6666);
      const { x, y } = hoveredSquare;
      ctx.fillStyle = selectedColor;
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
      </div>
    </>
  );
}

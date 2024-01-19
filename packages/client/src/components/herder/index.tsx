import React, { useState } from "react";
import style from "./index.module.css";
// import { useDrawPanel } from '@/providers/DrawPanelProvider.tsx'
import { clsx } from 'clsx'
import { useRenderGrid } from '../../hooks/useRenderGrid'
import DrawPanel from '../shared/DrawPanel'
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_ROWS_COLS } from '../../global/constants'

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
  const [panOffsetX, setPanOffsetX] = useState(0);
  const [panOffsetY, setPanOffsetY] = useState(0);
  const [GRID_SIZE, setGRID_SIZE] = useState(64);

//   const [ initialPositionX, setInitialPositionX ] = React.useState<number>(0)
//   const [ initialPositionY, setInitialPositionY ] = React.useState<number>(0)
//   const visibleAreaXStart = Math.max(0, Math.floor(-panOffsetX / cellSize))
//   const visibleAreaYStart = Math.max(0, Math.floor(-panOffsetY / cellSize))

//   // max: [x,y]: [20,20]
//   const visibleAreaXEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_WIDTH - panOffsetX) / cellSize))
//   const visibleAreaYEnd = Math.min(MAX_ROWS_COLS, Math.ceil((CANVAS_HEIGHT - panOffsetY) / cellSize))

  // Add a new state for storing the mousedown time
  const [ mouseDownTime, setMouseDownTime ] = React.useState<number>(0)
  const btnLower = () => {
    setNumberData(numberData - 5); // 每次点击减号减少5
    setGRID_SIZE(GRID_SIZE-5)
  };
  const btnAdd = () => {
    setNumberData(numberData + 5); // 每次点击加号增加5
    setGRID_SIZE(GRID_SIZE+5)
  };
//   const gridCanvasRef = React.useRef<HTMLCanvasElement>() as any
  const renderGrid = useRenderGrid()
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
const CANVAS_WIDTH = 1850;
const CANVAS_HEIGHT = 830;
// const GRID_SIZE = 64;

React.useEffect(() => {
  const canvas = gridCanvasRef.current as any;
  const ctx = canvas.getContext('2d');

  // 绘制网格函数
  const renderGrid = (gridSize: number) => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制格子
    for (let x = -panOffsetX; x < canvas.width - panOffsetX; x += gridSize) {
      for (let y = -panOffsetY; y < canvas.height - panOffsetY; y += gridSize) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, gridSize, gridSize);
      }
    }

    // 绘制文本
    ctx.font = `15px Arial`;
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    for (let x = -panOffsetX; x < canvas.width - panOffsetX; x += gridSize) {
      for (let y = -panOffsetY; y < canvas.height - panOffsetY; y += gridSize) {
        const text = `(${x / gridSize},${y / gridSize})`;
        ctx.fillText(text, x + gridSize / 2, y + gridSize / 2);
      }
    }
  };

  // 绑定鼠标事件
  const handleMouseMove = (event:any) => {
    if (panning) {
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      setPanOffsetX(panOffsetX + (offsetX - panStartX));
      setPanOffsetY(panOffsetY + (offsetY - panStartY));
      panStartX = offsetX;
      panStartY = offsetY;
    }
  };

  let panStartX = 0;
  let panStartY = 0;
  const handleMouseDown = (event:any) => {
    setPanning(true);
    panStartX = event.clientX - canvas.getBoundingClientRect().left;
    panStartY = event.clientY - canvas.getBoundingClientRect().top;

    const offsetX = panStartX + panOffsetX;
    const offsetY = panStartY + panOffsetY;

    const gridX = Math.floor(offsetX / GRID_SIZE);
    const gridY = Math.floor(offsetY / GRID_SIZE);

    ctx.fillStyle = 'blue';
    ctx.fillRect(gridX * GRID_SIZE, gridY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  };

  canvas.addEventListener('mousedown', handleMouseDown);

  const handleMouseUp = () => {
    setPanning(false);
  };

  const handleMouseLeave = () => {
    setPanning(false);
  };

  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mouseleave', handleMouseLeave);

  renderGrid(GRID_SIZE);

  return () => {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
  };
}, [GRID_SIZE, numberData, panOffsetX, panOffsetY]);


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
        <canvas ref={gridCanvasRef}
        
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className={clsx([ 'cursor-pointer', { '!cursor-grab': panning } ])}
                //   onMouseDown={(event) => onMouseDown(event.clientX, event.clientY)}
                //   onMouseMove={(event) => onMouseMove(event.clientX, event.clientY)}
                //   onMouseUp={(event) => onMouseUp(event)}
                //   onMouseLeave={onMouseLeave}
          />
          </div>
    </>
  );
}

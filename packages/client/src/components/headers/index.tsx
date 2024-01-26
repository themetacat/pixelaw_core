import React, { useRef, useEffect, useState, useCallback } from "react";

const CANVAS_WIDTH = window.innerWidth;
const GRID_SIZE = 50;
// 计算每行可容纳的网格数量
      const gridCount = Math.floor(CANVAS_WIDTH / GRID_SIZE);

      // 根据每行的网格数量计算内容区域的宽度
      const CONTENT_WIDTH = gridCount * GRID_SIZE;

function App() {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleAreaRef = useRef<HTMLDivElement>(null);

  // 使用 useCallback 来定义 drawGrid 函数
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    for (let x = 0.5; x < CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_WIDTH);
      ctx.stroke();
    }

    for (let y = 0.5; y < CANVAS_WIDTH; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    for (let i = 0; i <= CANVAS_WIDTH / GRID_SIZE; i++) {
      for (let j = 0; j <= CANVAS_WIDTH / GRID_SIZE; j++) {
        ctx.fillText(`${i},${j}`, i * GRID_SIZE + 2, j * GRID_SIZE + 10);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawGrid(ctx);
      }
    }
  }, [drawGrid]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setTranslateX(event.clientX);
    setTranslateY(event.clientY);
  };

  const handleMouseUp = () => {
    setTranslateX(0);
    setTranslateY(0);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons !== 1 || !visibleAreaRef.current) return;

    const dx = event.clientX - translateX;
    const dy = event.clientY - translateY;

    setTranslateX(event.clientX);
    setTranslateY(event.clientY);

    visibleAreaRef.current.scrollLeft -= dx;
    visibleAreaRef.current.scrollTop -= dy;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          ref={visibleAreaRef}
          style={{
            width: `${CONTENT_WIDTH}px`,
            height: `${CONTENT_WIDTH}px`,
            overflow: "auto",
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_WIDTH}
            style={{ border: "1px solid black" }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

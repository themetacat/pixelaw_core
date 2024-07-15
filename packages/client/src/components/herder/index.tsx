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
import RightPart, { addressToEntityID } from "../rightPart";
import { useMUD } from "../../MUDContext";
import BoxPrompt from "../BoxPrompt";
import PopStar from "../popStar";
import { convertToString, coorToEntityID } from "../rightPart/index";
import PopUpBox from "../popUpBox";
import TopUpContent from "../topUp";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
} from "@latticexyz/store-sync/recs";
import { update_app_value } from "../../mud/createSystemCalls";
import powerIcon from "../../images/jian_sekuai.png";
import AddIcon from "../../images/jia.png";
import { CANVAS_HEIGHT } from "../../global/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useDisconnect } from 'wagmi';
import pixeLawlogo from '../../images/pixeLawlogo.png'
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
    components: {
      App,
      Pixel,
      AppName,
      Instruction,
      TCMPopStar,
      UserDelegationControl,
    },
    network: { playerEntity, publicClient, palyerAddress },
    systemCalls: { interact, interactTCM },
  } = useMUD();
  const { isConnected, address } = useAccount();

  const { disconnect } = useDisconnect();
  const [numberData, setNumberData] = useState(25);
  const gridCanvasRef = React.useRef(null);
  const [popExhibit, setPopExhibit] = useState(false);
  const [boxPrompt, setBoxPrompt] = useState(false);
  const [topUpType, setTopUpType] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [instruC, setInstruC] = useState("");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [emptyRegionNum, setEmptyRegionNum] = useState({ x: 0, y: 0 });
  const [coordinatesData, setCoordinatesData] = useState({ x: 0, y: 0 });
  const [entityaData, setEntityaData] = useState("");
  const [paramInputs, setParamInputs] = useState([]);
  const [convertedParamsData, setConvertedParamsData] = useState(null);
  const [tCMPopStarTime, setTCMPopStarTime] = useState(null);
  const [updateAbiJson, setUpdate_abi_json] = useState("");
  const [updateAbiCommonJson, setUpdate_abi_Common_json] = useState([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleAreaRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const [showOverlay, setShowOverlay] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [panningFromChild, setPanningFromChild] = useState(false);
  const [popStar, setPopStar] = useState(false);
  const [pageClick, setPageClick] = useState(false);
  const [GRID_SIZE, setGRID_SIZE] = useState(32);
  const entities = useEntityQuery([Has(Pixel)]);
  const entities_app = useEntityQuery([Has(App)]);
  const [mainContent, setMainContent] = useState("MAINNET");
  const [showList, setShowList] = useState(false);
  const [addressModel, setAddressModel] = useState(false);
  const CANVAS_WIDTH = document.documentElement.clientWidth; // 获取整个页面的宽度
  const CANVAS_HEIGHT = document.documentElement.clientHeight; // 获取整个页面的高度

  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const hoveredSquareRef = useRef<{ x: number; y: number } | null>(null);
  const colorSession = window.sessionStorage.getItem("selectedColorSign");

  const [selectedColor, setSelectedColor] = useState(
    colorSession !== null ? colorSession : "#ffffff"
  );
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const panningType = window.localStorage.getItem("panning");
  const coorToEntityID = (x: number, y: number) =>
    encodeEntity({ x: "uint32", y: "uint32" }, { x, y });

  const addressData =
    palyerAddress.substring(0, 4) +
    "..." +
    palyerAddress.substring(palyerAddress.length - 4);
  const chainName = publicClient.chain.name;
  const capitalizedString =
    chainName.charAt(0).toUpperCase() + chainName?.slice(1).toLowerCase();

  const balanceFN = publicClient.getBalance({ address: palyerAddress });
  balanceFN.then((a: any) => {
    setBalance(a);
  });
  const natIve = publicClient.chain.nativeCurrency.decimals;
  const btnLower = () => {
    setNumberData(numberData - 5);
    setGRID_SIZE(GRID_SIZE - 6);
    setScrollOffset({ x: 0, y: 0 });
    setTranslateX(0);
    setTranslateY(0);
  };
  const btnAdd = () => {
    setNumberData(numberData + 5);
    setGRID_SIZE(GRID_SIZE + 6);
    setScrollOffset({ x: 0, y: 0 });
    setTranslateX(0);
    setTranslateY(0);
  };

  function handleColorOptionClick(color: any) {
    setSelectedColor(color);
    window.sessionStorage.setItem("selectedColorSign", color);
  }

  const handleLeave = () => {
    setHoveredSquare(null);
    if (downTimerRef.current) {
      clearTimeout(downTimerRef.current);
      downTimerRef.current = null;
    }
    setIsLongPress(false);
  };

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
      entityData.push({ coordinates, value });
    });
  }

  const getEntityAtCoordinates = (x: number, y: number) => {
    return entityData.find(
      (entity) => entity.coordinates.x === x && entity.coordinates.y === y
    );
  };

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

  const findEmptyRegion = () => {
    const gridSize = GRID_SIZE;
    const checkSize = 10;

    const isEmpty = (x, y) => {
      const encodeEntityNum = coorToEntityID(x, y);
      const value = getComponentValue(Pixel, encodeEntityNum);
      return value === undefined;
    };

    let px = 0,
      x = 0,
      y = 0;

    while (true) {
      let res = isEmpty(x, y);

      if (res) {
        if (x - px >= 9) {
          if (y === 9) {
            break;
          }
          y++;
          x = px;
        } else {
          x++;
        }
      } else {
        px = x + 1;
        x = px;
        y = 0;
      }
    }
    return px;
  };

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      hoveredSquare: { x: number; y: number } | null,
      playType: any
    ) => {
      let pix_text;

      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#000000";
      const checkSize = 10;
      for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x - scrollOffset.x, 0);
        ctx.lineTo(x - scrollOffset.x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y - scrollOffset.y);
        ctx.lineTo(CANVAS_WIDTH, y - scrollOffset.y);
        ctx.stroke();
      }

      const baseFontSize = 15;
      const fontSizeIncrement = 0.8;
      const fontWeight = "normal"; // 设置字体粗细
      const fontSize =
        numberData === 25
          ? baseFontSize
          : baseFontSize + (numberData - 25) * fontSizeIncrement;
      ctx.font = `${fontWeight} ${fontSize}px Arial`;

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
          ctx.fillStyle = "#2f1643";
          ctx.fillRect(currentX, currentY, GRID_SIZE, GRID_SIZE);
          const entity = getEntityAtCoordinates(i, j) as any;


          if (entity) {
            ctx.fillStyle = entity.value.color;
            ctx.fillRect(currentX, currentY, GRID_SIZE, GRID_SIZE);
            if (entity.value.text) {
              ctx.fillStyle = "#000"; 
              ctx.textAlign = "center"; 
              ctx.textBaseline = "middle"; 
              if (
                entity.value.text &&
                /^U\+[0-9A-Fa-f]{4,}$/.test(entity.value.text)
              ) {
                pix_text = String.fromCodePoint(
                  parseInt(entity.value.text.substring(2), 16)
                );
              } else {
                pix_text = entity.value.text;
              }

              const textX = currentX + GRID_SIZE / 2;
              const textY = currentY + GRID_SIZE / 2;
              ctx.fillText(pix_text, textX, textY);
            }
          }
        }
      }

      if (playType === true) {
        const emptyRegion = findEmptyRegion();
      }
      if (selectedColor && hoveredSquare) {
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
      numberData,
      CANVAS_WIDTH,
      getEntityAtCoordinates,
      CANVAS_HEIGHT,
      selectedColor,
      scrollOffset,
    ]
  );

  let timeout: NodeJS.Timeout;
  const [isDragging, setIsDragging] = useState(false);
  const [timeControl, setTimeControl] = useState(false);
  const downTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastDragEndX, setLastDragEndX] = useState(0);
  const [fingerNum, setFingerNum] = useState(0);
  const coor_entity = coorToEntityID(coordinates.x, coordinates.y);
  const pixel_value = getComponentValue(Pixel, coor_entity) as any;
  const action =
    pixel_value && pixel_value.action ? pixel_value.action : "interact";
  const ClickThreshold = 150; 
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setFingerNum(event.buttons);
    if (pageClick === true) {
      return;
    }
    setIsDragging(true);

    setTranslateX(event.clientX);
    setTranslateY(event.clientY);
    get_function_param(action);
    downTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
    }, ClickThreshold);
  };

  const handlePageClick = () => {
    setPageClick(true);
  };
  const handlePageClickIs = () => {
    setPageClick(false);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pageClick === true) {
      return;
    }
    setIsLongPress(false);
    setIsDragging(false);
    setPopExhibit(false);
    if (downTimerRef.current) {
      clearTimeout(downTimerRef.current);
      downTimerRef.current = null;
    }
    const a = get_function_param(action);
    a.then((x) => {
      const isEmpty = Object.keys(x).length === 0;

      if (isLongPress) {
        setIsLongPress(false);
        setIsDragging(false);
      } else {
        const canvas = canvasRef.current as any;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const gridX = Math.floor(mouseX / GRID_SIZE);
        const gridY = Math.floor(mouseY / GRID_SIZE);
        setCoordinatesData({ x: gridX, y: gridY });
        const newHoveredSquare = { x: gridX, y: gridY };
        setHoveredSquare(newHoveredSquare);
        if (isEmpty) {
          if (selectedColor && coordinates) {
            hoveredSquareRef.current = coordinates;

            setIsDragging(false);
            if (appName === "BASE/TCMPopStarSystem") {
              interactHandleTCM(
                coordinates,
                palyerAddress,
                selectedColor,
                action,
                null
              );
            } else {
              interactHandle(
                coordinates,
                palyerAddress,
                selectedColor,
                action,
                null
              );
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
              if (appName === "BASE/TCMPopStarSystem") {
                drawGrid(ctx, coordinates, true);
              }
              drawGrid(ctx, coordinates, false);
            }
          }
        } else {
          setPopExhibit(true);
        }

        setIsDragging(false);
        setShowOverlay(true);

        setTranslateX(0);
        setTranslateY(0);
      }
    });
  };

  const interactHandle = (
    coordinates: any,
    palyerAddress: any,
    selectedColor: any,
    actionData: any,
    other_params: any
  ) => { 
    setLoading(true);

    const interact_data = interact(
      coordinates,
      palyerAddress,
      selectedColor,
      actionData,
      other_params
    );

    interact_data.then((increDataVal: any) => {
      if (increDataVal[1]) {
        increDataVal[1].then((a: any) => {
          if (a.status === "success") {
            setLoading(false);
            onHandleLoading();
          } else {
            handleError();
            onHandleLoading();
          }
        });
      } else {
        handleError();
      }
    });
  };
  const interactHandleTCM = (
    coordinates: any,
    palyerAddress: any,
    selectedColor: any,
    actionData: any,
    other_params: any
  ) => {
    setLoading(true);

    const interact_data = interactTCM(
      coordinates,
      palyerAddress,
      selectedColor,
      actionData,
      other_params
    );

    interact_data.then((increDataVal: any) => {
      if (increDataVal[1]) {
        increDataVal[1].then((a: any) => {
          
          if (a.status === "success") {
            setLoading(false);
            setTimeControl(true);
            onHandleLoading();
          } else {
            handleError();
            onHandleLoading();
          }
        });
      } else {
        handleError();
      }
    });
  };

  const [TCMPopStarData, setTCMPopStarData] = useState(null);

  const handleEoaContractData = (data) => {
    setTCMPopStarData(data);
  };

  const playFun = () => {
    // console.log(TCMPopStarData);
    if (TCMPopStarData === undefined) {
      const emptyRegion = findEmptyRegion();
      setEmptyRegionNum({ x: emptyRegion, y: 0 });
    } else {
      setEmptyRegionNum({ x: 0, y: 0 });
    }
    localStorage.setItem("showGameOver", "false");
    const ctx = canvasRef?.current?.getContext("2d");
    if (ctx && canvasRef) {
      drawGrid(ctx, hoveredSquare, true);
      interactHandleTCM(
        emptyRegionNum,
        palyerAddress,
        selectedColor,
        "interact",
        null
      );
    }
  };

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!visibleAreaRef.current || !canvasRef.current) return;

      const rect = visibleAreaRef.current.getBoundingClientRect();
      mouseXRef.current = event.clientX - rect.left;
      mouseYRef.current = event.clientY - rect.top;

      const gridX = Math.floor(mouseXRef.current / GRID_SIZE);
      const gridY = Math.floor(mouseYRef.current / GRID_SIZE);

      setHoveredSquare({ x: gridX, y: gridY });

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawGrid(ctx, hoveredSquare, false);
      }
    },
    [drawGrid, hoveredSquare]
  );

  const handleMouseMoveData = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!visibleAreaRef.current || !isDragging) return;

      const dx = translateX - event.clientX;
      const dy = translateY - event.clientY;

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
          drawGrid(ctx, hoveredSquare, false);
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

  const DEFAULT_PARAMETERS_TYPE = "struct DefaultParameters";

  const get_function_param = async (
    function_name: string,
    common_json: any[] = []
  ) => {
    const abi_json = updateAbiJson;

    if (abi_json === "") {
      return [];
    }
    if (!function_name) {
      return [];
    }
    let function_def = abi_json.filter(
      (entry) => entry.name === function_name && entry.type === "function"
    );
    if (!function_def) {
      function_def = abi_json.filter(
        (entry) => entry.name === "interact" && entry.type === "function"
      );

      if (!function_def) {
        return [];
      }
    }
    let res = {};
    update_app_value(-1);
    function_def.forEach((param) => {
      (async () => {
        const filteredInputs = param.inputs.filter((component, index) => {
          const hasStructDefaultParameters = component.internalType.includes(
            DEFAULT_PARAMETERS_TYPE
          );
          const filteredEnum = param.inputs.filter((component) =>
            component.internalType.includes("enum ")
          );
          setParamInputs(filteredEnum);
          if (hasStructDefaultParameters) {
            update_app_value(index);
          }

          return !hasStructDefaultParameters;
        });
        if (filteredInputs) {
          const copy_filteredInputs = deepCopy(filteredInputs);

          res = get_struct(copy_filteredInputs);

          setConvertedParamsData(res);
        }
      })();
    });

    return res;
  };

  const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  const get_struct = (components: any) => {
    const res: any = {};
    components.forEach((component) => {
      if (component.internalType.startsWith("struct ")) {
        component = get_struct(component.components);
      } else if (component.internalType.includes("enum ")) {
        component["enum_value"] = get_enum_value(
          component.internalType.replace("enum ", "")
        );
      }
      component["type"] = get_value_type(component.type);
    });

    return components;
  };
  const [enumValue, setEnumValue] = useState({});
  const get_enum_value = (enumName: string) => {
    const res = [] as any;

    let systemCommonData = updateAbiCommonJson;

    const enumData = systemCommonData.ast.nodes.find(
      (node) => node.name === enumName
    );
    let key = 0;

    enumData.members.forEach((member) => {
      if (member.nodeType === "EnumValue") {
        res.push(member.name);
      }
    });

    return res;
  };

  const get_value_type = (type: string) => {
    if (type === undefined) {
      return type;
    }
    if (type.includes("int")) {
      return "number";
    } else if (type === "address") {
      return "string";
    } else {
      return type;
    }
  };

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
    setPopExhibit(false);
    setShowOverlay(false);
  };

  const onHandleLoading = () => {
    setLoading(false);
  };

  const onHandleLoadingFun = () => {
    setLoading(true);
  };

  const handleUpdateAbiJson = (data: any) => {
    setUpdate_abi_json(data);
  };

  const handleUpdateAbiCommonJson = (data: any) => {
    setUpdate_abi_Common_json(data);
  };

  const handleItemClick = (content) => {
    setMainContent(content);
  };
  const handleAddClick = (content) => {
    if (content === "topUp") {
      setTopUpType(true);
    } else {
      disconnect();
    }
  };

  const netContent = [{ name: "TESTNET" }, { name: "MAINNET" }];
  const addressContent = [
    { name: "Top up", value: "topUp" },
    { name: "Disconnect", value: "disconnect" },
  ];

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
      if (ctx && appName !== "BASE/TCMPopStarSystem") {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawGrid(ctx, hoveredSquare, false);
      } else {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawGrid(ctx, hoveredSquare, true);
      }
    }
  }, [
    appName,
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
    const handleMouseMove = (event: any) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const gridX = Math.floor((mouseX + scrollOffset.x) / GRID_SIZE);
      const gridY = Math.floor((mouseY + scrollOffset.y) / GRID_SIZE);
      setCoordinates({ x: gridX, y: gridY });
      setHoveredSquare({ x: gridX, y: gridY });
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

  useEffect(() => {
    if (
      appName === "BASE/TCMPopStarSystem"
    ) {
      setPopStar(true);
    }
  }, [appName]);

  useEffect(() => {
    if (isConnected) {
      if (balance && (Number(balance) / 1e18).toFixed(8) < "0.000001") {
        setTopUpType(true);
      }
    }
  }, [(Number(balance) / 1e18).toFixed(8), isConnected]);

  const balanceSW = balanceFN.data?.value ?? 0n;
  
  useEffect(() => {
    if (isConnected) {
      if ((Number(balance) / 1e18).toFixed(8) < "0.000001") {
        setTopUpType(true);
      }
    }
  }, [(Number(balance) / 1e18).toFixed(8), isConnected]);

  return (
    <>
      <div className={style.container}>
        <img
          className={style.containerImg}
          src={pixeLawlogo}
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
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className={style.btnConnect}
                        >
                          CONNECT
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button">
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div
                        style={{
                          gap: 12,
                        }}
                        onMouseEnter={() => {
                          setAddressModel(true);
                        }}
                        onMouseLeave={() => {
                          setAddressModel(false);
                        }}
                      >
                        {" "}
                        {chain.name}&nbsp;&nbsp;
                        <button
                          style={{
                            border: "none",
                            background: "none",
                            color: "#fff",
                            fontFamily: "Silkscreen,cursive",
                            height: "55px",
                          }}
                          type="button"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </button>
                        {addressModel && (
                          <div className={style.downBox}>
                            {addressContent.length > 0 &&
                              addressContent.map((item, index) => (
                                <div
                                  className={style.downBoxItem}
                                  key={index}
                                  onClick={() => handleAddClick(item.value)}
                                >
                                  {item.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>

      <div style={{ display: "flex", height: "100vh", overflowY: "hidden" }}>
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
          <div ref={visibleAreaRef} className={style.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_WIDTH}
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
          setPageClick={handlePageClick}
          handlePageClickIs={handlePageClickIs}
          onUpdateAbiJson={handleUpdateAbiJson}
          onUpdateAbiCommonJson={handleUpdateAbiCommonJson}
          onHandleLoading={onHandleLoading}
          onHandleLoadingFun={onHandleLoadingFun}
        />
      </div>

      {popExhibit === true ? (
        <>
          {showOverlay && <div className={style.overlay} />}
          <PopUpBox
            addressData={addressData}
            coordinates={coordinates}
            onHandleExe={onHandleExe}
            selectedColor={selectedColor}
            interactHandle={interactHandle}
            onHandleLoading={onHandleLoading}
            onHandleLoadingFun={onHandleLoadingFun}
            paramInputs={paramInputs}
            convertedParamsData={convertedParamsData}
            enumValue={enumValue}
            action={action}
          />
        </>
      ) : (
        ""
      )}
      {topUpType ? (
        <div
          className={style.overlay}
          onClick={(event) => {
            if (
              !event.target.classList.contains("topBox") &&
              event.target.classList.contains(style.overlay)
            ) {
              setTopUpType(false);
            }
          }}
        >
          <TopUpContent
            setTopUpType={setTopUpType}
            mainContent={mainContent}
            palyerAddress={palyerAddress}
          />
        </div>
      ) : null}
      {popStar === true ? (
        <div
          className={
            panningType !== "false"
              ? style.overlayPopStar
              : style.overlayPopStarFl
          }
          onClick={() => {
            setPopStar(false);
            setBoxPrompt(true);
          }}
        >
          <PopStar setPopStar={setPopStar} playFun={playFun} />
        </div>
      ) : null}
      {(boxPrompt === true && appName === "BASE/PopStarSystem") ||
      appName === "BASE/TCMPopStarSystem" ? (
        <BoxPrompt
          coordinates={coordinates}
          timeControl={timeControl}
          playFun={playFun}
          handleEoaContractData={handleEoaContractData}
        />
      ) : null}
    </>
  );
}

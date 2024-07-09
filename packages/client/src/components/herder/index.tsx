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
import { useDisconnect } from "wagmi";
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
  const [nnn, setnnn] = useState(25);
  const [uhn, setuhn] = useState("");
  const [qw, setqw] = useState(false);
  const [ass, setass] = useState(false);
  const [aq, setaq] = useState(false);
  const [ll, setll] = useState(false);
  const [hhh, sethhh] = useState(false);
  const [pia, setpia] = useState(false);
  const [plokkk, setplokkk] = useState(false);
  const gridCanvasRef = React.useRef(null);
  const [aww, setaww] = useState<bigint | null>(null);
  const [tCMPopStarTime, setTCMPopStarTime] = useState(null);
  const cnb = useRef<HTMLCanvasElement>(null);
  const bng = useRef<HTMLDivElement>(null);
  const [vbs, setvbs] = useState(null);
  const [az, setaz] = useState(0);
  const [axx, setaxx] = useState(0);
  const [avb, setavb] = useState({ x: 0, y: 0 });
  const [acx, setacx] = useState({ x: 0, y: 0 });
  const [zxc, setzxc] = useState({ x: 0, y: 0 });
  const [afgd, setafgd] = useState([]);
  const [uhm, setuhm] = useState([]);
  const [ss, setss] = useState({ x: 0, y: 0 });
  const [vdf, setvdf] = useState(false);
  const [nn, setnn] = useState(0);
  const [nm, setnm] = useState(0);

  const bda = useEntityQuery([Has(Pixel)]);
  const entities_app = useEntityQuery([Has(App)]);
  const bfs = document.documentElement.clientWidth;
  const bff = document.documentElement.clientHeight;

  const [hyu, sethyu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const ghy = useRef<{ x: number; y: number } | null>(null);
  const dfg = window.sessionStorage.getItem("selectedColorSign");

  const [asfgb, setasfgb] = useState(dfg !== null ? dfg : "#ffffff");
  const abn = useRef(0);
  const abb = useRef(0);
  const bhg = window.localStorage.getItem("panning");
  const nmh = (x: number, y: number) =>
    encodeEntity({ x: "uint32", y: "uint32" }, { x, y });

  const bgfd =
    palyerAddress.substring(0, 4) +
    "..." +
    palyerAddress.substring(palyerAddress.length - 4);

  const bbfd = publicClient.chain.name;
  const capitalizedString =
    bbfd.charAt(0).toUpperCase() + bbfd?.slice(1).toLowerCase();

  const btyr = publicClient.getBalance({ address: palyerAddress });
  btyr.then((a: any) => {
    setaww(a);
  });
  const natIve = publicClient.chain.nativeCurrency.decimals;
  const vdas = () => {
    setnnn(nnn - 5);
    setngd(ngd - 6);
    setss({ x: 0, y: 0 });
    setaz(0);
    setaxx(0);
  };
  const vdaa = () => {
    setnnn(nnn + 5);
    setngd(ngd + 6);
    setss({ x: 0, y: 0 });
    setaz(0);
    setaxx(0);
  };
  const [ngd, setngd] = useState(32);
  function csas(color: any) {
    setasfgb(color);
    window.sessionStorage.setItem("selectedColorSign", color);
  }

  const zxdg = () => {
    sethyu(null);
    if (bdadgx.current) {
      clearTimeout(bdadgx.current);
      bdadgx.current = null;
    }
    seta(false);
  };

  const mkl: { avb: { x: number; y: number }; value: any }[] = [];
  if (bda.length !== 0) {
    bda.forEach((a) => {
      const avb = decodeEntity({ x: "uint32", y: "uint32" }, a);
      const value = getComponentValueStrict(Pixel, a);

      if (value.text === "_none") {
        value.text = "";
      }
      if (value.color === "0") {
        value.color = "#2f1643";
      }
      mkl.push({ avb, value });
    });
  }

  const cfrt = (x: number, y: number) => {
    return mkl.find((a) => a.avb.x === x && a.avb.y === y);
  };

  const j = localStorage.getItem("manifest") as any;

  const parts = j?.split("/") as any;
  let worldAbiUrl: any;
  if (j) {
    if (parts[0] === "BASE") {
      worldAbiUrl = ("https://pixelaw-game.vercel.app/" +
        `${parts[1].replace(/\.abi\.json/g, "")}` +
        ".abi.json") as any;
    } else {
      worldAbiUrl = j;
    }
  } else {
    worldAbiUrl = "https://pixelaw-game.vercel.app/Paint.abi.json";
  }

  const grq = (event: React.MouseEvent<HTMLDivElement>) => {
    if (plokkk === true) {
      return;
    }
    seta(false);
    setbgra(false);
    setqw(false);
    if (bdadgx.current) {
      clearTimeout(bdadgx.current);
      bdadgx.current = null;
    }
    const a = get_function_param(action);

    a.then((x) => {
      const ffty = Object.keys(x).length === 0;

      if (aaas) {
        seta(false);
        setbgra(false);
      } else {
        const canvas = cnb.current as any;
        const ki = canvas.getBoundingClientRect();
        const nn = event.clientX - ki.left;
        const nm = event.clientY - ki.top;
        const xx = Math.floor(nn / ngd);
        const xxx = Math.floor(nm / ngd);
        setzxc({ x: xx, y: xxx });
        const xxc = { x: xx, y: xxx };
        sethyu(xxc);
        if (ffty) {
          if (asfgb && avb) {
            ghy.current = avb;
            setbgra(false);
            if (j === "BASE/TCMPopStarSystem") {
              cghe(avb, palyerAddress, asfgb, action, null);
            } else {
              v(avb, palyerAddress, asfgb, action, null);
            }

            abn.current = nn;
            abb.current = nm;
            handleData(hyu as any);
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const { x, y } = avb;
              ctx.fillStyle = asfgb;
              ctx.fillRect(x * ngd - ss.x, y * ngd - ss.y, ngd, ngd);
              if (j === "BASE/TCMPopStarSystem") {
                ddr(ctx, avb, true);
              }
              ddr(ctx, avb, false);
            }
          }
        } else {
          setqw(true);
        }

        setbgra(false);
        setvdf(true);

        setaz(0);
        setaxx(0);
      }
    });
  };

  let timeout: NodeJS.Timeout;
  const [bgra, setbgra] = useState(false);
  const [ttc, settc] = useState(false);
  const bdadgx = useRef<NodeJS.Timeout | null>(null);
  const [aaas, seta] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastDragEndX, setLastDragEndX] = useState(0);
  const [fingerNum, setFingerNum] = useState(0);
  const asnm = nmh(avb.x, avb.y);
  const b = getComponentValue(Pixel, asnm) as any;
  const action = b && b.action ? b.action : "interact";
  const c = 150;
  const d = (event: React.MouseEvent<HTMLDivElement>) => {
    setFingerNum(event.buttons);
    if (plokkk === true) {
      return;
    }
    setbgra(true);

    setaz(event.clientX);
    setaxx(event.clientY);
    get_function_param(action);
    bdadgx.current = setTimeout(() => {
      seta(true);
    }, c);
  };

  const e = () => {
    setplokkk(true);
  };
  const f = () => {
    setplokkk(false);
  };

  const fft = () => {
    const gridSize = ngd;
    const checkSize = 10;

    const ffty = (x, y) => {
      const encodeEntityNum = nmh(x, y);
      const value = getComponentValue(Pixel, encodeEntityNum);
      return value === undefined;
    };

    let px = 0,
      x = 0,
      y = 0;

    while (true) {
      let res = ffty(x, y);

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
    console.log(px, 0);
  };

  const v = (
    avb: any,
    palyerAddress: any,
    asfgb: any,
    actionData: any,
    other_params: any
  ) => {
    setll(true);

    const kii = interact(avb, palyerAddress, asfgb, actionData, other_params);

    kii.then((kiik: any) => {
      if (kiik[1]) {
        kiik[1].then((a: any) => {
          if (a.status === "success") {
            setll(false);
            mmn();
          } else {
            handleError();
            mmn();
          }
        });
      } else {
        handleError();
      }
    });
  };
  const cghe = (
    avb: any,
    palyerAddress: any,
    asfgb: any,
    actionData: any,
    other_params: any
  ) => {
    setll(true);

    const kii = interactTCM(
      avb,
      palyerAddress,
      asfgb,
      actionData,
      other_params
    );

    kii.then((kiik: any) => {
      if (kiik[1]) {
        kiik[1].then((a: any) => {
          if (a.status === "success") {
            setass(true);
            setll(false);
            settc(true);
            mmn();
          } else {
            handleError();
            mmn();
          }
        });
      } else {
        handleError();
      }
    });
  };
  const ddr = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      hyu: { x: number; y: number } | null,
      playType: any
    ) => {
      let pix_text;

      ctx.fillRect(0, 0, bfs, bff);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#000000";
      const checkSize = 10;
      for (let x = 0; x < bfs; x += ngd) {
        ctx.beginPath();
        ctx.moveTo(x - ss.x, 0);
        ctx.lineTo(x - ss.x, bff);
        ctx.stroke();
      }
      for (let y = 0; y < bff; y += ngd) {
        ctx.beginPath();
        ctx.moveTo(0, y - ss.y);
        ctx.lineTo(bfs, y - ss.y);
        ctx.stroke();
      }

      const dfge = 15;
      const hty = 0.8;
      const fontWeight = "normal";
      const fontSize = nnn === 25 ? dfge : dfge + (nnn - 25) * hty;
      ctx.font = `${fontWeight} ${fontSize}px Arial`;

      const vbdas = {
        x: Math.max(0, Math.floor(ss.x / ngd)),
        y: Math.max(0, Math.floor(ss.y / ngd)),
        width: Math.ceil(document.documentElement.clientWidth / ngd),
        height: Math.ceil(document.documentElement.clientHeight / ngd),
      };
      for (let i = vbdas.x; i < vbdas.x + vbdas.width; i++) {
        for (let j = vbdas.y; j < vbdas.y + vbdas.height; j++) {
          const o = i * ngd - ss.x;
          const oo = j * ngd - ss.y;
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#2e1043";
          ctx.strokeRect(o, oo, ngd, ngd);
          ctx.fillStyle = "#2f1643";
          ctx.fillRect(o, oo, ngd, ngd);
          const a = cfrt(i, j) as any;
          if (a) {
            ctx.fillStyle = a.value.color;
            ctx.fillRect(o, oo, ngd, ngd);
            if (a.value.text) {
              ctx.fillStyle = "#000";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              if (a.value.text && /^U\+[0-9A-Fa-f]{4,}$/.test(a.value.text)) {
                pix_text = String.fromCodePoint(
                  parseInt(a.value.text.substring(2), 16)
                );
              } else {
                pix_text = a.value.text;
              }

              const textX = o + ngd / 2;
              const textY = oo + ngd / 2;
              ctx.fillText(pix_text, textX, textY);
            }
          }
        }
      }

      if (playType === true) {
        const emptyRegion = fft();
      }
      if (asfgb && hyu) {
        ctx.fillStyle = asfgb;
        ctx.fillRect(avb.x * ngd - ss.x, avb.y * ngd - ss.y, ngd, ngd);
      }

      if (hyu) {
        ctx.canvas.style.cursor = "pointer";
      } else {
        ctx.canvas.style.cursor = "default";
      }
    },
    [ngd, avb, nnn, bfs, cfrt, bff, asfgb, ss]
  );

  const [mm, setmm] = useState(null);

  const bdcx = (data) => {
    setmm(data);
  };

  const playFun = () => {
    if (mm === undefined) {
      const emptyRegion = fft();
      setacx({ x: emptyRegion, y: 0 });
    } else {
      setacx({ x: 0, y: 0 });
    }
    localStorage.setItem("showGameOver", "false");
    const ctx = cnb?.current?.getContext("2d");
    if (ctx && cnb) {
      ddr(ctx, hyu, true);
      cghe(acx, palyerAddress, asfgb, "interact", null);
    }
  };

  const k = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!bng.current || !cnb.current) return;

      const ki = bng.current.getBoundingClientRect();
      abn.current = event.clientX - ki.left;
      abb.current = event.clientY - ki.top;

      const xx = Math.floor(abn.current / ngd);
      const xxx = Math.floor(abb.current / ngd);

      sethyu({ x: xx, y: xxx });

      const ctx = cnb.current.getContext("2d");
      if (ctx) {
        ddr(ctx, hyu, false);
      }
    },
    [ddr, hyu]
  );

  const ppl = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!bng.current || !bgra) return;

      const dx = az - event.clientX;
      const dy = axx - event.clientY;

      setaz(event.clientX);
      setaxx(event.clientY);

      setss((prevOffset) => ({
        x: Math.max(0, prevOffset.x + dx),
        y: Math.max(0, prevOffset.y + dy),
      }));

      const canvas = cnb.current;
      if (canvas) {
        const ki = canvas.getBoundingClientRect();
        const nn = event.clientX - ki.left;
        const nm = event.clientY - ki.top;

        setnn(nn);
        setnm(nm);

        const xx = Math.floor((nn + ss.x) / ngd);
        const xxx = Math.floor((nm + ss.y) / ngd);

        sethyu({ x: xx, y: xxx });

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ddr(ctx, hyu, false);
        }
      }
    },
    [az, axx, bng, ddr, hyu, bgra, ss, ngd]
  );

  const DEFAULT_PARAMETERS_TYPE = "struct DefaultParameters";

  const get_function_param = async (
    function_name: string,
    common_json: any[] = []
  ) => {
    const abi_json = uhn;

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
          setafgd(filteredEnum);
          if (hasStructDefaultParameters) {
            update_app_value(index);
          }

          return !hasStructDefaultParameters;
        });
        if (filteredInputs) {
          const copy_filteredInputs = deepCopy(filteredInputs);

          res = get_struct(copy_filteredInputs);

          setvbs(res);
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

    let systemCommonData = uhm;

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

  const pp = (newPanningValue: any) => {
    setqw(false);
    setvdf(false);
    sethhh(newPanningValue);
  };
  const handleError = () => {
    setll(false);
    mmn();
    toast.error("An error was reported");
  };

  const ppp = () => {
    setqw(false);
    setvdf(false);
  };

  const mmn = () => {
    setll(false);
  };

  const l = () => {
    setll(true);
  };

  const p = (data: any) => {
    setuhn(data);
  };

  const nm_ng = (data: any) => {
    setuhm(data);
  };

  useEffect(() => {
    const handleScroll = () => {
      setss({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = cnb.current;
    if (canvas && mkl.length > 0) {
      const ctx = canvas.getContext("2d");
      if (ctx && j !== "BASE/TCMPopStarSystem") {
        ctx.clearRect(0, 0, bfs, bff);
        ddr(ctx, hyu, false);
      } else {
        ctx.clearRect(0, 0, bfs, bff);
        ddr(ctx, hyu, true);
      }
    }
  }, [j, ddr, bfs, bff, mkl.length, hyu, nn, nm]);

  useEffect(() => {
    const canvas = cnb.current as any;

    const handleMouseMove = (event: any) => {
      const ki = canvas.getBoundingClientRect();
      const nn = event.clientX - ki.left;
      const nm = event.clientY - ki.top;
      const xx = Math.floor((nn + ss.x) / ngd);
      const xxx = Math.floor((nm + ss.y) / ngd);
      setavb({ x: xx, y: xxx });
      sethyu({ x: xx, y: xxx });
      ghy.current = { x: xx, y: xxx };
    };

    const handleScroll = () => {
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setss({ x: scrollX, y: scrollY });
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
  }, [cnb, ss]);

  const [mainContent, setMainContent] = useState("MAINNET");
  const [showList, setShowList] = useState(false);
  const [juy, setjuy] = useState(false);

  const handleItemClick = (content) => {
    setMainContent(content);
  };
  const handleAddClick = (content) => {
    if (content === "topUp") {
      setaq(true);
    } else {
      disconnect();
    }
  };
  useEffect(() => {
    if (j === "BASE/PopStarSystem" || j === "BASE/TCMPopStarSystem") {
      setpia(true);
    }
  }, [j]);

  const netContent = [{ name: "TESTNET" }, { name: "MAINNET" }];
  const addressContent = [
    { name: "Top up", value: "topUp" },
    { name: "Disconnect", value: "disconnect" },
  ];

  useEffect(() => {
    if (isConnected) {
      if (aww && (Number(aww) / 1e18).toFixed(8) < "0.000001") {
        setaq(true);
      }
    }
  }, [(Number(aww) / 1e18).toFixed(8), isConnected]);

  const balanceSW = btyr.data?.value ?? 0n;
  useEffect(() => {
    if (isConnected) {
      if ((Number(aww) / 1e18).toFixed(8) < "0.000001") {
        setaq(true);
      }
    }
  }, [(Number(aww) / 1e18).toFixed(8), isConnected]);

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
            className={nnn === 25 ? style.btnBoxY : style.btnBox}
            disabled={nnn === 25}
            onClick={vdas}
          >
            −
          </button>
          <span className={style.spanData}>{nnn}%</span>
          <button
            className={nnn === 100 ? style.btnBoxY : style.btnBox}
            disabled={nnn === 100}
            onClick={vdaa}
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
                          setjuy(true);
                        }}
                        onMouseLeave={() => {
                          setjuy(false);
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
                        {juy && (
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
          onMouseDown={d}
          onMouseUp={grq}
          onMouseMove={ppl}
          onMouseLeave={zxdg}
          onMouseEnter={k}
        >
          <div ref={bng} className={style.canvasWrapper}>
            <canvas ref={cnb} width={bfs} height={bfs} />
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
                asfgb === option.color ? " selected" : ""
              }`}
              data-color={option.color}
              style={{
                backgroundColor: option.color,
                width: "48px",
                height: "48px",
                display: "inline-block",
              }}
              onClick={() => csas(option.color)}
            >
              {asfgb === option.color && (
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
          avb={avb}
          mkl={mkl}
          pp={pp}
          ll={ll}
          ppp={ppp}
          setplokkk={e}
          f={f}
          p={p}
          bnfa={nm_ng}
          mmn={mmn}
          l={l}
        />
      </div>

      {qw === true ? (
        <>
          {vdf && <div className={style.overlay} />}
          <PopUpBox
            bgfd={bgfd}
            avb={avb}
            ppp={ppp}
            asfgb={asfgb}
            v={v}
            mmn={mmn}
            l={l}
            afgd={afgd}
            vbs={vbs}
            enumValue={enumValue}
            action={action}
          />
        </>
      ) : (
        ""
      )}
      {aq ? (
        <div
          className={style.overlay}
          onClick={(event) => {
            if (
              !event.target.classList.contains("topBox") &&
              event.target.classList.contains(style.overlay)
            ) {
              setaq(false);
            }
          }}
        >
          <TopUpContent
            setaq={setaq}
            mainContent={mainContent}
            palyerAddress={palyerAddress}
          />
        </div>
      ) : null}
      {pia === true ? (
        <div
          className={
            bhg !== "false" ? style.overlayPopStar : style.overlayPopStarFl
          }
          onClick={() => {
            setpia(false);
            setass(true);
          }}
        >
          <PopStar setpia={setpia} playFun={playFun} />
        </div>
      ) : null}
      {(ass === true && j === "BASE/PopStarSystem") ||
      j === "BASE/TCMPopStarSystem" ? (
        <BoxPrompt avb={avb} ttc={ttc} playFun={playFun} bdcx={bdcx} />
      ) : null}
    </>
  );
}

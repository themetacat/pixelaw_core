import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import style from "./index.module.css";
import warning from "../../images/warning.png";
import rightIcon from "../../images/duihao.png";
import loadingIcon from "../../images/loading (2).png";
import trunOff from "../../images/turnOffBtn.png";
import { imageIconData } from "../imageIconData";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../../MUDContext";
import { abi_json } from "../../mud/createSystemCalls";
import { resourceToHex, ContractWrite, getContract } from "@latticexyz/common";
import RightPart, { addressToEntityID } from "../rightPart";
import {
  Abi,
  encodeFunctionData,
  parseEther,
  decodeErrorResult,
  toHex,
} from "viem";
import { convertToString, coorToEntityID } from "../rightPart/index";
import Select from "../select";
import {
  encodeEntity,
  syncToRecs,
  decodeEntity,
} from "@latticexyz/store-sync/recs";
import {
  Has,
  getComponentValueStrict,
  getComponentValue,
  AnyComponentValue,
} from "@latticexyz/recs";
import { spanish } from "viem/accounts";
import { flare } from "viem/chains";

interface Props {
  avb: any;
  ttc: any;
  playFun: any;
  bdcx : any;
}

export default function BoxPrompt({ avb,ttc,playFun,bdcx  }: Props) {
  const {
    components: {
      App,
      Pixel,
      AppName,
      Instruction,
      TCMPopStar,
      TokenBalance,
      UserDelegationControl,
    },
    network: { playerEntity, publicClient, palyerAddress },
    systemCalls: { interact,forMent, payFunction,registerDelegation },
  } = useMUD();
  const [q, setq] = useState(120);
  const [w, setw] = useState(false);
  const [buYBox, setBuYBox] = useState(false);
  const [loadingType, setLoadingType] = useState(false);
  const [e, sete] = useState(false);
  const [r, setr] = useState(false);
  const [t, sett] = useState(false);
  const [congratsType, setCongratsType] = useState(false);
  const [pf, setpf] = useState(false);
  const [pss, setpss] = useState(false);
  const [gs, setgs] = useState(false);
  const [tst, settst] = useState(null);
  const [fs, setfs] = useState(null);
  const [vgf, setvgf] = useState(null);
  const [ge, setge] = useState(null);
  const [bbd, setbbd] = useState({});
  const [po, setpo] = useState(1);
  const coor_entity = coorToEntityID(avb.x, avb.y);
  const [startTime, setStartTime] = useState(null); 
  const pixel_value = getComponentValue(Pixel, coor_entity) as any;
  const entities_app = useEntityQuery([Has(App)]);


 

 

  const cv = () => {
    if (vgf) {
      const poo = payFunction(vgf?.key, po);
      setLoadingType(true);
      poo.then((result) => {
        if (result.status === "success") {
          setLoadingType(false);
          setpss(true);
        } else {
          setLoadingType(false);
          setpf(true);
        }
      })
      .catch((error) => {
        setLoadingType(false);
        setpf(true);
      });
      setTimeout(() => {
        setBuYBox(false);
        setpss(false);
        setpf(false);
      }, 2000);
    }
  };

  const gec = async () => {
    const [account] = await window.ethereum!.request({
      method: "eth_requestAccounts",
    });
    return account;
  };

  const addressToEntityIDTwo = (address: Hex, addressTwo: Hex) =>
    encodeEntity(
      { address: "address", addressTwo: "address" },
      { address, addressTwo }
    );

  const panningType = window.localStorage.getItem("panning");


  const fdfun = async () => {
    try {

      const account = await gec();


      const b = getComponentValue(
        TCMPopStar,
        addressToEntityID(account)
      );
      if(b){
      const tokenBalancePromises = b.tokenAddressArr.map(
        async (item) => {
          try {
            const balance = await getComponentValue(
              TokenBalance,
              addressToEntityIDTwo(account, item)
            );
            return { [item]: balance }; 
          } catch (error) {
            console.error(`Error fetching balance for ${item}:`, error);
            return { [item]: undefined };
          }
        }
      );

   
      const tokenBalanceResults = await Promise.all(tokenBalancePromises);
      setbbd(tokenBalanceResults);
     
  }
  const c = getComponentValue(
    UserDelegationControl,
    addressToEntityIDTwo(account, palyerAddress)
  );
if(c === undefined){
  registerDelegation()
}

      return b;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    const a = fdfun();
    
    
    a.then((b) => {
      if (palyerAddress !== undefined) {
        bdcx(b);
        if(b){

          setge(b?.tokenAddressArr);
          if (b) {
          
            const bb = Number(b.startTime) as any;
            setStartTime(bb);
  
            const vb = Math.floor(Date.now() / 1000); 
  
            const elapsedTime = vb - bb;
  
            const updatedTimeLeft = Math.max(120 - elapsedTime, 0);
            setq(updatedTimeLeft);
           
            const allZeros = b.matrixArray.every((data) => data === 0n);
            
            if (allZeros) {
                setgs(true)
                
            } else {
              
              setgs(false)
              if(b.gameFinished === true){
                setr(true)
              }
            }
           
          }
        }
      
      }
    });
  }, []);

 
  function ggt(tokenAddresses, imageData, bbd) {
    const result = {};

    tokenAddresses?.forEach((address) => {
      if (imageData[address]) {
        const n = Object.values(bbd).find(
          (obj) => obj[address]
        );
        let balance = n ? n[address] : 0;

        if (typeof balance.balance === "bigint") {
          balance = (balance.balance / BigInt(10 ** 18)).toString(); 
        } else {
          balance = balance.balance || "0";
        }

        result[address] = {
          ...imageData[address],
          balance: balance,
        };
      }
    });

    return result;
  }

    const md = ggt(
      ge,
      imageIconData,
      bbd
    );

 


  useEffect(() => {
    if(ttc === true&&gs === false){
      if (tst !== null) {
        const vb = Math.floor(Date.now() / 1000); 
        const timeElapsed = vb - tst;
        const newTimeLeft = 120 - timeElapsed;
        setq(newTimeLeft > 0 ? newTimeLeft : 0);
        if(localStorage.getItem('showGameOver') === 'false'){
          localStorage.setItem('showGameOver','true')
        }
 
      }
    }
  }, [tst,ttc,r,gs]);

  useEffect(() => {
    if(ttc === true&&gs === false){
      
      if (q > 0) {
        const timer = setTimeout(() => {
          setq(q - 1);
          if(localStorage.getItem('showGameOver') === 'false'){
            localStorage.setItem('showGameOver','true')
          }
        }, 1000);
  
        return () => clearTimeout(timer);
      }
     
    }
  }, [q,ttc,r,gs]);

  const minutes1 = Math.floor(q / 120);
  const seconds = q % 120;
  const [selectedOption, setSelectedOption] = useState("option1");

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const mm = 
    (val: any) => {
     
        setpo(po - 1);
      
    };
  const unm = (val: any) => {
  
      setpo(po + 1);

  };



  useEffect(()=>{
   
  
    const payFor = forMent(vgf?.key, po)
    sete(true)
    payFor.then((item)=>{
setfs(item)
  sete(false)
    })
  },[vgf,po])



  return (
    <>
      <div className={style.container}>
        <div className={style.firstPart}>
          <p style={{cursor:"pointer"}}>
          
            {q !== 0&&gs === false ?q : 
            <div onClick={()=>{
              playFun()
            }}>New<br/>Game</div>
            }
          </p>
          {q !== 0&&gs === false ?<p>TIME</p> :null}
        </div>
        <div className={style.twoPart}>
          <p>350$bugs</p>
          <p>REWARDS</p>
        </div>
        <div className={style.threePart}>
          <p>350$bugs</p>
          <p>REWARDS</p>
        </div>
        <div className={style.imgContent}>
       
          {Object.entries(md).map(([key, { src, balance, name }]) => (
            <div key={key} className={style.containerItem}>
              <div className={style.iconFont}>{balance}</div>
              <img className={style.imgconItem} src={src} alt={name} />
            </div>
          ))}
        </div>
        <button
          className={style.buyBtn}
          onClick={() => {
            setBuYBox(!w);
          }}
        >
          BUY
        </button>
        <button
          className={style.warningIcon}
          onClick={() => {
            setw(!w);
          }}
        >
          ?
        </button>
      </div>
      {buYBox === true ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.buYBox}>
            <img
              className={style.turnOff}
              src={trunOff}
              alt=""
              onClick={() => {
                setBuYBox(false);
              }}
            />
            <div className={style.firstBuy}>
              <span className={style.fontBuy}>BUY</span>
              <div className={style.dataIcon}>
                <button
                  onClick={() => {
                    mm(po);
                  }}
                  disabled={po ===1 }
                  className={po === 1 ? style.disabled : (null as any)}
                >
                  -
                </button>
                <p className={style.pp}></p>
                <span className={style.numData}>{po}</span>
                <p className={style.pp}></p>
                <button
                  onClick={() => {
                    unm(po);
                  }}
                  className={po === 120 ? style.disabled : (null as any)}
                >
                  +
                </button>
              </div>
              <div style={{ zIndex: "999999" }}>
                {" "}
                <Select
                  md={md}
                  setvgf={setvgf}
                />
              </div>
            </div>
            <div className={style.twoBuy}>
              <span className={style.fontBuy}>FOR</span>
              <span className={style.fontNum}>{fs}ETH</span>
              {e === true ? (
                <img
                  src={loadingIcon}
                  alt=""
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "5px",
                    color: "#ffffff",
                    filter: "grayscale(100%)",
                  }}
                  className={style.commonCls1}
                />
              ) : null}
            
            </div>

            {pf === true ? (
              <div className={style.patment}>payment failed! try again!</div>
            ) : null}

            <button
              className={style.payBtn}
              onClick={() => {
                cv();
              }}
              disabled={ fs === 0}
              style={{cursor:fs === 0?"not-allowed":"auto"}}
            >
              {pss === true ? (
                <img
                  src={rightIcon}
                  alt=""
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "5px",
                    position: "absolute",
                    left: "50%",
                    top: "25%",
                  }}
                />
              ) : (
                <span >PAY</span>
              )}
              {loadingType === true ? (
                <img
                  src={loadingIcon}
                  alt=""
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "5px",
                    color: "#ffffff",
                    filter: "grayscale(100%)",
                  }}
                  className={style.commonCls1}
                />
              ) : null}
            </button>
          </div>
        </div>
      ) : null}

      {w === true ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.content}>
            <p className={style.title}>How to play?</p>
            <p className={style.actical}>
              5 minutes countdown time to eliminate all the stars.
              <br /> Get 150 $bug rewarded for completions.
              <br />
              In order to complete the game, you may need materials from the
              game This Cursed Machine.
            </p>
            <button
              className={style.btnOk}
              onClick={() => {
                setw(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
      {
      q === 0&&localStorage.getItem('showGameOver') === 'true'
      ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.contentSuccess}>
          <img
              className={style.turnOff}
              src={trunOff}
              alt=""
              onClick={() => {
                localStorage.setItem('showGameOver','false')
                // setr(false);
                // setq(120)
              }}
            />
            <p>Game Over!</p>
            <button
              onClick={() => {
                // setq(120)
                // setr(false);
                playFun()
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : null}
      {
      gs === true
      &&localStorage.getItem('showGameOver') === 'true'
      ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.contentCon}>
          <img
              className={style.turnOff}
              src={trunOff}
              alt=""
              onClick={() => {
                localStorage.setItem('showGameOver','false')
                setCongratsType(false);
              }}
            />
            <p>Congrats！</p>
            <p>+150 $bugs！</p>
            <button
              onClick={() => {
                playFun();
                setgs(false)
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : null}
      {t === true ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.topUp}>
            <img
              src={trunOff}
              alt=""
              onClick={() => {
                sett(false);
              }}
            />
            <p>insufficient gasbalance</p>
            <button>top up</button>
          </div>
        </div>
      ) : null}
    </>
  );
}

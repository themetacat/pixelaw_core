import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import style from "./index.module.css";
import warning from "../../images/warning.png";
import rightIcon from "../../images/duihao.png";
import loadingIcon from "../../images/loading (2).png";
import trunOff from "../../images/turnOffBtn.png";
import { imageIconData } from "../imageIconData";
import Select from "../select";

interface Props {
  panningFromChild: any;
}

export default function BoxPrompt() {
  const [timeLeft, setTimeLeft] = useState(300);
  const [warnBox, setWarnBox] = useState(false);
  const [buYBox, setBuYBox] = useState(false);
  const [loadingType, setLoadingType] = useState(false);
  const [gameType, setGameType] = useState(false);
  const [topUpType, setTopUpType] = useState(false);
  const [congratsType, setCongratsType] = useState(false);
  const [numberData, setNumberData] = useState(30);

  // useEffect(()=>{
  //   console.log(panningFromChild);

  // },[panningFromChild])

  const learnCon = [
    {
      label: "Insi",
      img: "https://cdn.sanity.io/images/70kzkeor/production/b3a4586c6a25bf887f0bdd67dc22b7aaf86909a8-2000x2000.png?w=200&auto=format",
    },
    {
      label: "Repo",
      img: "https://poster-phi.vercel.app/metaverse_learn/282.png",
    },
    {
      label: "Othe",
      img: "https://poster-phi.vercel.app/metaverse_learn/283.png",
    },
  ];

  const panningType = window.localStorage.getItem("panning");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000); // 每秒更新一次倒计时

    return () => clearTimeout(timer); // 清除计时器
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [selectedOption, setSelectedOption] = useState("option1");

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const downHandleNumber = useCallback(
    (val: any) => {
      console.log(val === 0, numberData);
      if (val >= 10) {
        setNumberData(numberData - 10);
      } else {
        toast.error("OUT OF STOCK");
      }
    },
    [numberData]
  );
  const upHandleNumber = (val: any) => {
    if (val <= 20) {
      setNumberData(numberData + 10);
    } else {
      toast.error("EXCEEDS STOCK");
    }
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.firstPart}>
          <p>{`${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`}</p>
          <p>TIME</p>
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
          {imageIconData.map((item, index) => (
            <div key={index} className={style.containerItem}>
              <div className={style.iconFont}>{item.icon}</div>
              <img className={style.imgconItem} src={item.src} alt="" />
            </div>
          ))}
        </div>
        <button
          className={style.buyBtn}
          onClick={() => {
            setBuYBox(!warnBox);
          }}
        >
          BUY
        </button>
        <button
          className={style.warningIcon}
          onClick={() => {
            setWarnBox(!warnBox);
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
                    downHandleNumber(numberData);
                  }}
                  className={numberData === 0 ? style.disabled : (null as any)}
                >
                  -
                </button>
                <p className={style.pp}></p>
                <span className={style.numData}>{numberData}</span>
                <p className={style.pp}></p>
                <button
                  onClick={() => {
                    upHandleNumber(numberData);
                  }}
                  className={numberData === 30 ? style.disabled : (null as any)}
                >
                  +
                </button>
              </div>
              <div style={{ zIndex: "999999" }}>
                {" "}
                <Select optionsTotal={learnCon} />
              </div>
            </div>
            <div className={style.twoBuy}>
              <span className={style.fontBuy}>FOR</span>
              <span className={style.fontNum}>******BUGS</span>
              {/* <span className={style.fontbugs}>(******BUGS)</span> */}
              <br />
            </div>

            <div className={style.patment}> payment failed!try again!</div>

            <button
              className={style.payBtn}
              onClick={() => {
                setBuYBox(false);
              }}
            >
              PAY
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
              ) : (
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
              )}
            </button>
          </div>
        </div>
      ) : null}

      {warnBox === true ? (
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
                setWarnBox(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
      {gameType === true ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.contentSuccess}>
            <p>Game Over!</p>
            <button
              onClick={() => {
                setGameType(false);
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : null}
      {congratsType === true ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.contentCon}>
            <p>Congrats！</p>
            <p>+150 $bugs！</p>
            <button
              onClick={() => {
                setCongratsType(false);
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : null}
      {topUpType === true ? (
        <div
          className={panningType !== "false" ? style.overlayBuy : style.overlay}
        >
          <div className={style.topUp}>
            <img
              src={trunOff}
              alt=""
              onClick={() => {
                setTopUpType(false);
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

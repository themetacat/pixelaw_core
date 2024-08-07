import React, { useEffect } from "react";
import style from "./index.module.css";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import loadingImg from "../../images/loading.png";

interface Props {
  setPopStar: any;
  playFun: any;
  playFuntop: any;
  onTopUpClick: any; // 添加回调函数
  loadingplay: any;
}

export default function PopStar({ setPopStar, playFun, onTopUpClick, playFuntop, loadingplay }: Props) {
  const playAction = localStorage.getItem("playAction");
  const { isConnected } = useAccount();
  const handleConnectClick = () => {

    if (isConnected) {
      if (playAction == 'play') {
        setPopStar(true)
        playFun();
      } else {
        setPopStar(false);
      }
      if (!playFun) {
        onTopUpClick(); // 调用回调函数
      }
    } else {
      // 呼起钱包进行登录
      openConnectModal();
    }
  };

  return (
    <div className={style.content}>
      <p className={style.title}>WELCOME TO POPCRAFT!</p>
      <div className={style.Container}>
        <p className={style.copywritingFirst}>How to play?</p>
        <span className={style.copywritingTwo}>This is a compossibility-based elimination game.You have&nbsp;</span>
        <span className={style.copywritingThree}>5 minutes</span>&nbsp;
        <span className={style.copywritingTwo}>
          {" "}
          to eliminate all the materials.{" "}
        </span>
        <br />
        <span className={style.copywritingTwo}>    Get rewarded with </span>
        <span className={style.copywritingThree}> 150 $bugs</span>
        <span className={style.copywritingTwo}>
          {" "}
          for completing the game.
          <br />
          To complete the game, you may need materials from the game
        </span>
        <a href="https://thiscursedmachine.fun/" target="_blank" rel="noopener noreferrer" className={style.copywritingFour}> This Cursed Machine</a>
        <span className={style.copywritingTwo}>.</span>
      </div>
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
                      className={style.btnPlay}
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
                  <button
                    onClick={handleConnectClick}
                    type="button"
                    className={style.btnPlay}
                  >
                    {
                      loadingplay === true ? (
                        <img
                          src={loadingImg}
                          alt=""
                          className={`${style.commonCls1} ${style.spinAnimation}`}
                        />
                      ) : (
                        <> {playAction == 'play' ? "Play" : "Top Up First"}</>
                      )

                    }
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}

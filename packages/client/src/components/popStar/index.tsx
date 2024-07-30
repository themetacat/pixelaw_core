import React, { useEffect } from "react";
import style from "./index.module.css";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Props {
  setPopStar: any;
  playFun: any;
  playFun1: any;
  onTopUpClick: any; // 添加回调函数
}

export default function PopStar({ setPopStar, playFun, onTopUpClick, playFun1 }: Props) {
  const { isConnected } = useAccount();

  const handleConnectClick = () => {
    if (isConnected) {
      setPopStar(false);
      // playFun1();
      playFun();

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
        <span className={style.copywritingThree}>5 minutes</span>&nbsp;
        <span className={style.copywritingTwo}>
          {" "}
          countdown time to eliminate all the stars.{" "}
        </span>
        <br />
        <span className={style.copywritingTwo}> Get</span>
        <span className={style.copywritingThree}> 150 $bugs</span>
        <span className={style.copywritingTwo}>
          {" "}
          rewarded for completions.
          <br />
          In order to complete the game, made,you may need materials made from
          the game
        </span>
        <span className={style.copywritingFour}> This Cursed Machine</span>
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
                    {playFun1 ? "Play" : "Top Up First"}
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

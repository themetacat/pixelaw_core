import React from "react";
import style from "./index.module.css";

interface Props {
  setPopStar: any;
  playFun: any;
}

export default function PopStar({ setPopStar, playFun }: Props) {
  return (
    <div className={style.content}>
      <p className={style.title}>WELCOME TO TCM-POPSTAR!</p>
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
      <button
        className={style.btnPlay}
        onClick={() => {
          setPopStar(false);
          playFun();
        }}
      >
        PLAY
      </button>
    </div>
  );
}

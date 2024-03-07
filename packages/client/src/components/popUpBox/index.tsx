/* eslint-disable react/no-unknown-property */
import React from "react";

import style from './index.module.css'

export default function popUpBox() {
  return (
<div   className={style.container}>


    <div
    className={style.content}
    >
      <h2  className={style.title}>
    {/* //    className="text-[#FFC400] text-center uppercase text-[32px] font-silkscreen" */}
        select direction for snake
      </h2>
      <div>
        <div 
        className={style.bottomBox}>
          <label
            // className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-center text-white capitalize"
            // for="enum-group-direction"
            className={style.direction}
          >
            direction
          </label>
          <div className={style.btnBox}>
            <button className={style.btn}>
              Left
            </button>
            <button className={style.btn}>
              Right
            </button>
            <button className={style.btn}>
              Up
            </button>
             <button className={style.btn}>
              Down
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={style.closeBtn}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
        <span className="sr-only">Close</span>
      </button>
    </div>
    </div>







  );
}

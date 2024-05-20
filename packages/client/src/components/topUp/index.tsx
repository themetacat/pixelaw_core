import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import trunOff from "../../images/turnOffBtn.png";
import { SendTransaction } from "../SendTransaction";
import { Account } from "../Account";
import toast, { Toaster } from "react-hot-toast";
import { Connect } from "../Connect";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import warningImg from "../../images/warning.png";
import { useMUD } from "../../MUDContext";
import { getNetworkConfig } from "../../mud/getNetworkConfig";
import { type Hex, parseEther } from "viem";
import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from "wagmi";
interface Props {
  setTopUpType: any;
  palyerAddress: any;
  mainContent: any;
}

export default function TopUp({
  setTopUpType,
  palyerAddress,
  mainContent,
}: Props) {
  const [warningModel, setWarningModel] = useState(false);
  const [withDrawType, setWithDrawType] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [transferPayType, setTransferPayType] = useState(false);
  const [heightNum, setHeightNum] = useState('555');
  const [privateKey, setprivateKey] = useState("");
  const [hashVal, setHashVal] = useState(null);
  const {
    network: { walletClient },
  } = useMUD();
  const { address, isConnected } = useAccount();
  const MIN_SESSION_WALLET_BALANCE = parseEther("0.0000002");
  const balanceResultSW = useBalance({
    address: palyerAddress,
  });
  const [inputValue, setInputValue] = useState('0.0003');
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })
  const balanceSW = balanceResultSW.data?.value ?? 0n;
  const balanceResultEOA = useBalance({
    address: address,
  })     

  async function withDraw() {
    if (balanceSW > MIN_SESSION_WALLET_BALANCE) {
      const value = balanceSW - MIN_SESSION_WALLET_BALANCE;
      const hash = await walletClient.sendTransaction({
        to: address,
        value: value,
      });
      setHashVal(hash)
   
      
    } else {
      console.log("BALANCE not enough");
    }
  }

  useEffect(() => {
    const networkConfigPromise = getNetworkConfig();
    networkConfigPromise.then((networkConfigPromiseVal) => {
      setprivateKey(networkConfigPromiseVal.privateKey);
    });
  }, []);
  const [balanceSWNum, setBalanceSWNum] = useState(Number(balanceSW) / 1e18);


  const handleChange = (event) => {
    setInputValue(event.target.value);
    setTransferPayType(false)
  };
  const handleChangePrivate = (event) => {
    setprivateKey(event.target.value);(event.target.value);
    setTransferPayType(false)
  };
  const handleChangeBalanceSWNum= (event) => {
    setBalanceSWNum(event.target.value);(event.target.value);
    setTransferPayType(false)
  };

  const handleTogglePassword = (privateKey: any) => {
    navigator.clipboard.writeText(privateKey).then(
      function () {
        toast.success("Text copied to clipboard");
      },
      function (err) {
        toast.error("Error in copying text");
      }
    );
  };

  const handleCopy = () => {
    // 使用Clipboard API将输入框的值复制到剪贴板上
    navigator.clipboard.writeText(palyerAddress).then(
      function () {
        toast.success("Text copied to clipboard");
      },
      function (err) {
        toast.error("Error in copying text");
      }
    );
  };

  const bridgeHandle = () => {
    if (mainContent === "MAINNET") {
      window.open("https://redstone.xyz/deposit");
    } else {
      window.open("https://garnetchain.com/deposit");
    }
  };

  const transferPay = () => {
    // console.log(inputValue,typeof(inputValue));
    submit()
    // //console.log(Number(balanceSW) / 1e18, inputValue);

    if (inputValue < 0 || inputValue > Number(balanceSW) / 1e18) {
      // //console.log("不能转");
      setTransferPayType(true);
    } else {
      setTransferPayType(false);
    }

  };

  async function submit() {
    //console.log(2222);
    
    // const to = formData.get('address') as Hex
    // session wallet 
    const to = palyerAddress
    const value = inputValue 
    //console.log(inputValue,666,to);
    
   const a = sendTransaction({ to, value: parseEther(inputValue) })
   //console.log(a);
   
  }
  return (
    <div className={style.topBox}>
      <div className={style.cant}>
        <span>TOP UP</span>
        <img
          className={style.imgOff}
          src={trunOff}
          alt=""
          onClick={() => {
            setTopUpType(false);
          }}
        />
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
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <div
              style={{
                // backgroundColor: "#f4f3f1",
                padding: "0px 16px 16px 16px",
                height:warningModel === true?"535px":"auto",
                overflowY:warningModel === true?"scroll":"auto"
              }}
              className={warningModel === true ?style.canvasWrapper:null as any}
            >
              <div className={style.onePart}>
                <p className={style.titleOne1}>MAIN WALLET</p>
                <div style={{ display: "flex" }}>
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    className={style.btnPart}
                  >
                    <button
                      onClick={(event) => {
                        openChainModal();
                      }}
                      style={{ border: "none", background: "none" }}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            // overflow: 'hidden',
                            color:"#000",
                            marginRight: 4,
                           
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                   
                    </button>
                   <div style={{color:"#000",fontSize:"14px"}}>
                   {account.displayName}
                   { balanceResultEOA.data?.value ? ` (${(Number(balanceResultEOA.data?.value)/1e18).toFixed(6)})` : " 0ETH" } 
                   </div>
                 
                  </div>

                  <span className={style.bridgeBTN} onClick={bridgeHandle}>
                    Bridge
                  </span>
                </div>
              </div>
              <p className={style.titleOne}>
                SESSION WALLET{" "}
                <img
                  src={warningImg}
                  alt=""
                  style={{
                    width: "12px",
                    height: "12px",
                    marginLeft: "10px",
                    lineHeight: "20px",
                  }}
                  onMouseEnter={() => {
                    setWarningModel(true);
                  }}
                  onMouseLeave={() => {
                    setWarningModel(false);
                  }}
                />
                {warningModel === true ? (
                  <div className={style.warningCon}>
                    The session wallet is a private key stored in your browser's
                    local storage. It allows you to play games without having to
                    confirm transactions, but is less secure.
                    <br />
                    Only deposit very small amounts of ETH in this wallet. We
                    recommend no more than 0.0003 ETH at a time, this amount
                    lets you complete 1000 transactions in PixeLAW.
                  </div>
                ) : null}
              </p>
              <div className={style.partTwo}>
                <div className={style.addcon}>
                  <p>ADDRESS</p>
                  <input
                    type="text"
                    value={palyerAddress}
                    className={style.inputCon}
                  />
                  <span className={style.copyBtn} onClick={handleCopy}>
                    COPY
                  </span>
                </div>
                <div className={style.prvkey}>
                  <p>PRIVATE KEY</p>
                  <input
                    type={showPassword === true ? "text" : "password"}
                    value={privateKey}
                    onChange={handleChangePrivate}
                    className={style.inputCon}
                    onMouseEnter={() => {
                      setShowPassword(true);
                    }}
                    onMouseLeave={() => {
                      setShowPassword(false);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <span
                    className={style.copyBtn}
                    onClick={() => {
                      handleTogglePassword(privateKey);
                    }}
                  >
                    COPY
                  </span>
                </div>
              </div>
              <div className={style.partThree}>
                <span>Session Wallet Balance</span>
                <button
                  onClick={withDraw}
                  onMouseMove={() => {
                    setWithDrawType(true);
                  }}
                  onMouseLeave={() => {
                    setWithDrawType(false);
                  }}
                >
                  {withDrawType === true ? (
                    " Withdraw all"
                  ) : (
                    <>{(Number(balanceSW) / 1e18)===0?(Number(balanceSW) / 1e18):(Number(balanceSW) / 1e18).toFixed(8)}</>
                  )}
                   {hash && <div>Transaction Hash: {hashVal}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
                </button>
              </div>
              <div className={style.partFour}>
                <p>
                  Every onchain interaction uses gas. Top up your gasbalance
                  with funds from any chain.
                </p>
                <div style={{ display: "flex" }}>
                  <span className={style.svgIcon}>
                    <svg
                      style={{
                        backgroundColor: "#f34242",
                        borderRadius: "50%",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 52 52"
                      shape-rendering="crispEdges"
                      fill="white"
                    >
                      <path
                        opacity="0.75"
                        d="M13 19.5L13 13L19.5 13L19.5 19.5L13 19.5Z"
                      ></path>
                      <path d="M13 26L13 19.5L19.5 19.5L19.5 26L13 26Z"></path>
                      <path d="M13 32.5L13 26L19.5 26L19.5 32.5L13 32.5Z"></path>
                      <path
                        opacity="0.75"
                        d="M13 39L13 32.5L19.5 32.5L19.5 39L13 39Z"
                      ></path>
                      <path
                        opacity="0.75"
                        d="M32.5 19.5L32.5 13L39 13L39 19.5L32.5 19.5Z"
                      ></path>
                      <path d="M32.5 26L32.5 19.5L39 19.5L39 26L32.5 26Z"></path>
                      <path d="M32.5 32.5L32.5 26L39 26L39 32.5L32.5 32.5Z"></path>
                      <path
                        opacity="0.75"
                        d="M32.5 39L32.5 32.5L39 32.5L39 39L32.5 39Z"
                      ></path>
                      <path d="M26 39H19.5V32.5H26V39Z"></path>
                      <path d="M32.5 39H26V32.5H32.5V39Z"></path>
                      <path d="M26 19.5H19.5V13H26V19.5Z"></path>
                      <path d="M32.5 19.5H26V13H32.5V19.5Z"></path>
                      <path opacity="0.25" d="M19.5 0V6.5H26V0H19.5Z"></path>
                      <path opacity="0.75" d="M26 45.5V39H32.5V45.5H26Z"></path>
                      <path
                        opacity="0.75"
                        d="M45.5 26L39 26L39 32.5L45.5 32.5L45.5 26Z"
                      ></path>
                      <path
                        opacity="0.75"
                        d="M6.5 26L13 26L13 32.5L6.5 32.5L6.5 26Z"
                      ></path>
                      <path opacity="0.75" d="M26 6.5V13H32.5V6.5H26Z"></path>
                      <path opacity="0.25" d="M26 0V6.5H32.5V0H26Z"></path>
                      <path opacity="0.25" d="M19.5 52V45.5H26V52H19.5Z"></path>
                      <path opacity="0.25" d="M26 52V45.5H32.5V52H26Z"></path>
                      <path
                        opacity="0.25"
                        d="M52 19.5L45.5 19.5L45.5 26L52 26L52 19.5Z"
                      ></path>
                      <path
                        opacity="0.25"
                        d="M52 26L45.5 26L45.5 32.5L52 32.5L52 26Z"
                      ></path>
                      <path
                        opacity="0.25"
                        d="M0 26L6.5 26L6.5 32.5L2.84124e-07 32.5L0 26Z"
                      ></path>
                      <path
                        opacity="0.25"
                        d="M0 19.5L6.5 19.5L6.5 26L2.84124e-07 26L0 19.5Z"
                      ></path>
                      <path opacity="0.75" d="M19.5 6.5V13H26V6.5H19.5Z"></path>
                      <path
                        opacity="0.75"
                        d="M19.5 45.5V39H26V45.5H19.5Z"
                      ></path>
                      <path
                        opacity="0.75"
                        d="M45.5 19.5L39 19.5L39 26L45.5 26L45.5 19.5Z"
                      ></path>
                      <path
                        opacity="0.75"
                        d="M6.5 19.5L13 19.5L13 26L6.5 26L6.5 19.5Z"
                      ></path>
                    </svg>
                  </span>
                  <input
                    name="value"
                    placeholder="Amount (ETH)"
                    type="number"
                    step="0.0001"
                    value={inputValue}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={style.partFive}>
                <span>Available to deposit</span>
                {/* <input
                  name="value"
                  placeholder="Amount (ETH)"
                  type="number"
                  // step="0.0001"
                  value={balanceSWNum}
                  // onChange={handleChangeBalanceSWNum}
                  // required
                /> */}
                { balanceResultEOA.data?.value ? ` (${(Number(balanceResultEOA.data?.value)/1e18).toFixed(6)})` : " 0ETH" } 
              </div>
              <div className={style.partFive}>
                <span>Time to deposit</span>
                <span>A few seconds</span>
              </div>
              <button
                onClick={transferPay}
                className={
                  transferPayType === false
                    ? style.footerBtn
                    : style.footerBtnElse
                }
                // onMouseEnter={() => {
                //   if (inputValue < 0 || inputValue > Number(balanceSW) / 1e18) {
                //     setTransferPayType(true);
                //   } else {
                //     setTransferPayType(false);
                //   }
                // }}
                disabled={transferPayType===true}
              >
                {transferPayType === true
                  ? "Not enough funds"
                  : "Deposit via transfer"}
                 {transferPayType === true&&hash && <div>Transaction Hash: {hash}</div>}
        {transferPayType === true&&isConfirming && <div>Waiting for confirmation...</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
              </button>
                 {/* {transferPayType===true&&isConnected && <SendTransaction palyerAddress={palyerAddress}/>} */}
            </div>
          );
        }}
      </ConnectButton.Custom>
      {/* <Toaster
        toastOptions={{
          duration: 2000,
          style: {
            background: "linear-gradient(90deg, #dedfff,#8083cb)",
            color: "black",
            borderRadius: "8px",
            zIndex: "999999999999",
            marginTop: "50px",
          },
        }}
      /> */}
    </div>
  );
}

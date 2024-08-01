import React, { useEffect, useState } from "react";
import style from "./index.module.css";
import trunOff from "../../images/turnOffBtn.png";
import toast, { Toaster } from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import warningImg from "../../images/warning.png";
import FrameIcon from "../../images/Frame 29Icon.png";
import UnioncopyBtn from "../../images/UnioncopyBtn.png";
import openEye from "../../images/openEye.png";
import turnOffEye from "../../images/turnOffEye.png";
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
  onTopUpSuccess: () => void;
}

export default function TopUp({
  setTopUpType,
  palyerAddress,
  mainContent,
   onTopUpSuccess, 
}: Props) {
  const [warningModel, setWarningModel] = useState(false);
  const [withDrawType, setWithDrawType] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transferPayType, setTransferPayType] = useState(false);
  const [heightNum, setHeightNum] = useState("555");
  const [privateKey, setprivateKey] = useState("");
  const [withDrawHashVal, setwithDrawHashVal] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const {
    network: { walletClient, publicClient },
  } = useMUD();
  const { address, isConnected } = useAccount();
  const MIN_SESSION_WALLET_BALANCE = parseEther("0.0003");
  const balanceResultSW = useBalance({
    address: palyerAddress,
  });
   
   useEffect(() => {
    publicClient.getBalance({ address: palyerAddress }).then((balance: any) => {
      setBalance(Number(balance));
     })
   },[])

  
  const [inputValue, setInputValue] = useState("0.000003");
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
    sendTransactionAsync,
    status
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const {
    isLoading: isConfirmingWith,
    isSuccess: isConfirmedWith,
    isPending: isPendingWith,
  } = useWaitForTransactionReceipt({
    hash: withDrawHashVal,
  });
  
  const balanceSW = balanceResultSW.data?.value ?? 0n;
  
  const balanceResultEOA = useBalance({
    address: address,
  });
  
  async function withDraw() {
    if (parseEther(balance.toString()) > MIN_SESSION_WALLET_BALANCE) {
      const value = parseEther(balance.toString()) - MIN_SESSION_WALLET_BALANCE;
      
      const hash = await walletClient.sendTransaction({
        to: address,
        value: value,
      });
      console.log(hash);
      
      setwithDrawHashVal(hash);
    } else {
      toast.error("BALANCE not enough");
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
    setTransferPayType(false);
  };

  const handleChangeBalanceSWNum = (event) => {
    setBalanceSWNum(event.target.value);
    event.target.value;
    setTransferPayType(false);
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
    if (
      parseFloat(inputValue) > 0 &&
      balanceResultEOA.data?.value !== 0n &&
      parseFloat(inputValue) < Number(balanceResultEOA.data?.value) / 1e18
    ) {
      setTransferPayType(false);

      submit();
    } else {
      setLoading(false);
      setTransferPayType(true);
    }
  };

  async function submit() {
    const to = palyerAddress;
    const value = inputValue;
    
    const result_hash = await sendTransactionAsync({ to, value: parseEther(inputValue) });
    const result = await publicClient.waitForTransactionReceipt({hash: result_hash})
    if (result.status === "success") {
      onTopUpSuccess(); // 调用回调函数
    }
    
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
          const ready = mounted && authenticationStatus !== "loading";
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === "authenticated");

          return (
            <>
              <div className={style.onePart}>
                <p className={style.titleOne1}>MAIN WALLET</p>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }} className={style.btnPart}>
                    <img src={FrameIcon} alt="" className={style.imgICon} />
                    <button
                      onClick={(event) => {
                        openChainModal();
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        padding: "0px",
                      }}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            color: "#000",
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

                      <div className={style.mainFont}>
                        <span>{account.displayName}</span>
                        <img
                          src={UnioncopyBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                          }}
                          alt=""
                          className={style.imgUnionCopyBtn}
                        />
                        <p>
                          {balanceResultEOA.data?.value
                            ? ` (${(Number(balanceResultEOA.data?.value) / 1e18).toFixed(6)})`
                            : " 0ETH"}
                        </p>
                      </div>
                    </button>
                  </div>

                  <span className={style.bridgeBTN} onClick={bridgeHandle}>
                    Bridge
                  </span>
                </div>
              </div>
              <div className={style.partContent}>
                <p>
                  <span className={style.titleOne}> SESSION WALLET </span>
                  <img
                    src={warningImg}
                    alt=""
                    style={{
                      width: "16px",
                      height: "16px",
                      verticalAlign: "middle",
                      marginLeft: "8px",
                    }}
                    onClick={() => {
                      setWarningModel(!warningModel);
                    }}
                  />
                  {warningModel === true ? (
                    <div className={style.warningCon}>
                      <div className={style.triangle}></div>
                      The session wallet is a private key stored in your
                      browser's local storage. It allows you to play games
                      without having to confirm transactions, but is less
                      secure.
                      <br />
                      Only deposit very small amounts of ETH in this wallet. We
                      recommend no more than 0.0003 ETH at a time, this amount
                      lets you complete 1000 transactions in PixeLAW.
                    </div>
                  ) : null}
                </p>

                <div className={style.partTwo}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <img src={FrameIcon} alt="" className={style.imgICon} />
                    <div className={style.addcon}>
                      <input
                        type="text"
                        value={
                          palyerAddress.substring(0, 4) +
                          "..." +
                          palyerAddress.substring(palyerAddress.length - 4)
                        }
                        className={style.inputCon}
                      />
                      <img
                        src={UnioncopyBtn}
                        onClick={handleCopy}
                        alt=""
                        className={style.imgUnioncopyBtn}
                      />
                      <span className={style.ConfirmingFont}>
                        {!isConfirmingWith && (
                          <>{(Number(balance) / 1e18).toFixed(8)}</>
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      withDrawType === true ? style.btnMeB : style.btnMe
                    }
                    onClick={withDraw}
                    onMouseMove={() => {
                      setWithDrawType(true);
                    }}
                    onMouseLeave={() => {
                      setWithDrawType(false);
                    }}
                    disabled={isConfirmingWith}
                  >
                    {withDrawType === true
                      ? "   waiting for confirmation..."
                      : "WITHDRAW ALL"}

                    {isConfirmingWith && (
                      <div style={{ fontSize: "11px" }}>
                        Waiting for confirmation...
                      </div>
                    )}
                  </div>
                </div>
                <div className={style.prvkey}>
                  <p className={style.pqad}>PRIVATE KEY</p>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input
                      type={showPassword === true ? "text" : "password"}
                      value={privateKey}
                      style={{
                        width: showPassword === false ? "140px" : "auto",
                      }}
                      className={style.inputConPassWord}
                    />
                    <img
                      src={showPassword === true ? openEye : turnOffEye}
                      alt=""
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                    <img
                      src={UnioncopyBtn}
                      alt=""
                      className={style.imginputConPassWord}
                      onClick={() => {
                        handleTogglePassword(privateKey);
                      }}
                    />
                  </div>
                  <p className={style.prilf}>
                    Save the private key as soon as possible
                  </p>
                </div>
              </div>

              <div className={style.partFour}>
                <p>
                  Every onchain interaction uses gas. Top up your gasbalance
                  with funds from any chain.
                </p>
                <div className={style.partImo}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      verticalAlign: "middle",
                      height: "34px",
                      width: "400px",
                    }}
                  >
                    <img src={FrameIcon} alt="" className={style.svgIcon} />

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
                  <div className={style.partFive}>
                    <span>Available to deposit</span>

                    {balanceResultEOA.data?.value
                      ? ` (${(Number(balanceResultEOA.data?.value) / 1e18).toFixed(6)})`
                      : " 0ETH"}
                  </div>
                  <div className={style.partFive}>
                    <span>Time to deposit</span>
                    <span>A few seconds</span>
                  </div>
                </div>
              </div>

              <button
                onClick={transferPay}
                className={
                  transferPayType === false
                    ? style.footerBtn
                    : style.footerBtnElse
                }
                disabled={transferPayType === true || isConfirming || isPending}
              >
                {transferPayType === true && "Not enough funds"}
                {transferPayType === false &&
                  !isConfirming &&
                  !isPending &&
                  "Deposit via transfer"}

                {transferPayType === false && (isConfirming || isPending) && (
                  <div>Waiting for confirmation...</div>
                )}
              </button>
            </>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}

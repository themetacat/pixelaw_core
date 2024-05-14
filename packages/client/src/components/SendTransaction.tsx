import { FormEvent } from 'react';
import { type Hex, parseEther } from 'viem';
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import React, { useState } from 'react';
import {supportedChains} from  "../mud/supportedChains"



export function SendTransaction() {

  const { data: hash, error, isPending, sendTransaction } = useSendTransaction()
  const { address } = useAccount();

  let chainIndex = supportedChains.findIndex((c) => c.id === 17069);
  const garnet = supportedChains[chainIndex];
  const result = useBalance({
    address: address,
  })
  // result.data
  const [inputValue, setInputValue] = useState(0.0005);
  
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    // const to = formData.get('address') as Hex
    // session wallet 
    const to = "0x450AF1Ea236932c0e18B53BC1FeB15E47AA292df"
    const value = formData.get('value') as string
    sendTransaction({ to, value: parseEther(value) })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <div className="container">
      <div className="stack">
        <form className="set" onSubmit={submit}>
          <input name="address" placeholder="Address" value={address} required />
          <input
            name="value"
            placeholder="Amount (ETH)"
            type="number"
            step="0.0001"
            value={inputValue}
            onChange={handleChange}
            required
          />
          <button disabled={isPending} type="submit">
            {isPending ? 'Confirming...' : 'Send'}
          </button>
        </form>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </div>
  )
}

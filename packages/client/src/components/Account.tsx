
import { useMUD } from "../MUDContext";
import { resourceToHex, getContract, ContractWrite } from "@latticexyz/common";
import { useWalletClient } from 'wagmi'
interface Props {
  setTopUpType: any;
  palyerAddress: any;
  mainContent: any;
}
import { Abi, encodeFunctionData, decodeErrorResult, createWalletClient, custom } from "viem";
import { Subject, share } from "rxjs";
const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "ResourceId",
        name: "systemId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "numCalls",
        type: "uint256",
      },
    ],
    name: "initDelegation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
];

const delegationControlId = resourceToHex({
  type: "system",
  namespace: "",
  name: "unlimited",
});

const SYSTEMBOUND_DELEGATION = resourceToHex({
  type: "system",
  namespace: "",
  name: "systembound",
});

export const registerDelegation = async function() {
  console.log(1111);
  
  const {
    network: { worldContract, waitForTransaction, publicClient,clientOptions },
  } = useMUD();

  
  // const EOAWalletClient = useWalletClient();
  // console.log(EOAWalletClient);
  const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' })
  console.log(account);
  
  const walletClientWC = createWalletClient({
    account,
    ...clientOptions,
  })
  console.log(walletClientWC);
  
const write$ = new Subject<ContractWrite>();

  const EOAContact = getContract({
    address: worldContract.address,
    abi: worldContract.abi,
    publicClient,
    walletClient: walletClientWC,
    onWrite: (write) => write$.next(write),
  })

    const uint256Max = (BigInt(1) << BigInt(256)) - BigInt(1);
      // console.log(ABI.concat(abi_json[app_name]));

    const callData1 = encodeFunctionData({
      abi: ABI,
      functionName: "initDelegation",
      args: ["0xF59f26309Fb4416D0bA7989D3d0ae64f503E927A", delegationControlId, uint256Max],
    });
    
    try{
      const txData = await EOAContact.write.registerDelegation(['0xF59f26309Fb4416D0bA7989D3d0ae64f503E927A', SYSTEMBOUND_DELEGATION, callData1]);
      console.log(txData);

    }catch (error) {
      console.error('Failed to setup network:', error.message);
    }

}
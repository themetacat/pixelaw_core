import { useMUD } from "../MUDContext";
// import IWorldAbi from "../../../contracts/out/IWorld.sol/IWorld.abi.json";
import IWorldAbi from "../../../contracts/out/CoreSystem.sol/CoreSystem.abi.json";

// const {
//     network: {publicClient}
// } = useMUD();

type QueueType = {
  id: any,
  name: any;
  namespace: any;
  timestamp: any;
  call_data: any
}




export const fetchData = async (publicClient: any) => {
    const fromBlock = "earliest";
    
    const logs = await publicClient.getContractEvents({ 
      address: '0x56f802e174152919b68ad9808c149bb70e404449',
      abi: IWorldAbi,
      eventName: "EventQueueScheduled",
      fromBlock: fromBlock,
      toBlock: "latest"
    });

    console.log(logs);

  }

  export const queue: Record<string, QueueType> = {}
  export const addToQueue = (data: any[]) => {
    const [id, timestamp, namespace, name, call_data] = data
    queue[id] = {
      id,
      name,
      namespace,
      timestamp,
      call_data
    }
  }

  export const getQueue = async () => {

const queueData = queue;
return queueData
    
  }

  export const delQueue = async (id: any) => {
  
      delete queue[id];
  }
    

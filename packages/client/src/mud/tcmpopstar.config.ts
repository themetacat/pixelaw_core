import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "popCraft",
  tables: {
    TCMPopStar: {
      keySchema:{
        owner: "address"
      },
      valueSchema:{
        x: "uint32",
        y: "uint32",
        startTime: "uint256",
        gameFinished: "bool",
        matrixArray: "uint256[]",
        tokenAddressArr: "address[]"
      }
    },
    TokenBalance: {
      keySchema:{
        owner: "address",
        tokenAddress: "address",
      },
      valueSchema:{
        balance: "uint256",
      }
    },
    TokenSold:{
      keySchema:{
        tokenAddress: "address",
      },
      valueSchema:{
        soldNow: "uint256",
        soldAll: "uint256"
      }
    }
  },
  systems: {
    PopCraftSystem: {
      name: "PopCraftSystem",
      openAccess: false
    },
  }
});

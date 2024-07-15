import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "tcmPopStar",
  enums:{
  },
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
    }
  },
  systems: {
    TCMPopStarSystem: {
      name: "TCMPopStarSystem",
      openAccess: false
    },
  }
});

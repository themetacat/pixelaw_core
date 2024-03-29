import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "pix2048",
  tables: {
 
    Game2048: {
      keySchema: {
        x: "uint32",
        y: "uint32",
      },
      valueSchema: {
        owner: "address",
        gameState: "bool",
        matrixArray: "uint256[]",
      }
    }
  },
  systems: {
    Pix2048System: {
      name: "Pix2048System",
      openAccess: true
    },
    
  }
});

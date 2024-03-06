import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "call",

  tables: {
    
  },

  systems: {
    CallOtherSystem: {
      name: "CallOtherSystem",
      openAccess: true
    },
    
  }
});

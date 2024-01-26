import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "paint",
  tables: {

  },
  systems: {
    PaintSystem: {
      name: "PaintSystem",
      openAccess: true
    },
    
  }
});

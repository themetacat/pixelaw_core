import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "snake",
  enums:{
    Direction: ["None", "Left", "Right", "Up", "Down"]
  },
  tables: {
    Snake: {
      keySchema: {
        owner: "address"
      },
      valueSchema:{
        is_dying: "bool",
        direction: "Direction",
        step: "uint8",
        length: "uint8",
        first_segment_id: "uint256",
        last_segment_id: "uint256",
        color: "string",
        text: "string",
      }
    },
    SnakeSegment: {
      keySchema: {
        id: "uint256"
      },
      valueSchema:{
        previous_id: "uint256",
        next_id: "uint256",
        x: "uint32",
        y: "uint32",
        pixel_original_color: "string",
        pixel_original_text: "string"
      }
    }
  },
  systems: {
    SnakeSystem: {
      name: "SnakeSystem",
      openAccess: true
    },
  }
});

import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "snake",
  enums:{
    Direction: ["None", "Left", "Right", "Up", "Down"]
  },
  tables: {
    Permissions: {
      keySchema: {
        allowing_app: "address",
        allowed_app: "address",
      },
      valueSchema:{
        app: "bool",
        color: "bool",
        owner: "bool",
        text: "bool",
        timestamp: "bool",
        action: "bool",
      }
    },
    Pixel: {
      keySchema:{
        x: "uint32",
        y: "uint32",
      },
      valueSchema:{
        app: "address",
        owner: "address",
        timestamp: "uint256",
        created_at: "uint256",
        updated_at: "uint256",
        color: "string",
        text: "string",
        action: "string",
      }
    },
    PixelUpdate:{
      valueSchema:{
        x: "uint32",
        y: "uint32",
        app: "address",
        owner: "address",
        timestamp: "uint256",
        color: "string",
        text: "string",
        action: "string",
      }
    },
    // game_id uint32
    QueueItem: {
      keySchema:{
        game_id: "uint32",
      },
      valueSchema: {
        valid: "bool"
      }
    },
    App: {
      keySchema: {
        system: "address"
      },
      valueSchema: {
        manifest: "string",
        app_name: "string",
        icon: "string",
        action: "string"
      }
    },
    AppUser: {
      keySchema: {
        system: "address",
        player: "address"
      },
      valueSchema: {
        action: "string"
      }
    },
    AppName:{
      keySchema: {
        app_name: "bytes32",
      },
      valueSchema: {
        system: "address"
      }
    },
    CoreActionAddress: {
      keySchema: {
        key: "bytes32",
      },
      valueSchema: {
        value: 'address'
      }
    },
    Instruction: {
      keySchema: {
        system: "address",
        selector: "bytes4"
      },
      valueSchema:{
        instruction: "string"
      }
    },
    Snake: {
      keySchema: {
        owner: "address"
      },
      valueSchema:{
        is_dying: "bool",
        direction: "Direction",
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

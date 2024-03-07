import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
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
      },
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
      },
      valueSchema:{
        selector: "bytes4",
        instruction: "string"
      }
    },
    QueueScheduled:{
      keySchema: {
        id: "bytes32"
      },
      valueSchema:{
        timestamp: "uint256",
        name_space: "string",
        name: "string",
        call_data: "bytes"
      },
      offchainOnly: true
    },
    QueueProcessed: {
      keySchema: {
        id: "bytes32"
      },
      valueSchema: {
        caller: "address"
      },
      offchainOnly: true
    },
    Alert: {
      keySchema: {
        id: "bytes32"
      },
      valueSchema: {
        x: "uint32",
        y: "uint32",
        timestamp: "uint256",
        caller: "address",
        player: "address",
        message: "string",
      },
      offchainOnly: true
    }
  },
});

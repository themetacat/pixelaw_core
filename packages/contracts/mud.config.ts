import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  userTypes: {
    ResourceId: { filePath: "@latticexyz/store/src/ResourceId.sol", internalType: "bytes32" },
  },
  // userTypesFilename: "@latticexyz/store/src/ResourceId.sol",
  tables: {
    Permissions: {
      keySchema: {
        allowing_app: "bytes32",
        allowed_app: "bytes32",
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
        owner: "address",
        timestamp: "uint256",
        created_at: "uint256",
        updated_at: "uint256",
        color: "string",
        text: "string",
        action: "string",
        app: "string",
      }
    },
    PixelUpdate:{
      valueSchema:{
        x: "uint32",
        y: "uint32",
        owner: "address",
        timestamp: "uint256",
        color: "string",
        text: "string",
        action: "string",
        app: "string",
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
        app_name_key: "bytes32"
      },
      valueSchema: {
        developer: "address",
        system_addr: "address",
        namespace: "string",
        system_name: "string",
        manifest: "string",
        icon: "string",
        action: "string",
      }
    },
    AppUser: {
      keySchema: {
        player: "address",
        app_name: "bytes32",
      },
      valueSchema: {
        action: "string"
      }
    },
    AppName:{
      keySchema: {
        system: "address",
      },
      valueSchema: {
        app_name: "string",
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
        app: "bytes32",
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
    },
    ERC20TokenBalance: {
      keySchema: {
        tokenAddress: "address",
        namespaceId: "ResourceId"
      },
      valueSchema: {
        value: "uint256"
      }
    },
  },
});

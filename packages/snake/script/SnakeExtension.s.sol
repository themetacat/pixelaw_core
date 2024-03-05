// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
 
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IBaseWorld } from "@latticexyz/world-modules/src/interfaces/IBaseWorld.sol";
 
import { WorldRegistrationSystem } from "@latticexyz/world/src/modules/core/implementations/WorldRegistrationSystem.sol";
 
// Create resource identifiers (for the namespace and system)
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
 
// For registering the table
import { Snake, SnakeTableId, SnakeSegment, SnakeSegmentTableId } from "../src/codegen/index.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { DefaultParameters } from "../src/index.sol";
 
// For deploying MessageSystem
import { SnakeSystem } from "../src/systems/SnakeSystem.sol";

contract PaintExtension is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");
    console.log("world Address: ", worldAddress);
 
    WorldRegistrationSystem world = WorldRegistrationSystem(worldAddress);
    ResourceId namespaceResource = WorldResourceIdLib.encodeNamespace(bytes14("snake"));
    ResourceId systemResource = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "snake", "SnakeSystem");
    console.log("Namespace ID: %x", uint256(ResourceId.unwrap(namespaceResource)));
    console.log("System ID:    %x", uint256(ResourceId.unwrap(systemResource)));
 
    vm.startBroadcast(deployerPrivateKey);
    world.registerNamespace(namespaceResource);

    // forge script script/SnakeExtension.s.sol --rpc-url http://localhost:8545 --broadcast
    StoreSwitch.setStoreAddress(worldAddress);
    Snake.register();
    SnakeSegment.register();
 
    SnakeSystem snakeSystem = new SnakeSystem();
    console.log("SnakeSystem address: ", address(snakeSystem));
 
    world.registerSystem(systemResource, snakeSystem, true);
    world.registerFunctionSelector(systemResource, "init()");
    world.registerFunctionSelector(systemResource, "interact((address,address,(uint32,uint32),string),uint8)");
    world.registerFunctionSelector(systemResource, "move(address)");
 
    vm.stopBroadcast();
  }
}
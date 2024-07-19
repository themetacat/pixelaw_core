// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;
 
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IBaseWorld } from "@latticexyz/world-modules/src/interfaces/IBaseWorld.sol";
 
import { WorldRegistrationSystem } from "@latticexyz/world/src/modules/core/implementations/WorldRegistrationSystem.sol";
 
// Create resource identifiers (for the namespace and system)
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
 
// For registering the table
// import { Messages, MessagesTableId } from "../src/codegen/index.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { DefaultParameters } from "../src/core_codegen/index.sol";
import { WorldContextConsumerLib } from "@latticexyz/world/src/WorldContext.sol";
// For deploying MessageSystem
import { PaintSystem } from "../src/systems/PaintSystem.sol";
 
contract PaintExtension is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");
    console.log("world Address: ", worldAddress);
 
    WorldRegistrationSystem world = WorldRegistrationSystem(worldAddress);
    ResourceId namespaceResource = WorldResourceIdLib.encodeNamespace(bytes14("paint"));
    ResourceId systemResource = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "paint", "PaintSystem");
    // address worldAddress1 = WorldContextConsumerLib._world();
    console.log("Namespace ID: %x", uint256(ResourceId.unwrap(namespaceResource)));
    console.log("System ID:    %x", uint256(ResourceId.unwrap(systemResource)));
    // console.log("address: ", worldAddress1);
    vm.startBroadcast(deployerPrivateKey);
    world.registerNamespace(namespaceResource);
 
    PaintSystem paintSystem = new PaintSystem();
    console.log("PaintSystem address: ", address(paintSystem));
 
    world.registerSystem(systemResource, paintSystem, true);
    world.registerFunctionSelector(systemResource, "init()");
    world.registerFunctionSelector(systemResource, "interact((address,string,(uint32,uint32),string))");
 
    vm.stopBroadcast();
  }
}
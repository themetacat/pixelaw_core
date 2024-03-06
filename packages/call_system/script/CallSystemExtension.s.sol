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
// import { Messages, MessagesTableId } from "../src/codegen/index.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
 
// For deploying MessageSystem
import { CallOtherSystem } from "../src/systems/CallOtherSystem.sol";
 
contract CallSystemExtension is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");
    console.log("world Address: ", worldAddress);
 
    WorldRegistrationSystem world = WorldRegistrationSystem(worldAddress);
    ResourceId namespaceResource = WorldResourceIdLib.encodeNamespace(bytes14("call"));
    ResourceId systemResource = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "call", "CallOtherSystem");
    console.log("Namespace ID: %x", uint256(ResourceId.unwrap(namespaceResource)));
    console.log("System ID:    %x", uint256(ResourceId.unwrap(systemResource)));

    vm.startBroadcast(deployerPrivateKey);
    // world.registerNamespace(namespaceResource);

    // forge script script/CallSystemExtension.s.sol --rpc-url https://rpc.holesky.redstone.xyz --broadcast
    // StoreSwitch.setStoreAddress(worldAddress);
    // Messages.register();
 
    CallOtherSystem callOtherSystem = new CallOtherSystem();
    console.log("QueueSystem address: ", address(callOtherSystem));
 
    world.registerSystem(systemResource, callOtherSystem, true);
    // world.registerFunctionSelector(systemResource, "call_world_process_queue(bytes32,uint256,string,string,bytes)");
    // world.registerFunctionSelector(systemResource, "call_other_system_fn(string,string,bytes)");
    vm.stopBroadcast();
  }
}
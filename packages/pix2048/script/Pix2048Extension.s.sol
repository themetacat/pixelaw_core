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
import { Game2048, Game2048Data, Game2048TableId } from "../src/codegen/index.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { DefaultParameters } from "../src/core_codegen/index.sol";
 
import { Pix2048System } from "../src/systems/Pix2048System.sol";

contract PaintExtension is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");
    console.log("world Address: ", worldAddress);
 
    WorldRegistrationSystem world = WorldRegistrationSystem(worldAddress);
    ResourceId namespaceResource = WorldResourceIdLib.encodeNamespace(bytes14("pix2048"));
    ResourceId systemResource = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "pix2048", "Pix2048System");
    console.log("Namespace ID: %x", uint256(ResourceId.unwrap(namespaceResource)));
    console.log("System ID:    %x", uint256(ResourceId.unwrap(systemResource)));

    vm.startBroadcast(deployerPrivateKey);
    world.registerNamespace(namespaceResource);
  
    // forge script script/Pix2048Extension.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
    StoreSwitch.setStoreAddress(worldAddress);
    Game2048.register();
 
    Pix2048System pix2048System = new Pix2048System();
    console.log("SnakeSystem address: ", address(pix2048System));
 
    world.registerSystem(systemResource, pix2048System, true);
    world.registerFunctionSelector(systemResource, "init()");
    world.registerFunctionSelector(systemResource, "interact((address,address,(uint32,uint32),string),uint8)");
    // world.registerFunctionSelector(systemResource, "move(address)");
 
    vm.stopBroadcast();
  }
}
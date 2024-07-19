// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
 
import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
 
import { IWorld } from "../src/codegen/world/IWorld.sol";

import { StandardDelegationsModule } from "@latticexyz/world-modules/src/modules/std-delegations/StandardDelegationsModule.sol";
 
contract DeployDelegation is Script {
  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");
 
    vm.startBroadcast(deployerPrivateKey);
    IWorld world = IWorld(worldAddress);
 
    StandardDelegationsModule standardDelegationsModule = new StandardDelegationsModule();
    world.installRootModule(standardDelegationsModule, new bytes(0));
 
    vm.stopBroadcast();
  }
}
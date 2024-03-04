// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { ICoreSystem } from "./CoreInterface/ICoreSystem.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../codegen/world/Iworld.sol";
import { ResourceId, WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";


contract CallOtherSystem is System {
 function call_world_process_queue(bytes32 id, uint256 timestamp, string memory name_space, string memory name, bytes calldata call_data) public {
    
    require(timestamp <= block.timestamp, 'timestamp still in the future');

    bytes32 calculated_id = keccak256(abi.encodePacked(timestamp, name_space, name, call_data));
    require(calculated_id == id, 'Invalid Id');

    bytes14 namespace_bytes = bytes14(bytes(name_space));
    bytes16 name_bytes = bytes16(bytes(name));
    ResourceId systemId = WorldResourceIdLib.encode(RESOURCE_SYSTEM, namespace_bytes, name_bytes);
    // ResourceId systemId = WorldResourceIdLib.encode(RESOURCE_SYSTEM, 'snake', 'SnakeSystem');
    IWorld(_world()).call(
      systemId,
      call_data
    );
    ICoreSystem(_world()).process_queue(id);
    // QueueProcessed.set(id);
 
  }

   function call_other_system_fn(string memory name_space, string memory name, bytes calldata call_data) public {

    bytes14 namespace_bytes = bytes14(bytes(name_space));
    bytes16 name_bytes = bytes16(bytes(name));
    ResourceId systemId = WorldResourceIdLib.encode(RESOURCE_SYSTEM, namespace_bytes, name_bytes);
    IWorld(_world()).call(
      systemId,
      call_data
    );
 
  }

}

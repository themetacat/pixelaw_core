// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import {Permissions, PermissionsData, Pixel, 
PixelData, App, AppData, AppUser, 
AppName, CoreActionAddress, PixelUpdate, 
PixelUpdateData, Instruction, InstructionTableId, 
QueueScheduledData, QueueScheduled, QueueProcessed
} from "../codegen/index.sol";
import { ResourceId, WorldResourceIdLib, WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
import {Position} from "../index.sol";
import { SystemSwitch } from "@latticexyz/world-modules/src/utils/SystemSwitch.sol";
contract CoreSystem is System {
  
  // event EventQueueScheduled(QueueScheduled queueScheduled);
  event EventAlert(Alert alert);

  // struct Position{
  //   uint32 x;
  //   uint32 y; 
  // }

  struct Alert{
    Position position;
    address caller;
    address player;
    string message;
    uint256 timestamp;
  }

  function init() public{
    bytes32 key = convertToBytes32('core_actions');
    CoreActionAddress.set(key, _world());
  }

  function update_permission(string memory app_name, PermissionsData memory  permission_param) public {
    //system 使用msg.sender在此调用而不是传入
    // app addr
    // 在没有创建app的情况下，依然可以调用？这是对的？
    address allowed_app = AppName.getSystem(convertToBytes32(app_name));
    Permissions.set(address(_msgSender()), allowed_app, permission_param);
  }

  // system: app addr
  function update_app(string memory name, string memory icon, string memory manifest) public {

    AppData memory app = new_app(address(_msgSender()), name, icon, manifest);
    // emit EventAppNameUpdated(address(_msgSender()), app);
  }

  function new_app(address system, string memory name, string memory icon, string memory manifest) internal returns(AppData memory){
    AppData memory app = App.get(system);

    bytes32 bytes_name = convertToBytes32(name);
    address app_addr = AppName.get(bytes_name);

    require(bytes(app.app_name).length == 0 && app_addr == address(0), "app already set");

    app.app_name = name;
    app.icon = icon;
    app.manifest = manifest;
    App.set(system, app);

    AppName.set(bytes_name, system);
    return app;
  }

  function has_write_access(PixelData memory pixel, PixelUpdateData memory pixel_update) public view returns (bool) {
    // _msgSender should be user addr
    // _msgSender is system addr

    if (pixel.owner == address(0) || pixel.owner == tx.origin){
      return true;
    }

    // AppData memory caller_app = App.get(for_system);
    if (pixel.app == address(_msgSender())){
      return true;
    }

    PermissionsData memory permissions = Permissions.get(pixel.app, address(_msgSender()));
    if(pixel_update.app != address(0) && !permissions.app){
      return false;
    }
    
    if(pixel_update.owner != address(0) && !permissions.owner){
      return false;
    }

    if(bytes(pixel_update.color).length != 0 && !permissions.color){
      return false;
    }

    if(bytes(pixel_update.text).length != 0 && !permissions.text){
      return false;
    }

    // if(!permissions.color){
    //   return false;
    // }

    // if(!permissions.text){
    //   return false;
    // }

    if(pixel_update.timestamp != 0 && !permissions.timestamp){
      return false;
    }

    if(bytes(pixel_update.action).length != 0 && !permissions.action){
      return false;
    }

    return true;
  }

  function update_pixel(PixelUpdateData memory pixel_update) public{
    // 应该先创建了APP后才能执行该函数？

    PixelData memory pixel = Pixel.get(pixel_update.x, pixel_update.y);
    require(has_write_access(pixel, pixel_update), "No access!");
    if (pixel.created_at == 0){
      // uint256 _now = block.timestamp;
      pixel.created_at = block.timestamp;
      pixel.updated_at = block.timestamp;
    }

    //not allowed set all value to '' or 0x00...? ?

    if(pixel_update.app != address(0)){
      pixel.app = pixel_update.app;
    }

    if(bytes(pixel_update.color).length != 0){
      pixel.color = pixel_update.color;
    }

    // not allowed transfer to 0x00...? is that True?
    if(pixel_update.owner != address(0)){
      pixel.owner = pixel_update.owner;
    }

    if(bytes(pixel_update.text).length != 0){
      pixel.text = pixel_update.text;
    }

    if(pixel_update.timestamp != 0){
      pixel.timestamp = pixel_update.timestamp;
    }

    if(bytes(pixel_update.action).length != 0){
      pixel.action = pixel_update.action;
    }

    Pixel.set(pixel_update.x, pixel_update.y, pixel);

  }

  function set_instruction(bytes4 selector, string memory instruction) public {
    address system = address(_msgSender());
    AppData memory app = App.get(system);
    require(bytes(app.app_name).length != 0, 'cannot be called by a non-app');
    Instruction.set(system, selector, instruction);
  }

  function schedule_queue(uint256 timestamp, string memory name_space, string memory name, bytes calldata call_data) public {
    bytes32 id = keccak256(abi.encodePacked(timestamp, name_space, name, call_data));
    QueueScheduledData memory qs = QueueScheduledData(timestamp, name_space, name, call_data);
    QueueScheduled.set(id, qs);
  }

  function process_queue(bytes32 id) public {
    
    // require(timestamp <= block.timestamp, 'timestamp still in the future');

    // bytes32 calculated_id = keccak256(abi.encodePacked(timestamp, name_space, name, call_data));
    // require(calculated_id == id, 'Invalid Id');

    // bytes14 namespace_bytes = bytes14(bytes(name_space));
    // bytes16 name_bytes = bytes16(bytes(name));
    // ResourceId systemId = WorldResourceIdLib.encode(RESOURCE_SYSTEM, namespace_bytes, name_bytes);
    // // ResourceId systemId = WorldResourceIdLib.encode(RESOURCE_SYSTEM, 'snake', 'SnakeSystem');
    // // IWorld(address(0x2b6AC77F6e08395D0988E7e883b8335800CB58c4)).call(
    // //   systemId,
    // //   call_data
    // // );

    // SystemSwitch.call(
    //   systemId, 
    //   call_data
    // );
    QueueProcessed.set(id, address(_msgSender()));
 
  }

  function alert_player(Position memory position, address player, string memory message) public {
    AppData memory app = App.get(address(_msgSender()));
    // require(bytes(app.app_name).length != 0, 'cannot be called by a non-app');
    // Alert memory alert = Alert(position, address(_msgSender()), player, message, block.timestamp);
    // emit EventAlert(alert);
  }

  function convertToBytes32(string memory input) public pure returns (bytes32) {
    bytes memory stringBytes = bytes(input);
    if (stringBytes.length == 0) {
        return 0x0;
    }
    bytes32 result;
    assembly {
        result := mload(add(stringBytes, 32))
    }
    return result;
  }

}

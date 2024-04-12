// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import {Permissions, PermissionsData, Pixel, 
PixelData, App, AppData, AppUser, 
AppName, CoreActionAddress, PixelUpdate, 
PixelUpdateData, Instruction, InstructionTableId, 
QueueScheduledData, QueueScheduled, QueueProcessed,
Alert, AlertData
} from "../codegen/index.sol";
import { ResourceId, WorldResourceIdLib, WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
import {Position} from "../index.sol";
import { SystemSwitch } from "@latticexyz/world-modules/src/utils/SystemSwitch.sol";
contract CoreSystem is System {
  
  bytes32 constant string_null = keccak256(abi.encodePacked("_Null"));
  function init() public{
    bytes32 key = convertToBytes32('core_actions');
    CoreActionAddress.set(key, _world());
  }
 
  function update_permission(string memory allowed_app_name, PermissionsData memory  permission_param) public {
 
    string memory allowing_app_name = AppName.getApp_name(address(_msgSender()));
    require(bytes(allowing_app_name).length > 0, "Did not create this app");
    Permissions.set(convertToBytes32(allowing_app_name), convertToBytes32(allowed_app_name), permission_param);
  }

  // system: app addr
  function update_app(string memory name, string memory icon, string memory manifest, string memory namespace, string memory system_name) public {
    new_app(address(_msgSender()), name, icon, manifest, namespace, system_name);
    // emit EventAppNameUpdated(address(_msgSender()), app);
  }

  function new_app(address system, string memory name, string memory icon, string memory manifest, string memory namespace, string memory system_name) internal returns(AppData memory){

    // string memory app_name = AppName.getApp_name(system)
    AppData memory app = App.get(convertToBytes32(name));
    require(bytes(namespace).length > 0 || bytes(system_name).length > 0, "namespace and system_name are not allowed to be empty");
    require(bytes(app.namespace).length == 0 || bytes(app.system_name).length == 0, "app already set");

    app.icon = icon;
    app.manifest = manifest;
    app.namespace = namespace;
    app.system_name = system_name;
    app.developer = tx.origin;
    app.system_addr = address(_msgSender());
    App.set(convertToBytes32(name), app);

    AppName.set(system, name);
    return app;
  }

  function update_app_system(address new_system_addr, string memory app_name) public {
    AppData memory app = App.get(convertToBytes32(app_name));
    address developer = app.developer;
    require(developer == address(_msgSender()), 'not game owner');
    address old_system = app.system_addr;
    AppName.set(new_system_addr, app_name);

    app.system_addr = new_system_addr;
    App.set(convertToBytes32(app_name), app);
    AppName.deleteRecord(old_system);
  }

  function has_write_access(PixelData memory pixel, PixelUpdateData memory pixel_update) public view returns (bool) {

    if (pixel.owner == address(0) || pixel.owner == tx.origin){
      return true;
    }
    // AppData memory caller_app = App.get(for_system);
    string memory sender_app = AppName.getApp_name(address(_msgSender()));
    
    if (keccak256(abi.encodePacked(pixel.app)) == keccak256(abi.encodePacked(sender_app))){
      return true;
    }
    PermissionsData memory permissions = Permissions.get(convertToBytes32(pixel.app), convertToBytes32(sender_app));
    if(keccak256(abi.encodePacked(pixel_update.app)) != string_null && !permissions.app){
      return false;
    }
    
    if(pixel_update.owner != address(1) && !permissions.owner){
      return false;
    }

    if(keccak256(abi.encodePacked(pixel_update.color)) != string_null && !permissions.color){
      return false;
    }

    if(keccak256(abi.encodePacked(pixel_update.text)) != string_null && !permissions.text){
      return false;
    }

    if(pixel_update.timestamp != 0 && !permissions.timestamp){
      return false;
    }

    if(keccak256(abi.encodePacked(pixel_update.action)) != string_null && !permissions.action){
      return false;
    }

    return true;
  }

  function update_pixel(PixelUpdateData memory pixel_update) public{
    // may be create the app first?
    // bytes32 string_null;
    
    // string_null = keccak256(abi.encodePacked("_Null"));

    PixelData memory pixel = Pixel.get(pixel_update.x, pixel_update.y);
    require(has_write_access(pixel, pixel_update), "No access!");
    if (pixel.created_at == 0){
      // uint256 _now = block.timestamp;
      pixel.created_at = block.timestamp;
      pixel.updated_at = block.timestamp;
    }

    if(keccak256(abi.encodePacked(pixel_update.app)) != string_null){
      pixel.app = pixel_update.app;
    }

    if(keccak256(abi.encodePacked(pixel_update.color)) != string_null){
      pixel.color = pixel_update.color;
    }

    if(pixel_update.owner != address(1)){
      pixel.owner = pixel_update.owner;
    }

    if(keccak256(abi.encodePacked(pixel_update.text)) != string_null){
      pixel.text = pixel_update.text;
    }

    if(pixel_update.timestamp != 0){
      pixel.timestamp = pixel_update.timestamp;
    }

    if(keccak256(abi.encodePacked(pixel_update.action)) != string_null){
      pixel.action = pixel_update.action;
    }

    Pixel.set(pixel_update.x, pixel_update.y, pixel);

  }

  function set_instruction(bytes4 selector, string memory instruction) public {
    bytes32 bytes_app_name = convertToBytes32(AppName.getApp_name(address(_msgSender())));
    AppData memory app = App.get(bytes_app_name);
    require(bytes(app.namespace).length != 0 || bytes(app.system_name).length != 0, 'cannot be called by a non-app');
    Instruction.set(bytes_app_name, selector, instruction);
  }

  function schedule_queue(uint256 timestamp, bytes calldata call_data) public {
    bytes32 bytes_app_name = convertToBytes32(AppName.getApp_name(address(_msgSender())));
    AppData memory app = App.get(bytes_app_name);
    require(bytes(app.namespace).length != 0 || bytes(app.system_name).length != 0, 'cannot be called by a non-app');

    string memory namespace = app.namespace;
    string memory system_name = app.system_name;
    bytes32 id = keccak256(abi.encodePacked(timestamp, namespace, system_name, call_data));
    QueueScheduledData memory qs = QueueScheduledData(timestamp, namespace, system_name, call_data);
    QueueScheduled.set(id, qs);
  }

  function process_queue(bytes32 id) public {
    QueueProcessed.set(id, address(_msgSender()));
  }

  function alert_player(Position memory position, address player, string memory message) public {
    AppData memory app = App.get(convertToBytes32(AppName.getApp_name(address(_msgSender()))));
      require(bytes(app.namespace).length != 0 || bytes(app.system_name).length != 0, 'cannot be called by a non-app');

    bytes32 id = keccak256(abi.encodePacked(position.x, position.y, message, block.timestamp, player, address(_msgSender())));
    Alert.set(id, AlertData(position.x, position.y, block.timestamp, address(_msgSender()), player, message));
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

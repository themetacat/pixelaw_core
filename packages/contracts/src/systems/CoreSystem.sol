// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { System } from "@latticexyz/world/src/System.sol";
import {Permissions, PermissionsData, Pixel, PixelData, App, AppData, AppUser, AppName, CoreActionAddress, PixelUpdate, PixelUpdateData, Instruction, InstructionTableId} from "../codegen/index.sol";

contract CoreSystem is System {
  
  event AppNameUpdated(address indexed callre, AppData  app);


  function init() public{
    bytes32 key = convertToBytes32('core_actions');
    CoreActionAddress.set(key, _world());
  }

  function udpate_permission(string memory app_name, PermissionsData memory  permission_param) public {
    //system 使用msg.sender在此调用而不是传入
    // app addr
    // 在没有创建app的情况下，依然可以调用？这是对的？
    address allowed_app = AppName.getSystem(convertToBytes32(app_name));
    Permissions.set(address(_msgSender()), allowed_app, permission_param);
  }

  // system: app addr
  function update_app(string memory name, string memory icon) public {

    AppData memory app = new_app(address(_msgSender()), name, icon);
    emit AppNameUpdated(address(_msgSender()), app);
  }

  function new_app(address system, string memory name, string memory icon) internal returns(AppData memory){
    AppData memory app = App.get(system);

    bytes32 bytes_name = convertToBytes32(name);
    address app_addr = AppName.get(bytes_name);

    require(bytes(app.app_name).length == 0 && app_addr == address(0), "app already set");

    app.app_name = name;
    app.icon = icon;
    App.set(system, app);

    AppName.set(bytes_name, system);
    return app;
  }

  // function schedule_queue(uint64 timestamp, address called_system, string memory selector) internal {
  //   address allowed_app = AppName.getSystem(convertToBytes32(for_system));

  //   app = new_app(address(_msgSender()), name, icon);
  //   emit AppNameUpdated(address(_msgSender()), app);
  // }

  function has_write_access(address for_system, PixelData memory pixel, PixelUpdateData memory pixel_update) public view returns (bool) {
    if (pixel.owner == address(0) || pixel.owner == address(_msgSender())){
      return true;
    }

    // AppData memory caller_app = App.get(for_system);
    if (pixel.app == for_system){
      return true;
    }

    PermissionsData memory permissions = Permissions.get(pixel.app, for_system);
    if(pixel_update.app != address(0) && !permissions.app){
      return false;
    }
    
    if(bytes(pixel_update.color).length != 0 && !permissions.color){
      return false;
    }

    if(pixel_update.owner != address(0) && !permissions.owner){
      return false;
    }

    if(bytes(pixel_update.text).length != 0 && !permissions.text){
      return false;
    }

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
    require(has_write_access(address(_msgSender()), pixel, pixel_update), "No access!");
    if (pixel.created_at == 0){
      // uint256 _now = block.timestamp;
      pixel.created_at = block.timestamp;
      pixel.updated_at = block.timestamp;
    }
    if(pixel_update.app != address(0)){
      pixel.app = pixel_update.app;
    }

    if(bytes(pixel_update.color).length != 0){
      pixel.color = pixel_update.color;
    }

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

  function set_instruction(string memory selector, string memory instruction) public {
    address system = address(_msgSender());
    AppData app = App.get(caller);
    require(bytes(app.name).length != 0, 'cannot be called by a non-app');
    Instruction.set(system, convertToBytes32(selector), instruction)
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

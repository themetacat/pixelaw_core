// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { ICoreSystem } from "../core_codegen/world/ICoreSystem.sol";
import { PermissionsData, DefaultParameters, Position, PixelUpdateData, Pixel, PixelData } from "../core_codegen/index.sol";

contract PaintSystem is System {

  string constant APP_ICON = 'U+1F58C';
  string constant NAMESPACE = 'paint';
  string constant SYSTEM_NAME = 'PaintSystem';
  string constant APP_NAME = 'paint';
  string constant APP_MANIFEST = 'BASE/PaintSystem';
  
  function init() public {

    ICoreSystem(_world()).update_app(APP_NAME, APP_ICON, APP_MANIFEST, NAMESPACE, SYSTEM_NAME);

    ICoreSystem(_world()).update_permission("snake", 
    PermissionsData({
      app: true, color: true, owner: true, text: true, timestamp: false, action: false
      })); 
  }

  function interact(DefaultParameters memory default_parameters) public {


    Position memory position = default_parameters.position;
    // address player = default_parameters.for_player;

    PixelData memory pixel = Pixel.get(position.x, position.y);
    require(keccak256(abi.encodePacked(pixel.color)) != keccak256(abi.encodePacked(default_parameters.color)), "same color");

    // uint256 COOLDOWN_SECS = 5;

    // require(pixel.owner == address(0) || pixel.owner == player || block.timestamp - pixel.timestamp < COOLDOWN_SECS, 'Cooldown not over');
    // require(block.timestamp - pixel.timestamp < COOLDOWN_SECS, 'Cooldown not over');
 
    put_color(default_parameters);

  }

  function put_color(DefaultParameters memory default_parameters) public {
    Position memory position = default_parameters.position;
    address player = default_parameters.for_player;
    string memory for_app = default_parameters.for_app;
    
    ICoreSystem(_world()).update_pixel(
      PixelUpdateData({
        x: position.x,
        y: position.y,
        color: default_parameters.color,
        timestamp: 0,
        text: "",
        app: for_app,
        owner: player,
        action: ""
      }));
  }

}

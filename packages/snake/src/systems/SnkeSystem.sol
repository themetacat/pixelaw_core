// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
// import { Util } from "https://github.com/MJumpKing/MUD_template/blob/main/packages/contracts/src/systems/utils.sol";
// import { IWorld } from "https://github.com/MJumpKing/MUD_template/blob/main/packages/contracts/src/codegen/world/IWorld.sol";
// import { PixelUpdateData } from "https://github.com/MJumpKing/MUD_template/blob/main/packages/contracts/src/codegen/tables/PixelUpdate.sol";
// import { ICoreWorld } from "./CoreInterface/ICoreWorld.sol";
// import { ICoreSystem } from "./CoreInterface/ICoreSystem.sol";
import { Position } from "../index.sol";
import { Pixel, PermissionsData, DefaultParameters, PixelData, PixelUpdateData, Snake, SnakeSegment, SnakeSegmentData } from "../codegen/index.sol";
import { Direction } from "../codegen/common.sol";


contract SnakeSystem is System {

  event Moved(Moved moved);
  event Died(Died died);

  struct Died{
    address owner,
    uint32 x,
    uint32 y
  }
  
  struct Moved{
    address owner,
    Direction direction
  }

  function init() public {
    
    IWorld(_world()).update_app("snake", "icon_snake", "BASE/");
    bytes4 INTERACT_SELECTOR =  bytes4(keccak256("interact(DefaultParameters, Direction)"));
    string memory INTERACT_INSTRUCTION = 'select direction for snake';
    IWorld(_world()).set_instruction(INTERACT_SELECTOR, INTERACT_INSTRUCTION)
    // ICoreSystem(_world()).update_permission("paint", 
    // PermissionsData({
    //   app: false, color: true, owner: false, text: true, timestamp: false, action: false
    //   })); 
  }

  function interact(DefaultParameters memory default_parameters, Direction memory direction) public returns(uint32){
    Position memory position = default_parameters.position;
    address player = default_parameters.for_player;
    address system = default_parameters.for_system;

    // load pixel
    // how to get
    // PixelData memory pixel = ICoreSystem(_world()).get_pixel(position.x, position.y);
    PixelData memory pixel = Pixel.get(position.x, position.y);
    SnakeData memory snake = Snake.get(player)

    if snake.length > 0 {
      snake.direction = direction;
      Snake.set(snake);
      return snake.first_segment_id;
    }

    uint32 id = 10;
    SnakeData memory snake = SnakeData({
      length: 1,
      first_segment_id: id,
      last_segement_id: id,
      direction: direction,
      color: default_parameters.color,
      text: "",
      is_dying: false
    });

    SnakeSegmentData memory segment = SnakeSegmentData({
      previous_id: id,
      next_id: id,
      x: position.x,
      y: position.y,
      pixel_original_color: pixel.color,
      pixel_original_text: pixel.text
    });
    Snake.set(player, snake);
    SnakeSegment.set(id, segment);

    IWorld(_world()).update_pixel(player, system, PixelUpdateData({
      x: position.x,
      y: position.y,
      color: color,
      timestamp: 0,
      text: text,
      app: address(0),
      owner: address(0),
      action: ""
    }));

    uint256 MOVE_SECOND = 0;
    uint256 queue_timestamp = block.timestamp + MOVE_SECOND;

    bytes4 MOVE_SELECTOR =  bytes4(keccak256("move(address)"));
    
    IWorld(_world()).schedule_queue(queue_timestamp, address(this), MOVE_SELECTOR, player);

  }

  function move(address owner) public{
    SnakeData memory snake = Snake.get(owner);
    require(snake.length > 0, 'no snake');
    SnakeSegmentData memory first_segment = SnakeSegment.get(snake.first_segment_id);

    if(snake.is_dying) {
      snake.last_segement_id = remove_last_segment(snake);
      snake.length -= 1;
      if(snake.length == 0){
        Position memory position = Position{x: first_segment.x, y:first_segment.y};
        IWorld(_world()).alert_player(position, snake.owner, 'Snake died here');
        Died memory died = Died(owner, first_segment.x, first_segment.y);
        emit Died(died);

        Snake.set(owner, SnakeData({
          length: 0,
          first_segment_id: 0,
          last_segement_id: 0,
          direction: Direction.None,
          color: 0,
          text: '',
          is_dying: false
        }))
        // delete snake
        // ?
      }
    }

    PixelData memory current_piexl = Pixel.get(first_segment.x, first_segment.y);
  }

  function next_position(uint32 x, uint32 y, Direction memory direction) public returns(uint32, uint32){

    if(direction == 1){
      if(x == 0){
        x = 0;
        y = 0;
      }else{
        x -= 1;
      }
    }else if{}
    return x, y
  }


}

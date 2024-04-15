// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import { System } from "@latticexyz/world/src/System.sol";
// import { Util } from "https://github.com/MJumpKing/MUD_template/blob/main/packages/contracts/src/systems/utils.sol";
// import { IWorld } from "https://github.com/MJumpKing/MUD_template/blob/main/packages/contracts/src/codegen/world/IWorld.sol";
// import { PixelUpdateData } from "https://github.com/MJumpKing/MUD_template/blob/main/packages/contracts/src/codegen/tables/PixelUpdate.sol";
// import { ICoreWorld } from "./CoreInterface/ICoreWorld.sol";
import { ICoreSystem } from "../core_codegen/world/ICoreSystem.sol";
import { Pixel, PermissionsData, PixelData, PixelUpdateData, DefaultParameters, Position } from "../core_codegen/index.sol";
import { Snake, SnakeData, SnakeSegment, SnakeSegmentData } from "../codegen/index.sol";
import { Direction } from "../codegen/common.sol";

contract SnakeSystem is System {

  // event EventMoved(Moved moved);
  // event EventDied(Died died);

  // struct Died{
  //   address owner;
  //   uint32 x;
  //   uint32 y;
  // }
  
  // struct Moved{
  //   address owner;
  //   Direction direction;
  // }

  uint256 SNAKE_MAX_LENGTH = 255;
  string constant APP_ICON = 'U+1F40D';
  string constant NAMESPACE = 'snake';
  string constant SYSTEM_NAME = 'SnakeSystem';
  string constant APP_NAME = 'snake';
  string constant APP_MANIFEST = 'BASE/SnakeSystem';

  function init() public {
    
    ICoreSystem(_world()).update_app(APP_NAME, APP_ICON, APP_MANIFEST, NAMESPACE, SYSTEM_NAME);
    bytes4 INTERACT_SELECTOR =  bytes4(keccak256("interact(DefaultParameters, Direction)"));
    string memory INTERACT_INSTRUCTION = 'select direction for snake';
    ICoreSystem(_world()).set_instruction(INTERACT_SELECTOR, INTERACT_INSTRUCTION);
   
  }

  function interact(DefaultParameters memory default_parameters, Direction direction) public returns(uint256){
    Position memory position = default_parameters.position;
    address player = default_parameters.for_player;

    PixelData memory pixel = Pixel.get(position.x, position.y);
    SnakeData memory player_snake = Snake.get(player);

    if(player_snake.length > 0){
      player_snake.direction = direction;
      player_snake.step = 0;
      Snake.set(player, player_snake);
      return player_snake.first_segment_id;
    }

    uint256 id = generateUUID();
    SnakeData memory snake = SnakeData({
      length: 1,
      first_segment_id: id,
      last_segment_id: id,
      direction: direction,
      color: default_parameters.color,
      text: "",
      is_dying: false,
      step: 0
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

    ICoreSystem(_world()).update_pixel(PixelUpdateData({
      x: position.x,
      y: position.y,
      color: default_parameters.color,
      timestamp: 0,
      text: '',
      app: '',
      owner: address(0),
      action: ""
    }));

    uint256 MOVE_SECOND = 0;
    uint256 queue_timestamp = block.timestamp + MOVE_SECOND;

    bytes memory call_data = abi.encodeWithSignature("move(address)", player);
    ICoreSystem(_world()).schedule_queue(queue_timestamp, call_data);
    return id;
  }

  function move(address owner) public{
    SnakeData memory snake = Snake.get(owner);
    require(snake.length > 0, 'no snake');
    SnakeSegmentData memory first_segment = SnakeSegment.get(snake.first_segment_id);

    if(snake.is_dying) {
      snake.last_segment_id = remove_last_segment(snake);
      snake.length -= 1;
      if(snake.length == 0){
        Position memory position = Position({x: first_segment.x, y:first_segment.y});
        ICoreSystem(_world()).alert_player(position, owner, 'Snake died here');
        // Died memory died = Died(owner, first_segment.x, first_segment.y);
        // emit EventDied(died);

        // Snake.set(owner, SnakeData({
        //   length: 0,
        //   first_segment_id: 0,
        //   last_segment_id: 0,
        //   direction: Direction.None,
        //   color: '',
        //   text: '',
        //   is_dying: false,
        //   step: 0
        // }));
        Snake.deleteRecord(owner);
      }
    }else{
      // PixelData memory current_pixel = Pixel.get(first_segment.x, first_segment.y);
      uint32 next_x;
      uint32 next_y;
      bool is_die;
      (next_x, next_y, is_die) = next_position(first_segment.x, first_segment.y, snake.direction);
      // if(next_x != 0 && next_y != 0 && !snake.is_dying && snake.step <= 50){
      if(!is_die && !snake.is_dying && snake.step <= 50){
        PixelData memory next_pixel = Pixel.get(next_x, next_y);
        snake.step += 1;
        bool has_write_access = ICoreSystem(_world()).has_write_access(next_pixel, PixelUpdateData({x: next_x, y:next_y, color: snake.color, timestamp: 0, text: snake.text, app: '_Null', owner: address(1), action: '_Null'}));
        if(next_pixel.owner == address(0)){
          snake.first_segment_id = create_new_segment(next_x, next_y, next_pixel, snake, first_segment);
          snake.last_segment_id = remove_last_segment(snake);
        }else if(next_pixel.owner == owner){
          snake.first_segment_id = create_new_segment(next_x, next_y, next_pixel, snake, first_segment);
          if (snake.length >= SNAKE_MAX_LENGTH){
            snake.last_segment_id = remove_last_segment(snake);
          }else{
            snake.length += 1;
          }
        }else if(!has_write_access){
          snake.is_dying = true;
        }else{
          if(snake.length == 1){
            snake.is_dying = true;
          }else{
            snake.first_segment_id = create_new_segment(next_x, next_y, next_pixel, snake, first_segment);
            snake.last_segment_id = remove_last_segment(snake);
            snake.last_segment_id = remove_last_segment(snake);
          }
        }
      }else{
        snake.is_dying = true;
      }
    }
    Snake.set(owner, snake);
    uint256 queue_timestamp = block.timestamp;
    bytes memory call_data = abi.encodeWithSignature("move(address)", owner);
    ICoreSystem(_world()).schedule_queue(queue_timestamp, call_data);
  }

  function next_position(uint32 x, uint32 y, Direction direction) public pure returns(uint32, uint32, bool){
    bool is_die = false;
    if(direction == Direction.Left){
      if(x == 0){
        x = 0;
        // y = 0;
        is_die = true;
      }else{
        x -= 1;
      }
    }else if(direction == Direction.Right){
      x += 1;
    }else if(direction == Direction.Up){
      if(y == 0){
        y = 0;
        is_die = true;
      }else{
        y -= 1;
      }
    }else if(direction == Direction.Down){
      y += 1;
    }
    return (x, y, is_die);
  }

  function create_new_segment(uint32 x, uint32 y, PixelData memory pixel, SnakeData memory snake, SnakeSegmentData memory existing_segment) public returns(uint256){
    // uuid
    uint256 id = generateUUID();
    existing_segment.previous_id = id;
    SnakeSegment.set(snake.first_segment_id, existing_segment);

    SnakeSegment.set(id, SnakeSegmentData({previous_id: id, next_id: snake.first_segment_id, x: x, y: y, pixel_original_color: pixel.color, pixel_original_text: pixel.text}));
    
    ICoreSystem(_world()).update_pixel(PixelUpdateData({
      x: x,
      y: y,
      color: snake.color,
      timestamp: 0,
      text: snake.text,
      app: '_Null',
      owner: address(1),
      action: '_Null'
    }));
    return id;
  }

  function remove_last_segment(SnakeData memory snake) public returns(uint256){
 
    SnakeSegmentData memory last_segment = SnakeSegment.get(snake.last_segment_id);

    ICoreSystem(_world()).update_pixel(PixelUpdateData({
      x: last_segment.x,
      y: last_segment.y,
      color: last_segment.pixel_original_color,
      timestamp: 0,
      text: last_segment.pixel_original_text,
      app: '_Null',
      owner: address(1),
      action: '_Null'
    }));
    uint256 result = last_segment.previous_id;

    //delete last_segment
    SnakeSegment.deleteRecord(snake.last_segment_id);
    return result;
  }

  function generateUUID() public view returns (uint256) {
    uint256 timestamp = block.timestamp;
    address senderAddress = address(_msgSender());
    uint256 randomNumber = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), address(_msgSender()))));

    uint256 uuid = uint256(keccak256(abi.encodePacked(senderAddress, timestamp, randomNumber)));
    return uuid;
  }

}

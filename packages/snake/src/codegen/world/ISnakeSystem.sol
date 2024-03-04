// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { DefaultParameters } from "./../../index.sol";
import { Direction } from "./../common.sol";
import { PixelData, SnakeData, SnakeSegmentData } from "./../index.sol";

/**
 * @title ISnakeSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface ISnakeSystem {
  function snake_SnakeSystem_init() external;

  function snake_SnakeSystem_interact(
    DefaultParameters memory default_parameters,
    Direction direction
  ) external returns (uint256);

  function snake_SnakeSystem_move(address owner) external;

  function snake_SnakeSystem_next_position(
    uint32 x,
    uint32 y,
    Direction direction
  ) external pure returns (uint32, uint32);

  function snake_SnakeSystem_create_new_segment(
    uint32 x,
    uint32 y,
    PixelData memory pixel,
    SnakeData memory snake,
    SnakeSegmentData memory existing_segment
  ) external returns (uint256);

  function snake_SnakeSystem_remove_last_segment(SnakeData memory snake) external returns (uint256);

  function snake_SnakeSystem_generateUUID() external view returns (uint256);
}

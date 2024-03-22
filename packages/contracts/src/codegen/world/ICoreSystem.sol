// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { PermissionsData, PixelData, PixelUpdateData } from "./../index.sol";
import { Position } from "./../../index.sol";

/**
 * @title ICoreSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface ICoreSystem {
  function init() external;

  function update_permission(string memory allowed_app_name, PermissionsData memory permission_param) external;

  function update_app(
    string memory name,
    string memory icon,
    string memory manifest,
    string memory namespace,
    string memory system_name
  ) external;

  function has_write_access(PixelData memory pixel, PixelUpdateData memory pixel_update) external view returns (bool);

  function update_pixel(PixelUpdateData memory pixel_update) external;

  function set_instruction(bytes4 selector, string memory instruction) external;

  function schedule_queue(uint256 timestamp, bytes calldata call_data) external;

  function process_queue(bytes32 id) external;

  function alert_player(Position memory position, address player, string memory message) external;

  function convertToBytes32(string memory input) external pure returns (bytes32);
}

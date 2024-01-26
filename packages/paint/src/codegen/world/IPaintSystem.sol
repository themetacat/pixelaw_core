// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { DefaultParameters } from "./../../index.sol";
import { PixelData } from "./../index.sol";

/**
 * @title IPaintSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IPaintSystem {
  function paint_PaintSystem_init() external;

  function paint_PaintSystem_interact(DefaultParameters memory default_parameters) external returns (PixelData memory);

  function paint_PaintSystem_put_color(DefaultParameters memory default_parameters) external;
}

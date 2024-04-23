// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
// import { console } from "forge-std/console.sol";
import "forge-std/console2.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
// import { convertToBytes32 } from "../src/systems/CoreSystem.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import {Game2048, Game2048Data} from "../src/codegen/index.sol";
import {Permissions, PermissionsData, Pixel, PixelData, App, AppData, AppUser, AppName, CoreActionAddress, PixelUpdate, PixelUpdateData, DefaultParameters, Position}  from "../src/core_codegen/index.sol";

contract Pix2048Test is MudTest {
  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }


}

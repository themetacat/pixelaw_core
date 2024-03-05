// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
// import { console } from "forge-std/console.sol";
import "forge-std/console2.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
// import { convertToBytes32 } from "../src/systems/CoreSystem.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import {Permissions, PermissionsData, Pixel, PixelData, App, AppData, AppUser, AppName, CoreActionAddress, PixelUpdate, PixelUpdateData, SnakeData, Snake} from "../src/codegen/index.sol";
import { DefaultParameters, Position } from "../src/index.sol";
import { Direction } from "../src/codegen/common.sol";

contract SnakeTest is MudTest {
  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

//   function testInteract() public {
//     // Expect the counter to be 1 because it was incremented in the PostDeploy script.
//     SnakeData memory snake = Snake.get(address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc));
//     assertEq(snake.length, 0);

//     Position memory position = Position({x: 1, y: 2});

//     IWorld(worldAddress).interact(DefaultParameters({for_player: address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc), for_system: address(0x45009DD3aBBE29Db54fc5D893CeAa98a624882DF),position: position, color: "1==2"}), Direction.Left);
//     snake = Snake.get(address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc));
//      assertEq(snake.length, 1);
//   }
}

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

  function testInteract() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    Position memory position = Position({x: 1, y: 2});

    Game2048Data memory game = Game2048.get(1, 2);
    assertEq(game.owner, address(0));


    IWorld(worldAddress).pix2048_Pix2048System_interact(DefaultParameters({for_player: address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc), for_system: address(0x45009DD3aBBE29Db54fc5D893CeAa98a624882DF),position: position, color: "1==2"}));
    game = Game2048.get(1, 2);
    assertEq(game.owner, address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc));
  }
}

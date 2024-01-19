// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
// import { console } from "forge-std/console.sol";
import "forge-std/console2.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
// import { convertToBytes32 } from "../src/systems/CoreSystem.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import {Permissions, PermissionsData, Pixel, PixelData, App, AppData, AppUser, AppName, CoreActionAddress, PixelUpdate, PixelUpdateData} from "../src/codegen/index.sol";


contract CounterTest is MudTest {
  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testApp() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    AppData memory app = App.get(address(this));
    // console2.log(app);
    assertEq(app.app_name, "");

    // // Expect the counter to be 2 after calling increment.
    IWorld(worldAddress).udpate_app("zz", "zzz");
    app = App.get(address(this));
     assertEq(app.app_name, "zz");
  }

  function testInit() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    address addr = CoreActionAddress.get(convertToBytes32("core_actions"));
    // console2.log(app);
    assertEq(addr, address(0));

    // // Expect the counter to be 2 after calling increment.
    IWorld(worldAddress).init();
    bytes32  core_actions = convertToBytes32("core_actions");
    addr = CoreActionAddress.get(core_actions);
    assertEq(addr, worldAddress);
  }

  function testUdpate_app() public {
    AppData memory app = App.get(address(this));
    
    address addr = AppName.get(convertToBytes32("paint"));
    // console2.log(app);
    assertEq(app.app_name, "");
    assertEq(addr, address(0));

    IWorld(worldAddress).udpate_app("paint", "paint_icon");

    app = App.get(address(this));
    addr = AppName.get(convertToBytes32("paint"));
    assertEq(app.app_name, "paint");
    assertEq(addr, address(this));
  }

  function testUpdatePremission() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    address addr = AppName.get(convertToBytes32("paint"));
    PermissionsData memory permissions = Permissions.get(address(this), addr);
    // console2.log(app);
    assertEq(permissions.app, false);
    assertEq(permissions.color, false);
    // // Expect the counter to be 2 after calling increment.
    // PermissionsData memory perData = PermissionsData({app: true});
    IWorld(worldAddress).udpate_permission("paint", PermissionsData({app: true, color: false, owner:true, text: true, timestamp: true, action: true}));

    permissions = Permissions.get(address(this), addr);
    assertEq(permissions.app, true);
    assertEq(permissions.color, false);
  }

  function testUpdatePixel() public {
    // Expect the counter to be 1 because it was incremented in the PostDeploy script.
    PixelData memory pd = Pixel.get(1, 1);
    // console2.log(app);
    assertEq(pd.text, "");
    // // Expect the counter to be 2 after calling increment.
    // PermissionsData memory perData = PermissionsData({app: true});
    IWorld(worldAddress).update_pixel(PixelUpdateData({x: 1, y: 1, color:"xxx", text: "zzzz", owner: address(this), app: address(this), timestamp: 0, action: "run"}));

    pd = Pixel.get(1, 1);
    // console2.log(app);
    assertEq(pd.text, "zzzz");
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

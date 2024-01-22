// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import {App, AppData, AppName, CoreActionAddress} from "../codegen/index.sol";

library Util{
    function get_core_actions_address() public pure returns (address core_actions_world_addr) {
        core_actions_world_addr = 0xC44504Ab6a2C4dF9a9ce82aecFc453FeC3C8771C;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;
import {AppData} from "./codegen/index.sol";

struct Position{
    uint32 x;
    uint32 y; 
  }

  struct QueueScheduled{
    bytes32 id;
    uint256 timestamp;
    address called_system;
    bytes4 selector;
    string call_data;
  }

  struct QueueProcessed{
    string id;
  }
  
  struct AppNameUpdated{
    AppData app;
    string caller;
  }

  struct Alert{
    Position position;
    address caller;
    address player;
    string message;
    uint256 timestamp;
  }
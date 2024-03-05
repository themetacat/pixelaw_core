// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

struct PermissionsData {
  bool app;
  bool color;
  bool owner;
  bool text;
  bool timestamp;
  bool action;
}

struct PixelData {
  address app;
  address owner;
  uint256 timestamp;
  uint256 created_at;
  uint256 updated_at;
  string color;
  string text;
  string action;
}

struct PixelUpdateData {
  uint32 x;
  uint32 y;
  address app;
  address owner;
  uint256 timestamp;
  string color;
  string text;
  string action;
}

struct DefaultParameters{
    address for_player;
    address for_system;
    Position position;
    string color;
  }


struct Position{
    uint32 x;
    uint32 y; 
  }


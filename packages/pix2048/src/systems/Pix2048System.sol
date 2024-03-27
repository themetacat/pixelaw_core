// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { ICoreSystem } from "../core_codegen/world/ICoreSystem.sol";
import { PermissionsData, DefaultParameters, Position, PixelUpdateData, Pixel, PixelData } from "../core_codegen/index.sol";
import { Game2048, Game2048Data, Game2048TableId  } from "../codegen/index.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Pix2048System is System {
  string constant APP_ICON = 'U+1699';
  string constant NAMESPACE = 'pix2048';
  string constant SYSTEM_NAME = 'pix2048System';
  string constant APP_NAME = 'Pix2048';
  //abi json
  string constant APP_MANIFEST = 'BASE/Pix2048';

  function init() public {

    ICoreSystem(_world()).update_app(APP_NAME, APP_ICON, APP_MANIFEST);

  }

  function interact(DefaultParameters memory default_parameters) public {
    Position memory position = default_parameters.position;
    address player = default_parameters.for_player;
    address system = default_parameters.for_system;

    require(ownerless_space(position), "pixel not enough");

    PixelData memory pixel = Pixel.get(position.x, position.y);
    if(keccak256(abi.encodePacked(pixel.action)) == keccak256(abi.encodePacked("move"))){
      move(default_parameters);
    }else{
       // uint256 game_id = generateRandomNumber(1);
    // Game2048Data memory game = Game2048.get(position.x, position.y);

      uint256[] memory matrixArray = new uint256[](16);
          
      for (uint i = 0; i < 16; i++) {
          matrixArray[i] = 0; 
      }
      // // game.matrixArray = matrixArray;
      // // game.owner = player;
      // // game.gameState = true

      matrixArray = genNumber(matrixArray, default_parameters);
      matrixArray = genNumber(matrixArray, default_parameters);

      Game2048.set(position.x, position.y, player, true, matrixArray);

      // ICoreSystem(_world()).update_pixel(PixelUpdateData({
      //   x: position.x + 4,
      //   y: position.y,
      //   color: '0xFF00FF80',
      //   timestamp: 0,
      //   text: 'U+21E7',
      //   app: system,
      //   owner: player,
      //   action: 'move'
      // }));

    
    //   ICoreSystem(_world()).update_pixel(PixelUpdateData({
    //     x: position.x + 4,
    //     y: position.y + 1,
    //     color: '0xFF00FF80',
    //     timestamp: 0,
    //     text: 'U+21E9',
    //     app: system,
    //     owner: player,
    //     action: 'move'
    //   }));

    //   ICoreSystem(_world()).update_pixel(PixelUpdateData({
    //     x: position.x + 4,
    //     y: position.y + 2,
    //     color: '0xFF00FF80',
    //     timestamp: 0,
    //     text: 'U+21E6',
    //     app: system,
    //     owner: player,
    //     action: 'move'
    //   }));


    //   ICoreSystem(_world()).update_pixel(PixelUpdateData({
    //     x: position.x + 4,
    //     y: position.y + 3,
    //     color: '0xFF00FF80',
    //     timestamp: 0,
    //     text: 'U+21E8',
    //     app: system,
    //     owner: player,
    //     action: 'move'
    //   }));
    }
    
  }

  function genNumber(uint256[] memory matrixArray, DefaultParameters memory default_parameters) internal returns (uint256[] memory) {
    uint256 zeroCount = 0;
    for (uint8 i=0; i<matrixArray.length; i++){
      if(matrixArray[i]==0){
        zeroCount++;
      }
    }
    uint256[] memory zeroIndex = new uint256[](zeroCount);
    uint8 currentIndex = 0;
    for (uint8 index; index < matrixArray.length; index ++){
      if(matrixArray[index] == 0){
        zeroIndex[currentIndex] = index;
        currentIndex++;
      }
    }

    if(zeroCount != 0){
      uint256 randomIndex = generateRandomNumber(zeroCount);
      // uint256 randomIndex = 3;
      if(randomIndex >zeroCount/3 || zeroCount==16){
        matrixArray[zeroIndex[randomIndex]] = 2;
      }else{
        matrixArray[zeroIndex[randomIndex]] = 4;
      }
    }

    string memory string_matrix_value;
    string memory pixel_text;
    uint256 matrix_value;
    for(uint32 i; i < 4; i++){
      for(uint32 j; j<4; j++){

        matrix_value = matrixArray[4*i+j];
        if(matrix_value == 0){
          string_matrix_value = '';
        }else{
          string_matrix_value = Strings.toString(matrix_value);
        }
        pixel_text = Pixel.getText(default_parameters.position.x + i, default_parameters.position.y + j);
        
        // if(keccak256(abi.encodePacked(pixel_text)) != keccak256(abi.encodePacked(string_matrix_value))){
        //   ICoreSystem(_world()).update_pixel(PixelUpdateData({
        //     x: default_parameters.position.x + i,
        //     y: default_parameters.position.y + j,
        //     color: get_color(matrix_value),
        //     timestamp: 0,
        //     text: string_matrix_value,
        //     app: default_parameters.for_system,
        //     owner: default_parameters.for_player,
        //     action: ''
        //   }));
        // }
      }
    }
    return matrixArray;
  }

  function generateRandomNumber(uint256 maxNum) internal view returns (uint256) {
      uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.basefee, block.number, address(_msgSender())))) % maxNum;
      return randomNumber;
  }

  function move(DefaultParameters memory default_parameters) public {
    Position memory position = default_parameters.position;
    PixelData memory pixel = Pixel.get(position.x, position.y);

    bool isChange;
    uint256[] memory matrixArray;
    Position memory origin_position = position;
    origin_position.x -= 4;

    if(keccak256(abi.encodePacked(pixel.text)) == keccak256(abi.encodePacked("U+21E7"))){
      matrixArray = Game2048.getMatrixArray(origin_position.x, origin_position.y);
      (isChange, matrixArray) = moveUp(matrixArray);
    }else if(keccak256(abi.encodePacked(pixel.text)) == keccak256(abi.encodePacked("U+21E9"))){
      origin_position.y -= 1;
      matrixArray = Game2048.getMatrixArray(origin_position.x, origin_position.y);
      (isChange, matrixArray) = moveUp(matrixArray);
    }else if(keccak256(abi.encodePacked(pixel.text)) == keccak256(abi.encodePacked("U+21E6"))){
      origin_position.y -= 2;
      matrixArray = Game2048.getMatrixArray(origin_position.x, origin_position.y);
      (isChange, matrixArray) = moveUp(matrixArray);
    }else if(keccak256(abi.encodePacked(pixel.text)) == keccak256(abi.encodePacked("U+21E8"))){
      origin_position.y -= 3;
      matrixArray = Game2048.getMatrixArray(origin_position.x, origin_position.y);
      (isChange, matrixArray) = moveUp(matrixArray);
    }

    if(isChange){
      default_parameters.position = origin_position;
      genNumber(matrixArray, default_parameters);
      // isGameOver(matrixArray);
    }
  }

  // function isGameOver(uint256[] memory matrixArray) internal returns(bool){
  //   for(uint8 i; i < 4; i++){
  //     uint8 rowPIndex = i * 4 + 1;
  //     for(uint8 j; j<3; j++){
  //       uint8 rowIndex = i * 4 + j;
  //       uint8 colPIndex = (j+1) * 4 + i;
  //       uint8 colIndex = j * 4 + i;
  //       if(matrixArray[rowIndex] == 0 || matrixArray[colIndex] == 0){
  //         return;
  //       }
  //       if(matrixArray[rowIndex] == matrixArray[rowPIndex+j] || matrixArray[colIndex] == matrixArray[colPIndex]){
  //         return;
  //       }
  //     }
  //   }
  //   if(matrixArray[15] == 0){
  //     return true;
  //   }
  //   return false;
  // }

  function moveRight(uint256[] memory matrixArray) internal pure returns (bool, uint256[] memory) {
    bool isChange = false;
    for(uint8 i=0; i < 4; i++){
      uint8 pIndex = i * 4 + 2;
      for(uint8 j=0; j < 3; j++){
        uint8 index = i * 4 + 3 - j;
        // uint8 newJ = j;

        if (matrixArray[index] == 0) {
          continue;
        }
        while (j < 2 && matrixArray[pIndex - j] == 0) {
          j++;
        }
        if (matrixArray[pIndex - j] == matrixArray[index]) {
            if(!isChange){
              isChange = true;
            }
            matrixArray[index] *= 2;
            matrixArray[pIndex - j] = 0;
        }
      }

      for(uint8 k=0; k<3; k++){
        uint8 zeroIndex = i * 4 + 3 - k;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while (newK < 2 && matrixArray[pIndex - newK] == 0) {
            newK++;
          }
          if(matrixArray[pIndex - newK]!=0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[pIndex - newK];
            matrixArray[pIndex - newK] = 0;
          }
        }
      }
    }
    return (isChange, matrixArray);
  }

  function moveLeft(uint256[] memory matrixArray) internal pure returns (bool, uint256[] memory) {
    bool isChange = false;
    for(uint8 i=0; i < 4; i++){
      uint8 pIndex = i * 4 + 1;
      for(uint8 j=0; j < 3; j++){
        uint8 index = i * 4 + j;
        // uint8 newJ = j;
        if (matrixArray[index] == 0) {
          continue;
        }
        while (j < 2 && matrixArray[pIndex + j] == 0) {
          j++;
        }
        if (matrixArray[pIndex + j] == matrixArray[index]) {
          if(!isChange){
            isChange = true;
          }
          matrixArray[index] *= 2;
          matrixArray[pIndex + j] = 0;
        }
      }

      for(uint8 k=0; k<3; k++){
        uint8 zeroIndex = i * 4 +  k;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while (newK < 2 && matrixArray[pIndex + newK] == 0) {
            newK++;
          }
          if(matrixArray[pIndex + newK]!=0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[pIndex + newK];
            matrixArray[pIndex + newK] = 0;
          }
        }
      }
    }
    return (isChange, matrixArray);
  }

  function moveUp(uint256[] memory matrixArray) internal pure returns (bool, uint256[] memory) {
    bool isChange = false;
    for(uint8 i; i < 4; i++){
      for(uint8 j; j<3; j++){
        uint8 index = j * 4 + i;
        // uint8 newJ = j;
        if(matrixArray[index] == 0){
          continue;
        }
        while(j<2 && matrixArray[(j+1)*4+i]==0){
          j++;
        }
        if(matrixArray[index] == matrixArray[(j+1)*4+i]){
          if(!isChange){
            isChange = true;
          }
          matrixArray[index] = matrixArray[index] * 2;
          matrixArray[(j+1)*4+i] = 0;
        }
      }
      for(uint8 k; k<3; k++){
        uint8 zeroIndex = k * 4 + i;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while(newK<2 && matrixArray[(newK+1)*4+i] == 0){
            newK++;
          }
          if(matrixArray[(newK+1)*4+i] != 0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[(newK+1)*4+i];
            matrixArray[(newK+1)*4+i] = 0;
          }
        }
      } 
    }
    return (isChange, matrixArray);
 }

  function moveDown(uint256[] memory matrixArray) internal pure returns (bool, uint256[] memory){
    bool isChange = false;
    for(uint8 i; i<4; i++){
      for(uint8 j=3; j>0; j--){
        uint8 index = j * 4 + i;
        if(matrixArray[index] == 0){
          continue;
        }
        while(j > 1 && matrixArray[(j-1)*4+i] == 0){
          j--;
        }
        if(matrixArray[index] == matrixArray[(j-1)*4+i]){
            if(!isChange){
              isChange = true;
            }
          matrixArray[index] *= 2;
          matrixArray[(j-1)*4+i] = 0;
        }
      }
      for(uint8 k=3; k>0; k--){
        uint8 zeroIndex = k * 4 + i;
        uint8 newK = k;
        if(matrixArray[zeroIndex] == 0){
          while(newK > 1 && matrixArray[(newK-1)*4+i] == 0){
            newK--;
          }
          if(matrixArray[(newK-1)*4+i] != 0){
            if(!isChange){
              isChange = true;
            }
            matrixArray[zeroIndex] = matrixArray[(newK-1)*4+i];
            matrixArray[(newK-1)*4+i] = 0;
          }
        }
      }
    }
    return (isChange, matrixArray);
 }

 function ownerless_space(Position memory position) internal view returns (bool){
    for(uint8 i; i<4; i++){
      for(uint8 j; j<5; j++){
        PixelData memory pixel = Pixel.get(position.x+i, position.y+j);
        if(keccak256(abi.encodePacked(pixel.color)) != keccak256(abi.encodePacked('0')) && bytes(pixel.color).length != 0){
          return false;
        }else if(keccak256(abi.encodePacked(pixel.text)) != keccak256(abi.encodePacked('_none')) && bytes(pixel.text).length != 0){
          return false;
        }else if(pixel.app != address(0) || pixel.owner != address(0)){
          return false;
        }
      }
    }
    return true;
 }

 function get_color(uint256 number) internal pure returns (string memory) {
    if (number == 2) {
        return "0xFFEEE4DA";
    } else if (number == 4) {
        return "0xFFECE0CA";
    } else if (number == 8) {
        return "0xFFEFB883";
    } else if (number == 16) {
        return "0xFFF57C5F";
    } else if (number == 32) {
        return "0xFFEA4C3C";
    } else if (number == 64) {
        return "0xFFD83A2B";
    } else if (number == 128) {
        return "0xFFF9D976";
    } else if (number == 256) {
        return "0xFFBE67FF";
    } else if (number == 512) {
        return "0xFF7D6CFF";
    } else if (number == 1024) {
        return "0xFF26A69A";
    } else if (number == 2048) {
        return "0xFFFFE74C";
    } else if (number == 4096) {
        return "0xFFB19CD9";
    } else if (number == 8192) {
        return "0xFF85C1E9";
    } else if (number == 16384) {
        return "0xFF76D7C4";
    } else if (number == 32768) {
        return "0xFFF9A825";
    } else if (number == 65536) {
        return "0xFFFF8F00";
    } else {
        return "0xFFFFFFFF";
    }
  }
}

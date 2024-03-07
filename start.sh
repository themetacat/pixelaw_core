#!/bin/bash

echo -e "Run 'pnpm install' to install the dependencies."
cd packages/contracts
#pnpm install

echo -e "Check if anvil is running('pnpm mud deploy' need this)."
anvil_p_total=`ps -ef | grep anvil | grep -v grep | wc -l`
if [ $anvil_p_total -eq 0 ]
then
    echo -e "Start anvil first!"
    exit 0
fi

echo -e "Run 'pnpm mud deploy' to deploy contracts to RPC http://127.0.0.1:8545, which anvil listening on."
pnpm mud deploy

echo -e "Run 'pnpm vite' to start the frontend server of PixeLAW Core, which will listening on http://127.0.0.1:3000."
cd ../client

vite_p_total=`ps -ef | grep vite.js | grep -v grep | wc -l`
if [ $vite_p_total -eq 0 ]
then
    pnpm vite > /dev/null 2>&1 &
fi

echo -e "Register call_system to World contract."
cd ../call_system
forge script script/CallSystemExtension.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

echo -e "Register default app paint to World contract."
cd ../paint
forge script script/PaintExtension.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

echo -e "Register default app snake to World contract."
cd ../snake
forge script script/SnakeExtension.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

echo -e "Congratulations! Everything is ok! Just visit http://127.0.0.1:3000 to play."

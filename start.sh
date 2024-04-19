#!/bin/bash

set -e

echo -e "Check if anvil is running, if not will try to start, since all subsequent processes rely on it."
if [ $(lsof -i:8545 | grep anvil -c) -eq 0 ]
then
    nohup anvil > ./anvil.log 2>&1 &
    echo -e "anvil started successfully!"
else
    echo -e "Failed to start anvil, please start anvil manually first!"
    exit 0
fi

RPC_URL="http://127.0.0.1:8545"
CHAIN_ID="31337"

for arg in "$@"; do
    # Use '=' to separate key-value pairs
    key=$(echo "$arg" | cut -d '=' -f1)
    value=$(echo "$arg" | cut -d '=' -f2-)
    
    # Process based on keys
    case $key in
        RPC_URL)
            RPC_URL=$value
            ;;
        CHAIN_ID)
            CHAIN_ID=$value
            ;;
    esac
done

echo -e "Run 'pnpm mud deploy' to deploy contracts to RPC , which anvil listening on."
cd packages/contracts
pnpm mud deploy --rpc $RPC_URL

WORLD_ADDRESS=$(cat ./worlds.json | jq -r --arg chain_id $CHAIN_ID '.[$chain_id].address')

echo -e "Run 'pnpm vite' to start the frontend server of PixeLAW Core, which will listening on http://127.0.0.1:3000."
cd ../client

vite_p_total=`ps -ef | grep vite.js | grep -v grep | wc -l`
if [ $vite_p_total -eq 0 ]
then
    pnpm vite > /dev/null 2>&1 &
fi

echo -e "Register call_system to World contract."
cd ../call_system
forge script script/CallSystemExtension.s.sol --rpc-url $RPC_URL --broadcast
sleep 1

echo -e "Register default app paint to World contract."
cd ../paint
forge script script/PaintExtension.s.sol --rpc-url $RPC_URL --broadcast
sleep 1
PRIVATE_KEY=$(grep -E "^PRIVATE_KEY=" .env | cut -d '=' -f2-)
PRIVATE_KEY=${PRIVATE_KEY:-'0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6'}
cast send $WORLD_ADDRESS --rpc-url $RPC_URL --private-key $PRIVATE_KEY "paint_PaintSystem_init()" ""
sleep 1

echo -e "Register default app snake to World contract."
cd ../snake
forge script script/SnakeExtension.s.sol --rpc-url $RPC_URL --broadcast
sleep 1
PRIVATE_KEY=$(grep -E "^PRIVATE_KEY=" .env | cut -d '=' -f2-)
PRIVATE_KEY=${PRIVATE_KEY:-'0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6'}
cast send $WORLD_ADDRESS --rpc-url $RPC_URL --private-key $PRIVATE_KEY "snake_SnakeSystem_init()" ""

echo -e "Congratulations! Everything is ok! Just visit http://127.0.0.1:3000 to play."

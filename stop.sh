#!/bin/bash
# just to stop all the process which start by 'pnpm run start'

set -e

# stop the anvil
pkill -f anvil

# stop the vite
pkill -f vite

/*
 * This file sets up all the definitions required for a MUD client.
 */
import React, { useContext } from 'react';
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupNetwork } from "./setupNetwork";

// import {ManifestContext} from '../components/rightPart'

export type SetupResult = Awaited<ReturnType<typeof setup>>;
// console.log(ManifestContext,66666666666666)

export async function setup() {
  const network = await setupNetwork();
  const components = createClientComponents(network);
  const systemCalls = createSystemCalls(network, components);

  return {
    network,
    components,
    systemCalls,
  };
}

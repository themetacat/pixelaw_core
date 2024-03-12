/*
 * This file sets up all the definitions required for a MUD client.
 */
import React, { useContext } from 'react';
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupNetwork } from "./setupNetwork";

// import {ManifestContext} from '../components/rightPart'

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  const network = await setupNetwork();

  const components = createClientComponents(network);
  //console.log(components,'components')
  const systemCalls = createSystemCalls(network, components);
  
  return {
    network,
    components,
    systemCalls,
  };
}

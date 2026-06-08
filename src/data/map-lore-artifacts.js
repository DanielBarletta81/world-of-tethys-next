/**
 * Map lore artifact nodes — static data layer for the Tethys atlas.
 * Each node corresponds to a named region on the world map and carries
 * a short history plus a recovered artifact record.
 */
import rawNodes from '../content/map-lore-artifacts.json';

/** @type {Array<{regionId:string, label:string, era:string, history:string, subLocations?:string[], artifact:{name:string,class:string,note:string}}>} */
export const MAP_LORE_ARTIFACT_NODES = rawNodes;

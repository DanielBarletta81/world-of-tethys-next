// src/lib/vr-bridge.js

export function generateVRMetadata(user, stats, staff, inventory) {
  if (!user) return null;

  // 1. Calculate Shader Parameters (Normalize 0-100 stats to 0.0-1.0 floats)
  const shaderParams = {
    heatVal: (stats.geology || 0) / 100,
    bioVal: (stats.creature || 0) / 100,
    voidVal: (stats.lore || 0) / 100,
    roughness: staff?.rarity === 'Rare' ? 0.2 : 0.8,
    emissionStrength: Math.max(1.0, (stats.resin || 0) / 50)
  };

  // 2. Resolve Staff Mesh IDs (Mapping web IDs to 3D Asset IDs)
  // These keys correspond to the hypothetical FBX/OBJ files in your game engine
  const staffBlueprint = {
    meshId_Core: `MESH_${staff?.components?.core?.id?.toUpperCase() || 'BASE'}`,
    meshId_Wrap: `MESH_${staff?.components?.wrap?.id?.toUpperCase() || 'NONE'}`,
    meshId_Apex: `MESH_${staff?.components?.apex?.id?.toUpperCase() || 'EMPTY'}`,
    socket_A: inventory.some(i => i.id === 'compass') ? 'ATTACH_COMPASS' : 'EMPTY',
    socket_B: inventory.some(i => i.id === 'kith_spore') ? 'ATTACH_FAMILIAR' : 'EMPTY',
  };

  // 3. The Final JSON Payload
  return {
    version: "1.0",
    timestamp: new Date().toISOString(),
    player: {
      uid: user.uid,
      handle: user.displayName || 'Anonymous',
      faction: stats.faction || 'Unaligned',
      tier: Math.floor((stats.total || 0) / 10) + 1
    },
    loadout: {
      ...staffBlueprint,
      visuals: {
        primaryColor: staff?.visuals?.shaftGradient || '#333333',
        glowColor: staff?.visuals?.glowColor || '#ff8800',
        ...shaderParams
      }
    },
    currency: {
      resin: stats.resin || 0
    }
  };
}
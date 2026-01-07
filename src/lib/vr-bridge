// src/lib/vr-bridge.js
// src/lib/vr-bridge.js

export function generateVRMetadata(user, stats, staff, inventory) {
  if (!user) return null;

  // 1. SHADER PARAMS (Visuals)
  const shaderParams = {
    heatVal: (stats.geology || 0) / 100,
    bioVal: (stats.creature || 0) / 100,
    voidVal: (stats.lore || 0) / 100,
    roughness: staff?.rarity === 'Rare' ? 0.2 : 0.8,
    emissionStrength: Math.max(1.0, (stats.resin || 0) / 50)
  };

  // 2. MESH IDS (Staff)
  const staffBlueprint = {
    meshId_Core: `MESH_${staff?.components?.core?.id?.toUpperCase() || 'BASE'}`,
    meshId_Wrap: `MESH_${staff?.components?.wrap?.id?.toUpperCase() || 'NONE'}`,
    meshId_Apex: `MESH_${staff?.components?.apex?.id?.toUpperCase() || 'EMPTY'}`,
    socket_A: inventory.some(i => i.id === 'compass') ? 'ATTACH_COMPASS' : 'EMPTY',
    socket_B: inventory.some(i => i.id === 'kith_spore') ? 'ATTACH_FAMILIAR' : 'EMPTY',
  };

  // 3. NARRATIVE STATE (The Book Logic)
  // This tells the engine which "Version" of the world to load
  const narrativeState = {
    // Law & Order
    law_code: stats.alignment === 'Chaos' ? 'EXILE' : 'COHAB_CODE', 
    
    // Creature Affinity (Does Nute wake up? Do the trees speak?)
    titan_bond: stats.creature > 75 ? 'ACTIVE' : 'DORMANT', 
    kith_sensitivity: stats.kith > 40 ? 'HIGH' : 'LOW',

    // Key Memories (Did they find the secrets?)
    memories: {
      has_seen_cambria: inventory.some(i => i.id === 'cambria_relic'),
      survived_the_ledge: stats.igzier > 50, // High survival stat = Ledge survivor
      met_ravel: true // Default for all users who login via Airlock
    },

    // Atmosphere Overrides (Based on your text)
    atmosphere: {
      sky_color: stats.location === 'ironwoods' ? '#2d4a22' : '#87CEEB', // Green tint for canopy
      fog_density: stats.location === 'the-weep' ? 0.95 : 0.1, // Heavy mist at The Weep
      water_level: 'CRETACEOUS_HIGH' // Global constant
    }
  };

  return {
    version: "3.0-NARRATIVE",
    timestamp: new Date().toISOString(),
    player: {
      uid: user.uid,
      handle: user.displayName || 'Anonymous',
      archetype: stats.archetype || 'Survivor',
      tier: Math.floor((stats.total || 0) / 10) + 1
    },
    chronicle: narrativeState, // <--- The New Block
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
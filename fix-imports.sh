#!/bin/bash
# Fix all component imports after reorganization

echo "Fixing component imports..."

# Layout components
find src/app -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i '' \
  -e "s|from '@/components/Footer'|from '@/components/layout/Footer'|g" \
  -e "s|from '@/components/Header'|from '@/components/layout/Header'|g" \
  {} \;

# Forms components
find src/app -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i '' \
  -e "s|from '@/components/IdentityAirLock'|from '@/components/forms/IdentityAirLock'|g" \
  -e "s|from '@/components/IdentityAirlock'|from '@/components/forms/IdentityAirLock'|g" \
  -e "s|from '@/components/SideAuthPanel'|from '@/components/forms/SideAuthPanel'|g" \
  {} \;

# Features components  
find src/app -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i '' \
  -e "s|from '@/components/TethysNexus'|from '@/components/features/map/TethysNexus'|g" \
  -e "s|from '@/components/StaffSequencer'|from '@/components/features/onboarding/StaffSequencer'|g" \
  -e "s|from '@/components/Incubator'|from '@/components/features/onboarding/Incubator'|g" \
  -e "s|from '@/components/PathSelector'|from '@/components/features/onboarding/PathSelector'|g" \
  -e "s|from '@/components/StatusBar'|from '@/components/features/player/StatusBar'|g" \
  {} \;

# Content components
find src/app -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i '' \
  -e "s|from '@/components/ArtifactPlate'|from '@/components/content/ArtifactPlate'|g" \
  -e "s|from '@/components/MythicCard'|from '@/components/content/MythicCard'|g" \
  -e "s|from '@/components/FieldNotebook'|from '@/components/content/FieldNotebook'|g" \
  -e "s|from '@/components/ContrabandItem'|from '@/components/content/ContrabandItem'|g" \
  {} \;

# Page-specific components
find src/app -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i '' \
  -e "s|from '@/components/PterosDashboard'|from '@/components/page-specific/science/PterosDashboard'|g" \
  -e "s|from '@/components/PaleoRealityCheck'|from '@/components/page-specific/science/PaleoRealityCheck'|g" \
  -e "s|from '@/components/PaleoGIS'|from '@/components/page-specific/science/PaleoGIS'|g" \
  -e "s|from '@/components/VRConsole'|from '@/components/page-specific/science/VRConsole'|g" \
  -e "s|from '@/components/AssetCrate'|from '@/components/page-specific/science/AssetCrate'|g" \
  -e "s|from '@/components/ScientificJournal'|from '@/components/page-specific/science/ScientificJournal'|g" \
  -e "s|from '@/components/CaveWallTerminal'|from '@/components/page-specific/science/CaveWallTerminal'|g" \
  -e "s|from '@/components/MysticsClient'|from '@/components/page-specific/mystics/MysticsClient'|g" \
  -e "s|from '@/components/FungalProxyPanel'|from '@/components/page-specific/mystics/FungalProxyPanel'|g" \
  -e "s|from '@/components/CambriaClient'|from '@/components/page-specific/cambria/CambriaClient'|g" \
  {} \;

# Overlays
find src/app -type f \( -name "*.jsx" -o -name "*.js" \) -exec sed -i '' \
  -e "s|from '@/components/LandingSequence'|from '@/components/overlays/LandingSequence'|g" \
  -e "s|from '@/components/TheBlankSlate'|from '@/components/overlays/TheBlankSlate'|g" \
  -e "s|from '@/components/RelayLog'|from '@/components/overlays/RelayLog'|g" \
  {} \;

echo "✓ Import paths updated"
echo "Run 'npm run build' to verify"

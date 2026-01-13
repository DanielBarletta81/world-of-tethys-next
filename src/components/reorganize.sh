#!/bin/bash

# Layout components
mv Footer.jsx layout/ 2>/dev/null
mv Header.jsx layout/ 2>/dev/null
mv InnerNav.jsx layout/navigation/ 2>/dev/null
mv StrataNav.jsx layout/navigation/ 2>/dev/null
mv StoneSideNav.jsx layout/navigation/ 2>/dev/null
mv TriFoldNav.jsx layout/navigation/ 2>/dev/null
mv WorldNav.jsx layout/navigation/ 2>/dev/null

# Features - Onboarding
mv Incubator.jsx features/onboarding/ 2>/dev/null
mv StaffSequencer.jsx features/onboarding/ 2>/dev/null
mv PathSelector.jsx features/onboarding/ 2>/dev/null
mv StarterLoadout.jsx features/onboarding/ 2>/dev/null

# Features - Map
mv TethysNexus.jsx features/map/ 2>/dev/null
mv MapFragments.jsx features/map/ 2>/dev/null
mv MapPhysics.jsx features/map/ 2>/dev/null
mv MapViewport.jsx features/map/ 2>/dev/null
mv BondForge.jsx features/map/ 2>/dev/null
mv MineralMap.jsx features/map/ 2>/dev/null

# Features - Player
mv PlayerProfile.jsx features/player/ 2>/dev/null
mv PlayerAvatar.jsx features/player/ 2>/dev/null
mv StatusBar.jsx features/player/ 2>/dev/null
mv AvatarPanel.jsx features/player/ 2>/dev/null

# Content components
mv BookCarousel.jsx content/ 2>/dev/null
mv BookBanner.jsx content/ 2>/dev/null
mv BookManifest.jsx content/ 2>/dev/null
mv LoreCard.js content/ 2>/dev/null
mv CharacterCarousel.jsx content/ 2>/dev/null
mv FieldNotebook.jsx content/ 2>/dev/null
mv ScientificJournal.jsx content/ 2>/dev/null
mv LocalJournal.jsx content/ 2>/dev/null
mv MythicCard.jsx content/ 2>/dev/null

# Overlays
mv DiscoveryToast.jsx overlays/ 2>/dev/null
mv DiscoveryListener.jsx overlays/ 2>/dev/null
mv DreamOverlay.jsx overlays/ 2>/dev/null
mv InkDropOverlay.jsx overlays/ 2>/dev/null
mv InkDropDiscovery.jsx overlays/ 2>/dev/null
mv IntroOverlay.jsx overlays/ 2>/dev/null
mv OracleModal.jsx overlays/ 2>/dev/null

# Forms
mv IdentityAirLock.jsx forms/ 2>/dev/null
mv SideAuthPanel.jsx forms/ 2>/dev/null
mv SurvivorIdentityPanel.jsx forms/ 2>/dev/null

# Page-specific - Science
mv PterosDashboard.jsx page-specific/science/ 2>/dev/null
mv PaleoGIS.jsx page-specific/science/ 2>/dev/null
mv PaleoRealityCheck.jsx page-specific/science/ 2>/dev/null
mv PaleoGraph.jsx page-specific/science/ 2>/dev/null
mv VRConsole.jsx page-specific/science/ 2>/dev/null
mv CaveWallTerminal.jsx page-specific/science/ 2>/dev/null
mv AssetCrate.jsx page-specific/science/ 2>/dev/null

# Page-specific - Mystics
mv OraclePool.jsx page-specific/mystics/ 2>/dev/null
mv FungalProxyPanel.jsx page-specific/mystics/ 2>/dev/null
mv FungalProxyTerminal.jsx page-specific/mystics/ 2>/dev/null
mv MysticsClient.jsx page-specific/mystics/ 2>/dev/null
mv KithOracle.jsx weather/ 2>/dev/null

# Page-specific - Pteros
mv PteroIntro.jsx page-specific/pteros/ 2>/dev/null
mv WeepBarrelToss.jsx page-specific/pteros/ 2>/dev/null

# Data/visualization components
mv StaffPreview.jsx data/ 2>/dev/null
mv StaffVisualizer.jsx data/ 2>/dev/null
mv MagmaCarousel.tsx data/ 2>/dev/null
mv MarineShowcase.jsx data/ 2>/dev/null
mv SeedVisualizer.jsx data/ 2>/dev/null

# Global/utility components (stay in root for now)
# GlobalAtmosphere.jsx
# GlobalAudioPlayer.jsx
# AtmosphericLayer.jsx
# AtmosphericTotem.jsx
# AuthAppProvider.jsx
# RelayLog.jsx
# NutePulse.jsx
# SystemDebug.jsx

echo "Component reorganization complete!"

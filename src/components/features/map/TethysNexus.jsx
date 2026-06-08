'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cdn } from '@/lib/cdn';
import StaffVisualizer from '@/components/StaffVisualizer';
import { REGION_FOOD_WEB } from '@/data/tethys-food-web';

// Food web track color map — used to tint region areas when foodWebActive
const FOOD_WEB_COLORS = {
  chemosynthetic: 'rgba(8, 145, 178, 0.32)',   // cyan  — sulfur-driven
  photosynthetic: 'rgba(34, 197, 94, 0.28)',    // green — solar-driven
  mixed:          'rgba(234, 179, 8, 0.28)',    // amber — dual track
  default:        'rgba(100, 116, 139, 0.15)',  // slate — no data
};

function foodWebColor(regionId) {
  const track = REGION_FOOD_WEB[regionId]?.dominantTrack ?? 'default';
  return FOOD_WEB_COLORS[track] ?? FOOD_WEB_COLORS.default;
}

const SUBMAP_SATELLITE_BASE = process.env.NEXT_PUBLIC_TETHYS_SUBMAP_SATELLITE_BASE || '';
const submapSatellite = (slug, options = {}) => {
  if (!SUBMAP_SATELLITE_BASE) return null;
  const base = SUBMAP_SATELLITE_BASE.endsWith('/')
    ? SUBMAP_SATELLITE_BASE.slice(0, -1)
    : SUBMAP_SATELLITE_BASE;
  return {
    url: `${base}/${slug}.jpg`,
    opacity: 0.58,
    blend: 'soft-light',
    size: '240%',
    position: '50% 50%',
    ...options
  };
};

export const MAP_FRAGMENTS = [
  // ── CORE VOLCANIC ARC — Java (centered on Mount Merapi) ───────────────────────
  { id: 'skycity',          label: 'Sky City',           region: 'sky-city',           anchor: { x: 0.26, y: 0.84 }, icon: cdn('/img/icons/sky-city.svg'),          coords: { lat: -7.0,  lng: 107.5  }, extent: 2.8, satellite: submapSatellite('sky-city',           { opacity: 0.46 }) },
  { id: 'the-weep',         label: 'The Weep',           region: 'the-weep',           anchor: { x: 0.28, y: 0.80 },                                                  coords: { lat: -8.8,  lng: 107.2  }, extent: 2.2, satellite: submapSatellite('the-weep',           { opacity: 0.50 }) },
  { id: 'the-ledge',        label: 'The Ledge',          region: 'the-ledge',          anchor: { x: 0.31, y: 0.77 },                                                  coords: { lat: -9.2,  lng: 108.0  }, extent: 2.2, satellite: submapSatellite('the-ledge',          { opacity: 0.48 }) },
  // Watcher = Mount Merapi exact (7.54°S, 110.44°E)
  { id: 'watcher-volcano',  label: 'Watcher Volcano',    region: 'watcher-volcano',    anchor: { x: 0.58, y: 0.16 },                                                  coords: { lat: -7.54, lng: 110.44 }, extent: 2.6, satellite: submapSatellite('watcher-volcano',  { opacity: 0.60, blend: 'screen' }) },
  // Mt. Cinder = Mount Sumbing analog — volcanic sister to the west
  { id: 'mt-cinder',        label: 'Mt. Cinder',         region: 'mt-cinder',          anchor: { x: 0.82, y: 0.12 }, icon: cdn('/img/icons/mount-shastea.svg'),      coords: { lat: -7.4,  lng: 109.9  }, extent: 2.4, satellite: submapSatellite('mt-cinder',          { opacity: 0.62, blend: 'screen', position: '52% 48%' }) },
  // Purgess = Yogyakarta ash plain east of Merapi
  { id: 'purgess',          label: 'Purgess Flats',      region: 'purgess',            anchor: { x: 0.57, y: 0.23 },                                                  coords: { lat: -7.9,  lng: 111.3  }, extent: 2.5, satellite: submapSatellite('purgess',            { opacity: 0.56 }) },
  // Mystic Woods = central Java highlands between volcano complex and the river delta
  { id: 'mystic-woods',     label: 'Mystic Woods',       region: 'mystic-woods',       anchor: { x: 0.54, y: 0.28 }, icon: cdn('/img/icons/mystics.svg'),            coords: { lat: -7.2,  lng: 112.5  }, extent: 3.4, satellite: submapSatellite('mystic-woods',      { opacity: 0.55 }) },
  // Cimmerian Mtns = far western Java/Sunda hills — blocks northern approach to Sky City
  { id: 'cimmerian',        label: 'Cimmerian Mtns',     region: 'cimmerian-mtns',     anchor: { x: 0.16, y: 0.73 }, showPin: false, clickable: false,               coords: { lat: -7.5,  lng: 105.5  }, extent: 3.4 },

  // ── DANIAN RIVER SYSTEM — Solo/Brantas River analog ───────────────────────────
  // River flows: Mystic Woods highlands → north Java coast → Silurian delta
  { id: 'danian-river',     label: 'Danian River',       region: 'danian-river',       anchor: { x: 0.50, y: 0.54 },                                                  coords: { lat: -7.0,  lng: 111.0  }, extent: 2.7, satellite: submapSatellite('danian-river',      { opacity: 0.50 }) },
  // Silurian Riverlands = north Java coastal estuary — controls tidal gates to Java Sea
  { id: 'silurian-riverlands', label: 'Silurian Riverlands', region: 'silurian-riverlands', anchor: { x: 0.34, y: 0.73 }, icon: cdn('/img/icons/silurian.svg'),    coords: { lat: -6.5,  lng: 111.8  }, extent: 3.0, satellite: submapSatellite('silurian-riverlands', { opacity: 0.50 }) },
  // Danian Delta = river delta mouth, north Java coast
  { id: 'danian-delta',     label: 'Danian Delta',       region: 'danian-delta',       anchor: { x: 0.52, y: 0.61 },                                                  coords: { lat: -6.8,  lng: 112.0  }, extent: 2.7, satellite: submapSatellite('danian-delta',      { opacity: 0.57 }) },

  // ── EASTERN ISLAND ARC — Bali / Lombok / Sumbawa analogs ─────────────────────
  // Pteros = Bali — the estuary island hub, central to all sea routes
  { id: 'pteros',           label: 'Pteros Island',      region: 'pteros',             anchor: { x: 0.46, y: 0.56 }, icon: cdn('/img/icons/pteros_island.svg'),      coords: { lat: -8.3,  lng: 114.6  }, extent: 2.6, satellite: submapSatellite('pteros',             { opacity: 0.56 }) },
  // Straits of Dier = Lombok Strait (between Bali and Lombok) — deep-current narrows
  { id: 'straits',          label: 'Straits of Dier',    region: 'straits-of-dier',    anchor: { x: 0.43, y: 0.48 }, icon: cdn('/img/icons/straits-of-dier.svg'),    coords: { lat: -8.5,  lng: 115.8  }, extent: 2.6, satellite: submapSatellite('straits-of-dier',   { opacity: 0.52 }) },
  // Twin Straits = Sape Strait (between Sumbawa and Flores) — split current zone
  { id: 'twin-straits',     label: 'Twin Straits of Dier', region: 'twin-straits-of-dier', anchor: { x: 0.47, y: 0.50 }, icon: cdn('/img/icons/straits-of-dier.svg'), coords: { lat: -8.8,  lng: 117.0  }, extent: 2.6, satellite: submapSatellite('twin-straits-of-dier', { opacity: 0.52 }) },
  // Dier Lake = Lake Matano analog (Sulawesi — deepest lake in Indonesia)
  { id: 'dier-lake',        label: 'Dier Lake',          region: 'dier-lake',          anchor: { x: 0.66, y: 0.27 },                                                  coords: { lat: -2.5,  lng: 121.3  }, extent: 2.3, satellite: submapSatellite('dier-lake',          { opacity: 0.52 }) },

  // ── BORNEO ZONE — Ironwoods / Northern highlands ──────────────────────────────
  { id: 'ironwoods',        label: 'Ironwoods',          region: 'ironwoods',          anchor: { x: 0.62, y: 0.20 }, icon: cdn('/img/icons/ironwood.svg'),           coords: { lat: 1.0,   lng: 113.5  }, extent: 2.8, satellite: submapSatellite('ironwoods',          { opacity: 0.50 }) },
  { id: 'ironwood-spires',  label: 'Ironwood Spires',    region: 'ironwood-spires',    anchor: { x: 0.36, y: 0.78 }, icon: cdn('/img/icons/sky-city.svg'), showPin: false, clickable: false, coords: { lat: -0.5, lng: 113.0 }, extent: 2.4 },
  { id: 'younger',          label: 'Younger Woods',      region: 'younger-woods',      anchor: { x: 0.30, y: 0.22 }, showPin: false, clickable: false,               coords: { lat: 1.5,   lng: 115.0  }, extent: 2.8 },
  // Arnn Ridge = north-central ridge (Crocker Range, Sabah — highest in Borneo)
  { id: 'arnn-ridge',       label: 'Arnn Ridge',         region: 'arnn-ridge',         anchor: { x: 0.60, y: 0.25 },                                                  coords: { lat: 5.8,   lng: 116.5  }, extent: 2.6, satellite: submapSatellite('arnn-ridge',         { opacity: 0.50 }) },
  // Northern Mountains = Trusmadi Range / northern Sabah highlands
  { id: 'northern-mountains', label: 'Northern Mountains', region: 'northern-mountains', anchor: { x: 0.62, y: 0.14 },                                               coords: { lat: 6.5,   lng: 117.5  }, extent: 3.1, satellite: submapSatellite('northern-mountains', { opacity: 0.50 }) },
  // Karst Drains = Maros-Pangkep Karst (south Sulawesi — world's largest tropical karst)
  { id: 'karst',            label: 'Karst Drains',       region: 'karst-drains',       anchor: { x: 0.22, y: 0.30 },                                                  coords: { lat: -4.8,  lng: 119.8  }, extent: 3.2, satellite: submapSatellite('karst-drains',       { opacity: 0.50 }) },

  // ── SULAWESI ZONE — Thal Territory / Amber Plains ────────────────────────────
  // Amber Plains = Wakatobi / South Sulawesi grasslands (Thal titan-walker territory)
  { id: 'amber-plains',     label: 'Amber Plains',       region: 'amber-plains',       anchor: { x: 0.68, y: 0.72 }, icon: cdn('/img/icons/nubian-sandbar.svg'),     coords: { lat: -4.0,  lng: 120.5  }, extent: 4.2, satellite: submapSatellite('amber-plains',       { opacity: 0.52, blend: 'soft-light' }) },
  { id: 'thal',             label: 'Thal Territory',     region: 'thal-territory',     anchor: { x: 0.74, y: 0.51 }, showPin: false, clickable: false, labelOffset: { x: 7, y: 7 }, coords: { lat: -1.8, lng: 121.0 }, extent: 4.6, satellite: submapSatellite('thal-territory', { opacity: 0.48 }) },
  // Siluria = Halmahera/North Maluku (far eastern background, ancient territory)
  { id: 'siluria',          label: 'Siluria',            region: 'siluria',            anchor: { x: 0.18, y: 0.44 }, icon: cdn('/img/icons/silurian.svg'), clickable: false, coords: { lat: 0.5, lng: 128.0 }, extent: 4.0 },

  // ── MAMMOTH ISLAND — East Central (Sulawesi/Maluku) ──────────────────────────
  { id: 'mammoth',          label: 'Mammoth Island',     region: 'mammoth-hand-island', anchor: { x: 0.72, y: 0.46 }, icon: cdn('/img/icons/mammoth-hand-island.svg'), coords: { lat: 0.5, lng: 124.5 }, extent: 4.2, satellite: submapSatellite('mammoth-hand-island', { opacity: 0.50 }) },
  // Denisova = far east, Papua region (ancient deep-background territory)
  { id: 'denisova',         label: 'Denisova',           region: 'denisova',           anchor: { x: 0.28, y: 0.56 }, showPin: false, clickable: false,               coords: { lat: -1.0,  lng: 136.0  }, extent: 3.2 },

  // ── TETHYS SEA — Open Indian Ocean south of Java ─────────────────────────────
  { id: 'tethys-sea',       label: 'Tethys Sea',         region: 'tethys-sea',         anchor: { x: 0.53, y: 0.64 }, showPin: false, clickable: false,               coords: { lat: -12.0, lng: 113.0  }, extent: 6.5, satellite: submapSatellite('tethys-sea',        { opacity: 0.45, blend: 'screen' }) },
  { id: 'rogue',            label: 'Rogue Island',       region: 'rogue-island',       anchor: { x: 0.74, y: 0.73 }, showPin: false, clickable: false,               coords: { lat: -16.0, lng: 114.5  }, extent: 3.8, satellite: submapSatellite('rogue-island',       { opacity: 0.50 }) },
  { id: 'new-tethys',       label: 'New Tethys',         region: 'new-tethys',         anchor: { x: 0.78, y: 0.90 }, showPin: false, clickable: false,               coords: { lat: -22.0, lng: 116.0  }, extent: 6.2, satellite: submapSatellite('new-tethys',         { opacity: 0.48 }) },

  // ── PERMIAN DESERT — FAR NORTH (Khorat Plateau, Thailand) ────────────────────
  // The Khorat Basin IS geographically north of Indonesia — red beds, evaporites,
  // seasonal aridity. Perfect satellite imagery for the salt-flat Permian Desert.
  { id: 'permian-desert',   label: 'Permian Desert',     region: 'permian-desert',     anchor: { x: 0.90, y: 0.90 },                                                  coords: { lat: 15.5,  lng: 103.0  }, extent: 4.8, satellite: submapSatellite('permian-desert',    { opacity: 0.50, blend: 'soft-light' }) },
];

const DEFAULT_VIEW = { center: [113.0, -6.0], zoom: 3.8 };
// ESRI World Imagery — free satellite tiles, no API key required.
// Override with NEXT_PUBLIC_TETHYS_SATELLITE_TILES for a custom tileset.
// For custom per-region satellite overlays set NEXT_PUBLIC_TETHYS_SUBMAP_SATELLITE_BASE.
//
// VOLCANIC ACTIVITY INTEGRATION (future):
// The world is centered on Mount Merapi, Indonesia (7.54°S, 110.44°E) — the most
// monitored active volcano on Earth. Real-world tectonic/volcanic data will feed
// into map event triggers via NEXT_PUBLIC_TETHYS_VOLCANO_API when implemented.
// PVMBG API: https://magma.esdm.go.id/v1/
const ESRI_SATELLITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const STYLE_MODE = (process.env.NEXT_PUBLIC_TETHYS_MAP_STYLE_MODE || 'volcanic').toLowerCase();
const BACKDROP_URL = process.env.NEXT_PUBLIC_TETHYS_WORLD_BACKDROP_URL || '';
const BACKDROP_OPACITY = Number(process.env.NEXT_PUBLIC_TETHYS_WORLD_BACKDROP_OPACITY || 0.35);
const BACKDROP_MAX_ZOOM = Number(process.env.NEXT_PUBLIC_TETHYS_WORLD_BACKDROP_MAX_ZOOM || 2.4);

function watcherIntensityFor(regionId) {
  if (!regionId) return 'far';
  if (['mt-cinder', 'watcher-volcano', 'watcher-flats', 'purgess', 'the-ledge'].includes(regionId)) return 'near';
  if (['mystic-woods', 'sky-city', 'cambria-ruins', 'ironwoods'].includes(regionId)) return 'mid';
  return 'far';
}

function buildRasterStyle(tileUrl, attribution, mode) {
  const paint = { 'raster-opacity': 1 };
  if (mode === 'volcanic') {
    // Shift SE Asia green palette toward amber/obsidian while keeping geological
    // texture visible. Less dark than before — still clearly alien, not black.
    paint['raster-saturation'] = -0.30;
    paint['raster-contrast'] = 0.08;
    paint['raster-brightness-min'] = 0.22;
    paint['raster-brightness-max'] = 0.88;
    paint['raster-hue-rotate'] = 175;
  }
  return {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      base: {
        type: 'raster',
        tiles: [tileUrl],
        tileSize: 256,
        attribution
      }
    },
    layers: [
      {
        id: 'base-raster',
        type: 'raster',
        source: 'base',
        paint
      }
    ]
  };
}

export default function TethysNexus({
  currentLocation = 'pteros',
  lockedRegions = [],
  visibleRegions = null,
  unlockedNodes = [],
  onTravel,
  onInspect,
  onStillnessChange,
  equippedStaff = null,
  showStaffOverlay = false,
  weatherMistBoost = 0,
  cloudIntensity = 0,
  rumbleIntensity = 0,
  stormFrontActive = false,
  stormFrontIntensity = 0,
  mycorrhizalActive = false,
  sporeSaturation = 0,
  foodWebActive = false
}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [stillnessLevel, setStillnessLevel] = useState(0);
  const lastInputRef = useRef(Date.now());
  const stillnessRef = useRef(0);
  // satelliteConfigured — only false if explicitly using a broken custom tile URL
  // ESRI_SATELLITE is always available as fallback, so this should almost never show
  const satelliteConfigured = true;

  const mapStyle = useMemo(() => {
    const styleUrl = process.env.NEXT_PUBLIC_TETHYS_MAP_STYLE_URL;
    if (styleUrl) return styleUrl;

    const tileUrl = process.env.NEXT_PUBLIC_TETHYS_SATELLITE_TILES || ESRI_SATELLITE;
    const attribution = process.env.NEXT_PUBLIC_TETHYS_SATELLITE_ATTRIBUTION
      || (tileUrl === ESRI_SATELLITE ? '© Esri — Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP' : '');

    return buildRasterStyle(tileUrl, attribution, STYLE_MODE);
  }, []);

  const visibleFragments = useMemo(() => {
    if (!Array.isArray(visibleRegions) || !visibleRegions.length) return MAP_FRAGMENTS;
    const allow = new Set(visibleRegions);
    return MAP_FRAGMENTS.filter((fragment) => allow.has(fragment.region));
  }, [visibleRegions]);

  const regionPoints = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: visibleFragments.filter((f) => f.coords).map((f) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [f.coords.lng, f.coords.lat]
        },
        properties: {
          id: f.id,
          label: f.label,
          region: f.region,
          clickable: f.clickable !== false ? 1 : 0,
          locked: lockedRegions.includes(f.region) ? 1 : 0,
          current: f.region === currentLocation ? 1 : 0
        }
      }))
    };
  }, [currentLocation, lockedRegions, visibleFragments]);

  const regionAreas = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: visibleFragments.filter((f) => f.coords && f.extent).map((f) => {
        const span = f.extent || 2.5;
        const minLng = f.coords.lng - span;
        const maxLng = f.coords.lng + span;
        const minLat = f.coords.lat - span;
        const maxLat = f.coords.lat + span;
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [minLng, minLat],
              [maxLng, minLat],
              [maxLng, maxLat],
              [minLng, maxLat],
              [minLng, minLat]
            ]]
          },
          properties: {
            id: f.id,
            label: f.label,
            region: f.region,
            locked: lockedRegions.includes(f.region) ? 1 : 0,
            current: f.region === currentLocation ? 1 : 0
          }
        };
      })
    };
  }, [currentLocation, lockedRegions, visibleFragments]);

  useEffect(() => {
    let isMounted = true;

    if (!mapContainerRef.current || mapRef.current) return undefined;

    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      if (!mapContainerRef.current || !isMounted) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: DEFAULT_VIEW.center,
        zoom: DEFAULT_VIEW.zoom,
        minZoom: 1.2,
        maxZoom: 9.5,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false
      });

      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
      // Scale and attribution rendered manually inside counter-flip wrapper (MapLibre's
      // internal controls sit inside the mirrored canvas div and appear backwards)
      // Hide MapLibre's built-in scale + attribution via injected CSS
      const ctrlStyle = document.createElement('style');
      ctrlStyle.textContent = '.maplibregl-ctrl-attrib, .maplibregl-ctrl-scale { display: none !important; }';
      document.head.appendChild(ctrlStyle);

      const markInput = () => {
        lastInputRef.current = Date.now();
      };

      map.on('dragstart', markInput);
      map.on('zoomstart', markInput);
      map.on('pitchstart', markInput);
      map.on('rotate', markInput);
      map.on('movestart', markInput);

      map.on('load', () => {
        if (!mapRef.current) return;

        if (BACKDROP_URL) {
          // Pre-validate the image before handing it to MapLibre — MapLibre's
          // image source fetch is async and its errors escape a try/catch.
          const probe = new window.Image();
          probe.crossOrigin = 'anonymous';
          probe.onload = () => {
            if (!mapRef.current) return;
            map.addSource('tethys-backdrop', {
              type: 'image',
              url: BACKDROP_URL,
              coordinates: [
                [-180, 85],
                [180, 85],
                [180, -85],
                [-180, -85]
              ]
            });
            const beforeId = map.getLayer('base-raster') ? 'base-raster' : undefined;
            map.addLayer(
              {
                id: 'tethys-backdrop',
                type: 'raster',
                source: 'tethys-backdrop',
                minzoom: 0,
                maxzoom: Math.max(0, Math.min(6, BACKDROP_MAX_ZOOM)),
                paint: {
                  'raster-opacity': Math.max(0.05, Math.min(0.8, BACKDROP_OPACITY))
                }
              },
              beforeId
            );
            if (map.getLayer('base-raster')) {
              map.setPaintProperty('base-raster', 'raster-opacity', [
                'interpolate', ['linear'], ['zoom'], 0, 0.35, 2, 1
              ]);
            }
          };
          probe.onerror = () => {
            console.warn('[TethysNexus] Backdrop image not accessible — skipping overlay.', BACKDROP_URL);
          };
          probe.src = BACKDROP_URL;
        }

        map.addSource('tethys-regions', { type: 'geojson', data: regionPoints });
        map.addSource('tethys-areas', { type: 'geojson', data: regionAreas });

        map.addLayer({
          id: 'tethys-area-fill',
          type: 'fill',
          source: 'tethys-areas',
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'current'], 1], '#f97316',
              ['==', ['get', 'locked'], 1], '#1f2937',
              '#0f172a'
            ],
            'fill-opacity': [
              'case',
              ['==', ['get', 'current'], 1], 0.14,
              ['==', ['get', 'locked'], 1], 0.08,
              0.1
            ]
          }
        });

        map.addLayer({
          id: 'tethys-area-outline',
          type: 'line',
          source: 'tethys-areas',
          paint: {
            'line-color': [
              'case',
              ['==', ['get', 'current'], 1], '#fb923c',
              ['==', ['get', 'locked'], 1], '#475569',
              '#64748b'
            ],
            'line-width': [
              'case',
              ['==', ['get', 'current'], 1], 2.2,
              1.1
            ],
            'line-opacity': [
              'case',
              ['==', ['get', 'locked'], 1], 0.4,
              0.6
            ]
          }
        });

        map.addLayer({
          id: 'tethys-markers-glow',
          type: 'circle',
          source: 'tethys-regions',
          paint: {
            'circle-radius': [
              'case',
              ['==', ['get', 'current'], 1], 12,
              9
            ],
            'circle-color': [
              'case',
              ['==', ['get', 'current'], 1], '#fb923c',
              '#0ea5e9'
            ],
            'circle-opacity': [
              'case',
              ['==', ['get', 'locked'], 1], 0.2,
              0.25
            ]
          }
        });

        map.addLayer({
          id: 'tethys-markers',
          type: 'circle',
          source: 'tethys-regions',
          paint: {
            'circle-radius': [
              'case',
              ['==', ['get', 'current'], 1], 6.5,
              5
            ],
            'circle-color': [
              'case',
              ['==', ['get', 'current'], 1], '#f8fafc',
              '#e2e8f0'
            ],
            'circle-stroke-color': [
              'case',
              ['==', ['get', 'locked'], 1], '#475569',
              '#0f172a'
            ],
            'circle-stroke-width': 1.2,
            'circle-opacity': [
              'case',
              ['==', ['get', 'locked'], 1], 0.35,
              0.85
            ]
          }
        });

        map.addLayer({
          id: 'tethys-labels',
          type: 'symbol',
          source: 'tethys-regions',
          layout: {
            'text-field': ['get', 'label'],
            'text-size': 12,
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular'],
            'text-offset': [0, 1.2],
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#e2e8f0',
            'text-halo-color': '#0b0a09',
            'text-halo-width': 1,
            'text-opacity': [
              'case',
              ['==', ['get', 'locked'], 1], 0.35,
              0.7
            ]
          }
        });

        const coords = regionPoints.features.map((f) => f.geometry.coordinates);
        if (coords.length) {
          const bounds = coords.reduce(
            (acc, coord) => {
              acc[0][0] = Math.min(acc[0][0], coord[0]);
              acc[0][1] = Math.min(acc[0][1], coord[1]);
              acc[1][0] = Math.max(acc[1][0], coord[0]);
              acc[1][1] = Math.max(acc[1][1], coord[1]);
              return acc;
            },
            [[coords[0][0], coords[0][1]], [coords[0][0], coords[0][1]]]
          );
          map.fitBounds(bounds, { padding: 80, duration: 1200 });
        }

        setMapReady(true);
      });
    })();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapStyle]);

  useEffect(() => {
    const interval = setInterval(() => {
      const idleMs = Date.now() - lastInputRef.current;
      const next = Math.max(0, Math.min(1, (idleMs - 1200) / 1800));
      if (Math.abs(next - stillnessRef.current) > 0.01) {
        stillnessRef.current = next;
        setStillnessLevel(next);
        onStillnessChange?.(next);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onStillnessChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const pointsSource = map.getSource('tethys-regions');
    if (pointsSource) pointsSource.setData(regionPoints);
    const areaSource = map.getSource('tethys-areas');
    if (areaSource) areaSource.setData(regionAreas);
  }, [mapReady, regionAreas, regionPoints]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const coords = regionPoints.features.map((f) => f.geometry.coordinates);
    if (!coords.length) return;
    const bounds = coords.reduce(
      (acc, coord) => {
        acc[0][0] = Math.min(acc[0][0], coord[0]);
        acc[0][1] = Math.min(acc[0][1], coord[1]);
        acc[1][0] = Math.max(acc[1][0], coord[0]);
        acc[1][1] = Math.max(acc[1][1], coord[1]);
        return acc;
      },
      [[coords[0][0], coords[0][1]], [coords[0][0], coords[0][1]]]
    );
    map.fitBounds(bounds, { padding: 80, duration: 900 });
  }, [mapReady, regionPoints]);

  // Food web trophic coloring — tints region areas by dominant track when active
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (foodWebActive) {
      const regionColorExpression = ['match', ['get', 'region']];
      visibleFragments.forEach((f) => {
        regionColorExpression.push(f.region, foodWebColor(f.region));
      });
      regionColorExpression.push(FOOD_WEB_COLORS.default);
      try {
        map.setPaintProperty('tethys-area-fill', 'fill-color', regionColorExpression);
        map.setPaintProperty('tethys-area-fill', 'fill-opacity', 0.55);
      } catch (_) { /* layer not ready */ }
    } else {
      try {
        map.setPaintProperty('tethys-area-fill', 'fill-color', [
          'case',
          ['==', ['get', 'current'], 1], '#f97316',
          ['==', ['get', 'locked'], 1], '#1f2937',
          '#0f172a'
        ]);
        map.setPaintProperty('tethys-area-fill', 'fill-opacity', [
          'case',
          ['==', ['get', 'current'], 1], 0.14,
          ['==', ['get', 'locked'], 1], 0.08,
          0.1
        ]);
      } catch (_) { /* layer not ready */ }
    }
  }, [mapReady, foodWebActive, visibleFragments]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const handleClick = (event) => {
      const feature = event.features?.[0];
      if (!feature) return;
      const { region, clickable } = feature.properties || {};
      const canClick = Number(clickable ?? 1) !== 0;
      if (!region || !canClick) return;

      const original = event.originalEvent || {};
      if (original.shiftKey || original.altKey) {
        onInspect?.(region);
      } else {
        onTravel?.(region);
      }
    };

    const setCursor = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const resetCursor = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', 'tethys-markers', handleClick);
    map.on('mouseenter', 'tethys-markers', setCursor);
    map.on('mouseleave', 'tethys-markers', resetCursor);

    return () => {
      map.off('click', 'tethys-markers', handleClick);
      map.off('mouseenter', 'tethys-markers', setCursor);
      map.off('mouseleave', 'tethys-markers', resetCursor);
    };
  }, [mapReady, onInspect, onTravel]);

  const watcherIntensity = watcherIntensityFor(currentLocation);
  const volcanicMode = STYLE_MODE === 'volcanic';
  const noiseOpacity = Math.min(0.45, 0.1 + weatherMistBoost * 0.7 + cloudIntensity * 0.2);
  const ashOpacity = watcherIntensity === 'near' ? 0.22 : watcherIntensity === 'mid' ? 0.12 : 0.06;
  const mycoOpacity = mycorrhizalActive ? Math.min(0.45, 0.18 + sporeSaturation * 0.35) : 0;
  const foodOpacity = foodWebActive ? 0.25 : 0;

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-2xl border border-stone-800 bg-[#050505]"
      style={volcanicMode ? { transform: 'scaleX(-1)' } : undefined}
    >
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
        style={volcanicMode ? {
          filter: 'saturate(0.82) contrast(1.06) brightness(0.90)',
        } : undefined}
      />

      {/* Counter-flip overlay wrapper so UI text/controls read correctly */}
      <div className="absolute inset-0" style={volcanicMode ? { transform: 'scaleX(-1)' } : undefined}>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      {volcanicMode && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 70%, rgba(251,146,60,0.22), transparent 60%), radial-gradient(circle at 80% 30%, rgba(239,68,68,0.18), transparent 55%)',
            mixBlendMode: 'screen',
            opacity: 0.7
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${cdn('/img/map/tethys-mist-noise.png')})`,
          opacity: noiseOpacity,
          mixBlendMode: 'soft-light'
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${cdn('/img/map/tethys-ember-scar.png')})`,
          opacity: ashOpacity,
          mixBlendMode: 'screen'
        }}
      />

      {stormFrontActive && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: Math.max(0.15, Math.min(0.7, stormFrontIntensity)),
            mixBlendMode: 'screen'
          }}
        >
          <div className="absolute inset-0 storm-front-layer" />
        </div>
      )}

      {mycorrhizalActive && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: mycoOpacity,
            backgroundImage: 'radial-gradient(circle at 40% 35%, rgba(16,185,129,0.45), transparent 60%)',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {foodWebActive && (
        <div className="pointer-events-none absolute bottom-16 left-4 rounded-xl border border-stone-700/60 bg-black/70 px-3 py-2 text-[10px] backdrop-blur-sm">
          <p className="uppercase tracking-[0.25em] text-stone-400 mb-1.5">Trophic Track</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#0891b2' }} />
              <span className="text-cyan-300">Chemosynthetic — sulfur-driven</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-emerald-300">Photosynthetic — solar-driven</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#eab308' }} />
              <span className="text-amber-300">Mixed dual-track</span>
            </div>
          </div>
        </div>
      )}

      {showStaffOverlay && equippedStaff ? (
        <div className="pointer-events-none absolute bottom-4 right-4 w-[220px] rounded-xl border border-stone-800/80 bg-black/70 p-3 shadow-[0_16px_30px_rgba(0,0,0,0.45)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Staff Echo</p>
          <StaffVisualizer staffData={equippedStaff} heightClass="h-[200px]" />
        </div>
      ) : null}

      {!satelliteConfigured && (
        <div className="absolute left-4 top-4 rounded-full border border-stone-700/60 bg-black/60 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-stone-400">
          Satellite tiles not configured
        </div>
      )}

      <style jsx>{`
        .storm-front-layer {
          width: 100%;
          height: 100%;
          background-image: linear-gradient(120deg, rgba(255,255,255,0) 10%, rgba(200,220,255,0.32) 40%, rgba(255,255,255,0) 70%);
          background-size: 220% 100%;
          animation: storm-front 18s linear infinite;
          filter: blur(8px);
        }
        @keyframes storm-front {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>

      {/* Scale bar + attribution — inside counter-flip so text reads correctly */}
      <div className="pointer-events-none absolute bottom-2 left-3 flex items-end gap-3">
        {/* Scale bar — approximate: at zoom 3.8 over Indonesia, ~140px ≈ 1000km */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[8px] font-mono text-stone-500">1000 km</span>
          <div className="flex">
            <div className="w-[70px] h-[3px] bg-stone-400/70" />
            <div className="w-[70px] h-[3px] bg-stone-700/70" />
          </div>
          <div className="w-[140px] h-px bg-stone-500/50" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-1 right-2 text-[9px] text-stone-600/60 font-mono">
        © Esri · World Imagery
      </div>

      </div>{/* end counter-flip wrapper */}
    </div>
  );
}

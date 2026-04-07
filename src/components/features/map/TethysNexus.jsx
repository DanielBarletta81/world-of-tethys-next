'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cdn } from '@/lib/cdn';
import StaffVisualizer from '@/components/StaffVisualizer';

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
  { id: 'skycity', label: 'Sky City', region: 'sky-city', anchor: { x: 0.26, y: 0.84 }, icon: '/img/icons/sky-city.svg', coords: { lat: -16.5, lng: -68.15 }, extent: 2.8, satellite: submapSatellite('sky-city', { opacity: 0.46 }) },
  { id: 'the-weep', label: 'The Weep', region: 'the-weep', anchor: { x: 0.28, y: 0.8 }, coords: { lat: -15.9, lng: -67.5 }, extent: 2.2, satellite: submapSatellite('the-weep', { opacity: 0.5 }) },
  { id: 'the-ledge', label: 'The Ledge', region: 'the-ledge', anchor: { x: 0.31, y: 0.77 }, coords: { lat: -15.1, lng: -66.8 }, extent: 2.2, satellite: submapSatellite('the-ledge', { opacity: 0.48 }) },
  { id: 'silurian-riverlands', label: 'Silurian Riverlands', region: 'silurian-riverlands', anchor: { x: 0.34, y: 0.73 }, icon: '/img/icons/silurian.svg', coords: { lat: -13.6, lng: -65.4 }, extent: 3.0, satellite: submapSatellite('silurian-riverlands', { opacity: 0.5 }) },
  { id: 'cimmerian', label: 'Cimmerian Mtns', region: 'cimmerian-mtns', anchor: { x: 0.16, y: 0.73 }, showPin: false, clickable: false, coords: { lat: -19.5, lng: -69.4 }, extent: 3.4 },
  { id: 'denisova', label: 'Denisova', region: 'denisova', anchor: { x: 0.28, y: 0.56 }, showPin: false, clickable: false, coords: { lat: 51.4, lng: 84.7 }, extent: 3.2 },
  { id: 'siluria', label: 'Siluria', region: 'siluria', anchor: { x: 0.18, y: 0.44 }, icon: '/img/icons/silurian.svg', clickable: false, coords: { lat: 30.4, lng: 34.9 }, extent: 4.0 },
  { id: 'watcher-volcano', label: 'Watcher Volcano', region: 'watcher-volcano', anchor: { x: 0.58, y: 0.16 }, coords: { lat: 38.2, lng: 16.0 }, extent: 2.6, satellite: submapSatellite('watcher-volcano', { opacity: 0.6, blend: 'screen' }) },
  { id: 'purgess', label: 'Purgess Flats', region: 'purgess', anchor: { x: 0.57, y: 0.23 }, coords: { lat: 35.8, lng: 13.4 }, extent: 2.5, satellite: submapSatellite('purgess', { opacity: 0.56 }) },
  { id: 'arnn-ridge', label: 'Arnn Ridge', region: 'arnn-ridge', anchor: { x: 0.6, y: 0.25 }, coords: { lat: 44.8, lng: -120.4 }, extent: 2.6, satellite: submapSatellite('arnn-ridge', { opacity: 0.5 }) },
  { id: 'northern-mountains', label: 'Northern Mountains', region: 'northern-mountains', anchor: { x: 0.62, y: 0.14 }, coords: { lat: 48.2, lng: -120.9 }, extent: 3.1, satellite: submapSatellite('northern-mountains', { opacity: 0.5 }) },
  { id: 'dier-lake', label: 'Dier Lake', region: 'dier-lake', anchor: { x: 0.66, y: 0.27 }, coords: { lat: 41.6, lng: -71.2 }, extent: 2.3, satellite: submapSatellite('dier-lake', { opacity: 0.52 }) },
  { id: 'karst', label: 'Karst Drains', region: 'karst-drains', anchor: { x: 0.22, y: 0.3 }, coords: { lat: 25.2, lng: 110.3 }, extent: 3.2, satellite: submapSatellite('karst-drains', { opacity: 0.5 }) },
  { id: 'younger', label: 'Younger Woods', region: 'younger-woods', anchor: { x: 0.3, y: 0.22 }, showPin: false, clickable: false, coords: { lat: 47.2, lng: -122.5 }, extent: 2.8 },
  { id: 'ironwoods', label: 'Ironwoods', region: 'ironwoods', anchor: { x: 0.62, y: 0.2 }, icon: '/img/icons/ironwood.svg', coords: { lat: 45.5, lng: -122.7 }, extent: 2.8, satellite: submapSatellite('ironwoods', { opacity: 0.5 }) },
  { id: 'ironwood-spires', label: 'Ironwood Spires', region: 'ironwood-spires', anchor: { x: 0.36, y: 0.78 }, icon: '/img/icons/sky-city.svg', showPin: false, clickable: false, coords: { lat: 44.2, lng: -121.7 }, extent: 2.4 },
  { id: 'mystic-woods', label: 'Mystic Woods', region: 'mystic-woods', anchor: { x: 0.54, y: 0.28 }, icon: '/img/icons/mystics.svg', coords: { lat: 3.1, lng: 101.7 }, extent: 3.4, satellite: submapSatellite('mystic-woods', { opacity: 0.55 }) },
  { id: 'mt-cinder', label: 'Mt. Cinder', region: 'mt-cinder', anchor: { x: 0.82, y: 0.12 }, icon: '/img/icons/mount-shastea.svg', coords: { lat: 37.7, lng: 15.0 }, extent: 2.4, satellite: submapSatellite('mt-cinder', { opacity: 0.62, blend: 'screen', position: '52% 48%' }) },
  { id: 'straits', label: 'Straits of Dier', region: 'straits-of-dier', anchor: { x: 0.43, y: 0.48 }, icon: '/img/icons/straits-of-dier.svg', coords: { lat: 41.6, lng: -71.2 }, extent: 2.6, satellite: submapSatellite('straits-of-dier', { opacity: 0.52 }) },
  { id: 'twin-straits', label: 'Twin Straits of Dier', region: 'twin-straits-of-dier', anchor: { x: 0.47, y: 0.5 }, icon: '/img/icons/straits-of-dier.svg', coords: { lat: 40.8, lng: -70.1 }, extent: 2.6, satellite: submapSatellite('twin-straits-of-dier', { opacity: 0.52 }) },
  { id: 'danian-river', label: 'Danian River', region: 'danian-river', anchor: { x: 0.5, y: 0.54 }, coords: { lat: 7.8, lng: -44.0 }, extent: 2.7, satellite: submapSatellite('danian-river', { opacity: 0.5 }) },
  { id: 'pteros', label: 'Pteros Island', region: 'pteros', anchor: { x: 0.46, y: 0.56 }, icon: '/img/icons/pteros_island.svg', coords: { lat: -3.7, lng: -38.5 }, extent: 2.6, satellite: submapSatellite('pteros', { opacity: 0.56 }) },
  { id: 'danian-delta', label: 'Danian Delta', region: 'danian-delta', anchor: { x: 0.52, y: 0.61 }, coords: { lat: 5.2, lng: -36.7 }, extent: 2.7, satellite: submapSatellite('danian-delta', { opacity: 0.57 }) },
  { id: 'mammoth', label: 'Mammoth Island', region: 'mammoth-hand-island', anchor: { x: 0.72, y: 0.46 }, icon: '/img/icons/mammoth-hand-island.svg', coords: { lat: 61.2, lng: -149.9 }, extent: 4.2, satellite: submapSatellite('mammoth-hand-island', { opacity: 0.5 }) },
  { id: 'thal', label: 'Thal Territory', region: 'thal-territory', anchor: { x: 0.74, y: 0.51 }, showPin: false, clickable: false, labelOffset: { x: 7, y: 7 }, coords: { lat: -2.3, lng: 34.8 }, extent: 4.6, satellite: submapSatellite('thal-territory', { opacity: 0.48 }) },
  { id: 'amber-plains', label: 'Amber Plains', region: 'amber-plains', anchor: { x: 0.68, y: 0.72 }, icon: '/img/icons/nubian-sandbar.svg', coords: { lat: -1.4, lng: 35.2 }, extent: 4.2, satellite: submapSatellite('amber-plains', { opacity: 0.52, blend: 'soft-light' }) },
  { id: 'tethys-sea', label: 'Tethys Sea', region: 'tethys-sea', anchor: { x: 0.53, y: 0.64 }, showPin: false, clickable: false, coords: { lat: 34.5, lng: 18.5 }, extent: 6.5, satellite: submapSatellite('tethys-sea', { opacity: 0.45, blend: 'screen' }) },
  { id: 'rogue', label: 'Rogue Island', region: 'rogue-island', anchor: { x: 0.74, y: 0.73 }, showPin: false, clickable: false, coords: { lat: -4.6, lng: 55.5 }, extent: 3.8, satellite: submapSatellite('rogue-island', { opacity: 0.5 }) },
  { id: 'new-tethys', label: 'New Tethys', region: 'new-tethys', anchor: { x: 0.78, y: 0.9 }, showPin: false, clickable: false, coords: { lat: -14.6, lng: 78.2 }, extent: 6.2, satellite: submapSatellite('new-tethys', { opacity: 0.48 }) },
  { id: 'permian-desert', label: 'Permian Desert', region: 'permian-desert', anchor: { x: 0.9, y: 0.9 }, coords: { lat: -23.4, lng: -69.3 }, extent: 4.8, satellite: submapSatellite('permian-desert', { opacity: 0.5, blend: 'soft-light' }) }
];

const DEFAULT_VIEW = { center: [18, 18], zoom: 2.1 };
const OSM_FALLBACK = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
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
    paint['raster-saturation'] = -0.35;
    paint['raster-contrast'] = 0.12;
    paint['raster-brightness-min'] = 0.12;
    paint['raster-brightness-max'] = 0.8;
    paint['raster-hue-rotate'] = 18;
  }
  return {
    version: 8,
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
  const satelliteConfigured = Boolean(
    process.env.NEXT_PUBLIC_TETHYS_MAP_STYLE_URL || process.env.NEXT_PUBLIC_TETHYS_SATELLITE_TILES
  );

  const mapStyle = useMemo(() => {
    const styleUrl = process.env.NEXT_PUBLIC_TETHYS_MAP_STYLE_URL;
    if (styleUrl) return styleUrl;

    const tileUrl = process.env.NEXT_PUBLIC_TETHYS_SATELLITE_TILES || OSM_FALLBACK;
    const attribution = process.env.NEXT_PUBLIC_TETHYS_SATELLITE_ATTRIBUTION
      || (tileUrl.includes('openstreetmap') ? '© OpenStreetMap contributors' : '');

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
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 140, unit: 'metric' }), 'bottom-left');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

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
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              0.35,
              2,
              1
            ]);
          }
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
    <div className="relative w-full h-[80vh] overflow-hidden rounded-2xl border border-stone-800 bg-[#050505]">
      <div
        ref={mapContainerRef}
        className="absolute inset-0"
        style={volcanicMode ? { filter: 'saturate(0.85) contrast(1.08) brightness(0.78)' } : undefined}
      />

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
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: foodOpacity,
            backgroundImage: 'radial-gradient(circle at 70% 60%, rgba(34,211,238,0.35), transparent 55%)',
            mixBlendMode: 'screen'
          }}
        />
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
    </div>
  );
}

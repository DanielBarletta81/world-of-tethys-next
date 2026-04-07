'use client';

import { useEffect, useRef, useState } from 'react';

const colors = {
  tethysBlue: '#2C5282',
  tethysBlueLight: 'rgba(44, 82, 130, 0.2)',
  terracotta: '#C05621',
  terracottaLight: 'rgba(192, 86, 33, 0.2)',
  slate: '#4A5568'
};

export default function InteractiveSurvivalPanels() {
  const tideCanvasRef = useRef(null);
  const speciationCanvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('communications');

  useEffect(() => {
    let ChartModule;
    let tideChart;
    let speciationChart;
    let mounted = true;

    (async () => {
      try {
        ChartModule = await import('chart.js/auto');
      } catch (err) {
        console.warn('Chart.js import failed; skipping interactive charts.', err?.message || err);
        return;
      }

      if (!mounted || !tideCanvasRef.current || !speciationCanvasRef.current) return;

      tideChart = new ChartModule.default(tideCanvasRef.current, {
        type: 'line',
        data: {
          labels: ['Phase 1', 'Phase 2', 'OAE 1b Onset', 'The Wall of Water', 'Post-Surge Equilibrium', 'New Baseline'],
          datasets: [
            {
              label: 'Catastrophic Tide Level (Meters)',
              data: [5, 12, 18, 85, 40, 45],
              borderColor: colors.tethysBlue,
              backgroundColor: colors.tethysBlueLight,
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: colors.tethysBlue
            },
            {
              label: 'S-Shaped Clinoform Habitable Elevation',
              data: [30, 30, 30, 30, 30, 30],
              borderColor: colors.terracotta,
              borderWidth: 2,
              borderDash: [6, 6],
              fill: false,
              pointRadius: 0
            },
            {
              label: 'Sky City Founding Elevation',
              data: [null, null, null, null, 120, 120],
              borderColor: colors.slate,
              borderWidth: 3,
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              backgroundColor: 'rgba(45, 55, 72, 0.9)',
              padding: 10,
              callbacks: {
                label(context) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  if (context.parsed.y !== null) label += `${context.parsed.y}m`;
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Elevation relative to old sea level (m)' },
              grid: { color: '#E2E8F0' }
            },
            x: { grid: { display: false } }
          }
        }
      });

      speciationChart = new ChartModule.default(speciationCanvasRef.current, {
        type: 'bubble',
        data: {
          datasets: [
            {
              label: 'Base Cambrians (Control)',
              data: [{ x: 10, y: 170, r: 15, pressure: 'Moderate coastal equilibrium' }],
              backgroundColor: 'rgba(74, 85, 104, 0.6)',
              borderColor: colors.slate
            },
            {
              label: 'The Mynz (Marsh Dwellers)',
              data: [
                { x: 30, y: 150, r: 12, pressure: 'High predation, thick marsh canopy' },
                { x: 60, y: 135, r: 10, pressure: 'Aquatic evasion required, webbing develops' },
                { x: 100, y: 120, r: 8, pressure: 'Hyper-agile, compact morphology fixed' }
              ],
              backgroundColor: 'rgba(44, 82, 130, 0.7)',
              borderColor: colors.tethysBlue
            },
            {
              label: 'Gargantua Archipelago (Giants)',
              data: [
                { x: 30, y: 185, r: 18, pressure: 'Island isolation, megafauna competition' },
                { x: 60, y: 210, r: 25, pressure: 'Ecological release, giantism traits amplify' },
                { x: 100, y: 240, r: 35, pressure: 'Bol/Barr lineage stabilized' }
              ],
              backgroundColor: 'rgba(192, 86, 33, 0.7)',
              borderColor: colors.terracotta
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              backgroundColor: 'rgba(45, 55, 72, 0.9)',
              callbacks: {
                label(context) {
                  const raw = context.raw;
                  return [`Height: ${raw.y} cm`, `Time Isolated: ${raw.x}k Years`, `Driver: ${raw.pressure}`];
                }
              }
            }
          },
          scales: {
            y: {
              title: { display: true, text: 'Average Adult Height (cm)' },
              grid: { color: '#E2E8F0' }
            },
            x: {
              title: { display: true, text: 'Time Since Separation (Thousands of Years)' },
              grid: { display: false }
            }
          }
        }
      });
    })();

    return () => {
      mounted = false;
      if (tideChart) tideChart.destroy();
      if (speciationChart) speciationChart.destroy();
    };
  }, []);

  return (
    <>
      <section className="mt-8 rounded-2xl border border-amber-900/25 bg-[#edf2f7] p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)] md:p-8">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Interactive Topography: The Clinoform Refuge</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#3f3024]">
          Compare the catastrophic tide profile against habitable clinoform elevation. Settlements survived only where
          ridge geometry created enough vertical margin and predictable approach corridors.
        </p>
        <div className="mt-5 rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-sm md:p-4">
          <div className="relative h-[350px] w-full md:h-[430px]">
            <canvas ref={tideCanvasRef} aria-label="Clinoform refuge tide chart" />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)] md:p-8">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Hominid Speciation Divergence Map</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#3f3024]">
          Isolation pressure did not produce a single human outcome. It produced distinct morphologies tied to terrain,
          predation load, and logistical constraints.
        </p>
        <div className="mt-5 rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-sm md:p-4">
          <div className="relative h-[350px] w-full md:h-[430px]">
            <canvas ref={speciationCanvasRef} aria-label="Hominid speciation divergence chart" />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)] md:p-8">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Logistics of Survival</h2>
        <p className="mt-3 leading-relaxed text-[#3f3024]">
          Open a panel below to inspect the systems that let communities survive in high-risk dinosaur-era corridors.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setActiveTab('communications')}
            className={`rounded-lg border-2 p-4 text-center text-sm font-bold transition-colors ${
              activeTab === 'communications'
                ? 'border-[#2C5282] bg-[#2C5282] text-white'
                : 'border-[#cbd5e0] bg-[#edf2f7] text-[#4A5568]'
            }`}
          >
            Communications
            <span className="mt-1 block text-xs font-normal">Ptero-swifts and Eyries</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('measurement')}
            className={`rounded-lg border-2 p-4 text-center text-sm font-bold transition-colors ${
              activeTab === 'measurement'
                ? 'border-[#2C5282] bg-[#2C5282] text-white'
                : 'border-[#cbd5e0] bg-[#edf2f7] text-[#4A5568]'
            }`}
          >
            Logistics
            <span className="mt-1 block text-xs font-normal">Bol and Matsu-knots</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shelter')}
            className={`rounded-lg border-2 p-4 text-center text-sm font-bold transition-colors ${
              activeTab === 'shelter'
                ? 'border-[#2C5282] bg-[#2C5282] text-white'
                : 'border-[#cbd5e0] bg-[#edf2f7] text-[#4A5568]'
            }`}
          >
            Infrastructure
            <span className="mt-1 block text-xs font-normal">Cambria to Sky City</span>
          </button>
        </div>

        <div className="mt-5 min-h-[260px] rounded-xl border border-gray-200 bg-white p-6">
          {activeTab === 'communications' && (
            <div>
              <h3 className="text-xl font-semibold text-[#2C5282]">The Ptero-Swift Symbiosis</h3>
              <p className="mt-3 leading-relaxed text-[#3f3024]">
                Information had to outrun danger. Neutral eyries, managed by specialist handlers, created a resilient
                relay system where messages could cross hostile terrain without forcing direct ground contact between
                rival factions.
              </p>
            </div>
          )}

          {activeTab === 'measurement' && (
            <div>
              <h3 className="text-xl font-semibold text-[#2C5282]">Matsu-Knots and the Bol</h3>
              <p className="mt-3 leading-relaxed text-[#3f3024]">
                Standardization made distributed survival possible. Knot-based slipcodes encoded urgency and route
                constraints, while the Bol unit aligned speed and distance planning across communities that otherwise
                shared no stable political center.
              </p>
            </div>
          )}

          {activeTab === 'shelter' && (
            <div>
              <h3 className="text-xl font-semibold text-[#2C5282]">From Cambria to Sky City</h3>
              <p className="mt-3 leading-relaxed text-[#3f3024]">
                After catastrophic coastal loss, refuge architecture moved permanently upslope. The transition from
                temporary high-ground camps to engineered elevated cities marked the moment survival became a long-range
                civic design problem, not a seasonal improvisation.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

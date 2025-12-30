'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const compositionLabels = [
  'Theropod Aggressors (Carnivores)',
  'Sauropod Titans (Structural)',
  'Pterosaur Scouts (Aerial)',
  'Marine Leviathans (Aquatic)',
  'Insectoid Symbiotes (Utility)'
];

const survivalLabels = [
  'Deep Sea Pressure Resistance',
  'Low Oxygen Tolerance',
  'Toxin Filtration Capacity',
  'Wound Regeneration Speed',
  'Caloric Efficiency Rate'
];

const radarLabels = [
  'Hydrodynamic Efficiency',
  'Bite Force Pressure',
  'Cognitive Problem Solving',
  'Camouflage Capability',
  'Reproductive Rate',
  'Armor Density Rating'
];

const lineLabels = [
  'Founding Era (Year 0-100)',
  'Golden Age of Splicing (100-300)',
  'The Expansion Era (300-450)',
  'The Stagnation Period (450-500)',
  'The Mutation Cascade (500-550)',
  'The Fall of Cambria (550+)'
];

function splitLabels(labels) {
  return labels.map((label) => {
    if (label.length <= 16) return label;
    const words = label.split(' ');
    const lines = [];
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      if (`${current} ${words[i]}`.length <= 16) {
        current += ` ${words[i]}`;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
    return lines;
  });
}

export default function CambriaPage() {
  const compRef = useRef(null);
  const survRef = useRef(null);
  const radarRef = useRef(null);
  const lineRef = useRef(null);
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    let ChartModule;
    let instances = [];
    (async () => {
      try {
        ChartModule = await import('chart.js/auto');
      } catch (err) {
        console.warn('Chart.js not installed; charts will be hidden.', err?.message || err);
        return;
      }

      const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#5c4f43', font: { family: 'EB Garamond' } }
          },
          tooltip: {
            callbacks: {
              title(tooltipItems) {
                const item = tooltipItems[0];
                const label = item?.chart?.data?.labels?.[item.dataIndex];
                return Array.isArray(label) ? label.join(' ') : label;
              }
            },
            backgroundColor: 'rgba(226, 215, 197, 0.95)',
            titleColor: '#7a3a23',
            bodyColor: '#2b2621',
            borderColor: '#c7b6a1',
            borderWidth: 1,
            padding: 10
          }
        }
      };

      if (compRef.current) {
        instances.push(
          new ChartModule.default(compRef.current, {
            type: 'doughnut',
            data: {
              labels: splitLabels(compositionLabels),
              datasets: [
                {
                  data: [35, 25, 20, 15, 5],
                  backgroundColor: ['#f43f5e', '#8b5cf6', '#06b6d4', '#0ea5e9', '#10b981'],
                  borderColor: '#c7b6a1',
                  borderWidth: 2,
                  hoverOffset: 8
                }
              ]
            },
            options: {
              ...baseOptions,
              cutout: '60%',
              plugins: { ...baseOptions.plugins, legend: { position: 'right', labels: { color: '#5c4f43' } } }
            }
          })
        );
      }

      if (survRef.current) {
        instances.push(
          new ChartModule.default(survRef.current, {
            type: 'bar',
            data: {
              labels: splitLabels(survivalLabels),
              datasets: [
                {
                  label: 'Natural Baseline (Wild)',
                  data: [40, 55, 30, 20, 45],
                  backgroundColor: '#c7b6a1',
                  borderRadius: 6,
                  barPercentage: 0.6
                },
                {
                  label: 'Engineered Hybrid (Cambria)',
                  data: [95, 88, 92, 85, 90],
                  backgroundColor: '#7a3a23',
                  borderRadius: 6,
                  barPercentage: 0.6
                }
              ]
            },
            options: {
              ...baseOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(43,38,33,0.1)' },
                  ticks: { color: '#5c4f43' },
                  max: 100
                },
                x: { grid: { display: false }, ticks: { color: '#5c4f43', autoSkip: false } }
              }
            }
          })
        );
      }

      if (radarRef.current) {
        instances.push(
          new ChartModule.default(radarRef.current, {
            type: 'radar',
            data: {
              labels: splitLabels(radarLabels),
              datasets: [
                {
                  label: 'Tethys Titan (Engineered)',
                  data: [90, 95, 85, 70, 20, 88],
                  fill: true,
                  backgroundColor: 'rgba(122,58,35,0.15)',
                  borderColor: '#7a3a23',
                  pointBackgroundColor: '#7a3a23'
                },
                {
                  label: 'Wild Acrocanthosaurus',
                  data: [30, 85, 40, 40, 80, 50],
                  fill: true,
                  backgroundColor: 'rgba(124,110,90,0.15)',
                  borderColor: '#5c4f43',
                  pointBackgroundColor: '#5c4f43'
                }
              ]
            },
            options: {
              ...baseOptions,
              scales: {
                r: {
                  angleLines: { color: 'rgba(43,38,33,0.1)' },
                  grid: { color: 'rgba(43,38,33,0.15)' },
                  pointLabels: { color: '#5c4f43', font: { size: 11 } },
                  ticks: { display: false }
                }
              }
            }
          })
        );
      }

      if (lineRef.current) {
        instances.push(
          new ChartModule.default(lineRef.current, {
            type: 'line',
            data: {
              labels: splitLabels(lineLabels),
              datasets: [
                {
                  label: 'Genetic Instability Index',
                  data: [5, 12, 18, 45, 88, 98],
                  borderColor: '#f43f5e',
                  backgroundColor: 'rgba(244,63,94,0.12)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3
                },
                {
                  label: 'Technological Output',
                  data: [20, 80, 95, 90, 60, 10],
                  borderColor: '#06b6d4',
                  borderDash: [5, 5],
                  backgroundColor: 'transparent',
                  tension: 0.2,
                  pointRadius: 0
                }
              ]
            },
            options: {
              ...baseOptions,
              interaction: { mode: 'index', intersect: false },
              scales: {
                y: {
                  grid: { color: 'rgba(43,38,33,0.1)' },
                  ticks: { color: '#5c4f43' },
                  title: { display: true, text: 'Index Value (0-100)', color: '#5c4f43' }
                },
                x: { grid: { display: false }, ticks: { color: '#5c4f43' } }
              }
            }
          })
        );
      }

      setChartsReady(true);

      return () => instances.forEach((c) => c?.destroy());
    })();
  }, []);

  return (
    <main className="section-shell space-y-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Cambria Archive</p>
          <h1 className="text-3xl font-display uppercase tracking-tight">The Genetic Forge of the Cretaceous</h1>
          <p className="text-sm text-ancient-ink/70">Era: 111 MYA — Bio-tech without machines</p>
        </div>
        <Link href="/" className="text-[11px] font-mono uppercase tracking-[0.3em] text-ancient-accent">
          Return to Map
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="Temporal Location" value="111 MYA" accent="text-ancient-accent" />
        <StatCard label="Viable Chimeras Created" value="4,200+" accent="text-ancient-ink" />
        <StatCard label="Mechanical Dependence" value="Zero" accent="text-ancient-teal" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <article className="space-y-4">
          <p className="eyebrow">Genesis</p>
          <h2 className="text-2xl font-display uppercase tracking-wide">The Genetic Source Code</h2>
          <p className="text-sm text-ancient-ink/80">
            Cambria’s bio-engineers harvested genetic material from dominant Aptian fauna. Theropod DNA drove aggression and metabolism; Sauropod DNA provided structure and scale.
          </p>
          <p className="text-sm text-ancient-ink/80">
            This composition map shows how aggression, structure, air, water, and utility symbiotes were blended to seed the servitor classes.
          </p>
          <div className="artifact-card text-sm italic text-ancient-ink/80 border-l-4 border-ancient-accent">
            "Flesh is the clay, DNA is the kiln." — Arch-Geneticist Vaal
          </div>
        </article>
        <div className="artifact-card">
          <h3 className="text-lg font-display mb-2 uppercase tracking-wide text-center">DNA Contribution by Clade</h3>
          <div className="w-full h-72 lg:h-80">
            {chartsReady ? <canvas ref={compRef} className="w-full h-full" /> : <ChartPlaceholder />}
          </div>
          <p className="text-[11px] text-ancient-ink/60 text-center mt-2">Source: Cambria Central Gene-Bank Fragments</p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <p className="eyebrow">Symbiosis</p>
          <h2 className="text-2xl font-display uppercase tracking-wide">Survival Through Symbiosis</h2>
          <p className="text-sm text-ancient-ink/80">
            Forced symbiosis paired modified hosts with flora and fauna to amplify survival in high-oxygen predator-dense biomes.
          </p>
        </div>
        <div className="artifact-card space-y-4">
          <h3 className="text-lg font-display uppercase tracking-wide">Survival Rates: Natural vs Engineered</h3>
          <div className="w-full h-80 lg:h-96">
            {chartsReady ? <canvas ref={survRef} className="w-full h-full" /> : <ChartPlaceholder />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-sm text-ancient-ink/80">
            <div>
              <span className="block text-xl font-display text-ancient-accent">+145%</span>
              Longevity Increase
            </div>
            <div>
              <span className="block text-xl font-display text-ancient-teal">-40%</span>
              Caloric Requirement
            </div>
            <div>
              <span className="block text-xl font-display text-ancient-ink">99.9%</span>
              Reproductive Control
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="artifact-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-display uppercase tracking-wide">Project: Tethys Titan</h3>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-accent">Restricted</span>
          </div>
          <div className="w-full h-80 lg:h-96">
            {chartsReady ? <canvas ref={radarRef} className="w-full h-full" /> : <ChartPlaceholder />}
          </div>
          <p className="text-[11px] text-ancient-ink/60 text-center mt-2">Titan Hybrid vs Natural Tyrannosaur</p>
        </div>
        <article className="space-y-3">
          <p className="eyebrow">Apex</p>
          <h2 className="text-2xl font-display uppercase tracking-wide">Engineering the Ultimate Guardian</h2>
          <p className="text-sm text-ancient-ink/80">
            The Tethys Titan trades reproductive rate and sprint speed for massive gains in cognition, armor density, and hydrodynamics. Neural cortex from raptors, plating from ankylosaurs, gill-lung hybrid from mosasaurs.
          </p>
          <ul className="text-sm text-ancient-ink/80 space-y-1">
            <li>Enhanced Neural Cortex (Raptor base)</li>
            <li>Osteoderm Plating (Ankylosaur base)</li>
            <li>Gills/Lung Hybrid System (Mosasaur splice)</li>
          </ul>
        </article>
      </section>

      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="eyebrow">Instability</p>
          <h2 className="text-2xl font-display uppercase tracking-wide">The Cost of Hubris</h2>
          <p className="text-sm text-ancient-ink/80">
            As Cambria pushed genetic boundaries, instability outpaced corrections—culminating in the Cascade Failure.
          </p>
        </div>
        <div className="artifact-card">
          <h3 className="text-lg font-display uppercase tracking-wide mb-4">Genetic Instability Index Over Eras</h3>
          <div className="w-full h-80 lg:h-96">
            {chartsReady ? <canvas ref={lineRef} className="w-full h-full" /> : <ChartPlaceholder />}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="artifact-card text-center">
      <div className={`text-2xl font-display mb-1 ${accent}`}>{value}</div>
      <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-ancient-ink/70">{label}</div>
    </div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center text-[11px] font-mono uppercase tracking-[0.2em] text-ancient-ink/50">
      Chart.js unavailable
    </div>
  );
}

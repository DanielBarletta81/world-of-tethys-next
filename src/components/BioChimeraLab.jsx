'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Beaker,
  Dna,
  Zap,
  Shield,
  Waves,
  Info,
  AlertTriangle,
  Wand2,
  RefreshCw
} from 'lucide-react';

const DINOSAURS = [
  { id: 'acro', name: 'Acrocanthosaurus', clade: 'Theropod', trait: 'Aggression' },
  { id: 'spino', name: 'Spinosaurus', clade: 'Aegyptiacus', trait: 'Aquatic Mastery' },
  { id: 'tenon', name: 'Tenontosaurus', clade: 'Ornithopod', trait: 'Endurance' },
  { id: 'sauro', name: 'Sauroposeidon', clade: 'Sauropod', trait: 'Massive Scale' }
];

const PTEROSAURS = [
  { id: 'quetz', name: 'Quetzalcoatlus', type: 'Giant Azhdarchid', trait: 'High-Altitude Vision' },
  { id: 'tape', name: 'Tapejara', type: 'Short-winged', trait: 'Aerial Agility' },
  { id: 'anhang', name: 'Anhanguera', type: 'Fish-eater', trait: 'Diving Velocity' }
];

const SYMBIOSES = [
  { id: 'biolum', name: 'Bioluminescent Algae', benefit: 'Deep-Sea Communication' },
  { id: 'mycel', name: 'Neural Mycelium', benefit: 'Hive Intelligence' },
  { id: 'coral', name: 'Calcified Coral Plate', benefit: 'Reactive Armor' }
];

/**
 * Cambria Bio-Chimera Lab (UI-only). Uses Gemini/Imagen endpoints if apiKey is provided.
 * Note: Chart dependencies are loaded lazily; without them the radar chart is hidden.
 */
export default function BioChimeraLab({ apiKey = '' }) {
  const [selectedDino, setSelectedDino] = useState(DINOSAURS[0]);
  const [selectedPtero, setSelectedPtero] = useState(PTEROSAURS[0]);
  const [selectedSymbiosis, setSelectedSymbiosis] = useState(SYMBIOSES[0]);

  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [hybridProfile, setHybridProfile] = useState(null);
  const [hybridImage, setHybridImage] = useState(null);
  const [error, setError] = useState(null);
  const [RadarChart, setRadarChart] = useState(null);

  const synthesisRef = useRef(null);

  useEffect(() => {
    // Lazy load chart libs if available to avoid hard dependency when not installed.
    (async () => {
      try {
        const chart = await import('chart.js');
        const reactChart = await import('react-chartjs-2');
        const { RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } = chart;
        chart.Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
        setRadarChart(() => reactChart.Radar);
      } catch (err) {
        console.warn('Radar chart unavailable (missing deps):', err?.message || err);
      }
    })();
  }, []);

  const chartData = useMemo(() => {
    if (!hybridProfile) return null;
    const stats = hybridProfile.biologicalStats || {};
    return {
      labels: ['Agility', 'Power', 'Intelligence', 'Resilience', 'Adaptability'],
      datasets: [
        {
          label: 'Genetic Potential',
          data: [
            stats.Agility,
            stats.Power,
            stats.Intelligence,
            stats.Resilience,
            stats.Adaptability
          ],
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderColor: '#06b6d4',
          borderWidth: 2,
          pointBackgroundColor: '#06b6d4'
        }
      ]
    };
  }, [hybridProfile]);

  const generateHybridProfile = async () => {
    setLoading(true);
    setError(null);

    const prompt = `Create a scientific profile for a hybrid organism in my sci-fi world "World of Tethys" set 111 million years ago. 
The organism is a "Bio-Chimera" created by the ancient city of Cambria.
Base Animal: ${selectedDino.name}
Pterosaur Trait Source: ${selectedPtero.name}
Symbiosis Integration: ${selectedSymbiosis.name}

Format the response as JSON with these keys: 
"speciesName" (Latin-style), "commonName", "scientificDescription" (2 sentences), 
"habitat", "biologicalStats" (object with keys: Agility, Power, Intelligence, Resilience, Adaptability - values 1-100).`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (!response.ok) throw new Error('Cambria Archive Connection Lost');
      const data = await response.json();
      const profile = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
      setHybridProfile(profile);
      generateHybridImage(profile);
    } catch (err) {
      setError('Failed to synchronize with Cambrian data banks.');
      setLoading(false);
    }
  };

  const generateHybridImage = async (profile) => {
    setGeneratingImage(true);
    const imagePrompt = `Detailed biological illustration of a prehistoric hybrid creature: A ${profile.speciesName}. It has the massive body of a ${selectedDino.name}, the specialized head and wings of a ${selectedPtero.name}, and glowing ${selectedSymbiosis.name} patterns across its skin. Set in a 111 million year old tropical Tethys ocean environment with bioluminescent plants. Professional sci-fi creature design, high detail.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: imagePrompt }],
            parameters: { sampleCount: 1 }
          })
        }
      );

      if (!response.ok) throw new Error('Visual Uplink Failed');
      const result = await response.json();
      const imageUrl = `data:image/png;base64,${result?.predictions?.[0]?.bytesBase64Encoded || ''}`;
      setHybridImage(imageUrl);
    } catch (err) {
      console.error('Image generation failed', err);
    } finally {
      setGeneratingImage(false);
      setLoading(false);
      if (synthesisRef.current) {
        synthesisRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-ancient-bg text-ancient-ink p-6 lg:p-10 font-body">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="border-b border-ancient-ink/10 pb-8 flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display uppercase tracking-tight flex items-center gap-3">
              <Beaker className="w-7 h-7 text-ancient-accent" /> Cambria Bio-Chimera Lab
            </h1>
            <p className="text-sm text-ancient-ink/70 mt-1">Experimental synthesis engine • Era: 111 MYA</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 border border-ancient-accent text-ancient-accent text-[10px] font-mono uppercase tracking-[0.3em]">
              Archive Secure
            </span>
            <span className="px-3 py-1 border border-ancient-ink/40 text-ancient-ink/80 text-[10px] font-mono uppercase tracking-[0.3em]">
              Tethys Link Active
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SelectionCard
            title="Genomic Base"
            icon={<Dna className="w-5 h-5" />}
            accentClass="text-ancient-accent"
            options={DINOSAURS}
            selected={selectedDino}
            onSelect={setSelectedDino}
            subtitle={(d) => `${d.clade} • Primary Trait: ${d.trait}`}
          />
          <SelectionCard
            title="Aerial Hybridization"
            icon={<Zap className="w-5 h-5" />}
            accentClass="text-ancient-ink"
            options={PTEROSAURS}
            selected={selectedPtero}
            onSelect={setSelectedPtero}
            subtitle={(p) => `${p.type} • Augment: ${p.trait}`}
          />
          <SelectionCard
            title="Survival Symbiosis"
            icon={<Waves className="w-5 h-5" />}
            accentClass="text-ancient-teal"
            options={SYMBIOSES}
            selected={selectedSymbiosis}
            onSelect={setSelectedSymbiosis}
            subtitle={(s) => `Benefit: ${s.benefit}`}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={generateHybridProfile}
            disabled={loading || !apiKey}
            className="group relative px-10 py-4 border border-ancient-accent text-ancient-accent font-display uppercase tracking-[0.3em] bg-white/70 hover:bg-ancient-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-3">
              {loading ? <RefreshCw className="w-4 h-4 spin-slow" /> : <Wand2 className="w-4 h-4" />}
              {loading ? 'Synthesizing…' : 'Initialize Bio-Synthesis'}
            </span>
            <span className="absolute inset-0 bg-ancient-accent opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </div>

        <div ref={synthesisRef} className="space-y-6">
          {loading && !hybridProfile && (
            <div className="artifact-card text-center space-y-3">
              <Dna className="w-10 h-10 mx-auto text-ancient-accent spin-slow" />
              <p className="text-sm font-mono uppercase tracking-[0.3em]">Decoding Cambrian nucleotides…</p>
            </div>
          )}

          {error && (
            <div className="artifact-card border border-red-200 bg-white/60 flex items-center gap-3 text-red-800">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {hybridProfile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="artifact-card flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-display uppercase tracking-tight italic">{hybridProfile.speciesName}</h3>
                  <p className="text-ancient-accent font-mono text-[10px] uppercase tracking-[0.3em]">
                    Commonly: {hybridProfile.commonName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-ancient-ink/80">
                  <Tag label={`Base: ${selectedDino.name}`} />
                  <Tag label={`Augment: ${selectedPtero.name}`} />
                  <Tag label={`Driver: ${selectedSymbiosis.name}`} />
                </div>

                <p className="text-sm leading-relaxed text-ancient-ink/80">{hybridProfile.scientificDescription}</p>

                <div className="border border-ancient-ink/15 p-3 rounded-lg flex gap-2 items-start bg-white/60">
                  <Info className="w-4 h-4 text-ancient-accent mt-[2px]" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ancient-ink">Ecological Habitat</p>
                    <p className="text-sm text-ancient-ink/80">{hybridProfile.habitat}</p>
                  </div>
                </div>

                <div className="min-h-[240px] border border-ancient-ink/10 rounded-lg p-3 bg-white/50 flex items-center justify-center">
                  {RadarChart && chartData ? (
                    <RadarChart
                      data={chartData}
                      options={{
                        scales: {
                          r: {
                            angleLines: { color: 'rgba(43,38,33,0.1)' },
                            grid: { color: 'rgba(43,38,33,0.15)' },
                            pointLabels: { color: '#5c4f43', font: { size: 10 } },
                            ticks: { display: false, max: 100, min: 0 }
                          }
                        },
                        plugins: { legend: { display: false } },
                        animation: { duration: 600 }
                      }}
                    />
                  ) : (
                    <p className="text-[12px] text-ancient-ink/60 font-mono uppercase tracking-[0.2em]">
                      Radar chart unavailable (install chart.js + react-chartjs-2)
                    </p>
                  )}
                </div>
              </div>

              <div className="artifact-card flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-mono uppercase tracking-[0.3em] text-ancient-ink flex items-center gap-2">
                    <Zap className="w-4 h-4 text-ancient-accent" /> Bio-Visual Reconstruction
                  </h4>
                  {generatingImage && (
                    <span className="text-[10px] text-ancient-ink/60 uppercase tracking-[0.2em]">Uploading visual uplink…</span>
                  )}
                </div>
                <div className="relative min-h-[320px] border border-ancient-ink/10 rounded-xl bg-white/50 flex items-center justify-center p-4">
                  {generatingImage ? (
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 border-4 border-ancient-accent border-t-transparent rounded-full spin-slow mx-auto" />
                      <p className="text-[10px] text-ancient-ink/60 font-mono uppercase tracking-[0.2em]">
                        Render engine active // Pixel gen phase 03
                      </p>
                    </div>
                  ) : hybridImage ? (
                    <img
                      src={hybridImage}
                      alt={hybridProfile.speciesName}
                      className="w-full h-full object-contain rounded-lg border border-ancient-ink/10 shadow-lg"
                    />
                  ) : (
                    <div className="text-center opacity-50">
                      <Shield className="w-10 h-10 mx-auto mb-3" />
                      <p className="text-sm">Awaiting visual confirmation</p>
                    </div>
                  )}

                  {hybridImage && (
                    <div className="absolute bottom-4 right-4 text-[10px] text-ancient-ink/60 font-mono uppercase tracking-[0.2em] bg-white/70 px-2 py-1 rounded border border-ancient-ink/15">
                      Cambria archives • Imagen 4.0
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SelectionCard({ title, icon, accentClass = '', options, selected, onSelect, subtitle }) {
  return (
    <div className="artifact-card space-y-3">
      <div className={`flex items-center gap-2 text-sm font-mono uppercase tracking-[0.3em] ${accentClass}`}>
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className={`w-full text-left p-3 border transition-all ${
              selected.id === opt.id
                ? 'border-ancient-accent bg-ancient-accent/10 text-ancient-ink'
                : 'border-ancient-ink/10 bg-white/50 hover:border-ancient-ink/30 text-ancient-ink/80'
            }`}
          >
            <div className="font-display text-lg">{opt.name}</div>
            <div className="text-[11px] text-ancient-ink/70">{subtitle(opt)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Tag({ label }) {
  return (
    <span className="px-2 py-1 bg-ancient-ink/5 rounded border border-ancient-ink/15">
      {label}
    </span>
  );
}

'use client';

import { useMemo, useState, useEffect } from 'react';
import { Hammer, ArrowRight } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
import StaffVisualizer from '@/components/StaffVisualizer';

const RECIPES = {
  'Watcher Basalt': {
    type: 'core',
    id: 'basalt',
    tier: 1,
    visual: { color: '#2e2a26', gradient: 'linear-gradient(180deg, #2e2a26 0%, #4a4036 100%)' }
  },
  'Rift Obsidian': {
    type: 'core',
    id: 'obsidian',
    tier: 2,
    visual: { color: '#000000', gradient: 'linear-gradient(135deg, #1a1a1a 0%, #4a0404 100%)' }
  },
  'Ironwood Branch': {
    type: 'core',
    id: 'ironwood',
    tier: 1,
    visual: { color: '#3f2e26', gradient: 'linear-gradient(to bottom, #3f2e26, #5c4033)' }
  },
  'Frenel Branch': {
    type: 'wrap',
    id: 'kelp',
    tier: 1,
    visual: { color: '#3f6212' }
  },
  'Conductive Gold Wire': {
    type: 'wrap',
    id: 'gold-wire',
    tier: 2,
    visual: { color: '#facc15' }
  },
  'Focusing Lens': {
    type: 'apex',
    id: 'lens',
    tier: 2,
    color: '#22d3ee'
  },
  'Scout Lantern': {
    type: 'apex',
    id: 'lantern',
    tier: 1,
    color: '#f59e0b'
  }
};

function buildVisualsFromComponents(components, fallback) {
  return {
    shaftGradient: components.core?.visual?.gradient || fallback?.shaftGradient,
    wrapColor: components.wrap?.visual?.color || fallback?.wrapColor,
    glowColor: components.apex?.color || fallback?.glowColor
  };
}

export default function StaffWorkbench() {
  const {
    equippedStaff,
    setEquippedStaff,
    forgeStaff,
    inventory,
    removeInventoryItem,
    setPlayerProfile,
    playerProfile
  } = useTethys();
  const [selectedPart, setSelectedPart] = useState('core');
  const [previewStaff, setPreviewStaff] = useState(equippedStaff);
  const [pendingParts, setPendingParts] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmItems, setConfirmItems] = useState([]);
  const [forgeNotice, setForgeNotice] = useState(null);

  useEffect(() => {
    setPreviewStaff(equippedStaff);
    setPendingParts({});
  }, [equippedStaff]);

  useEffect(() => {
    if (!equippedStaff) return;
    const draft = playerProfile?.staff?.workbenchDraft;
    if (!draft || draft.staffId !== equippedStaff.id) return;
    if (!draft.pendingParts) return;
    const hydrated = {};
    Object.entries(draft.pendingParts).forEach(([part, entry]) => {
      if (!entry?.itemId) return;
      const item = inventory.find((inv) => inv.id === entry.itemId);
      if (!item) return;
      const recipe = RECIPES[item.name];
      if (!recipe) return;
      hydrated[part] = { ...item, recipe };
    });
    if (Object.keys(hydrated).length === 0) return;
    setPendingParts(hydrated);
    const nextComponents = {
      ...equippedStaff.components
    };
    Object.entries(hydrated).forEach(([part, item]) => {
      nextComponents[part] = {
        id: item.recipe.id,
        label: item.name,
        tier: item.recipe.tier,
        visual: item.recipe.visual,
        color: item.recipe.color
      };
    });
    setPreviewStaff({
      ...equippedStaff,
      components: nextComponents,
      visuals: buildVisualsFromComponents(nextComponents, equippedStaff.visuals)
    });
  }, [equippedStaff, inventory, playerProfile?.staff?.workbenchDraft]);

  const availableComponents = useMemo(() => {
    return inventory.reduce((acc, item) => {
      const recipe = RECIPES[item.name];
      if (recipe && recipe.type === selectedPart) {
        acc.push({ ...item, recipe });
      }
      return acc;
    }, []);
  }, [inventory, selectedPart]);

  const hasChanges = useMemo(() => {
    if (!equippedStaff || !previewStaff) return false;
    const parts = ['core', 'wrap', 'apex'];
    return parts.some((part) => {
      return previewStaff?.components?.[part]?.id !== equippedStaff?.components?.[part]?.id;
    });
  }, [equippedStaff, previewStaff]);

  const pendingItems = useMemo(() => {
    return Object.entries(pendingParts)
      .map(([part, item]) => {
        if (!item?.recipe?.id) return null;
        return { part, item };
      })
      .filter(Boolean);
  }, [pendingParts]);

  const missingPendingItems = useMemo(() => {
    if (!pendingItems.length) return [];
    return pendingItems.filter(({ item }) => !inventory.some((inv) => inv.id === item.id));
  }, [inventory, pendingItems]);

  const handlePreview = (component) => {
    if (!previewStaff) return;
    const nextComponents = {
      ...previewStaff.components,
      [selectedPart]: {
        id: component.recipe.id,
        label: component.name,
        tier: component.recipe.tier,
        visual: component.recipe.visual,
        color: component.recipe.color
      }
    };

    const nextStaff = {
      ...previewStaff,
      components: nextComponents,
      visuals: buildVisualsFromComponents(nextComponents, previewStaff.visuals)
    };

    setPendingParts((prev) => ({
      ...prev,
      [selectedPart]: component
    }));
    if (setPlayerProfile && equippedStaff?.id) {
      setPlayerProfile((profile) => ({
        ...profile,
        staff: {
          ...(profile.staff || {}),
          workbenchDraft: {
            staffId: equippedStaff.id,
            pendingParts: {
              ...(profile.staff?.workbenchDraft?.pendingParts || {}),
              [selectedPart]: {
                itemId: component.id,
                name: component.name,
                recipeId: component.recipe.id,
                recipeType: component.recipe.type,
                tier: component.recipe.tier
              }
            }
          }
        }
      }));
    }
    setPreviewStaff(nextStaff);
  };

  const handleRevert = () => {
    setPreviewStaff(equippedStaff);
    setPendingParts({});
    if (setPlayerProfile) {
      setPlayerProfile((profile) => ({
        ...profile,
        staff: {
          ...(profile.staff || {}),
          workbenchDraft: null
        }
      }));
    }
  };

  const executeForge = (partsToConsume) => {
    if (!previewStaff) return;
    if (!equippedStaff) return;
    if (forgeStaff) {
      forgeStaff(previewStaff);
    } else {
      setEquippedStaff(previewStaff);
    }
    partsToConsume.forEach(([, item]) => {
      if (item?.id) removeInventoryItem(item.id);
    });
    setPendingParts({});
    if (setPlayerProfile) {
      setPlayerProfile((profile) => ({
        ...profile,
        staff: {
          ...(profile.staff || {}),
          workbenchDraft: null
        }
      }));
    }
    const consumedList = partsToConsume.map(([, item]) => item?.name).filter(Boolean);
    if (consumedList.length > 0) {
      setForgeNotice(`Consumed: ${consumedList.join(', ')}`);
      setTimeout(() => setForgeNotice(null), 2200);
    }
  };

  const handleForge = () => {
    if (!previewStaff) return;
    if (!equippedStaff) return;
    if (missingPendingItems.length > 0) return;
    const partsToConsume = Object.entries(pendingParts).filter(([part, item]) => {
      return item?.recipe?.id && previewStaff?.components?.[part]?.id !== equippedStaff?.components?.[part]?.id;
    });
    if (partsToConsume.length > 0) {
      setConfirmItems(partsToConsume);
      setConfirmOpen(true);
      return;
    }
    executeForge(partsToConsume);
  };

  if (!equippedStaff) {
    return (
      <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg text-stone-500 text-xs italic">
        Staff workbench offline. Sync an artifact to continue.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-[#0c0a09] p-6 rounded-xl border border-stone-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Field Workbench</p>
          <h3 className="text-lg font-serif text-stone-200">Reforge Components</h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-amber-500 border border-amber-700/50 px-2 py-1 rounded">
          Live
        </span>
      </div>
      {forgeNotice && (
        <div className="text-[10px] uppercase tracking-[0.25em] text-amber-400 border border-amber-900/40 bg-[#1a0f0b] px-3 py-2">
          {forgeNotice}
        </div>
      )}

      <div className="w-full h-64 bg-black/40 rounded-lg border border-stone-800 flex items-center justify-center relative overflow-hidden">
        <StaffVisualizer staffData={previewStaff} heightClass="h-full" />
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <h4 className="text-stone-200 font-serif text-base">{previewStaff?.name}</h4>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest">
            Power: {previewStaff?.stats?.power || 10} · Res: {previewStaff?.stats?.resonance || 5}
          </p>
        </div>
      </div>

      {hasChanges && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleForge}
            disabled={missingPendingItems.length > 0}
            className={`w-full py-3 border uppercase tracking-widest text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              missingPendingItems.length > 0
                ? 'bg-stone-900/60 border-stone-700 text-stone-500 cursor-not-allowed'
                : 'bg-amber-700/20 border-amber-600/50 text-amber-500 hover:bg-amber-700/40'
            }`}
          >
            <Hammer size={16} /> Forge Update
          </button>
          <button
            type="button"
            onClick={handleRevert}
            className="w-full py-2 border border-stone-800 text-stone-400 uppercase tracking-widest text-[10px] hover:text-stone-200 hover:border-stone-600 transition-colors"
          >
            Revert Preview
          </button>
          {missingPendingItems.length > 0 && (
            <div className="text-[10px] text-amber-500 uppercase tracking-widest text-center">
              Missing materials in satchel.
            </div>
          )}
        </div>
      )}

      <div className="border-b border-stone-800 flex gap-4">
        {['core', 'wrap', 'apex'].map((part) => (
          <button
            key={part}
            onClick={() => setSelectedPart(part)}
            className={`pb-2 text-[10px] uppercase tracking-widest transition-colors ${
              selectedPart === part
                ? 'text-amber-400 border-b-2 border-amber-500'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border border-stone-800 bg-stone-900/40 opacity-70">
          <span className="text-[10px] text-stone-500 uppercase block mb-2">Equipped</span>
          <div className="text-stone-300 font-bold">
            {equippedStaff?.components?.[selectedPart]?.label || 'None'}
          </div>
        </div>

        {availableComponents.length > 0 ? (
          availableComponents.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePreview(item)}
              className="p-4 rounded border border-stone-700 bg-stone-900/60 hover:border-amber-500 hover:bg-stone-900 transition-all text-left group"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-emerald-500 uppercase block mb-1">Available</span>
                {item.recipe.tier > 1 && (
                  <span className="text-[9px] bg-amber-900/40 text-amber-500 px-1 rounded">
                    Tier {item.recipe.tier}
                  </span>
                )}
              </div>
              <div className="text-stone-200 font-bold group-hover:text-white flex items-center gap-2">
                {item.name}
                <ArrowRight
                  size={14}
                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                />
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-6 text-center text-stone-600 text-xs italic border border-dashed border-stone-800 rounded">
            No compatible {selectedPart} materials found in satchel.
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="absolute right-6 bottom-6 w-full max-w-sm border border-[#3b1d13] bg-[#0b0706] shadow-[0_0_40px_rgba(239,68,68,0.08)] relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-15 mix-blend-soft-light"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)'
              }}
            />
            <div className="px-4 py-3 border-b border-[#3b1d13] bg-[#140b08]">
              <div className="text-[10px] uppercase tracking-[0.35em] text-amber-400/80">Forge Authorization</div>
              <div className="text-[11px] text-stone-500 font-mono mt-1">
                Material transfer requires clearance.
              </div>
            </div>
            <div className="px-4 py-3 space-y-2 text-[11px] text-stone-300 font-mono">
              <div className="text-[10px] uppercase tracking-widest text-stone-500">Consume Queue</div>
              {confirmItems.map(([, item]) => (
                <div
                  key={item?.id || item?.name}
                  className="flex items-center justify-between border border-[#2a1711] px-3 py-2 bg-[#0c0807]"
                >
                  <span className="text-stone-200">{item?.name || 'Unknown'}</span>
                  <span className="text-[9px] uppercase tracking-widest text-amber-400/80">
                    {item?.recipe?.type || 'part'}
                  </span>
                </div>
              ))}
              <div className="text-[10px] uppercase tracking-widest text-stone-500 pt-1">
                Status: Pending
              </div>
            </div>
            <div className="px-4 py-3 border-t border-[#3b1d13] flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  executeForge(confirmItems);
                }}
                className="flex-1 py-2 border border-[#6b2b1a] text-amber-300 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-[#2a140e] transition-all forge-ember"
              >
                Authorize
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-2 border border-[#241412] text-stone-400 uppercase tracking-[0.3em] text-[10px] hover:text-stone-200 hover:border-stone-500 transition-colors"
              >
                Abort
              </button>
            </div>
            <div className="px-4 pb-3 text-[9px] uppercase tracking-widest text-stone-600 font-mono">
              Access Level: Field
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .forge-ember {
          animation: emberFlicker 2.4s infinite ease-in-out;
          box-shadow: 0 0 18px rgba(248, 113, 113, 0.18);
        }

        @keyframes emberFlicker {
          0% {
            opacity: 0.85;
            box-shadow: 0 0 10px rgba(248, 113, 113, 0.12);
          }
          45% {
            opacity: 1;
            box-shadow: 0 0 22px rgba(251, 191, 36, 0.25);
          }
          100% {
            opacity: 0.9;
            box-shadow: 0 0 14px rgba(248, 113, 113, 0.18);
          }
        }
      `}</style>
    </div>
  );
}

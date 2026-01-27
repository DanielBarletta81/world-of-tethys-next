import { resolveNpcParaphrase } from './resolveNpcMemory';

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function cloneMyths(myths) {
  if (!myths) return {};
  if (typeof structuredClone === 'function') {
    return structuredClone(myths);
  }
  return JSON.parse(JSON.stringify(myths));
}

function injectDistortion(myths, distortion) {
  const next = cloneMyths(myths);
  Object.values(next).forEach((myth) => {
    if (!myth || typeof myth !== 'object') return;
    const current = myth.distortion ?? 0;
    myth.distortion = clamp01((current + distortion) / 2);
  });
  return next;
}

export function resolveNpcMisquote({
  quoteMemory,
  knowledge,
  speakerNpc,
  paraphraseBlock
}) {
  if (!quoteMemory) {
    return { line: null, nextQuoteMemory: null };
  }

  const {
    originTextId,
    distortionAtHear = 0,
    confidence = 1
  } = quoteMemory;

  const nextConfidence = Math.max(0.2, confidence - 0.15);
  const driftedDistortion = clamp01(
    distortionAtHear + (1 - confidence) * 0.2
  );

  const paraphrased = resolveNpcParaphrase({
    textId: originTextId,
    knowledge: {
      ...knowledge,
      myths: injectDistortion(knowledge?.myths, driftedDistortion)
    },
    faction: speakerNpc?.faction,
    npcProximity: speakerNpc?.proximity,
    paraphraseBlock
  });

  return {
    line: paraphrased,
    nextQuoteMemory: {
      originTextId,
      heardFromNpcId: speakerNpc?.id,
      distortionAtHear: driftedDistortion,
      factionAtHear: speakerNpc?.faction,
      confidence: nextConfidence
    }
  };
}
// World of Tethys || D.C. Barletta

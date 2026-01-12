export const ARCHIVE_DOCUMENTS = [
  {
    id: 'betrayal_001_missing_measurement',
    slug: 'loop-anomaly-classification',
    title: 'Loop Anomaly Classification',
    subtitle: 'Event Code 4-A',
    render: {
      titleHtml: 'Loop Anomaly Classification',
      bodyHtml: [
        '<p><strong>Sky City Archive</strong><br/>Systems Verification Office</p>',
        '<p><strong>Internal Memorandum:</strong> Restricted Circulation</p>',
        '<p><strong>Re:</strong> Post-Event Causal Review - Loop Integrity</p>',
        '<p><strong>Reference:</strong> Incident Cluster 4.11 / Watcher Proximity</p>',
        '<hr/>',
        '<p>Following preliminary reconciliation of sensor data associated with Incident Cluster 4.11, it has been determined that <strong>Signal Loop C-17 did not complete its cycle within tolerances required for causal attribution</strong>.</p>',
        '<p>The incomplete sequence introduces a degree of interpretive instability that cannot be responsibly incorporated into the City&#39;s operational models. While fragments of the loop remain intelligible in isolation, the absence of closure renders extrapolation speculative.</p>',
        '<p>It is therefore the recommendation of this office that <strong>Loop C-17 be designated non-essential for purposes of causal determination</strong>, and excluded from subsequent analyses and summaries intended to inform policy revision.</p>',
        '<p>This designation does <strong>not</strong> constitute a denial of occurrence. Rather, it reflects adherence to the City&#39;s long-standing principle that <strong>incomplete measurements cannot be permitted to anchor systemic conclusions</strong>.</p>',
        '<p>Alternative data sources - specifically thermal deviation records, proximity breach logs, and containment threshold reports - provide sufficient basis for evaluating procedural compliance without reliance on compromised loops.</p>',
        '<p>It is further noted that continued reference to partial loops risks conflating mechanical failure with interpretive preference, an outcome incompatible with the Archive&#39;s mandate.</p>',
        '<p>The omission of Loop C-17 from the primary causal model will allow the City to proceed with clarity, consistency, and corrective action where deviation is demonstrable.</p>',
        '<p><strong>Prepared by:</strong><br/>Systems Verification Officer<br/>Archive Division - Sky City</p>',
        '<p><strong>Filed:</strong><br/>Under Incident Cluster 4.11<br/>Status: <em>Resolved for Policy Purposes</em></p>'
      ].join('')
    },
    db: {
      classification: 'restricted',
      faction: 'sky-city',
      institution: 'archive',
      tags: ['betrayal_001', 'signal-loop', 'platform-breach', 'archive'],
      mythIds: ['sky-city-fall'],
      regionIds: ['sky_city'],
      createdAt: 'TETHYS-111-MYA-4A',
      source: 'Systems Verification Office',
      sealId: 'seal_sky_city',
      parchmentId: 'parchment_sky_city_a',
      ink: 'obsidian-iron',
      witness: 'indirect'
    }
  },
  {
    id: 'betrayal_001_missing_measurement_redacted',
    slug: 'loop-anomaly-classification-redacted',
    title: 'Loop Anomaly Classification',
    subtitle: 'Event Code 4-A (Redacted)',
    render: {
      titleHtml: 'Loop Anomaly Classification',
      bodyHtml: [
        '<p><strong>Sky City Archive</strong><br/>Systems Verification Office</p>',
        '<p><strong>Internal Memorandum:</strong> Restricted Circulation</p>',
        '<p><strong>Re:</strong> Post-Event Causal Review - Loop Integrity</p>',
        '<p><strong>Reference:</strong> Incident Cluster 4.11 / Watcher Proximity</p>',
        '<hr/>',
        '<p>Following preliminary reconciliation of sensor data associated with Incident Cluster 4.11, it has been determined that <strong>Signal Loop C-17 did not complete its cycle within tolerances required for causal attribution</strong>.</p>',
        '<p>The incomplete sequence introduces a degree of interpretive instability that cannot be responsibly incorporated into the City&#39;s operational models.</p>',
        '<p>[REDACTED] [REDACTED] [REDACTED]</p>',
        '<p>It is therefore the recommendation of this office that <strong>Loop C-17 be designated non-essential for purposes of causal determination</strong>.</p>',
        '<p>This designation does <strong>not</strong> constitute a denial of occurrence.</p>',
        '<p>Alternative data sources - specifically thermal deviation records, proximity breach logs, and containment threshold reports - provide sufficient basis for evaluating procedural compliance without reliance on compromised loops.</p>',
        '<p>It is further noted that continued reference to partial loops risks conflating mechanical failure with interpretive preference, an outcome incompatible with the Archive&#39;s mandate.</p>',
        '<p><strong>Prepared by:</strong><br/>Systems Verification Officer<br/>Archive Division - Sky City</p>',
        '<p><strong>Filed:</strong><br/>Under Incident Cluster 4.11<br/>Status: <em>Resolved for Policy Purposes</em></p>'
      ].join('')
    },
    db: {
      classification: 'sealed',
      faction: 'sky-city',
      institution: 'archive',
      tags: ['betrayal_001', 'signal-loop', 'platform-breach', 'archive', 'redacted'],
      mythIds: ['sky-city-fall'],
      regionIds: ['sky_city'],
      createdAt: 'TETHYS-111-MYA-4A',
      source: 'Systems Verification Office',
      sealId: 'seal_sky_city_redacted',
      parchmentId: 'parchment_sky_city_a',
      ink: 'obsidian-iron',
      witness: 'indirect'
    }
  },
  {
    id: 'betrayal_001_aftermath_absence',
    slug: 'what-doesnt-appear',
    title: "What Doesn't Appear",
    subtitle: 'Archive Corridor',
    render: {
      titleHtml: "What Doesn't Appear",
      bodyHtml: [
        '<p>The corridor outside the Archive smelled faintly of coolant and stone dust.</p>',
        '<p>Igzier had walked it before, in other contexts, when questions had answers and procedures had weight. Now the place felt thinner, as though something had been removed without leaving a gap large enough to see.</p>',
        '<p>Inside, the air was still.</p>',
        '<p>A clerk guided him to the table without speaking. The slab of stone was warm, which suggested recent use. That, too, felt deliberate.</p>',
        '<p>The record slate activated at his touch.</p>',
        '<p>He did not read it all at once. He had learned not to. Instead, he skimmed for landmarks - references he expected to find, points where the City usually anchored its stories.</p>',
        '<p>Containment breach. Thermal excursion. Unauthorized proximity.</p>',
        '<p>All present.</p>',
        '<p>He scrolled again.</p>',
        '<p>There was no mention of the loop.</p>',
        '<p>Not the failure. Not the interruption. Not even a note marking absence.</p>',
        '<p>Igzier frowned, then stopped himself. Expressions invited interpretation. He adjusted his stance instead, placing his weight evenly, as if balance might encourage the record to settle.</p>',
        '<p>"It didn&#39;t complete," he said.</p>',
        '<p>The archivist at the far end of the chamber did not look up.</p>',
        '<p>"Incomplete measurements are not retained as causal anchors," the archivist replied. The phrase arrived smoothly, as though it had already been used today.</p>',
        '<p>"It was running," Igzier said. "Long enough to matter."</p>',
        '<p>The archivist paused then - not in uncertainty, but in selection.</p>',
        '<p>"There are multiple systems involved in any complex failure," they said. "The Archive prioritizes those that resolve."</p>',
        '<p>Resolve.</p>',
        '<p>The word hung between them, doing more work than it should have.</p>',
        '<p>Igzier looked back at the slate. Without the loop, the sequence curved differently. Cause bent toward proximity. Toward deviation. Toward him.</p>',
        '<p>Not falsely. Just <em>cleanly</em>.</p>',
        '<p>"Without it," he said, "the picture changes."</p>',
        '<p>"Yes," the archivist said. "That is the purpose of clarification."</p>',
        '<p>Igzier closed the slate. The surface dimmed at once, obedient.</p>',
        '<p>Outside, the City continued its quiet reordering. Access paths were already shifting. Language was tightening. He could feel it, the way one feels pressure before weather.</p>',
        '<p>As he turned to leave, it occurred to him that nothing in the record was wrong.</p>',
        '<p>It was simply narrower than the day had been.</p>',
        '<p>And that narrowing would spread.</p>'
      ].join('')
    },
    db: {
      classification: 'restricted',
      faction: 'sky-city',
      institution: 'archive',
      tags: ['betrayal_001', 'aftermath', 'archive'],
      mythIds: ['sky-city-fall'],
      regionIds: ['sky_city'],
      createdAt: 'TETHYS-111-MYA-4A',
      source: 'Archive Corridor',
      sealId: 'seal_sky_city',
      parchmentId: 'parchment_sky_city_b',
      ink: 'obsidian-iron',
      witness: 'direct'
    }
  },
  {
    id: 'bond_completion_what_stayed',
    slug: 'what-stayed',
    title: 'What Stayed',
    subtitle: 'After the Encounter',
    render: {
      titleHtml: 'What Stayed',
      bodyHtml: [
        '<p>It did not announce itself.</p>',
        '<p>There was no moment that could be pointed to later and named. Only a gradual sense that something had finished arriving.</p>',
        '<p>The world did not grow quieter. If anything, it seemed to resume, as though it had been waiting for a decision that no longer needed to be made.</p>',
        '<p>The distance between things felt different. Not shorter. More accountable.</p>',
        '<p>When movement returned, it did so carefully. When stillness came again, it was no longer empty.</p>',
        '<p>Nothing was taken.</p>',
        '<p>Nothing was added.</p>',
        '<p>And yet, it was no longer possible to imagine the path that had existed before.</p>',
        '<p>Some bonds are not formed.</p>',
        '<p>They are recognized.</p>',
        '<p>Once recognized, they do not loosen.</p>',
        '<p>They simply become part of how the world continues.</p>'
      ].join('')
    },
    db: {
      classification: 'lore',
      faction: 'neutral',
      institution: 'field',
      tags: ['bond', 'completion', 'after-encounter'],
      mythIds: ['bond-origin'],
      regionIds: ['wild'],
      createdAt: 'TETHYS-111-MYA-BOND-01',
      source: 'Field Fragment',
      sealId: 'seal_wild',
      parchmentId: 'parchment_wild_a',
      ink: 'fern-ash',
      witness: 'direct'
    }
  },
  {
    id: 'bond_rumors_lower_tier',
    slug: 'bonded-rumors-lower-tier',
    title: 'Bonded Rumors',
    subtitle: 'Lower Tier',
    render: {
      titleHtml: 'Bonded Rumors',
      bodyHtml: [
        '<p>They do not walk the same after.</p>',
        '<p>You notice them before you see them.</p>',
        '<p>It is not that they are followed. It is that things do not rush them.</p>',
        '<p>They stop checking the wind so much. Or maybe the wind checks them.</p>',
        '<p>Does not mean they are safer. Just means they are harder to surprise.</p>',
        '<p><em>The land knows them now.</em></p>',
        '<p>No one agrees what that means.</p>'
      ].join('')
    },
    db: {
      classification: 'oral',
      faction: 'lower-tier',
      institution: 'riverfolk',
      tags: ['bond', 'rumor', 'lower-tier'],
      mythIds: ['bond-origin'],
      regionIds: ['cambria', 'wild'],
      createdAt: 'TETHYS-111-MYA-BOND-01',
      source: 'Dockside Refrain',
      sealId: 'seal_lower_tier',
      parchmentId: 'parchment_lower_a',
      ink: 'river-char',
      witness: 'indirect'
    }
  },
  {
    id: 'sky_city_rumor_after_catastrophe',
    slug: 'after-catastrophe-rumor',
    title: 'After the Catastrophe',
    subtitle: 'Sky City Rumor',
    render: {
      titleHtml: 'After the Catastrophe',
      bodyHtml: [
        '<p>The City did not expel him at once. There were corridors, then another, then the long descent where the air cooled and the stone changed texture underfoot.</p>',
        '<p>No escort. No hurry. It felt like distance on purpose.</p>',
        '<p>At a junction he paused, realizing he had not been told where to go - only where he would no longer be.</p>',
        '<p>He passed an open panel. Indicator lights blinked through a sequence that never quite finished, then reset and tried again.</p>',
        '<p>By the lower span, the sky had settled into restraint. Smoke no longer rose. It drifted thin enough to deny its origin.</p>',
        '<p>Someone recognized him and said nothing. Not accusation. Relief, edged with worry.</p>',
        '<p>He crossed the dimmed boundary marker. The stone on the other side felt the same. That was unsettling.</p>',
        '<p>Nothing happened.</p>',
        '<p>The City continued behind him, reorganizing its language. Ahead, the path narrowed into terrain that did not care what had been decided above.</p>',
        '<hr/>',
        '<p>The glass in the upper corridors had not cracked, but it sang when the wind passed over it.</p>',
        '<p>Attendants moved with a new attention to edges. Doors were checked twice. Notes were re-read. Names were weighed before being spoken.</p>',
        '<p>A whisper passed: contained, no further escalation, bond issue remains.</p>',
        '<p>Readings wavered where they had once held. Calibration felt like a mistake.</p>',
        '<p>One line appeared in the margin of a ledger: <em>Absence observed. Cause unresolved.</em></p>',
        '<p>Outside, the glass continued to sing.</p>'
      ].join('')
    },
    db: {
      classification: 'oral',
      faction: 'sky-city',
      institution: 'archive',
      tags: ['rumor', 'after-catastrophe', 'sky-city', 'igzier'],
      mythIds: ['sky-city-fall'],
      regionIds: ['sky_city'],
      createdAt: 'TETHYS-111-MYA-4B',
      source: 'Upper Corridor Refrain',
      sealId: 'seal_sky_city',
      parchmentId: 'parchment_sky_city_c',
      ink: 'glass-ash',
      witness: 'indirect'
    }
  },
  {
    id: 'cambria_origin_incomplete_09',
    slug: 'mysterious-9-origin',
    title: 'Mysterious 9',
    subtitle: 'Origin — Incomplete Record',
    render: {
      titleHtml: 'Mysterious 9',
      bodyHtml: [
        '<p><strong>Cambria Archive</strong><br/>Foundry Shelf: M-9</p>',
        '<p><strong>Status:</strong> Incomplete record set</p>',
        '<hr/>',
        '<p>The corridor current carried heat westward, but the maze of plates broke it into eddies.</p>',
        '<p>There were basins where the surface glowed and the depths went silent.</p>',
        '<p>Heat ruled the seasons until a brief cooling sharpened the edges of the year.</p>',
        '<p>At night the water answered movement with light, a thin blue-green alarm.</p>',
        '<p><em>Margins lost. Provenance unclear.</em></p>'
      ].join('')
    },
    db: {
      classification: 'sealed',
      faction: 'cambria',
      institution: 'archive',
      tags: ['cambria', 'origin', 'incomplete', 'mysterious-9'],
      mythIds: ['tethys-throughflow', 'purple-lull', 'cold-snap', 'bioluminescence'],
      regionIds: ['cambria'],
      createdAt: 'TETHYS-111-MYA-M9',
      source: 'Cambria Archive',
      sealId: 'seal_cambria',
      parchmentId: 'parchment_cambria_m9',
      ink: 'silt-iron',
      witness: 'indirect'
    }
  },
  {
    id: 'cambria_prehistoric_sea_research',
    slug: 'prehistoric-sea-research',
    title: 'Prehistoric Sea Research',
    subtitle: 'Cambria Collective Record',
    render: {
      titleHtml: 'Prehistoric Sea Research',
      bodyHtml: [
        '<p><strong>Cambria Archive</strong><br/>Collective Research Ledger</p>',
        '<p><strong>Scope:</strong> Survival guidance from incomplete sea records</p>',
        '<hr/>',
        '<p><strong>Summary of Findings</strong></p>',
        '<p>The corridor current carried heat westward, but the maze of plates broke it into eddies. This creates false calm in surface channels and sudden shears below.</p>',
        '<p>Heat ruled the seasons until a brief cooling sharpened the edges of the year. Expect abrupt swings: long warmth punctuated by sharp, short cold.</p>',
        '<p>There are basins where the surface glows and the depths go silent. These waters are not safe to enter or harvest from.</p>',
        '<p>At night the water answers movement with light. Disturbance reveals predators and draws them in equal measure.</p>',
        '<p><strong>Survival Guidance</strong></p>',
        '<p>Do not trust still water. It may be stratified, and the boundary can move without warning.</p>',
        '<p>Salt-thick thickets burn quickly in the dry season; smoke lingers longer than the flame.</p>',
        '<p>When ash falls, surface blooms follow. The bloom feeds, then suffocates.</p>',
        '<p><strong>Record Integrity</strong></p>',
        '<p>This ledger is assembled from scattered symbols and fragments. Margins were lost, provenance is incomplete, and several passages are reconstructed.</p>'
      ].join('')
    },
    db: {
      classification: 'restricted',
      faction: 'cambria',
      institution: 'archive',
      tags: ['cambria', 'prehistoric-sea', 'collective', 'survival'],
      mythIds: ['tethys-throughflow', 'purple-lull', 'cold-snap', 'bioluminescence', 'frenel-thickets', 'kohistan-firechain'],
      regionIds: ['cambria'],
      createdAt: 'TETHYS-111-MYA-CAMBRIA-SEA',
      source: 'Cambria Collective',
      sealId: 'seal_cambria_collective',
      parchmentId: 'parchment_cambria_sea',
      ink: 'silt-iron',
      witness: 'indirect'
    }
  }
];
// World of Tethys || D.C. Barletta

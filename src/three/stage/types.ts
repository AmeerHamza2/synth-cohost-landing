/**
 * Shared vocabulary for the 3D stage layer.
 *
 * The landing page keeps its existing seven-section narrative. Each narrative
 * beat gets a `SectionId`, and the DOM marks its own boundaries with a
 * `data-stage="<SectionId>"` attribute so the 3D layer can follow along without
 * owning the layout.
 */

export type SectionId =
  | 'hero' // 01 - Hero.tsx
  | 'pressure' // 02 - StreamingDemands.tsx (upper block)
  | 'capabilities' // 03 - StreamingDemands.tsx (lower block, "MEET YOUR SYN")
  | 'roles' // 04 - RolesCarousel.tsx
  | 'studio' // 05 - LivestreamShowcase.tsx
  | 'knowledge' // 06 - KnowledgeHero.tsx
  | 'finale'; // 07 - FinalCTA.tsx

export const SECTION_ORDER: SectionId[] = [
  'hero',
  'pressure',
  'capabilities',
  'roles',
  'studio',
  'knowledge',
  'finale',
];

/**
 * Rendering budget. Resolved once on mount from device capability and user
 * preference; `off` means the page stays fully 2D and no WebGL context is
 * created at all.
 */
export type QualityTier = 'off' | 'low' | 'medium' | 'high';

/** Which of the three capability cards in section 03 is being explored. */
export type CapabilityId = 'chat' | 'context' | 'workflow';

/** Roles in section 04, in narrative order. */
export type RoleId =
  | 'educator'
  | 'moderator'
  | 'interviewer'
  | 'researcher'
  | 'companion';

export const ROLE_ORDER: RoleId[] = [
  'educator',
  'moderator',
  'interviewer',
  'researcher',
  'companion',
];

/**
 * High-level animation intent for the SYN rig. The rig blends between these;
 * they are deliberately coarse so a real GLB's animation clips can be mapped
 * onto them one-for-one later.
 */
export type SynMood =
  | 'idle' // breathing, occasional blink, tracks cursor
  | 'overwhelmed' // section 02 build-up: tighter, faster, less settled
  | 'focused' // section 02 resolution + 03: calm, attentive, centred
  | 'presenting' // section 04/05: upright, addressing the viewer
  | 'listening' // section 05: turned toward an incoming chat message
  | 'thinking' // section 06: processing knowledge
  | 'together'; // section 07: relaxed, beside the creator

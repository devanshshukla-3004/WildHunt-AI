import type { HuntDefinition } from "../types";

export const hunts: HuntDefinition[] = [
  { id: "nature", name: "Nature Hunt", description: "Slow down and notice the living world around you.", icon: "🌿", targets: ["yellow-flower", "unusual-bark", "interesting-stone"] },
  { id: "city", name: "Urban Explorer", description: "Turn ordinary streets into a field guide.", icon: "🏙️", targets: ["street-art", "walk-past-detail", "landmark-detail"] },
  { id: "color", name: "Color Hunt", description: "Let the real world become your color palette.", icon: "🎨", targets: ["yellow-flower", "natural-red", "street-art"] },
  { id: "texture", name: "Texture Hunt", description: "Look closer at surfaces, patterns, and details.", icon: "🪨", targets: ["interesting-stone", "pattern-texture", "unusual-bark"] },
];
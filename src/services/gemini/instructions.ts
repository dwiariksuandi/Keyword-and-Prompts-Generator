export function getContentTypeInstructions(contentType: string): string {
  switch (contentType) {
    case 'Photo':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Be specific: Provide concrete details on subject, lighting, and composition.
      - Use positive framing: Describe what you want, not what you don't want.
      - Control the camera: Use photographic terms like "low angle" and "aerial view".
      - Design your lighting: Specify Studio setups (e.g., "three-point softbox setup") or Dramatic effects.
      - Choose camera, lens, and focus: Dictate hardware (e.g., "50mm lens, f/1.8").`;
    case 'Illustration':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on sophisticated illustrative techniques: complex brushwork, layered textures, intricate line art.`;
    case 'Vector':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on high-end vector aesthetics: perfect geometric precision, clean SVG-compliant paths.`;
    case 'Background':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on atmospheric and textural depth: multi-layered bokeh, expansive copy space.`;
    case 'Video':
      return `VEO 3.1 PROMPTING FRAMEWORK:
      Formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
      - Cinematography: Define camera movement (Dolly shot, tracking shot, crane shot, aerial view).`;
    case '3D Render':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on state-of-the-art rendering: Unreal Engine 5.4 Path Tracing, OctaneRender.`;
    case 'AI Art & Creativity':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on boundary-pushing conceptualism: generative patterns, fluid organic forms.`;
    default:
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]`;
  }
}

export function getVariationInstructions(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'Low':
      return "VARIATION LEVEL: LOW. Focus on a highly cohesive set of prompts that explore a specific, narrow theme.";
    case 'High':
      return "VARIATION LEVEL: HIGH. MAXIMUM CREATIVE DIVERSITY REQUIRED. Each prompt must explore a radically different concept.";
    default:
      return "VARIATION LEVEL: MEDIUM. Standard professional variation.";
  }
}

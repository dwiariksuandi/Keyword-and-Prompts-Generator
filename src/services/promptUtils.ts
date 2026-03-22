import { PromptTemplate } from '../types';

export const promptTemplates: PromptTemplate[] = [
  // --- PHOTO ---
  {
    id: "nanobanana-photo",
    name: "Nano Banana Pro (Photo)",
    template: "{subject}, {details}, {lighting}, {mood} atmosphere, {style}. Shot on medium format camera, 50mm lens, f/1.8. Cinematic composition, hyper-detailed textures, 8k resolution, no text.",
    description: "Advanced multimodal prompt for Nano Banana Pro AI using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Photo"]
  },
  {
    id: "midjourney-photo",
    name: "Midjourney v6 (Photo)",
    template: "{style} {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail, no text, no watermark, commercial photography. --ar {aspect} --style raw --v 6.0",
    description: "Optimized for Midjourney v6 with style raw",
    contentTypes: ["Photo"]
  },
  {
    id: "dalle-photo",
    name: "DALL-E 3 (Photo)",
    template: "A {style} image of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, photorealistic details, commercial stock photography style, no text, no logos.",
    description: "Natural language prompts for DALL-E 3",
    contentTypes: ["Photo"]
  },
  {
    id: "stable-photo",
    name: "Stable Diffusion XL (Photo)",
    template: "{subject}, {style}, {details}, {lighting}, {mood}, masterpiece, best quality, highly detailed, 8k uhd, commercial stock photo, clean background",
    description: "Tag-based prompts for SDXL",
    contentTypes: ["Photo"]
  },
  {
    id: "stock-photo",
    name: "Stock Photography",
    template: "Professional stock photo: {subject}. {details}. Shot with {lighting}, conveying {mood}. Commercial use, editorial quality, diverse representation, authentic lifestyle, 8k resolution.",
    description: "Optimized for stock photography sites",
    contentTypes: ["Photo"]
  },

  // --- BACKGROUND ---
  {
    id: "nanobanana-background",
    name: "Nano Banana Pro (Background)",
    template: "{subject}, {details}, {lighting}, {mood} color palette, {style}. 8k resolution, seamless composition, ample copy space, subtle depth of field, clean and modern aesthetic, out of focus elements.",
    description: "Premium background generation for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Background"]
  },
  {
    id: "midjourney-background",
    name: "Midjourney v6 (Background)",
    template: "Abstract {style} background of {subject}, {details}, {lighting}, {mood} atmosphere, ample copy space, minimalist composition, commercial background asset, 8k, highly detailed. --ar {aspect} --style raw --v 6.0",
    description: "Optimized for Midjourney v6 backgrounds",
    contentTypes: ["Background"]
  },
  {
    id: "dalle-background",
    name: "DALL-E 3 (Background)",
    template: "A clean, modern {style} background image featuring {subject}. {details}. {lighting}, {mood} atmosphere. Designed with ample negative space for text overlays, commercial stock background style, high resolution.",
    description: "Natural language background prompts for DALL-E 3",
    contentTypes: ["Background"]
  },

  // --- VECTOR ---
  {
    id: "nanobanana-vector",
    name: "Nano Banana Pro (Vector)",
    template: "{subject}, {details}, {lighting}, {mood} color palette, {style}. Flat design, clean SVG style, minimalist curves, no gradients, solid colors, isolated on white background.",
    description: "Advanced vector prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Vector"]
  },
  {
    id: "midjourney-vector",
    name: "Midjourney v6 (Vector Style)",
    template: "Flat {style} vector illustration of {subject}, {details}, {lighting}, {mood}, clean lines, solid colors, minimal shading, white background, commercial quality, no text. --ar {aspect} --v 6.0",
    description: "Midjourney prompts designed to look like vectors",
    contentTypes: ["Vector"]
  },
  {
    id: "recraft-vector",
    name: "Recraft (Vector)",
    template: "Vector art of {subject}, {details}, {lighting}, {mood}, {style}, clean SVG style, flat colors, commercial design, no text.",
    description: "Optimized for Recraft vector generation",
    contentTypes: ["Vector"]
  },
  {
    id: "leonardo-vector",
    name: "Leonardo AI (Vector)",
    template: "Vector illustration of {subject}, {details}, {lighting}, {mood}, {style}, flat design, vibrant colors, clean edges, commercial vector asset, white background.",
    description: "Optimized for Leonardo AI vector style",
    contentTypes: ["Vector"]
  },

  // --- ILLUSTRATION ---
  {
    id: "nanobanana-illustration",
    name: "Nano Banana Pro (Illustration)",
    template: "{subject}, {details}, {lighting}, {mood} atmosphere, {style}. Intricate details, vibrant colors, commercial editorial illustration, 8k resolution.",
    description: "High-end illustration prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Illustration"]
  },
  {
    id: "nanobanana-ai-art",
    name: "Nano Banana Pro (AI Art)",
    template: "{subject}, {details}, {lighting}, {mood} color palette, {style}. Intricate generative patterns, fluid forms, digital dreamscape, high-concept creativity, 8k resolution.",
    description: "Conceptual and creative AI art prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "midjourney-ai-art",
    name: "Midjourney v6 (AI Art)",
    template: "Conceptual {style} AI art of {subject}, {details}, {lighting}, {mood}, surrealism, abstract expressionism, intricate details, professional quality, high-concept, no text. --ar {aspect} --v 6.0 --stylize 750",
    description: "High-stylization prompts for Midjourney AI art",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "dalle-ai-art",
    name: "DALL-E 3 (AI Art)",
    template: "A highly creative and conceptual {style} AI art piece depicting {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. Surreal elements, digital art masterpiece, high resolution, no text.",
    description: "Creative and conceptual prompts for DALL-E 3",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "stock-ai-art",
    name: "Adobe Stock AI Art",
    template: "Conceptual AI art: {subject}. {details}. {style} aesthetic, {lighting}, {mood}. High commercial utility for creative projects, clean composition, 8k resolution, masterpiece.",
    description: "Optimized for Adobe Stock's AI art category",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "midjourney-niji",
    name: "Midjourney Niji (Illustration)",
    template: "{style} illustration of {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail, no text, no watermark, commercial illustration. --ar {aspect} --niji 6",
    description: "Optimized for Midjourney Niji 6",
    contentTypes: ["Illustration"]
  }
];

export function getContentTypeInstructions(contentType: string): string {
  switch (contentType) {
    case 'Photo':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Be specific: Provide concrete details on subject, lighting, and composition.
      - Use positive framing: Describe what you want, not what you don't want.
      - Control the camera: Use photographic terms like "low angle" and "aerial view".
      - Design your lighting: Specify Studio setups (e.g., "three-point softbox setup") or Dramatic effects (e.g., "Chiaroscuro lighting with harsh, high contrast", "Golden hour backlighting creating long shadows").
      - Choose camera, lens, and focus: Dictate hardware (e.g., "GoPro", "Fujifilm", "disposable camera") and Lens (e.g., "low-angle shot with a shallow depth of field (f/1.8)", "wide-angle lens", "macro lens").
      - Define color grading and film stock: e.g., "1980s color film, slightly grainy", "Cinematic color grading with muted teal tones".
      - Emphasize materiality and texture: Define physical makeup (e.g., "minimalist ceramic coffee mug").
      - Text rendering: If text is needed, use quotes (e.g., "Happy Birthday") and choose a font (e.g., "bold, white, sans-serif font").`;
    case 'Illustration':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on sophisticated illustrative techniques: complex brushwork, layered textures, intricate line art, and advanced color theory.
      - Define color grading and film stock: Set the emotional tone through color palettes.
      - Emphasize materiality and texture: Define the physical makeup of the illustration (e.g., "cel animation style", "plushie style", "claymation style").
      - Text rendering: If text is needed, use quotes (e.g., "URBAN EXPLORER") and choose a font.
      - Be specific and use positive framing.`;
    case 'Vector':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on high-end vector aesthetics: perfect geometric precision, complex gradients (mesh gradients), isometric perspectives, and clean SVG-compliant paths.
      - Emphasize scalability, minimalist elegance, and elite UI/UX design standards.
      - Text rendering: If text is needed, use quotes and choose a font (e.g., "Century Gothic 12px font").`;
    case 'Background':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on atmospheric and textural depth: multi-layered bokeh, complex procedural textures, subtle light leaks, and expansive copy space.
      - Design your lighting: Specify Dramatic effects (e.g., "Chiaroscuro lighting", "Golden hour backlighting").
      - Choose camera, lens, and focus: Use "wide-angle lens" for vast scale or "macro lens" for intricate details.
      - Define color grading and film stock: e.g., "Cinematic color grading with muted teal tones".`;
    case 'Video':
      return `VEO 3.1 PROMPTING FRAMEWORK:
      Formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
      - Cinematography: Define camera movement (Dolly shot, tracking shot, crane shot, aerial view, slow pan, POV shot), Composition (Wide shot, close-up, extreme close-up, low angle, two-shot), and Lens & focus (Shallow depth of field, wide-angle lens, soft focus, macro lens, deep focus).
      - Directing the soundstage: Veo 3.1 generates audio. Include Dialogue (e.g., A woman says, "We have to leave now."), Sound effects (e.g., SFX: thunder cracks in the distance), and Ambient noise (e.g., Ambient noise: the quiet hum of a starship bridge).
      - Be specific and use positive framing (e.g., "desolate landscape with no buildings or roads" instead of "no man-made structures").
      - Focus on cinematic mastery and professional storytelling.`;
    case '3D Render':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on state-of-the-art rendering: Unreal Engine 5.4 Path Tracing, OctaneRender, physically based rendering (PBR) materials, subsurface scattering (SSS), and global illumination.
      - Design your lighting: Specify Studio setups (e.g., "three-point softbox setup") to evenly light a product.
      - Emphasize materiality and texture: Define physical makeup (e.g., "anisotropic metal", "refractive glass", "high-fidelity 3D armchair render").
      - Choose camera, lens, and focus: Dictate the exact camera type and lens perspective.`;
    case 'AI Art & Creativity':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on boundary-pushing conceptualism: generative patterns, fluid organic forms, surrealist dreamscapes, and innovative digital alchemy.
      - Design your lighting: Specify Dramatic effects (e.g., "Chiaroscuro lighting with harsh, high contrast").
      - Define color grading and film stock: Set the emotional tone with unique color palettes.
      - Emphasize materiality and texture: Define the physical makeup of the abstract elements.`;
    default:
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on high-fidelity, commercially elite visual descriptors appropriate for this specific asset class.
      - Design your lighting, choose your camera/lens, define color grading, and emphasize materiality.`;
  }
}

export function getVariationInstructions(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'Low':
      return "VARIATION LEVEL: LOW. Focus on a highly cohesive set of prompts that explore a specific, narrow theme with subtle variations in lighting or angle. The resulting images should look like they belong to the same specific photoshoot or series. Ideal for creating consistent character sets or product variations.";
    case 'High':
      return "VARIATION LEVEL: HIGH. MAXIMUM CREATIVE DIVERSITY REQUIRED. Each prompt must explore a radically different concept, environment, lighting setup, and composition within the niche. Force the AI to use diverse subjects, unexpected angles, and contrasting moods. This is CRITICAL for large batches to avoid 'similar content' rejection by Adobe Stock. No two prompts should share more than 20% of their descriptive DNA.";
    default:
      return "VARIATION LEVEL: MEDIUM. Standard professional variation. Ensure a balanced mix of different subjects, camera angles, and lighting styles while maintaining relevance to the core theme. Provides enough variety for a standard stock submission.";
  }
}

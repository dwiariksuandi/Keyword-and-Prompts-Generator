import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
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
  },
  {
    id: "dalle-illustration",
    name: "DALL-E 3 (Illustration)",
    template: "A {style} illustration of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, commercial stock illustration style, no text, no logos.",
    description: "Natural language illustration prompts for DALL-E 3",
    contentTypes: ["Illustration"]
  },
  {
    id: "firefly-illustration",
    name: "Adobe Firefly (Illustration)",
    template: "{subject}, {details}, {lighting}, {mood}, {style} illustration, highly detailed, commercial use, clean background, vibrant colors",
    description: "Optimized for Adobe Firefly",
    contentTypes: ["Illustration"]
  },

  // --- VIDEO ---
  {
    id: "veo-video",
    name: "Veo 3.1 (Video)",
    template: "{style} shot of {subject}, {details}, {lighting}, {mood} atmosphere. SFX: appropriate ambient sounds. 4k resolution, smooth motion.",
    description: "Optimized for Google Veo 3.1 using [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]",
    contentTypes: ["Video"]
  },
  {
    id: "sora-video",
    name: "Sora (Video)",
    template: "A highly detailed, photorealistic {style} video of {subject}. {details}. The camera moves smoothly, capturing the {lighting} and {mood} atmosphere. 8k resolution, commercial stock footage style.",
    description: "Natural language prompts for OpenAI Sora",
    contentTypes: ["Video"]
  },
  {
    id: "wan-video",
    name: "WAN (Video)",
    template: "High quality {style} video of {subject}, {details}, {lighting}, {mood}, cinematic lighting, photorealistic, 4k resolution, smooth camera movement, commercial stock footage.",
    description: "Optimized for WAN Video AI",
    contentTypes: ["Video"]
  },
  {
    id: "kling-video",
    name: "Kling (Video)",
    template: "{subject}, {details}, {lighting}, {mood}, {style}, cinematic motion, 4k, ultra realistic, professional stock video, clean composition.",
    description: "Optimized for Kling AI",
    contentTypes: ["Video"]
  },
  {
    id: "runway-video",
    name: "Runway Gen-2 (Video)",
    template: "{subject}, {details}, {lighting}, {mood}, {style}, cinematic, highly detailed, 4k, photorealistic, slow motion, commercial stock footage.",
    description: "Tag-based prompts for Runway Gen-2",
    contentTypes: ["Video"]
  },

  // --- 3D RENDER ---
  {
    id: "nanobanana-3d",
    name: "Nano Banana Pro (3D Render)",
    template: "{subject}, {details}, {lighting}, {mood} atmosphere, {style}. Created in Unreal Engine 5, path tracing, global illumination, hyper-realistic textures, 8k resolution, clean background.",
    description: "Premium 3D render prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["3D Render"]
  },
  {
    id: "midjourney-3d",
    name: "Midjourney v6 (3D Render)",
    template: "{style} 3D render of {subject}, {details}, {lighting}, {mood}, Octane Render, Unreal Engine 5, ray tracing, highly detailed, commercial quality, clean background. --ar {aspect} --v 6.0",
    description: "Optimized for 3D style in Midjourney",
    contentTypes: ["3D Render"]
  },
  {
    id: "dalle-3d",
    name: "DALL-E 3 (3D Render)",
    template: "A high-quality {style} 3D render of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. Created in Blender, Octane Render style, commercial stock 3D asset, no text.",
    description: "Natural language 3D prompts for DALL-E 3",
    contentTypes: ["3D Render"]
  },
  {
    id: "leonardo-3d",
    name: "Leonardo AI (3D Render)",
    template: "3D illustration of {subject}, {details}, {lighting}, {mood}, {style}, isometric view, clay render style, soft lighting, pastel colors, commercial 3D asset, clean background.",
    description: "Optimized for Leonardo AI 3D style",
    contentTypes: ["3D Render"]
  }
];

import { GoogleGenAI, Type } from '@google/genai';
import { AppSettings, PromptTemplate } from '../types';

export const promptTemplates: PromptTemplate[] = [
  // --- PHOTO ---
  {
    id: "nanobanana-photo",
    name: "Nano Banana Pro (Photo)",
    template: "Breathtaking {style} photorealistic image of {subject}, {details}. Shot on medium format camera, 50mm lens, f/1.8. {lighting}, {mood} atmosphere. Cinematic composition, hyper-detailed textures, 8k resolution, editorial commercial photography, award-winning masterpiece, no text.",
    description: "Advanced multimodal prompt for Nano Banana Pro AI",
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
    template: "High-end commercial {style} background featuring {subject}, {details}. {lighting}, {mood} color palette. 8k resolution, seamless composition, ample copy space, subtle depth of field, premium stock photography background, clean and modern aesthetic, out of focus elements.",
    description: "Premium background generation for Nano Banana Pro",
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
    template: "Professional {style} vector illustration of {subject}, {details}. Flat design, clean SVG style, {lighting}, {mood} color palette. Minimalist curves, no gradients, solid colors, commercial UI/UX asset, isolated on white background, award-winning vector art.",
    description: "Advanced vector prompt for Nano Banana Pro",
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
    template: "Masterpiece digital {style} illustration of {subject}, {details}. {lighting}, {mood} atmosphere. Intricate details, vibrant colors, commercial editorial illustration, trending on ArtStation, 8k resolution.",
    description: "High-end illustration prompt for Nano Banana Pro",
    contentTypes: ["Illustration"]
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
    name: "Veo (Video)",
    template: "Cinematic {style} video of {subject}, {details}. {lighting}, {mood} atmosphere. Shot on 35mm lens, 4k resolution, smooth motion, high quality commercial footage.",
    description: "Optimized for Google Veo",
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
    template: "Award-winning {style} 3D render of {subject}, {details}. {lighting}, {mood} atmosphere. Created in Unreal Engine 5, path tracing, global illumination, hyper-realistic textures, 8k resolution, commercial 3D asset, clean background.",
    description: "Premium 3D render prompt for Nano Banana Pro",
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

const getAI = (apiKey?: string) => {
  const envApiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const finalApiKey = apiKey?.trim() || envApiKey || '';
  
  if (!finalApiKey) {
    throw new Error("API key is missing. Please enter your Gemini API key in the settings.");
  }
  
  return new GoogleGenAI({ apiKey: finalApiKey });
};

export function handleGeminiError(error: any): string {
  let errorString = '';
  if (error instanceof Error) {
    errorString = error.message;
  } else if (typeof error === 'object' && error !== null) {
    try {
      errorString = JSON.stringify(error);
    } catch {
      errorString = String(error);
    }
  } else {
    errorString = String(error);
  }
  
  if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('quota')) {
    return "Error 429 (RESOURCE_EXHAUSTED). Ini terjadi karena salah satu dari 2 hal:\n\n1. Limit Per Menit (Sering Terjadi): Akun gratis dibatasi 15 request/menit. Solusi: Tunggu 1 menit dan coba lagi.\n2. Kuota Harian Habis: Solusi: Gunakan API Key dari Project Google Cloud yang BARU.\n\nJika Anda baru saja mengganti API Key dan tetap error, kemungkinan besar itu adalah Limit Per Menit (tunggu 1 menit).";
  }
  
  if (errorString.includes('API key not valid') || errorString.includes('API_KEY_INVALID')) {
    return "API Key tidak valid. Pastikan Anda menyalin API Key dengan benar tanpa spasi tambahan.";
  }

  return `Terjadi kesalahan: ${errorString}`;
}

function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const startArr = text.indexOf('[');
    const endArr = text.lastIndexOf(']');
    const startObj = text.indexOf('{');
    const endObj = text.lastIndexOf('}');
    
    if (startArr !== -1 && endArr !== -1 && (startObj === -1 || startArr < startObj)) {
      return JSON.parse(text.substring(startArr, endArr + 1));
    } else if (startObj !== -1 && endObj !== -1) {
      return JSON.parse(text.substring(startObj, endObj + 1));
    }
    throw new Error("Could not find valid JSON in response");
  }
}

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const ai = getAI(apiKey);
    // A simple, fast call to verify the key
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { maxOutputTokens: 1 }
    });
    return { isValid: true };
  } catch (error) {
    console.error("API Key validation failed:", error);
    return { isValid: false, error: handleGeminiError(error) };
  }
}

export async function analyzeKeyword(keyword: string, contentType: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Perform an exhaustive, data-driven microstock market analysis for the broad keyword: '${keyword}' targeting the asset type: '${contentType}'.

Your objective is to uncover 4 to 6 highly specific, underserved, and commercially lucrative sub-niches (Blue Oceans). AVOID generic categories. Focus on exact, long-tail concepts that buyers (ad agencies, web designers, corporate marketers) are actively searching for but lack high-quality supply on platforms like Adobe Stock and Shutterstock.

CRITICAL ADOBE STOCK RULES:
- GENERATIVE AI COMPLIANCE: The niches MUST NOT rely on trademarked/copyrighted elements, specific brands, recognizable characters, or real known restricted places/buildings. Focus on generic, commercially safe concepts (e.g., "generic modern smartphone" instead of "iPhone").
- NO SIMILAR CONTENT: Ensure the 4 to 6 niches are distinct from each other.

For each niche, you MUST provide realistic, simulated market data:
1. categoryName: A highly specific, commercial niche name (e.g., "Gen Z Sustainable Office Lifestyle" instead of "Business People").
2. mainKeywords: 5-7 exact-match, long-tail keywords that buyers actually type into search bars.
3. volumeLevel & volumeNumber: Simulated monthly search volume on major stock platforms. Make this a highly realistic number reflecting actual market demand (e.g., 12500, not just 100).
4. competition & competitionScore: Simulated number of existing assets (0-100 score). 100 means millions of assets (oversaturated), 10 means very few assets (blue ocean).
5. trend & trendPercent: Current market trajectory (e.g., +45% due to recent news/seasons).
6. difficultyScore: 0-100. How hard is it for a new contributor to rank on page 1?
7. opportunityScore: 0-100. The ultimate metric. High volume + Low competition = High Opportunity (80-100).
8. creativeAdvice: Highly specific art direction. What exact visual elements, lighting, colors, or compositions are missing in the current market for this niche?

CRITICAL: Ensure mathematical and logical consistency. If competition is 95/100 (oversaturated), the opportunity score MUST be low (under 40) unless the volume is exceptionally massive and growing rapidly. Prioritize finding "Blue Ocean" niches (High Opportunity).
Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
    config: {
      systemInstruction: "You are an elite Microstock Market Data Analyst (Adobe Stock, Shutterstock). Your job is to simulate real-world keyword research tools. You must provide highly accurate, data-backed estimates for search volume and competition based on current market trends. NEVER provide generic keywords. ALWAYS find underserved, high-converting long-tail niches.",
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            categoryName: { type: Type.STRING },
            mainKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            volumeLevel: { type: Type.STRING, description: "High, Medium, or Low" },
            volumeNumber: { type: Type.INTEGER },
            competition: { type: Type.STRING, description: "High, Medium, or Low" },
            competitionScore: { type: Type.INTEGER },
            trend: { type: Type.STRING, description: "up, down, or stable" },
            trendPercent: { type: Type.INTEGER },
            difficultyScore: { type: Type.INTEGER },
            opportunityScore: { type: Type.INTEGER },
            creativeAdvice: { type: Type.STRING },
          },
          required: ['categoryName', 'mainKeywords', 'volumeLevel', 'volumeNumber', 'competition', 'competitionScore', 'trend', 'trendPercent', 'difficultyScore', 'opportunityScore', 'creativeAdvice'],
        },
      },
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return extractJSON(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function generatePrompts(keyword: string, categoryName: string, count: number, settings: AppSettings, contentType: string) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  // For large counts, use a combinatorial approach to avoid LLM output token limits and guarantee uniqueness
  if (count > 30) {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: `Generate a rich set of prompt components for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}'.
      
      We need to programmatically generate ${count} unique combinations. Please provide:
      1. 30 highly distinct subjects (e.g., "a young professional woman", "a modern office desk", "a diverse team of engineers"). MUST be diverse in age, ethnicity, and core concept.
      2. 30 specific and varied details/actions/camera angles (e.g., "typing on a laptop, close-up shot", "holding a coffee cup, wide angle", "brainstorming at a whiteboard, over-the-shoulder view").
      3. 15 distinct lighting styles (e.g., "soft morning sunlight", "dramatic studio lighting", "neon cyberpunk glow").
      4. 15 mood/atmosphere descriptions (e.g., "energetic and focused", "calm and serene", "mysterious and dark").
      5. 10 artistic styles/mediums (e.g., "photorealistic", "cinematic photography", "3D render", "flat vector illustration").
      6. 5 aspect ratios (e.g., "16:9", "4:3", "3:2", "1:1", "9:16")
      
      CRITICAL ADOBE STOCK RULES:
      - NO SIMILAR CONTENT: The components must be vastly different from each other to avoid generating repetitive images. Do not just change colors or minor details. Vary the camera angles, compositions, and core actions.
      - GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings.
      - QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
      - Ensure all components are perfectly suited for ${contentType}.
      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
      config: {
        systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation components that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            details: { type: Type.ARRAY, items: { type: Type.STRING } },
            lightings: { type: Type.ARRAY, items: { type: Type.STRING } },
            moods: { type: Type.ARRAY, items: { type: Type.STRING } },
            styles: { type: Type.ARRAY, items: { type: Type.STRING } },
            aspects: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["subjects", "details", "lightings", "moods", "styles", "aspects"]
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    try {
      const components = extractJSON(text);
      const generatedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ' --no text, watermark, deformed, blurry, logos' : '';
      
      // Generate combinations, ensuring uniqueness
      let attempts = 0;
      const maxAttempts = count * 5;
      
      while (generatedPrompts.size < count && attempts < maxAttempts) {
        const subject = components.subjects[Math.floor(Math.random() * components.subjects.length)] || "subject";
        const detail = components.details[Math.floor(Math.random() * components.details.length)] || "detail";
        const lighting = components.lightings[Math.floor(Math.random() * components.lightings.length)] || "lighting";
        const mood = components.moods[Math.floor(Math.random() * components.moods.length)] || "mood";
        const style = components.styles[Math.floor(Math.random() * components.styles.length)] || "style";
        const aspect = components.aspects[Math.floor(Math.random() * components.aspects.length)] || "16:9";
        
        let prompt = template.template
          .replace(/{subject}/g, subject)
          .replace(/{details}/g, detail)
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, mood)
          .replace(/{style}/g, style)
          .replace(/{aspect}/g, aspect);
          
        prompt += negativePrompt;
        generatedPrompts.add(prompt);
        attempts++;
      }
      return Array.from(generatedPrompts);
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse the response from the AI. Please try again.");
    }
  }

  // Standard generation for smaller counts
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Generate exactly ${count} highly detailed, commercial-grade image generation prompts for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}'.

CRITICAL REQUIREMENTS FOR ADOBE STOCK:
1. Commercial Utility: Ensure concepts are highly usable for designers and agencies. Include concepts with 'copy space', 'authentic lifestyle', 'modern aesthetics', or 'clean backgrounds' where appropriate.
2. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for a ${contentType}.
3. NO SIMILAR CONTENT: Do not generate prompts that are practically identical (e.g., just changing a shirt color). Each prompt MUST have a distinct composition, camera angle, subject, or core action.
4. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings.
5. QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
6. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure:
"${template.template}"
Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.

Respond strictly with a JSON array of strings, where each string is a complete, ready-to-use image generation prompt tailored for a ${contentType}.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each prompt (e.g., "--no text, watermark, deformed, blurry, logos, bad anatomy, extra limbs").' : ''}`,
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. You understand lighting, composition, camera settings, and market trends perfectly.",
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return extractJSON(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function optimizePrompts(prompts: string[], settings: AppSettings, contentType: string) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  // If the array is very large, optimizing them one by one via LLM is too slow and hits token limits.
  // Instead, we extract the core subjects from a sample, generate high-quality commercial modifiers,
  // and programmatically reconstruct the prompts.
  if (prompts.length > 30) {
    // Take a small sample to understand the context
    const sample = prompts.slice(0, 10);
    
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: `Analyze these sample prompts: ${JSON.stringify(sample)}.
      
      We need to optimize a massive batch of similar prompts for Adobe Stock (${contentType}).
      To do this instantly, provide a set of highly commercial, premium modifiers that we can programmatically apply to the original subjects.
      
      Provide:
      1. 15 premium lighting setups (e.g., "cinematic studio lighting, softbox", "golden hour natural sunlight")
      2. 15 commercial moods/atmospheres (e.g., "authentic lifestyle, candid", "clean corporate, modern")
      3. 10 high-end technical styles (e.g., "shot on 35mm lens, 8k resolution", "hyper-detailed digital illustration")
      4. 5 commercial composition tags (e.g., "wide angle, copy space", "close up macro")
      
      CRITICAL ADOBE STOCK RULES:
      - NO SIMILAR CONTENT: The modifiers must be distinct enough to create visually different variations of the same subject.
      - GENERATIVE AI COMPLIANCE: Ensure all modifiers strictly avoid brands, logos, trademarked elements, and specific real-world locations.
      - QUALITY: The modifiers should naturally enhance the quality and realism/detail of the final output.
      
      Ensure all modifiers are tailored for ${contentType}.
      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
      config: {
        systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Provide highly commercial, premium modifiers that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lightings: { type: Type.ARRAY, items: { type: Type.STRING } },
            moods: { type: Type.ARRAY, items: { type: Type.STRING } },
            styles: { type: Type.ARRAY, items: { type: Type.STRING } },
            compositions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["lightings", "moods", "styles", "compositions"]
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    try {
      const modifiers = extractJSON(text);
      const optimizedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ' --no text, watermark, deformed, blurry, logos' : '';
      
      // Programmatically optimize all prompts
      for (const originalPrompt of prompts) {
        // Strip out negative prompts first to avoid capturing them
        let cleanPrompt = originalPrompt.split('--no')[0].trim();
        let parts = cleanPrompt.split(/[,.]/);
        
        // Extract a rough subject and details from the original prompt
        let coreSubject = parts[0] ? parts[0].substring(0, 100).trim() : "commercial subject";
        let coreDetails = parts[1] ? parts[1].substring(0, 100).trim() : "";
        
        if (!coreSubject) coreSubject = "commercial subject";

        const lighting = modifiers.lightings[Math.floor(Math.random() * modifiers.lightings.length)] || "professional lighting";
        const mood = modifiers.moods[Math.floor(Math.random() * modifiers.moods.length)] || "commercial mood";
        const style = modifiers.styles[Math.floor(Math.random() * modifiers.styles.length)] || "high quality";
        const composition = modifiers.compositions[Math.floor(Math.random() * modifiers.compositions.length)] || "standard composition";
        
        // Combine original detail with new composition
        const finalDetails = coreDetails ? `${coreDetails}, ${composition}` : composition;
        
        let prompt = template.template
          .replace(/{subject}/g, coreSubject)
          .replace(/{details}/g, finalDetails)
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, mood)
          .replace(/{style}/g, style)
          .replace(/{aspect}/g, "16:9"); // Default aspect for programmatic
          
        prompt += negativePrompt;
        
        // Ensure uniqueness if possible, though with original prompts it's usually unique
        let suffix = 1;
        let finalPrompt = prompt;
        while (optimizedPrompts.has(finalPrompt)) {
          finalPrompt = prompt + ` --v ${suffix++}`; // Add a tiny variation to force uniqueness if needed
        }
        optimizedPrompts.add(finalPrompt);
      }
      return Array.from(optimizedPrompts);
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse the response from the AI. Please try again.");
    }
  }

  // Standard optimization for smaller arrays
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Optimize the following list of image generation prompts to make them more detailed, commercial-grade, and highly targeted for the '${contentType}' category on microstock platforms like Adobe Stock.

Original Prompts:
${JSON.stringify(prompts)}

CRITICAL REQUIREMENTS FOR OPTIMIZATION (ADOBE STOCK):
1. Enhance Technical Precision: Add specific lighting, camera angles, lens types, and aesthetic quality appropriate for a ${contentType}.
2. Improve Commercial Utility: Ensure concepts are highly usable for designers and agencies. Add elements like 'copy space', 'authentic lifestyle', 'modern aesthetics', or 'clean backgrounds' where appropriate.
3. NO SIMILAR CONTENT: Ensure the optimized prompts are distinct enough from each other to avoid generating repetitive images.
4. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings.
5. QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
6. Maintain Original Intent: Keep the core subject and action of the original prompt, but elevate its quality and marketability.
7. STRICT Template Alignment: You MUST strictly format each optimized prompt using this exact template structure:
"${template.template}"
Replace the bracketed placeholders with your optimized content. Do not add conversational text.

Respond strictly with a JSON array of strings, where each string is the optimized version of the corresponding original prompt. The output array must have exactly the same length as the input array.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each optimized prompt (e.g., "--no text, watermark, deformed, blurry, logos, bad anatomy, extra limbs").' : ''}`,
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in optimizing and refining image generation prompts to produce flawless, authentic, and highly usable stock photography and illustrations that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines.",
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return extractJSON(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function generateAllPromptsBatch(
  keyword: string, 
  categories: any[], 
  totalCount: number, 
  settings: AppSettings, 
  contentType: string
): Promise<Map<string, string[]>> {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'nanobanana-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const countPerCategory = Math.max(1, Math.floor(totalCount / categories.length));
  const itemsNeeded = Math.max(5, Math.ceil(Math.sqrt(countPerCategory) * 1.5));

  const categoryNames = categories.map(c => c.categoryName).join("', '");

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: `Generate rich prompt components for multiple niches based on the core keyword '${keyword}'. The target asset type is '${contentType}'.
      
      The niches are: '${categoryNames}'.
      
      For EACH niche, provide:
      1. ${itemsNeeded} highly distinct subjects.
      2. ${itemsNeeded} specific and varied details/actions/camera angles.
      3. ${itemsNeeded} distinct lighting styles.
      4. ${itemsNeeded} mood/atmosphere descriptions.
      5. ${itemsNeeded} artistic styles/mediums.
      6. 5 aspect ratios (e.g., "16:9", "4:3", "1:1").
      
      CRITICAL ADOBE STOCK RULES:
      - NO SIMILAR CONTENT: Components must be vastly different.
      - GENERATIVE AI COMPLIANCE: NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands.
      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
      config: {
        systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  categoryName: { type: Type.STRING },
                  subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                  details: { type: Type.ARRAY, items: { type: Type.STRING } },
                  lightings: { type: Type.ARRAY, items: { type: Type.STRING } },
                  moods: { type: Type.ARRAY, items: { type: Type.STRING } },
                  styles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  aspects: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["categoryName", "subjects", "details", "lightings", "moods", "styles", "aspects"]
              }
            }
          },
          required: ["categories"]
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    const data = extractJSON(text);
    const negativePrompt = settings.includeNegative ? ' --no text, watermark, deformed, blurry, logos' : '';
    
    const resultsMap = new Map<string, string[]>();
    
    for (const catData of data.categories) {
      const generatedPrompts = new Set<string>();
      let attempts = 0;
      const maxAttempts = countPerCategory * 5;
      
      while (generatedPrompts.size < countPerCategory && attempts < maxAttempts) {
        const subject = catData.subjects[Math.floor(Math.random() * catData.subjects.length)] || "subject";
        const detail = catData.details[Math.floor(Math.random() * catData.details.length)] || "detail";
        const lighting = catData.lightings[Math.floor(Math.random() * catData.lightings.length)] || "lighting";
        const mood = catData.moods[Math.floor(Math.random() * catData.moods.length)] || "mood";
        const style = catData.styles[Math.floor(Math.random() * catData.styles.length)] || "style";
        const aspect = catData.aspects[Math.floor(Math.random() * catData.aspects.length)] || "16:9";
        
        let prompt = template.template
          .replace(/{subject}/g, subject)
          .replace(/{details}/g, detail)
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, mood)
          .replace(/{style}/g, style)
          .replace(/{aspect}/g, aspect);
          
        prompt += negativePrompt;
        generatedPrompts.add(prompt);
        attempts++;
      }
      resultsMap.set(catData.categoryName, Array.from(generatedPrompts));
    }
    
    return resultsMap;
  } catch (error) {
    console.error("Batch generation failed:", error);
    throw new Error(handleGeminiError(error));
  }
}

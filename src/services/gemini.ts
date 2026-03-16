import { GoogleGenAI, Type } from '@google/genai';
import { AppSettings, PromptTemplate, ReferenceFile } from '../types';

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

function getContentTypeInstructions(contentType: string): string {
  switch (contentType) {
    case 'Photo':
      return "Focus on photographic elements: camera angles, lighting (e.g., golden hour, studio lighting), lens types (e.g., macro, wide-angle), depth of field, and realistic human subjects or environments. Emphasize authenticity and commercial photography standards.";
    case 'Illustration':
      return "Focus on illustrative elements: art styles (e.g., flat design, watercolor, digital painting), color palettes, line work, and artistic composition. Emphasize creativity, stylistic consistency, and commercial illustration trends.";
    case 'Vector':
      return "Focus on vector-specific elements: clean lines, scalable graphics, flat colors, isometric designs, icons, and UI/UX elements. Emphasize simplicity, versatility, and modern graphic design trends.";
    case 'Background':
      return "Focus on background elements: textures, abstract patterns, gradients, bokeh, minimalistic spaces, and copy space. Emphasize usability as a backdrop for text or other design elements.";
    case 'Video':
      return "Focus on cinematic elements: camera movement (e.g., pan, tilt, tracking shot), frame rate, resolution (e.g., 4K, 8K), lighting, motion blur, and dynamic action. Emphasize storytelling and high-end stock footage standards.";
    case '3D Render':
      return "Focus on 3D elements: rendering engines (e.g., Octane, Unreal Engine), materials (e.g., glass, metal, matte), lighting (e.g., volumetric, HDRI), isometric views, and hyper-realism or stylized 3D. Emphasize modern 3D design trends.";
    default:
      return "Focus on high-quality, commercially viable visual elements appropriate for this asset type.";
  }
}

export async function analyzeKeyword(keyword: string, contentType: string, settings: AppSettings, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Perform an exhaustive, data-driven microstock market analysis targeting the asset type: '${contentType}'.

${getContentTypeInstructions(contentType)}

CRITICAL: You MUST use Google Search to find REAL, CURRENT data, trends, and search volumes for Adobe Stock and the microstock industry. Do not rely solely on your internal knowledge; ground your analysis in actual, up-to-date market realities to avoid bias.

${keyword ? `The broad keyword context is: '${keyword}'.` : 'No specific keyword was provided.'}
${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
You MUST use the urlContext tool to fetch and deeply analyze the content of this URL. 
This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for this analysis.
1. Extract the core visual themes, color palettes, lighting styles, subject matter, and underlying concepts from the URL.
2. The generated niches MUST be directly derived from, or highly complementary to, the specific content found in this URL. Do not deviate into unrelated topics.
3. Identify the target audience and commercial purpose of the content in the URL.
4. Use Google Search to cross-reference these extracted themes with current market demand on Adobe Stock to find profitable angles based on the URL's core concept.` : ''}
${!keyword && !referenceUrl && referenceFile ? 'Please derive the niche opportunities primarily from the visual content of the provided reference.' : ''}

Your objective is to uncover 4 to 6 highly specific, underserved, and commercially lucrative sub-niches (Blue Oceans). AVOID generic categories. Focus on exact, long-tail concepts that buyers (ad agencies, web designers, corporate marketers) are actively searching for but lack high-quality supply on platforms like Adobe Stock and Shutterstock.

${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: I have provided an ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference. 
This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for this analysis.
1. Extract the core visual themes, color palettes, lighting styles, subject matter, and underlying concepts from the file.
2. The generated niches MUST be directly derived from, or highly complementary to, the specific content found in this file. Do not deviate into unrelated topics.
3. Identify the target audience and commercial purpose of the content in the file.
4. Use Google Search to cross-reference these extracted themes with current market demand on Adobe Stock to find profitable angles based on the file's core concept.` : ''}

CRITICAL ADOBE STOCK RULES:
- GENERATIVE AI COMPLIANCE: The niches MUST NOT rely on trademarked/copyrighted elements, specific brands, recognizable characters, or real known restricted places/buildings. Focus on generic, commercially safe concepts (e.g., "generic modern smartphone" instead of "iPhone").
- NO SIMILAR CONTENT: Ensure the 4 to 6 niches are distinct from each other, while still adhering to the main idea if a reference URL/file is provided.

For each niche, you MUST provide realistic, data-backed market metrics based on your search:
1. categoryName: A highly specific, commercial niche name (e.g., "Gen Z Sustainable Office Lifestyle" instead of "Business People").
2. mainKeywords: 5-7 exact-match, long-tail keywords that buyers actually type into search bars.
3. volumeLevel & volumeNumber: Estimated monthly search volume on major stock platforms based on real trends. Make this a highly realistic number reflecting actual market demand (e.g., 12500, not just 100).
4. competition & competitionScore: Estimated number of existing assets (0-100 score). 100 means millions of assets (oversaturated), 10 means very few assets (blue ocean).
5. trend & trendPercent: Current market trajectory based on real-world news/seasons (e.g., +45% due to recent events).
6. difficultyScore: 0-100. How hard is it for a new contributor to rank on page 1?
7. opportunityScore: 0-100. The ultimate metric. High volume + Low competition = High Opportunity (80-100).
8. creativeAdvice: Highly specific art direction based on current design trends. What exact visual elements, lighting, colors, or compositions are missing in the current market for this niche? ${referenceUrl ? 'Ensure the advice heavily incorporates the aesthetic and concepts from the reference URL.' : ''} ${referenceFile ? 'Ensure the advice heavily incorporates the aesthetic and concepts from the reference file.' : ''}

CRITICAL: Ensure mathematical and logical consistency. If competition is 95/100 (oversaturated), the opportunity score MUST be low (under 40) unless the volume is exceptionally massive and growing rapidly. Prioritize finding "Blue Ocean" niches (High Opportunity).
Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const parts: any[] = [{ text: promptText }];

  if (referenceFile) {
    parts.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: "You are an elite Microstock Market Data Analyst (Adobe Stock, Shutterstock). Your job is to provide highly accurate, data-backed estimates for search volume and competition based on REAL, current market trends using Google Search. NEVER provide generic keywords. ALWAYS find underserved, high-converting long-tail niches. When a reference URL is provided, you MUST deeply analyze its content to extract its visual and conceptual DNA.",
      tools: referenceUrl ? [{ urlContext: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
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

export async function generatePrompts(keyword: string, categoryName: string, count: number, settings: AppSettings, contentType: string, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  // For large counts, use a combinatorial approach to avoid LLM output token limits and guarantee uniqueness
  if (count > 30) {
    const promptText = `Generate a rich set of prompt components for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.
      
      ${getContentTypeInstructions(contentType)}

      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated components reflect REAL market demand and current design trends.

      ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
      You MUST use the urlContext tool to deeply analyze the visual style, trends, and content from this URL. 
      This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
      Extract its "Visual DNA" (lighting, color palette, mood, composition, subject matter).
      The niche '${categoryName}' should be used as a SECONDARY IDEA or context to adapt the primary visual DNA from the URL into a highly commercial stock asset.` : ''}
      ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference.
      This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
      Extract its "Visual DNA" (lighting, color palette, mood, composition, subject matter).
      The niche '${categoryName}' should be used as a SECONDARY IDEA or context to adapt the primary visual DNA from the file into a highly commercial stock asset.` : ''}

      We need to programmatically generate ${count} unique combinations. Please provide:
      1. 30 highly distinct subjects (e.g., "a young professional woman", "a modern office desk", "a diverse team of engineers"). MUST be diverse in age, ethnicity, and core concept.
      2. 30 specific and varied details/actions/camera angles (e.g., "typing on a laptop, close-up shot", "holding a coffee cup, wide angle", "brainstorming at a whiteboard, over-the-shoulder view").
      3. 15 distinct lighting styles (e.g., "soft morning sunlight", "dramatic studio lighting", "neon cyberpunk glow").
      4. 15 mood/atmosphere descriptions (e.g., "energetic and focused", "calm and serene", "mysterious and dark").
      5. 10 artistic styles/mediums (e.g., "photorealistic", "cinematic photography", "3D render", "flat vector illustration").
      6. 5 aspect ratios (e.g., "16:9", "4:3", "3:2", "1:1", "9:16")
      
      CRITICAL ADOBE STOCK RULES:
      - NO SIMILAR CONTENT: The components must be vastly different from each other to avoid generating repetitive images. Do not just change colors or minor details. Vary the camera angles, compositions, and core actions.
      - NO TEXT/TYPOGRAPHY: Absolutely no text, words, letters, signatures, or watermarks should be mentioned or implied in the components. The output must be purely visual.
      - GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms (e.g., "generic modern luxury car" instead of "Tesla").
      - QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
      - Ensure all components are perfectly suited for ${contentType} and optimized for the ${template.name} platform.
      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

    const parts: any[] = [{ text: promptText }];
    if (referenceFile) {
      parts.push({
        inlineData: {
          data: referenceFile.data,
          mimeType: referenceFile.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation components that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. Use real-world data to inform your aesthetic choices. When a reference URL is provided, you MUST deeply analyze its content to extract its visual and conceptual DNA.",
        tools: referenceUrl ? [{ urlContext: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
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
      const negativePrompt = settings.includeNegative ? ' --no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy' : '';
      
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
  const promptTextSmall = `Generate exactly ${count} highly detailed, commercial-grade image generation prompts for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.

${getContentTypeInstructions(contentType)}

CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated prompts reflect REAL market demand and current design trends.

${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
You MUST use the urlContext tool to deeply analyze the visual style, trends, and content from this URL. 
This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
Extract its "Visual DNA" (lighting, color palette, mood, composition, subject matter).
The niche '${categoryName}' should be used as a SECONDARY IDEA or context to adapt the primary visual DNA from the URL into a highly commercial stock asset.` : ''}
${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference.
This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
Extract its "Visual DNA" (lighting, color palette, mood, composition, subject matter).
The niche '${categoryName}' should be used as a SECONDARY IDEA or context to adapt the primary visual DNA from the file into a highly commercial stock asset.` : ''}

CRITICAL REQUIREMENTS FOR ADOBE STOCK:
1. Commercial Utility: Ensure concepts are highly usable for designers and agencies. Include concepts with 'copy space', 'authentic lifestyle', 'modern aesthetics', or 'clean backgrounds' where appropriate.
2. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for a ${contentType} on the ${template.name} platform.
3. NO SIMILAR CONTENT: Do not generate prompts that are practically identical. Each prompt MUST have a distinct composition, camera angle, subject, or core action.
4. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms only.
5. QUALITY: Ensure descriptions naturally lead to high-quality outputs.
6. NO TEXT: Strictly avoid any mention of text, typography, words, letters, signatures, or watermarks. The image must be clean and free of any literal text.
7. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure for ${template.name}:
"${template.template}"
Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.

Respond strictly with a JSON array of strings, where each string is a complete, ready-to-use image generation prompt tailored for a ${contentType}.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

  const partsSmall: any[] = [{ text: promptTextSmall }];
  if (referenceFile) {
    partsSmall.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: { parts: partsSmall },
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. You understand lighting, composition, camera settings, and market trends perfectly based on real data. When a reference URL is provided, you MUST deeply analyze its content to extract its visual and conceptual DNA.",
      tools: referenceUrl ? [{ urlContext: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
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

export async function generatePromptsDirectly(count: number, settings: AppSettings, contentType: string, keyword?: string, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const promptText = `Generate exactly ${count} highly detailed, commercial-grade image generation prompts. The target asset type is '${contentType}' and the target platform is '${template.name}'.
  
  ${getContentTypeInstructions(contentType)}

  CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this asset type. Ensure your generated prompts reflect REAL market demand and current design trends.

  ${keyword ? `The core theme/keyword is: '${keyword}'.` : ''}
  ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
  You MUST use the urlContext tool to deeply analyze the visual style, trends, and content from this URL. 
  This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
  Extract the "Visual DNA" (lighting, color palette, mood, composition, subject matter).
  ${keyword ? `The core theme/keyword '${keyword}' should be used as a SECONDARY IDEA or context to adapt the primary visual DNA from the URL into a highly commercial stock asset.` : 'Adapt the primary visual DNA from the URL into highly commercial stock assets.'}
  DO NOT make literal copies; instead, create new scenes heavily inspired by this aesthetic and concept.` : ''}
  ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference.
  This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
  Extract the "Visual DNA" (lighting, color palette, mood, composition, subject matter).
  ${keyword ? `The core theme/keyword '${keyword}' should be used as a SECONDARY IDEA or context to adapt the primary visual DNA from the file into a highly commercial stock asset.` : 'Adapt the primary visual DNA from the file into highly commercial stock assets.'}
  DO NOT make literal copies; instead, create new scenes heavily inspired by this aesthetic and concept.` : ''}

  CRITICAL REQUIREMENTS FOR ADOBE STOCK:
  1. Commercial Utility: Ensure concepts are highly usable for designers and agencies. Include 'copy space' where relevant.
  2. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for the ${template.name} platform.
  3. NO SIMILAR CONTENT: Each prompt MUST have a distinct composition, camera angle, subject, or core action. Avoid repetitive concepts.
  4. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms only (e.g., "generic modern smartphone").
  5. QUALITY: Ensure descriptions naturally lead to high-quality outputs.
  6. NO TEXT: Strictly avoid any mention of text, typography, words, letters, signatures, or watermarks.
  7. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure for ${template.name}:
  "${template.template}"
  Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.

  Respond strictly with a JSON array of strings, where each string is a complete, ready-to-use image generation prompt tailored for a ${contentType}.
  Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
  ${settings.includeNegative ? 'Append a strong negative prompt at the end of each prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

  const parts: any[] = [{ text: promptText }];

  if (referenceFile) {
    parts.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts based on visual or textual references and real-world market data. You excel at extracting aesthetic essence and applying it to new, commercially viable concepts. When a reference URL is provided, you MUST deeply analyze its content to extract its visual and conceptual DNA.",
      tools: referenceUrl ? [{ urlContext: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return extractJSON(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function optimizePrompts(prompts: string[], settings: AppSettings, contentType: string, keyword?: string, categoryName?: string, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  // If the array is very large, we use a programmatic approach but with stricter preservation of original content
  if (prompts.length > 30) {
    const sample = prompts.slice(0, 10);
    
    const promptText = `Analyze these sample prompts: ${JSON.stringify(sample)}.
      
      We need to perform a "Technical Upgrade" on a large batch of similar prompts for Adobe Stock (${contentType}).
      GOAL: Enhance the technical quality (lighting, camera, resolution) WITHOUT changing the core visual subject or scene of each prompt.
      
      ${getContentTypeInstructions(contentType)}

      CRITICAL: Use Google Search to research current technical standards, popular aesthetic modifiers, and high-demand commercial styles on Adobe Stock. Ensure your enhancements reflect REAL market demand and current professional photography/illustration trends.

      ${keyword || categoryName ? `The niche context is: '${categoryName || keyword}'.` : ''}
      ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
      You MUST use the urlContext tool to deeply analyze the visual style from this URL. 
      This URL is the PRIMARY SOURCE OF INSPIRATION for the technical upgrade.
      Use it as a technical quality benchmark for lighting, camera settings, and overall aesthetic.` : ''}
      ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided reference file.
      This reference file is the PRIMARY SOURCE OF INSPIRATION for the technical upgrade.
      Use it as a technical quality benchmark for lighting, camera settings, and overall aesthetic.` : ''}

      Provide a set of "Technical Enhancement Layers" that can be applied to preserve the original subject:
      1. 10 premium technical modifiers (e.g., "shot on 85mm lens, f/1.8", "high-end commercial photography, 8k")
      2. 10 lighting enhancements that fit any scene (e.g., "natural soft lighting", "professional studio setup")
      3. 5 mood-neutral quality tags (e.g., "hyper-detailed textures", "award-winning masterpiece")
      
      CRITICAL RULES:
      - PRESERVE SUBJECT: The modifiers must be neutral enough to not change what is happening in the original prompt.
      - NO TEXT/TYPOGRAPHY: Ensure all modifiers avoid text or watermarks.
      - ADOBE STOCK COMPLIANCE: No brands, logos, or trademarks.
      
      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

    const parts: any[] = [{ text: promptText }];
    if (referenceFile) {
      parts.push({
        inlineData: {
          data: referenceFile.data,
          mimeType: referenceFile.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: "You are an elite AI Image Prompt Engineer. Your task is to provide technical enhancement layers that improve prompt quality without altering the original visual subject or intent. Base your enhancements on real-world commercial photography standards. When a reference URL is provided, you MUST deeply analyze its content to extract its visual and conceptual DNA.",
        tools: referenceUrl ? [{ urlContext: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicals: { type: Type.ARRAY, items: { type: Type.STRING } },
            lightings: { type: Type.ARRAY, items: { type: Type.STRING } },
            qualities: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["technicals", "lightings", "qualities"]
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    try {
      const layers = extractJSON(text);
      const optimizedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ' --no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy' : '';
      
      for (const originalPrompt of prompts) {
        let cleanPrompt = originalPrompt.split('--no')[0].trim();
        let parts = cleanPrompt.split(/[,.]/);
        
        // Extract the original subject and existing details as much as possible
        let coreSubject = parts[0] ? parts[0].trim() : "subject";
        let originalDetails = parts.slice(1).join(', ').trim();
        
        const technical = layers.technicals[Math.floor(Math.random() * layers.technicals.length)] || "high quality";
        const lighting = layers.lightings[Math.floor(Math.random() * layers.lightings.length)] || "professional lighting";
        const quality = layers.qualities[Math.floor(Math.random() * layers.qualities.length)] || "masterpiece";
        
        // Reconstruct using the template but prioritizing original content
        let prompt = template.template
          .replace(/{subject}/g, coreSubject)
          .replace(/{details}/g, originalDetails || "highly detailed")
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, quality) // Use quality as mood to be neutral
          .replace(/{style}/g, technical)
          .replace(/{aspect}/g, "16:9");
          
        prompt += negativePrompt;
        optimizedPrompts.add(prompt);
      }
      return Array.from(optimizedPrompts);
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse the response from the AI. Please try again.");
    }
  }

  // Standard optimization for smaller arrays
  const promptTextSmall = `Optimize the following list of image generation prompts. The target asset type is '${contentType}'.
  
  ${getContentTypeInstructions(contentType)}

  CRITICAL: Use Google Search to research current technical standards, popular aesthetic modifiers, and high-demand commercial styles on Adobe Stock. Ensure your enhancements reflect REAL market demand and current professional photography/illustration trends.

  ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
  You MUST use the urlContext tool to deeply analyze the visual style from this URL. 
  This URL is the PRIMARY SOURCE OF INSPIRATION for the technical upgrade.
  Use it as a technical quality benchmark for lighting, camera settings, and overall aesthetic.
  Ensure the upgraded prompts reflect the high-end technical qualities found in this URL.` : ''}
  ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided reference file.
  This reference file is the PRIMARY SOURCE OF INSPIRATION for the technical upgrade.
  Use it as a technical quality benchmark for lighting, camera settings, and overall aesthetic.
  Ensure the upgraded prompts reflect the high-end technical qualities found in this file.` : ''}

  STRICT RULE: You MUST preserve the original visual subject, core action, and specific scene details. Do NOT add new subjects, change the setting, or alter the primary visual intent.
  
  YOUR TASK: Perform a "Technical Upgrade" by:
  1. Enhancing technical precision (camera settings, lens types, lighting terminology) for ${template.name}.
  2. Improving commercial formatting for Adobe Stock.
  3. Ensuring strict adherence to the target platform's best practices.

Original Prompts:
${JSON.stringify(prompts)}

CRITICAL REQUIREMENTS:
1. NO VISUAL CHANGES: Keep the subject and scene exactly as described in the original.
2. NO TEXT: Strictly avoid any mention of text, typography, or watermarks.
3. ADOBE STOCK COMPLIANCE: Use generic terms for brands/logos.
4. STRICT Template Alignment: Format each prompt using this exact structure:
"${template.template}"

Respond strictly with a JSON array of strings.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each optimized prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

  const partsSmall: any[] = [{ text: promptTextSmall }];
  if (referenceFile) {
    partsSmall.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: { parts: partsSmall },
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer. Your specialty is 'Technical Upgrading'—improving the technical execution and formatting of a prompt while strictly preserving its original visual subject and intent. Base your upgrades on real-world market data.",
      tools: referenceUrl ? [{ urlContext: {} }, { googleSearch: {} }] : [{ googleSearch: {} }],
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
      model: settings.model || 'gemini-2.5-flash',
      contents: `Generate rich prompt components for multiple niches based on the core keyword '${keyword}'. The target asset type is '${contentType}'.
      
      ${getContentTypeInstructions(contentType)}

      The niches are: '${categoryNames}'.
      
      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for these niches. Ensure your generated components reflect REAL market demand and current design trends.

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
        systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Use real-world data to inform your aesthetic choices.",
        tools: [{ googleSearch: {} }],
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

export async function generateAdobeStockMetadata(
  prompts: string[], 
  categoryName: string, 
  settings: AppSettings,
  contentType: string
): Promise<{ title: string, keywords: string[] }[]> {
  const ai = getAI(settings.apiKey);
  
  // Chunk prompts to avoid token limits (max 10 per request)
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < prompts.length; i += chunkSize) {
    chunks.push(prompts.slice(i, i + chunkSize));
  }

  let allMetadata: { title: string, keywords: string[] }[] = [];

  for (const chunk of chunks) {
    const promptText = `Generate highly optimized metadata for Adobe Stock for the following ${chunk.length} image generation prompts in the niche '${categoryName}'. The target asset type is '${contentType}'.
    
    ${getContentTypeInstructions(contentType)}

CRITICAL: Use Google Search to find the highest-converting, most searched keywords for these specific visual concepts on Adobe Stock and similar platforms.

For EACH prompt, provide:
1. title: A descriptive, commercial title (max 200 characters). Must be in English.
2. keywords: Exactly 40-50 highly relevant keywords. Order them by relevance (most important first). Must be in English. No spammy words.

Prompts:
${chunk.map((p, i) => `[${i + 1}] ${p}`).join('\n')}
`;

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: "You are an elite Microstock SEO Expert and Top-Selling Adobe Stock Contributor. You know exactly how to write titles and 50 keywords that rank #1 on Adobe Stock search. You use real-world search data to inform your keywords.",
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "keywords"]
          }
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    try {
      const parsed = extractJSON(text);
      allMetadata = [...allMetadata, ...parsed];
    } catch (e) {
      console.error("Failed to parse JSON response for chunk:", text);
      throw new Error("Failed to parse the response from the AI. Please try again.");
    }
  }

  return allMetadata;
}

import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { AppSettings, PromptTemplate, ReferenceFile } from '../types';
import { getAI, handleGeminiError, extractJSON, getContentTypeInstructions, getVariationInstructions } from './geminiUtils';
import { promptTemplates } from './gemini';

export async function generatePrompts(
  keyword: string, 
  categoryName: string, 
  count: number, 
  settings: AppSettings, 
  contentType: string, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string,
  buyerPersona?: string,
  visualTrends?: string[],
  creativeAdvice?: string
) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: You MUST infuse these prompts with the creator's specific Aesthetic DNA. The lighting, composition, color palette, and overall vibe MUST strongly reflect their established style to ensure the generated assets fit seamlessly into their portfolio.)
  ` : '';

  // For large counts, use a combinatorial approach to avoid LLM output token limits and guarantee uniqueness
  if (count > 30) {
    const promptText = `Generate a rich set of prompt components for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.
      
      ${getContentTypeInstructions(contentType)}

      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated components reflect REAL market demand and current design trends.

      ${portfolioContext}
      ${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\n      Tailor the subjects, environments, and overall vibe to appeal directly to this specific audience and their commercial needs.` : ''}
      ${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\n      Integrate these specific aesthetic trends into the lighting, color grading, and styling of the prompts.` : ''}
      ${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\n      Ensure the prompts execute on this specific creative advice.` : ''}

      ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
      You MUST use the Google Search tool to deeply analyze the visual style, trends, topic, lighting, and keywords from this URL. 
      This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
      1. Identify the specific content type, niche, and CORE TOPIC of the asset in the URL.
      2. Extract its "Visual DNA" (lighting, color palette, mood, composition, subject matter, and thematic keywords).
      The niche '${categoryName}' should be used as a SECONDARY context to adapt the primary visual DNA and topic from the URL into a highly commercial stock asset.
      
      ADOBE STOCK ALGORITHM: Ensure the resulting prompts are "tepat sasaran" (perfectly targeted) to the URL's aesthetic DNA while maximizing commercial appeal (copy space, authentic lifestyle).` : ''}
      ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference.
      This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
      1. Extract its "Visual DNA": style, topic, lighting, and key visual elements.
      The niche '${categoryName}' should be used as a SECONDARY context to adapt the primary visual DNA from the file into a highly commercial stock asset.` : ''}

      We need to programmatically generate ${count} unique combinations. Please provide:
      1. 30 highly distinct subjects (e.g., "a young professional woman", "a modern office desk", "a diverse team of engineers"). MUST be diverse in age, ethnicity, and core concept.
      2. 30 specific and varied details/actions/camera angles. ${contentType === 'Video' ? 'Include Cinematography (Camera movement, Composition, Lens & focus) and Action.' : 'Include Action, Location/context, and Composition.'} You MUST rotate through diverse camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
      3. 20 distinct and trending lighting styles based on current market analysis (e.g., "soft morning sunlight", "dramatic studio lighting", "neon cyberpunk glow", "chiaroscuro", "golden hour backlighting", "cinematic rim lighting").
      4. 15 mood/atmosphere descriptions (e.g., "energetic and focused", "calm and serene", "mysterious and dark"). ${contentType === 'Video' ? 'Include Soundstage details (Dialogue, SFX, Ambient noise).' : ''}
      5. 20 diverse artistic styles/mediums based on current visual trends (e.g., "photorealistic", "cinematic photography", "3D render", "flat vector illustration", "synthwave aesthetic", "minimalist line art", "hyper-detailed digital painting").
      6. 5 aspect ratios (e.g., "16:9", "4:3", "3:2", "1:1", "9:16")
      
      CRITICAL ADOBE STOCK RULES:
      - ALGORITHM OPTIMIZATION: To rank high and sell, concepts must have high commercial utility. Prioritize "authentic lifestyle", "diverse representation", "copy space", and "clean compositions".
      - KEYWORD WEAVING & DENSITY STRATEGY: To maximize search visibility without keyword stuffing, you MUST weave 5-8 high-value commercial synonyms and LSI (Latent Semantic Indexing) keywords naturally across the components (subject, details, lighting, mood, style). 
        - Do NOT repeat the exact same words. Use varied adjectives and nouns (e.g., instead of repeating "business", use "corporate, executive, professional, commercial, enterprise").
        - The combined final prompt should read as a natural, highly descriptive sentence that inherently contains a dense cluster of unique, searchable stock keywords.
      - NO SIMILAR CONTENT: The components must be vastly different from each other to avoid generating repetitive images. Adobe Stock rejects batches of similar images. 
        - VARIATION STRATEGY: Rotate through diverse camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
      - NO TEXT/TYPOGRAPHY: Absolutely no text, words, letters, signatures, or watermarks should be mentioned or implied in the components. The output must be purely visual.
      - AESTHETIC DNA ALIGNMENT: You MUST ensure the generated components (especially lighting, mood, and style) align with the provided CREATOR AESTHETIC DNA. The components MUST be "tepat sasaran" based on their portfolio.
      - GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms (e.g., "generic modern luxury car" instead of "Tesla").
      - QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
      ${contentType === 'Video' ? `- SPECIAL VIDEO INSTRUCTION: For this category, you MUST incorporate specific cinematic camera movements and techniques in the 'details/actions' section. Use terms like 'slow-motion tracking shot', 'dynamic drone footage', 'handheld camera effect', 'stabilized gimbal shot', 'crane shot', 'dolly zoom', and 'rack focus'.` : ''}
      - ${getVariationInstructions(settings.variationLevel)}
      - Ensure all components are perfectly suited for ${contentType} and optimized for the ${template.name} platform.
      
      Respond strictly with a JSON object following this schema:
      {
        "subjects": string[],
        "details": string[],
        "lightings": string[],
        "moods": string[],
        "styles": string[],
        "aspects": string[]
      }

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
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation components that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. 
        CORE ENGINE: You are operating on the ${settings.model || 'gemini-3-flash-preview'} model.
        SYNTHESIS BLUEPRINT: You are generating components for the ${template.name} platform using its specific structural logic.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}
        ADOBE STOCK ALGORITHM: Prioritize high-demand commercial themes, authentic representation, and technical excellence.
        Respond ONLY with valid JSON.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    try {
      const components = extractJSON(text);
      const generatedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ` ${settings.customNegativePrompt || '--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy'}` : '';
      
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
        
        // Ensure single line
        prompt = prompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        
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

${portfolioContext}
${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\nTailor the subjects, environments, and overall vibe to appeal directly to this specific audience and their commercial needs.` : ''}
${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\nIntegrate these specific aesthetic trends into the lighting, color grading, and styling of the prompts.` : ''}
${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\nEnsure the prompts execute on this specific creative advice.` : ''}

${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
You MUST use the Google Search tool to analyze this URL. 
LOGIC: Use this URL as the PRIMARY SOURCE for style, topic, lighting, and thematic keywords.
The niche '${categoryName}' provides additional context. 
TASK: Generate prompts that are "tepat sasaran" (perfectly targeted) according to the URL's essence.
ADOBE STOCK ALGORITHM: Maximize commercial utility (copy space, authentic lifestyle, diverse representation).
ADOBE STOCK SAFETY: Capture the 'vibe' and conceptual DNA without infringing on IP.` : ''}
${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'}.
LOGIC: Use this file as the PRIMARY SOURCE for style, topic, lighting, and thematic keywords.
The niche '${categoryName}' provides additional context. 
TASK: Generate prompts that precisely match the visual and conceptual DNA of the file.` : ''}

${contentType === 'AI Art & Creativity' ? `SPECIAL AI ART INSTRUCTION: For this category, prioritize surrealism, abstract concepts, and innovative digital aesthetics. If a reference is provided, deeply analyze its 'Aesthetic Soul'—not just the subject, but the emotional resonance, the texture of the light, and the complexity of the forms. Incorporate these into the prompts to create something that feels like a creative evolution of the reference.` : ''}
${contentType === 'Video' ? `SPECIAL VIDEO INSTRUCTION: For this category, you MUST incorporate specific cinematic camera movements and techniques. Use terms like 'slow-motion tracking shot', 'dynamic drone footage', 'handheld camera effect', 'stabilized gimbal shot', 'crane shot', 'dolly zoom', and 'rack focus'. Specify frame rates like '60fps' for slow motion or '24fps' for a cinematic look. Ensure the action described is dynamic and visually engaging. Include Soundstage details (Dialogue, SFX, Ambient noise).` : ''}

CRITICAL REQUIREMENTS FOR ADOBE STOCK:
1. ALGORITHM OPTIMIZATION & Commercial Utility: Ensure concepts are highly usable for designers and agencies. You MUST include concepts with 'copy space', 'authentic lifestyle', 'diverse representation', 'modern aesthetics', or 'clean backgrounds' where appropriate.
2. KEYWORD WEAVING & DENSITY STRATEGY: To maximize search visibility without keyword stuffing, you MUST weave 5-8 high-value commercial synonyms and LSI (Latent Semantic Indexing) keywords naturally across the descriptive flow of EACH prompt. 
   - DO NOT repeat the exact same words. Use varied adjectives and nouns (e.g., instead of repeating "business", use "corporate, executive, professional, commercial, enterprise").
   - The combined final prompt should read as a natural, highly descriptive sentence that inherently contains a dense cluster of unique, searchable stock keywords.
3. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for a ${contentType} on the ${template.name} platform.
4. NO SIMILAR CONTENT: Adobe Stock rejects batches of similar images. Do not generate prompts that are practically identical. Each prompt MUST have a distinct composition, camera angle, subject, or core action.
   - VARIATION STRATEGY: You MUST explicitly rotate through a wide range of camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level, over-the-shoulder) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
   - LIGHTING & STYLE DIVERSITY: Ensure each prompt uses a unique combination of trending lighting conditions (e.g., golden hour, cinematic rim lighting, neon glow, soft diffused, harsh shadows) and artistic styles relevant to the market.
5. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms only.
6. QUALITY: Ensure descriptions naturally lead to high-quality outputs.
7. NO TEXT: Strictly avoid any mention of text, typography, words, letters, signatures, or watermarks. The image must be clean and free of any literal text.
8. AESTHETIC DNA ALIGNMENT: You MUST ensure the generated prompts (especially lighting, composition, and color palette) align with the provided CREATOR AESTHETIC DNA. The prompts MUST be "tepat sasaran" based on their portfolio.
9. ${getVariationInstructions(settings.variationLevel)}
10. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure for ${template.name}:
"${template.template}"
Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.
11. FORMATTING: Each prompt MUST be a single, continuous line of text. Do not use line breaks, newlines, or paragraphs within a single prompt.

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

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: { parts: partsSmall },
      config: {
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. 
        CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
        SYNTHESIS BLUEPRINT: ${template.name}.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
        ADOBE STOCK ALGORITHM: Focus on high-demand commercial utility and technical perfection.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    // Strip markdown formatting if present
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    const parsed = extractJSON(text);
    if (Array.isArray(parsed)) {
      return parsed.map(p => typeof p === 'string' ? p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : p);
    }
    return parsed;
  } catch (error) {
    console.error("Prompt generation failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses hasil prompt. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

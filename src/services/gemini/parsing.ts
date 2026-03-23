export function extractJSON(text: string) {
  if (!text) return null;
  
  try {
    // 1. Try direct parse after cleaning markdown
    const cleaned = text.replace(/^```json\s*/g, '').replace(/\s*```$/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // 2. Try to find the first array or object block
    const startArr = text.indexOf('[');
    const endArr = text.lastIndexOf(']');
    const startObj = text.indexOf('{');
    const endObj = text.lastIndexOf('}');
    
    try {
      if (startArr !== -1 && endArr !== -1 && (startObj === -1 || startArr < startObj)) {
        const potentialJson = text.substring(startArr, endArr + 1);
        return JSON.parse(potentialJson);
      } else if (startObj !== -1 && endObj !== -1) {
        const potentialJson = text.substring(startObj, endObj + 1);
        return JSON.parse(potentialJson);
      }
    } catch (innerError) {
      // 3. Last resort: try to clean common JSON errors (like trailing commas)
      try {
        let fallback = text.substring(Math.max(0, startArr, startObj), Math.max(endArr, endObj) + 1);
        fallback = fallback.replace(/,\s*([\]}])/g, '$1'); // Remove trailing commas
        return JSON.parse(fallback);
      } catch (finalError) {
        console.error("JSON Extraction failed. Raw text:", text);
        throw new Error("Could not find valid JSON in response");
      }
    }
    throw new Error("Could not find valid JSON in response");
  }
}

export function zodToJsonSchemaNoSchema(schema: any) {
  return schema; 
}

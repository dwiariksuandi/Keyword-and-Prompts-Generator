export function extractJSON(text: string) {
  try {
    // Clean up markdown if present
    const cleaned = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    return JSON.parse(cleaned);
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

export function zodToJsonSchemaNoSchema(schema: any) {
  return schema; 
}

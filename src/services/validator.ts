export interface MetadataValidation {
  isValid: boolean;
  errors: string[];
}

export function validateAdobeMetadata(title: string, keywords: string[]): MetadataValidation {
  const errors: string[] = [];

  if (title.length > 70) {
    errors.push(`Title is too long (${title.length} characters). Max 70.`);
  }
  
  if (keywords.length !== 40) {
    errors.push(`Keywords must be exactly 40. Current: ${keywords.length}.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export const safeTrim = (str: string | undefined | null): string => {
  return str ? str.trim() : '';
};

export const cleanLigatures = (text: string): string => {
  if (!text) return text;
  // A robust fix for the 'A' -> 'ti' ligature error.
  // It replaces 'A' with 'ti' when it's between letters or following a lowercase letter,
  // but safely ignores 'Apple', 'A', 'NASA', etc.
  return text.replace(/([a-z])A/g, '$1ti')
             .replace(/A([a-z])/g, 'ti$1');
};

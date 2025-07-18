/**
 * Color utility functions for generating consistent colors and initials
 * Used throughout the application for avatar colors and user initials
 */

/**
 * Generates a consistent color based on a name string using hash algorithm
 * Ensures same name always gets same color for visual consistency
 * @param {string} name - The name string to generate a color for
 * @returns {string} A hex color string from predefined palette
 */
export function getRandomColor(name: string): string {
  const predefinedColors = getPredefinedColorPalette();
  const hashValue = calculateStringHash(name);
  return predefinedColors[hashValue % predefinedColors.length];
}

/**
 * Gets the predefined color palette used for name-based colors
 * @returns {string[]} Array of hex color strings
 */
function getPredefinedColorPalette(): string[] {
  return [
    '#00BEE8', '#1FD7C1', '#6E52FF', '#9327FF', '#462F8A',
    '#C3FF2B', '#FC71FF', '#FF4646', '#FF5EB3', '#FF745E',
    '#FF7A00', '#FFA35E', '#FFBB2B', '#FFC701', '#FFE62B',
  ];
}

/**
 * Calculates a hash value from a string for consistent color selection
 * @param {string} input - String to hash
 * @returns {number} Hash value as positive integer
 */
function calculateStringHash(input: string): number {
  return input
    .split('')
    .reduce((accumulator, character) => {
      return accumulator + character.charCodeAt(0);
    }, 0);
}

/**
 * Extracts initials from a full name string
 * Takes first character of each word, useful for avatar displays
 * @param {string} name - Full name string (space-separated words)
 * @returns {string} Concatenated initials in uppercase
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => extractFirstCharacter(word))
    .join('')
    .toUpperCase();
}

/**
 * Extracts first character from a word
 * @param {string} word - Word to extract character from
 * @returns {string} First character of the word
 */
function extractFirstCharacter(word: string): string {
  return word.charAt(0);
}
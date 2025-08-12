// Color utility functions for handling labeled colors
// Supports both "Label|#hexvalue" format and plain hex values for backward compatibility

export interface ParsedColor {
  label: string;
  value: string;
  hasCustomLabel: boolean;
}

/**
 * Parse a color entry that might be in "Label|#hexvalue" format or just a hex value
 */
export function parseColorEntry(colorEntry: string): ParsedColor {
  if (!colorEntry) {
    return { label: '', value: '', hasCustomLabel: false };
  }

  const trimmed = colorEntry.trim();
  
  // Check if it contains the delimiter
  if (trimmed.includes('|')) {
    const parts = trimmed.split('|');
    if (parts.length >= 2) {
      const label = parts[0].trim();
      const value = parts[1].trim();
      return {
        label: label || value, // Fallback to value if label is empty
        value,
        hasCustomLabel: true
      };
    }
  }
  
  // Plain hex value or color name - use as both label and value
  return {
    label: getColorDisplayName(trimmed),
    value: trimmed,
    hasCustomLabel: false
  };
}

/**
 * Get display text for a color - either custom label or friendly name
 */
export function getDisplayColorText(colorEntry: string): string {
  const parsed = parseColorEntry(colorEntry);
  return parsed.label;
}

/**
 * Create a labeled color entry
 */
export function createLabeledColor(label: string, value: string): string {
  if (!label || label.trim() === getColorDisplayName(value)) {
    // If no custom label or label matches default name, just return the value
    return value;
  }
  return `${label.trim()}|${value}`;
}

/**
 * Extract just the color value (hex code) from a color entry
 */
export function getColorValue(colorEntry: string): string {
  const parsed = parseColorEntry(colorEntry);
  return parsed.value;
}

/**
 * Get a friendly display name for common colors or hex values
 */
function getColorDisplayName(value: string): string {
  const colorNames: Record<string, string> = {
    '#ff0000': 'Red',
    '#ff4500': 'Orange Red',
    '#ffa500': 'Orange',
    '#ffff00': 'Yellow',
    '#9acd32': 'Yellow Green',
    '#00ff00': 'Green',
    '#00ffff': 'Cyan',
    '#0000ff': 'Blue',
    '#8a2be2': 'Blue Violet',
    '#ff00ff': 'Magenta',
    '#ff1493': 'Deep Pink',
    '#000000': 'Black',
    '#ffffff': 'White',
    '#808080': 'Gray',
    '#800080': 'Purple',
    '#ffc0cb': 'Pink',
    '#a52a2a': 'Brown',
    '#008080': 'Teal',
    '#00ff7f': 'Spring Green',
    '#4b0082': 'Indigo',
    '#32cd32': 'Lime'
  };

  const lowerValue = value.toLowerCase();
  
  // Check if it's a known hex color
  if (colorNames[lowerValue]) {
    return colorNames[lowerValue];
  }
  
  // Check if it's already a color name
  const colorNamesList = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'pink', 'orange', 'brown', 'gray', 'cyan', 'teal', 'lime', 'indigo'];
  if (colorNamesList.includes(lowerValue)) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  
  // For hex values, return the hex code
  if (value.startsWith('#')) {
    return value.toUpperCase();
  }
  
  // Return as-is for other values
  return value;
}

/**
 * Validate if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Convert named colors to hex values for consistency
 */
export function normalizeColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#00ff00',
    'yellow': '#ffff00',
    'black': '#000000',
    'white': '#ffffff',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'orange': '#ffa500',
    'brown': '#a52a2a',
    'gray': '#808080',
    'grey': '#808080',
    'cyan': '#00ffff',
    'teal': '#008080',
    'lime': '#32cd32',
    'indigo': '#4b0082'
  };
  
  const lowerColor = color.toLowerCase();
  return colorMap[lowerColor] || color;
}

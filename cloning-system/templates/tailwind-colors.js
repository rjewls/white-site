// Custom color schemes for different boutique brands
// Use these examples to customize your Tailwind CSS configuration

// Example 1: Rose & Gold Boutique
export const roseGoldTheme = {
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',  // Main brand color
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843'
    },
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Gold accent
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    }
  },
  gradients: {
    'primary-soft': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    'primary-bold': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'accent-warm': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
  }
};

// Example 2: Ocean Blue Boutique
export const oceanBlueTheme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main brand color
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    accent: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',  // Teal accent
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b'
    }
  },
  gradients: {
    'primary-soft': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    'primary-bold': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'accent-fresh': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
  }
};

// Example 3: Purple Luxury Boutique
export const purpleLuxuryTheme = {
  colors: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',  // Main brand color
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87'
    },
    accent: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',  // Gold accent
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12'
    }
  },
  gradients: {
    'primary-soft': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    'primary-bold': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    'accent-luxury': 'linear-gradient(135deg, #facc15 0%, #eab308 100%)'
  }
};

// Example 4: Elegant Black & White
export const elegantMonochromeTheme = {
  colors: {
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',  // Main brand color
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    accent: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',  // Gray accent
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b'
    }
  },
  gradients: {
    'primary-soft': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    'primary-bold': 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    'accent-elegant': 'linear-gradient(135deg, #71717a 0%, #52525b 100%)'
  }
};

// Helper function to generate Tailwind config
export const generateTailwindColors = (theme) => {
  return {
    extend: {
      colors: {
        primary: theme.colors.primary,
        accent: theme.colors.accent,
        brand: {
          primary: theme.colors.primary[500],
          secondary: theme.colors.accent[500]
        }
      },
      backgroundImage: theme.gradients
    }
  };
};

// Usage example:
// In your tailwind.config.ts file:
// 
// import { roseGoldTheme, generateTailwindColors } from './cloning-system/templates/tailwind-colors.js';
// 
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: generateTailwindColors(roseGoldTheme),
//   plugins: []
// };

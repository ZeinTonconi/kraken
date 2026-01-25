export const theme = {
  colors: {
    // Brand
    primary: '#2F80ED',
    primaryDark: '#1C5DB6',
    secondary: '#27AE60',
    secondaryDark: '#1E874B',

    // Backgrounds
    background: '#F5FAFF',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF4F8',

    // Text
    textPrimary: '#1F2D3D',
    textSecondary: '#5F6F81',
    textMuted: '#8A99A8',

    // Borders
    border: '#DCE6F0',
    borderMuted: '#E9F0F6',

    // States
    success: '#27AE60',
    warning: '#F2C94C',
    error: '#EB5757',
    info: '#2F80ED',
  },

  radii: {
    pill: '999px',
    card: '20px',
    input: '12px',
  },

  shadow: {
    card: '0 10px 30px rgba(47,128,237,0.08)',
    soft: '0 4px 12px rgba(0,0,0,0.06)',
  },
};

export type Theme = typeof theme;

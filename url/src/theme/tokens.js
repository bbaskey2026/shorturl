// Exact Muse.ai Inspected Design Tokens & Theme Engine
// Extracted directly from https://muse.ai/ computed styles and CSS assets
export const tokens = {
  dark: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#0074E4', // Muse.ai signature action blue
        light: '#2E8FFF',
        dark: '#0059D4',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#323435', // Muse elevated surface
        light: '#3E4143',
        dark: '#252628',
        contrastText: '#FFFFFF',
      },
      accent: {
        blue: '#0074E4',
        green: '#00A919',
        orange: '#F86A00',
        red: '#F20039',
      },
      background: {
        default: '#17171A', // Muse.ai page background
        surface: '#1F1F20', // Muse sidebar and panels
        paper: '#252628',   // Muse card fill & chat bubble
        card: '#252628',    // Muse bento card fill
        elevated: '#323435', // Muse hover & elevated button fill
        hover: 'rgba(255, 255, 255, 0.05)',
        active: 'rgba(255, 255, 255, 0.09)',
        backdrop: 'rgba(23, 23, 26, 0.80)',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#A0A4A8',
        muted: '#707477',
        disabled: '#4B4D50',
      },
      border: {
        subtle: 'rgba(255, 255, 255, 0.08)',
        medium: 'rgba(255, 255, 255, 0.14)',
        strong: 'rgba(255, 255, 255, 0.22)',
        focus: '#0074E4',
      },
      status: {
        success: '#00A919',
        successBg: 'rgba(0, 169, 25, 0.12)',
        warning: '#F86A00',
        warningBg: 'rgba(248, 106, 0, 0.12)',
        error: '#F20039',
        errorBg: 'rgba(242, 0, 57, 0.12)',
        info: '#0074E4',
        infoBg: 'rgba(0, 116, 228, 0.12)',
      },
    },
    shadows: {
      card: '0 1px 3px rgba(0, 0, 0, 0.3), 0 6px 20px -4px rgba(0, 0, 0, 0.4)',
      cardHover: '0 4px 12px rgba(0, 0, 0, 0.4), 0 16px 32px -4px rgba(0, 0, 0, 0.5)',
      dropdown: '0 12px 36px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      glow: '0 0 20px rgba(0, 116, 228, 0.25)',
    },
  },
  light: {
    palette: {
      mode: 'light',
      primary: {
        main: '#0074E4', // Muse.ai signature action blue
        light: '#2E8FFF',
        dark: '#0059D4',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#E9EAEB',
        light: '#F3F4F5',
        dark: '#D1D3D5',
        contrastText: '#111112',
      },
      accent: {
        blue: '#0074E4',
        green: '#008332',
        orange: '#CB4E00',
        red: '#CB0021',
      },
      background: {
        default: '#FCFCFC', // Muse.ai light page background
        surface: '#F3F4F5', // Muse light sidebar & panels
        paper: '#FFFFFF',   // Muse light card fill
        card: '#FFFFFF',
        elevated: '#E9EAEB',
        hover: 'rgba(0, 0, 0, 0.04)',
        active: 'rgba(0, 0, 0, 0.08)',
        backdrop: 'rgba(252, 252, 252, 0.85)',
      },
      text: {
        primary: '#111112', // Muse primary dark text
        secondary: '#5C5E61',
        muted: '#8E9296',
        disabled: '#C1C4C7',
      },
      border: {
        subtle: 'rgba(0, 0, 0, 0.08)',
        medium: 'rgba(0, 0, 0, 0.14)',
        strong: 'rgba(0, 0, 0, 0.22)',
        focus: '#0074E4',
      },
      status: {
        success: '#008332',
        successBg: '#E5F9E3',
        warning: '#CB4E00',
        warningBg: '#FFF2E5',
        error: '#CB0021',
        errorBg: '#FFF0F2',
        info: '#0074E4',
        infoBg: '#EBF5FF',
      },
    },
    shadows: {
      card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.06)',
      cardHover: '0 4px 16px -2px rgba(0, 0, 0, 0.08), 0 16px 36px -4px rgba(0, 0, 0, 0.1)',
      dropdown: '0 10px 30px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      glow: '0 0 20px rgba(0, 116, 228, 0.15)',
    },
  },
  shortie: {
    palette: {
      mode: 'dark',
      primary: {
        main: '#0055FF', // Shortie signature electric blue (Image 1)
        light: '#2563EB',
        dark: '#003ECC',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#1E243A',
        light: '#293252',
        dark: '#141829',
        contrastText: '#FFFFFF',
      },
      accent: {
        blue: '#0055FF',
        green: '#10B981',
        orange: '#F59E0B',
        red: '#EF4444',
      },
      background: {
        default: '#0E1322', // Shortie dark navy
        surface: '#151C30',
        paper: '#1C243D',
        card: '#1C243D',
        elevated: '#273254',
        hover: 'rgba(255, 255, 255, 0.06)',
        active: 'rgba(255, 255, 255, 0.10)',
        backdrop: 'rgba(14, 19, 34, 0.85)',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        muted: '#64748B',
        disabled: '#475569',
      },
      border: {
        subtle: 'rgba(255, 255, 255, 0.10)',
        medium: 'rgba(255, 255, 255, 0.18)',
        strong: 'rgba(255, 255, 255, 0.28)',
        focus: '#0055FF',
      },
      status: {
        success: '#10B981',
        successBg: 'rgba(16, 185, 129, 0.14)',
        warning: '#F59E0B',
        warningBg: 'rgba(245, 158, 11, 0.14)',
        error: '#EF4444',
        errorBg: 'rgba(239, 68, 68, 0.14)',
        info: '#0055FF',
        infoBg: 'rgba(0, 85, 255, 0.14)',
      },
    },
    shadows: {
      card: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      cardHover: '0 10px 30px -4px rgba(0, 85, 255, 0.25), 0 0 0 1px rgba(0, 85, 255, 0.4)',
      dropdown: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      glow: '0 0 25px rgba(0, 85, 255, 0.35)',
    },
  },
  tinu: {
    palette: {
      mode: 'light',
      primary: {
        main: '#16A34A', // Tinu signature fresh forest/lime green (Image 2)
        light: '#22C55E',
        dark: '#15803D',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#EFE7DC',
        light: '#F5EDE2',
        dark: '#E2D8CA',
        contrastText: '#18181B',
      },
      accent: {
        blue: '#2563EB',
        green: '#16A34A',
        orange: '#EA580C',
        red: '#DC2626',
      },
      background: {
        default: '#FBF8F3', // Warm editorial sand/cream
        surface: '#F4EDE4', // Soft beige surface
        paper: '#FFFFFF',   // White crisp cards
        card: '#FFFFFF',
        elevated: '#ECE3D6',
        hover: 'rgba(0, 0, 0, 0.04)',
        active: 'rgba(0, 0, 0, 0.08)',
        backdrop: 'rgba(251, 248, 243, 0.88)',
      },
      text: {
        primary: '#18181B', // Deep editorial charcoal
        secondary: '#52525B',
        muted: '#71717A',
        disabled: '#A1A1AA',
      },
      border: {
        subtle: 'rgba(0, 0, 0, 0.08)',
        medium: 'rgba(0, 0, 0, 0.15)',
        strong: 'rgba(0, 0, 0, 0.25)',
        focus: '#16A34A',
      },
      status: {
        success: '#16A34A',
        successBg: '#DCFCE7',
        warning: '#D97706',
        warningBg: '#FEF3C7',
        error: '#DC2626',
        errorBg: '#FEE2E2',
        info: '#2563EB',
        infoBg: '#DBEAFE',
      },
    },
    shadows: {
      card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 12px 24px -6px rgba(0, 0, 0, 0.06)',
      cardHover: '0 6px 20px -2px rgba(22, 163, 74, 0.15), 0 16px 36px -4px rgba(0, 0, 0, 0.08)',
      dropdown: '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      glow: '0 0 20px rgba(34, 197, 94, 0.2)',
    },
  },
  typography: {
    fontFamily: '"optimisticAI", "Optimistic", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    bodyFamily: '"optimisticText", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    codeFamily: '"optimisticMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  shape: {
    borderRadiusSm: '4px',
    borderRadiusMd: '6px',
    borderRadiusLg: '10px',
    borderRadiusXl: '12px',
    borderRadius2xl: '16px',
    borderRadiusFull: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

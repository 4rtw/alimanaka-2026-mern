// Malagasy month names
export const MALAGASY_MONTHS = [
  'Janoary', 'Febroary', 'Marsa', 'Aprily', 'Mey', 'Jona',
  'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'
];

// English month keys used by the API/database
export const API_MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

// Liturgical season colors
export const LITURGICAL_COLORS = {
  white: { bg: '#fafafa', border: '#f5f5f5', label: 'Fotsy' },
  green: { bg: '#a5d6a7', border: '#66bb6a', label: 'Maitso' },
  red:   { bg: '#ef9a9a', border: '#e57373', label: 'Mena' },
  purple:{ bg: '#ce93d8', border: '#ba68c8', label: 'Volomparasy' },
  brown: { bg: '#bcaaa4', border: '#a1887f', label: 'Volon-davenona' },
  yellow:{ bg: '#fff59d', border: '#fff176', label: 'Mavo' },
  black: { bg: '#bdbdbd', border: '#9e9e9e', label: 'Mainty' },
};

export const DEFAULT_ACCENT = '#e26f5a';
export const SCROLL_DELAY_MS = 500;
export const API_TIMEOUT_MS = 10000;

// Configurable liturgical year (default: current Gregorian year)
export const LITURGICAL_YEAR = parseInt(process.env.LITURGICAL_YEAR) || new Date().getFullYear();

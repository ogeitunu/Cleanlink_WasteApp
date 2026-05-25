// Central asset configuration for CleanLinka
// This ensures all assets are properly typed and imported

export const images = {
  logo: require('@/assets/images/logo.jpg'),
  emptyBox: require('@/assets/images/logo.jpg'), // Fallback to logo
  noData: require('@/assets/images/logo.jpg'),
  avatar: require('@/assets/images/logo.jpg'),
  wasteBin: require('@/assets/images/logo.jpg'),
  recycle: require('@/assets/images/logo.jpg'),
};

// Placeholder animations - using color indicators instead
export const animations = {
  loading: null, // Will use ActivityIndicator
  success: null, // Will use checkmark icon
  empty: null, // Will use empty state icon
  truck: null, // Will use truck icon
};

export const colors = {
  primary: '#0B6B3A',
  primaryLight: '#E8F5EC',
  accent: '#F47B20',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  disabled: '#CCCCCC',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

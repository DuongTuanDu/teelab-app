import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text, View, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Variant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'info' 
  | 'dark' 
  | 'light'
  | 'outline-primary' 
  | 'outline-secondary' 
  | 'outline-danger' 
  | 'outline-success' 
  | 'outline-warning' 
  | 'outline-info' 
  | 'outline-dark'
  | 'ghost-primary' 
  | 'ghost-secondary' 
  | 'ghost-danger' 
  | 'ghost-success' 
  | 'ghost-warning' 
  | 'ghost-info' 
  | 'ghost-dark'
  | 'link'
  | string;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string;
  elevation?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  label,
  icon,
  iconPosition = 'left',
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  rounded = false,
  className = '',
  elevation,
}) => {
  // Solid variants styling
  const solidVariants = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    danger: 'bg-red-600 active:bg-red-700',
    success: 'bg-green-600 active:bg-green-700',
    warning: 'bg-yellow-500 active:bg-yellow-600',
    info: 'bg-cyan-500 active:bg-cyan-600',
    dark: 'bg-gray-800 active:bg-gray-900',
    light: 'bg-gray-100 active:bg-gray-200',
  };

  // Outline variants styling
  const outlineVariants = {
    'outline-primary': 'bg-transparent border border-blue-600',
    'outline-secondary': 'bg-transparent border border-gray-600',
    'outline-danger': 'bg-transparent border border-red-600',
    'outline-success': 'bg-transparent border border-green-600',
    'outline-warning': 'bg-transparent border border-yellow-500',
    'outline-info': 'bg-transparent border border-cyan-500',
    'outline-dark': 'bg-transparent border border-gray-800',
  };

  // Ghost variants styling
  const ghostVariants = {
    'ghost-primary': 'bg-blue-50 active:bg-blue-100',
    'ghost-secondary': 'bg-gray-50 active:bg-gray-100',
    'ghost-danger': 'bg-red-50 active:bg-red-100',
    'ghost-success': 'bg-green-50 active:bg-green-100',
    'ghost-warning': 'bg-yellow-50 active:bg-yellow-100',
    'ghost-info': 'bg-cyan-50 active:bg-cyan-100',
    'ghost-dark': 'bg-gray-50 active:bg-gray-100',
    'link': 'bg-transparent underline',
  };

  // Combine all variants
  const variants = {
    ...solidVariants,
    ...outlineVariants,
    ...ghostVariants,
  };

  // Text colors based on variant
  const textColors = {
    // Solid variants
    primary: 'text-white',
    secondary: 'text-white',
    danger: 'text-white',
    success: 'text-white',
    warning: 'text-gray-900',
    info: 'text-white',
    dark: 'text-white',
    light: 'text-gray-900',
    
    // Outline variants
    'outline-primary': 'text-blue-600',
    'outline-secondary': 'text-gray-600',
    'outline-danger': 'text-red-600',
    'outline-success': 'text-green-600',
    'outline-warning': 'text-yellow-500',
    'outline-info': 'text-cyan-500',
    'outline-dark': 'text-gray-800',
    
    // Ghost variants
    'ghost-primary': 'text-blue-600',
    'ghost-secondary': 'text-gray-600',
    'ghost-danger': 'text-red-600',
    'ghost-success': 'text-green-600',
    'ghost-warning': 'text-yellow-500',
    'ghost-info': 'text-cyan-500',
    'ghost-dark': 'text-gray-800',
    'link': 'text-blue-600',
  };

  // Icon colors based on variant
  const iconColors = {
    // Solid variants
    primary: 'white',
    secondary: 'white',
    danger: 'white',
    success: 'white',
    warning: '#1f2937',
    info: 'white',
    dark: 'white',
    light: '#1f2937',
    
    // Outline variants
    'outline-primary': '#2563eb',
    'outline-secondary': '#4b5563',
    'outline-danger': '#dc2626',
    'outline-success': '#16a34a',
    'outline-warning': '#f59e0b',
    'outline-info': '#06b6d4',
    'outline-dark': '#1f2937',
    
    // Ghost variants
    'ghost-primary': '#2563eb',
    'ghost-secondary': '#4b5563',
    'ghost-danger': '#dc2626',
    'ghost-success': '#16a34a',
    'ghost-warning': '#f59e0b',
    'ghost-info': '#06b6d4',
    'ghost-dark': '#1f2937',
    'link': '#2563eb',
  };

  // Size styling
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-4 text-xl',
  };

  // Icon sizes based on button size
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  // Get the correct styling
  const variantClass = variants[variant as keyof typeof variants] || variant; // Fallback to custom classes
  const textColorClass = textColors[variant as keyof typeof textColors] || 'text-white';
  const iconColor = iconColors[variant as keyof typeof iconColors] || 'white';
  const sizeClass = sizes[size];
  const iconSize = iconSizes[size];
  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Shadow effect for elevated look - exclude outline, ghost and link variants
  const isFlat = variant.startsWith('outline-') || variant.startsWith('ghost-') || variant === 'link';
  const shadowClass = !isFlat ? 'shadow-md' : '';

  // Determine specific elevation
  const buttonElevation = elevation !== undefined ? elevation : (isFlat ? 0 : 2);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      className={`flex-row items-center justify-center ${sizeClass} ${variantClass} ${roundedClass} ${widthClass} ${shadowClass} ${disabled ? 'opacity-50' : 'active:opacity-90'} ${className}`}
      style={{
        elevation: buttonElevation,
      }}
    >
      {loading ? (
        <ActivityIndicator 
          color={isFlat ? iconColor : (variant === 'light' ? '#1f2937' : '#fff')} 
          size={iconSize} 
        />
      ) : (
        <View className={`flex-row items-center ${iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          {icon && (
            <Ionicons 
              name={icon} 
              size={iconSize} 
              color={iconColor} 
              style={{ marginRight: iconPosition === 'left' && label ? 8 : 0, marginLeft: iconPosition === 'right' && label ? 8 : 0 }} 
            />
          )}
          {label && <Text className={`font-semibold ${textColorClass}`}>{label}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
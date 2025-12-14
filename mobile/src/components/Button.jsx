import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  ...props
}) {
  const variantStyles = {
    primary: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
    secondary: { backgroundColor: '#e2e8f0', borderColor: '#e2e8f0' },
    danger: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
    success: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
    outline: { backgroundColor: 'transparent', borderColor: '#2563eb', borderWidth: 2 },
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 },
  };

  const textColor = variant === 'outline' ? '#2563eb' : variant === 'secondary' ? '#1e293b' : '#ffffff';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize: sizeStyles[size].fontSize }]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});


import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, typography, layout } from '../styles';

export default function Button({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  style,
  textStyle,
  variant = 'primary' // primary, secondary, outline
}) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.outlineButtonText, textStyle];
      default:
        return [styles.buttonText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.white} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: layout.spacing.medium,
    paddingHorizontal: layout.spacing.large,
    borderRadius: layout.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '600',
  },
  outlineButtonText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: '600',
  },
});


/**
 * CustomButton Component - Botão Dinâmico por Tenant
 * 
 * Componente de botão reutilizável que se adapta automaticamente
 * ao tema e cores do tenant ativo.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: CustomButtonProps) {
  const { colors } = useTheme();

  /**
   * Determina as cores do botão baseado na variante
   */
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          textColor: colors.background,
          borderColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          textColor: colors.background,
          borderColor: colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: colors.text,
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary,
          textColor: colors.background,
          borderColor: colors.primary,
        };
    }
  };

  /**
   * Determina o tamanho do botão
   */
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, height: 36 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16, height: 48 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18, height: 56 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16, height: 48 };
    }
  };

  const buttonColors = getButtonColors();
  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColors.backgroundColor,
          borderColor: buttonColors.borderColor,
          paddingVertical: buttonSize.paddingVertical,
          paddingHorizontal: buttonSize.paddingHorizontal,
          height: buttonSize.height,
        },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={buttonColors.textColor} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              {
                color: buttonColors.textColor,
                fontSize: buttonSize.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    marginLeft: 8,
  },
});
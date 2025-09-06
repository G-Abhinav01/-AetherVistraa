import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { darkTheme } from '../constants/theme';

interface CustomButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  label: string;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  color?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  mode = 'contained',
  onPress,
  label,
  icon,
  loading = false,
  disabled = false,
  style,
  labelStyle,
  color = darkTheme?.colors?.primary || '#6200ee',
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={icon}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      labelStyle={[styles.label, labelStyle]}
      buttonColor={color}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
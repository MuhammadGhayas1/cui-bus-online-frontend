import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'info' }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: '#10B98120', text: '#10B981', border: '#10B98150' };
      case 'warning':
        return { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B50' };
      case 'danger':
        return { bg: '#EF444420', text: '#EF4444', border: '#EF444450' };
      case 'info':
      default:
        return { bg: '#3B82F620', text: '#60A5FA', border: '#3B82F650' };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: styleConfig.bg, borderColor: styleConfig.border },
      ]}
    >
      <Text style={[styles.text, { color: styleConfig.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

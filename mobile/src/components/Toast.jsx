import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Toast({ message, type = 'info', visible, onHide }) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const typeStyles = {
    success: { backgroundColor: '#16a34a', icon: 'checkmark-circle' },
    error: { backgroundColor: '#dc2626', icon: 'close-circle' },
    info: { backgroundColor: '#2563eb', icon: 'information-circle' },
    warning: { backgroundColor: '#ea580c', icon: 'warning' },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: style.backgroundColor }]}>
      <Ionicons name={style.icon} size={20} color="#ffffff" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});


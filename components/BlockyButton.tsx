import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface BlockyButtonProps {
  text: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
}

const BlockyButton: React.FC<BlockyButtonProps> = ({ text, onPress, color = '#00ccff', style }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }, style]} onPress={onPress}>
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
});

export default BlockyButton;

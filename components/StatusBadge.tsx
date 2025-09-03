import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DonationStatus } from '../context/DonationsContext';

const statusColors: Record<DonationStatus, string> = {
  'LISTED': '#00ccff',
  'RESERVED': '#ff0066',
  'ASSIGNED': '#ffcc00',
  'PICKED UP': '#000',
  'DELIVERED': '#00cc66',
};

const textColors: Record<DonationStatus, string> = {
  'LISTED': '#000',
  'RESERVED': '#fff',
  'ASSIGNED': '#000',
  'PICKED UP': '#fff',
  'DELIVERED': '#fff',
};

const StatusBadge: React.FC<{ status: DonationStatus }> = ({ status }) => (
  <View style={[styles.badge, { backgroundColor: statusColors[status] }]}> 
    <Text style={[styles.text, { color: textColors[status] }]}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default StatusBadge;

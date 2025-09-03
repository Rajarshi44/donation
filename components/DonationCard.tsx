import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Donation } from '../context/DonationsContext';
import StatusBadge from './StatusBadge';

const emojiMap: Record<string, string> = {
  'Pizza': '🍕',
  'Salad': '🥗',
  'Bread': '🍞',
  'Fruit': '🍎',
  'Box': '📦',
  'Pack': '📦',
};

const getEmoji = (title: string) => {
  for (const key in emojiMap) {
    if (title.includes(key)) return emojiMap[key];
  }
  return '🍽️';
};

const DonationCard: React.FC<{ donation: Donation }> = ({ donation }) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.emoji}>{getEmoji(donation.title)}</Text>
      <StatusBadge status={donation.status} />
    </View>
    <Image source={{ uri: donation.image }} style={styles.image} />
    <Text style={styles.title}>{donation.title}</Text>
    <Text style={styles.info}>Qty: {donation.quantity}</Text>
    <Text style={styles.info}>Address: {donation.address}</Text>
    <Text style={styles.info}>Time: {donation.timeWindow}</Text>
    {donation.notes ? <Text style={styles.notes}>📝 {donation.notes}</Text> : null}
    {donation.ngo && <Text style={styles.info}>NGO: {donation.ngo}</Text>}
    {donation.driver && <Text style={styles.info}>Driver: {donation.driver}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffcc00',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 18,
    marginVertical: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emoji: { fontSize: 36, marginRight: 8 },
  image: { width: '100%', height: 120, borderRadius: 10, marginVertical: 8, borderWidth: 2, borderColor: '#000' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#000', marginVertical: 4 },
  info: { fontSize: 18, color: '#000', marginVertical: 2 },
  notes: { fontSize: 16, color: '#ff0066', marginTop: 4, fontStyle: 'italic' },
});

export default DonationCard;

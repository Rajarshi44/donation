import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DonationCard from '../../components/DonationCard';
import { useDonations } from '../../context/DonationsContext';

const colors = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  accent: '#FFE66D',
  success: '#4ECDC4',
  danger: '#FF5E5B',
  dark: '#2C3E50',
  light: '#ECF0F1',
  white: '#FFFFFF',
};

const foodCategories = [
  { id: 'prepared', name: 'Prepared Food', icon: 'restaurant', color: colors.primary },
  { id: 'fresh', name: 'Fresh Produce', icon: 'leaf', color: colors.success },
  { id: 'packaged', name: 'Packaged Foods', icon: 'gift', color: colors.secondary },
  { id: 'dairy', name: 'Dairy Products', icon: 'water', color: colors.accent },
  { id: 'bakery', name: 'Bakery Items', icon: 'cafe', color: colors.danger },
];

const urgencyLevels = [
  { id: 'low', name: 'Within 24 hours', color: colors.success },
  { id: 'medium', name: 'Within 12 hours', color: colors.secondary },
  { id: 'high', name: 'Within 6 hours', color: colors.danger },
  { id: 'urgent', name: 'Immediate pickup', color: colors.dark },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect }) => (
  <View style={styles.categoryContainer}>
    <Text style={styles.sectionLabel}>Food Category</Text>
    <View style={styles.categoryGrid}>
      {foodCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            { 
              borderColor: category.color,
              backgroundColor: selectedCategory === category.id ? category.color + '20' : colors.white 
            }
          ]}
          onPress={() => onSelect(category.id)}
        >
          <Ionicons name={category.icon as any} size={24} color={category.color} />
          <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
          {selectedCategory === category.id && (
            <View style={[styles.selectedMark, { backgroundColor: category.color }]}>
              <Ionicons name="checkmark" size={12} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

interface UrgencySelectorProps {
  selectedUrgency: string;
  onSelect: (urgency: string) => void;
}

const UrgencySelector: React.FC<UrgencySelectorProps> = ({ selectedUrgency, onSelect }) => (
  <View style={styles.urgencyContainer}>
    <Text style={styles.sectionLabel}>Pickup Urgency</Text>
    {urgencyLevels.map((level) => (
      <TouchableOpacity
        key={level.id}
        style={[
          styles.urgencyItem,
          { 
            borderColor: level.color,
            backgroundColor: selectedUrgency === level.id ? level.color + '20' : colors.white 
          }
        ]}
        onPress={() => onSelect(level.id)}
      >
        <View style={[styles.urgencyDot, { backgroundColor: level.color }]} />
        <Text style={styles.urgencyText}>{level.name}</Text>
        {selectedUrgency === level.id && (
          <Ionicons name="checkmark-circle" size={20} color={level.color} />
        )}
      </TouchableOpacity>
    ))}
  </View>
);

const DonorScreen = () => {
  const { donations, createDonation } = useDonations();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    quantity: '',
    address: '',
    timeWindow: '',
    notes: '',
    category: '',
    urgency: '',
    contactNumber: '',
    specialInstructions: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    if (!form.title || !form.quantity || !form.address || !form.timeWindow || !form.category || !form.urgency) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    createDonation({
      ...form,
    });
    
    setForm({ 
      title: '', 
      quantity: '', 
      address: '', 
      timeWindow: '', 
      notes: '', 
      category: '',
      urgency: '',
      contactNumber: '',
      specialInstructions: '',
    });
    setShowForm(false);
    Alert.alert('Success!', 'Your food donation has been listed successfully!');
  };

  const quickDonationTemplates = [
    { 
      title: 'Restaurant Surplus', 
      category: 'prepared', 
      urgency: 'medium',
      icon: 'restaurant'
    },
    { 
      title: 'Fresh Vegetables', 
      category: 'fresh', 
      urgency: 'low',
      icon: 'leaf'
    },
    { 
      title: 'Bakery Items', 
      category: 'bakery', 
      urgency: 'high',
      icon: 'cafe'
    },
  ];

  const fillTemplate = (template: any) => {
    setForm({
      ...form,
      title: template.title,
      category: template.category,
      urgency: template.urgency,
    });
    setShowForm(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Donations</Text>
        <Text style={styles.headerSubtitle}>Share your surplus, feed the community</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.templatesGrid}>
            {quickDonationTemplates.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateCard}
                onPress={() => fillTemplate(template)}
              >
                <Ionicons name={template.icon as any} size={32} color={colors.primary} />
                <Text style={styles.templateTitle}>{template.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add-circle" size={24} color={colors.white} />
          <Text style={styles.createButtonText}>Create New Donation</Text>
        </TouchableOpacity>

        <View style={styles.donationsSection}>
          <Text style={styles.sectionTitle}>My Active Donations</Text>
          {donations.filter(d => !d.ngo || d.status === 'LISTED').length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={colors.light} />
              <Text style={styles.emptyText}>No active donations</Text>
              <Text style={styles.emptySubtext}>Create your first food donation to get started</Text>
            </View>
          ) : (
            donations.filter(d => !d.ngo || d.status === 'LISTED').map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color={colors.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Food Donation</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Donation Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Fresh sandwiches from lunch event"
                value={form.title}
                onChangeText={v => handleChange('title', v)}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity/Servings *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 20 servings, 5 boxes"
                value={form.quantity}
                onChangeText={v => handleChange('quantity', v)}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <CategorySelector 
              selectedCategory={form.category}
              onSelect={(category) => handleChange('category', category)}
            />

            <UrgencySelector 
              selectedUrgency={form.urgency}
              onSelect={(urgency) => handleChange('urgency', urgency)}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pickup Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Full address for pickup"
                value={form.address}
                onChangeText={v => handleChange('address', v)}
                multiline
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available Time Window *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Today 2-6 PM, Tomorrow morning"
                value={form.timeWindow}
                onChangeText={v => handleChange('timeWindow', v)}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Your contact number"
                value={form.contactNumber}
                onChangeText={v => handleChange('contactNumber', v)}
                keyboardType="phone-pad"
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Special Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special handling instructions, storage requirements, etc."
                value={form.specialInstructions}
                onChangeText={v => handleChange('specialInstructions', v)}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional information about the donation"
                value={form.notes}
                onChangeText={v => handleChange('notes', v)}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Create Donation</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.dark,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  templateCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  templateTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  donationsSection: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.light,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  selectedMark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyContainer: {
    marginBottom: 20,
  },
  urgencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  urgencyText: {
    fontSize: 16,
    color: colors.dark,
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DonorScreen;

import { useAuth } from '@/context/AuthContext';
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

interface RequestForm {
  location: string;
  families: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  requirements: string;
  contactPerson: string;
  deadline: string;
}

const urgencyLevels = [
  { id: 'low', name: 'Low Priority', color: colors.success, description: 'Within 2 days' },
  { id: 'medium', name: 'Medium Priority', color: colors.secondary, description: 'Within 1 day' },
  { id: 'high', name: 'High Priority', color: colors.danger, description: 'Within 6 hours' },
  { id: 'urgent', name: 'Urgent', color: colors.dark, description: 'Immediate assistance needed' },
];

const NGOScreen = () => {
  const { donations, updateDonationStatus } = useDonations();
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'reserved' | 'requests'>('available');
  const [requestForm, setRequestForm] = useState<RequestForm>({
    location: '',
    families: '',
    urgency: 'medium',
    requirements: '',
    contactPerson: '',
    deadline: '',
  });

  const NGO_NAME = user?.name || 'Hope Foundation';
  const available = donations.filter(d => d.status === 'LISTED');
  const reserved = donations.filter(d => d.status === 'RESERVED' && d.ngo === NGO_NAME);

  const handleReserve = (donationId: string) => {
    Alert.alert(
      'Reserve Donation',
      'Are you sure you want to reserve this donation for your NGO?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reserve',
          onPress: () => {
            updateDonationStatus(donationId, 'RESERVED', NGO_NAME);
            Alert.alert('Success!', 'Donation reserved successfully. Please coordinate pickup with the donor.');
          }
        }
      ]
    );
  };

  const handleCreateRequest = () => {
    if (!requestForm.location || !requestForm.families || !requestForm.contactPerson) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert('Request Created!', 'Your food assistance request has been submitted successfully.');
    setRequestForm({
      location: '',
      families: '',
      urgency: 'medium',
      requirements: '',
      contactPerson: '',
      deadline: '',
    });
    setShowRequestForm(false);
  };

  const TabButton = ({ tab, title, icon, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.tabButton, { backgroundColor: isActive ? colors.primary : colors.white }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={isActive ? colors.white : colors.primary} />
      <Text style={[styles.tabText, { color: isActive ? colors.white : colors.primary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NGO Dashboard</Text>
        <Text style={styles.headerSubtitle}>{NGO_NAME}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="list"
          value={available.length}
          label="Available"
          color={colors.success}
        />
        <StatCard
          icon="bookmark"
          value={reserved.length}
          label="Reserved"
          color={colors.secondary}
        />
        <StatCard
          icon="people"
          value="156"
          label="Families Served"
          color={colors.primary}
        />
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          tab="available"
          title="Available"
          icon="list"
          isActive={activeTab === 'available'}
          onPress={() => setActiveTab('available')}
        />
        <TabButton
          tab="reserved"
          title="Reserved"
          icon="bookmark"
          isActive={activeTab === 'reserved'}
          onPress={() => setActiveTab('reserved')}
        />
        <TabButton
          tab="requests"
          title="Requests"
          icon="add-circle"
          isActive={activeTab === 'requests'}
          onPress={() => setActiveTab('requests')}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'available' && (
          <View>
            {available.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={64} color={colors.light} />
                <Text style={styles.emptyText}>No donations available</Text>
                <Text style={styles.emptySubtext}>Check back later for new food donations</Text>
              </View>
            ) : (
              available.map(donation => (
                <View key={donation.id} style={styles.donationItem}>
                  <DonationCard donation={donation} />
                  <TouchableOpacity
                    style={styles.reserveButton}
                    onPress={() => handleReserve(donation.id)}
                  >
                    <Ionicons name="bookmark-outline" size={20} color={colors.white} />
                    <Text style={styles.reserveButtonText}>Reserve for Distribution</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'reserved' && (
          <View>
            {reserved.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={64} color={colors.light} />
                <Text style={styles.emptyText}>No reserved donations</Text>
                <Text style={styles.emptySubtext}>Reserve donations from the Available tab</Text>
              </View>
            ) : (
              reserved.map(donation => (
                <View key={donation.id} style={styles.donationItem}>
                  <DonationCard donation={donation} />
                  <View style={styles.reservedActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="call" size={16} color={colors.primary} />
                      <Text style={styles.actionText}>Contact Donor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="car" size={16} color={colors.secondary} />
                      <Text style={styles.actionText}>Arrange Pickup</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'requests' && (
          <View>
            <TouchableOpacity
              style={styles.createRequestButton}
              onPress={() => setShowRequestForm(true)}
            >
              <Ionicons name="add-circle" size={24} color={colors.white} />
              <Text style={styles.createRequestText}>Create Food Request</Text>
            </TouchableOpacity>

            <View style={styles.requestsSection}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <View style={styles.requestItem}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestLocation}>Downtown Shelter</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: colors.danger }]}>
                    <Text style={styles.urgencyText}>HIGH</Text>
                  </View>
                </View>
                <Text style={styles.requestDetails}>25 families • Immediate assistance needed</Text>
                <Text style={styles.requestTime}>Posted 2 hours ago</Text>
              </View>
              
              <View style={styles.requestItem}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestLocation}>Community Center</Text>
                  <View style={[styles.urgencyBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.urgencyText}>MEDIUM</Text>
                  </View>
                </View>
                <Text style={styles.requestDetails}>15 families • Regular food distribution</Text>
                <Text style={styles.requestTime}>Posted 5 hours ago</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showRequestForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRequestForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowRequestForm(false)}>
              <Ionicons name="close" size={24} color={colors.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Food Request</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location/Center Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Downtown Community Center"
                value={requestForm.location}
                onChangeText={(value) => setRequestForm({ ...requestForm, location: value })}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Families *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25"
                value={requestForm.families}
                onChangeText={(value) => setRequestForm({ ...requestForm, families: value })}
                keyboardType="numeric"
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Urgency Level</Text>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.urgencyOption,
                    {
                      borderColor: level.color,
                      backgroundColor: requestForm.urgency === level.id ? level.color + '20' : colors.white
                    }
                  ]}
                  onPress={() => setRequestForm({ ...requestForm, urgency: level.id as any })}
                >
                  <View style={[styles.urgencyDot, { backgroundColor: level.color }]} />
                  <View style={styles.urgencyInfo}>
                    <Text style={styles.urgencyName}>{level.name}</Text>
                    <Text style={styles.urgencyDescription}>{level.description}</Text>
                  </View>
                  {requestForm.urgency === level.id && (
                    <Ionicons name="checkmark-circle" size={20} color={level.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Person *</Text>
              <TextInput
                style={styles.input}
                placeholder="Name of person to contact"
                value={requestForm.contactPerson}
                onChangeText={(value) => setRequestForm({ ...requestForm, contactPerson: value })}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Special Requirements</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special dietary requirements, allergies, etc."
                value={requestForm.requirements}
                onChangeText={(value) => setRequestForm({ ...requestForm, requirements: value })}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.dark + '80'}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateRequest}>
              <Text style={styles.submitButtonText}>Submit Request</Text>
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
    color: colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.dark,
    opacity: 0.7,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
  donationItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  reserveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reservedActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: colors.dark,
  },
  createRequestButton: {
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
  createRequestText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  requestsSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
  },
  requestItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  requestLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  requestDetails: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
    color: colors.dark,
    opacity: 0.7,
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
  urgencyOption: {
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
  urgencyInfo: {
    flex: 1,
  },
  urgencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  urgencyDescription: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
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

export default NGOScreen;

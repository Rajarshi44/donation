import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const DRIVER_NAME = 'Alex Rodriguez';

const statusSteps = [
  { key: 'ASSIGNED', label: 'Assigned', icon: 'checkmark-circle', color: colors.secondary },
  { key: 'PICKED UP', label: 'Picked Up', icon: 'car', color: colors.primary },
  { key: 'DELIVERED', label: 'Delivered', icon: 'trophy', color: colors.success },
];

const DriverScreen = () => {
  const { donations, updateDonationStatus } = useDonations();
  const { user } = useAuth();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const driverName = user?.name || DRIVER_NAME;

  // Donations needing pickup
  const jobs = donations.filter(d => (d.status === 'LISTED' || d.status === 'RESERVED'));
  // Active job (ASSIGNED, PICKED UP, DELIVERED)
  const active = donations.find(d => d.driver === driverName && (d.status === 'ASSIGNED' || d.status === 'PICKED UP'));
  // Completed deliveries today
  const completedToday = donations.filter(d => d.driver === driverName && d.status === 'DELIVERED').length;

  const handleAccept = (donation: any) => {
    Alert.alert(
      'Accept Delivery Job',
      `Are you sure you want to accept this delivery job?\n\nPickup: ${donation.address}\nDestination: ${donation.ngo || 'To be assigned'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept Job',
          onPress: () => {
            updateDonationStatus(donation.id, 'ASSIGNED', undefined, driverName);
            setActiveId(donation.id);
            Alert.alert('Job Accepted!', 'Navigate to the pickup location and contact the donor when you arrive.');
          }
        }
      ]
    );
  };

  const handleNextStatus = (donation: any) => {
    if (donation.status === 'ASSIGNED') {
      Alert.alert(
        'Mark as Picked Up',
        'Have you successfully picked up the food donation from the donor?',
        [
          { text: 'Not Yet', style: 'cancel' },
          {
            text: 'Yes, Picked Up',
            onPress: () => {
              updateDonationStatus(donation.id, 'PICKED UP');
              Alert.alert('Status Updated!', 'Now proceed to deliver the food to the NGO/recipient.');
            }
          }
        ]
      );
    } else if (donation.status === 'PICKED UP') {
      Alert.alert(
        'Mark as Delivered',
        'Have you successfully delivered the food to the recipient?',
        [
          { text: 'Not Yet', style: 'cancel' },
          {
            text: 'Yes, Delivered',
            onPress: () => {
              updateDonationStatus(donation.id, 'DELIVERED');
              Alert.alert('Delivery Complete!', 'Great job! Thank you for helping reduce food waste and feeding those in need.');
            }
          }
        ]
      );
    }
  };

  const showJobDetailsModal = (job: any) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const getETA = () => {
    const etas = ['15 min', '25 min', '35 min', '12 min', '28 min'];
    return etas[Math.floor(Math.random() * etas.length)];
  };

  const getDistance = () => {
    const distances = ['2.3 km', '4.1 km', '1.8 km', '3.7 km', '5.2 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

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

  const JobCard = ({ donation, onAccept, onViewDetails }: any) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{donation.title}</Text>
          <Text style={styles.jobSubtitle}>{donation.quantity}</Text>
        </View>
        <View style={styles.urgencyBadge}>
          <Ionicons name="time" size={16} color={colors.white} />
          <Text style={styles.urgencyText}>URGENT</Text>
        </View>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeItem}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.routeText}>Pickup: {donation.address.split(',')[0]}</Text>
        </View>
        <View style={styles.routeItem}>
          <Ionicons name="business" size={16} color={colors.success} />
          <Text style={styles.routeText}>Deliver to: {donation.ngo || 'Community Center'}</Text>
        </View>
        <View style={styles.routeItem}>
          <Ionicons name="speedometer" size={16} color={colors.secondary} />
          <Text style={styles.routeText}>{getDistance()} • ETA: {getETA()}</Text>
        </View>
      </View>

      <View style={styles.jobActions}>
        <TouchableOpacity style={styles.detailsButton} onPress={() => onViewDetails(donation)}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(donation)}>
          <Ionicons name="car" size={18} color={colors.white} />
          <Text style={styles.acceptButtonText}>Accept Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ActiveJobCard = ({ donation }: any) => (
    <View style={styles.activeJobCard}>
      <View style={styles.activeHeader}>
        <Text style={styles.activeTitle}>Active Delivery</Text>
        <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.statusBadgeText}>{donation.status}</Text>
        </View>
      </View>

      <View style={styles.activeContent}>
        <Text style={styles.activeJobTitle}>{donation.title}</Text>
        <Text style={styles.activeJobQuantity}>{donation.quantity}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Delivery Progress</Text>
        <View style={styles.progressSteps}>
          {statusSteps.map((step, index) => {
            const isCompleted = statusSteps.findIndex(s => s.key === donation.status) >= index;
            const isCurrent = step.key === donation.status;
            
            return (
              <View key={step.key} style={styles.progressStep}>
                <View style={[
                  styles.progressIcon,
                  {
                    backgroundColor: isCompleted || isCurrent ? step.color : colors.light,
                    borderColor: step.color,
                    borderWidth: isCurrent ? 3 : 1,
                  }
                ]}>
                  <Ionicons 
                    name={step.icon as any} 
                    size={16} 
                    color={isCompleted || isCurrent ? colors.white : colors.dark} 
                  />
                </View>
                <Text style={[
                  styles.progressLabel,
                  { color: isCompleted || isCurrent ? step.color : colors.dark }
                ]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {donation.status !== 'DELIVERED' && (
        <TouchableOpacity style={styles.nextStepButton} onPress={() => handleNextStatus(donation)}>
          <Text style={styles.nextStepText}>
            {donation.status === 'ASSIGNED' ? 'Mark as Picked Up' : 'Mark as Delivered'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, {driverName.split(' ')[0]}!</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="car-sport"
          value={jobs.length}
          label="Available Jobs"
          color={colors.primary}
        />
        <StatCard
          icon="checkmark-circle"
          value={completedToday}
          label="Completed Today"
          color={colors.success}
        />
        <StatCard
          icon="star"
          value="4.9"
          label="Rating"
          color={colors.accent}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {active ? (
          <View>
            <Text style={styles.sectionTitle}>Active Delivery</Text>
            <ActiveJobCard donation={active} />
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Available Delivery Jobs</Text>
            {jobs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="car-outline" size={64} color={colors.light} />
                <Text style={styles.emptyText}>No delivery jobs available</Text>
                <Text style={styles.emptySubtext}>Check back later for new pickup requests</Text>
              </View>
            ) : (
              jobs.map(job => (
                <JobCard
                  key={job.id}
                  donation={job}
                  onAccept={handleAccept}
                  onViewDetails={showJobDetailsModal}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showJobDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowJobDetails(false)}
      >
        {selectedJob && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowJobDetails(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Job Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalContent}>
              <DonationCard donation={selectedJob} />
              
              <View style={styles.detailsSection}>
                <Text style={styles.detailsTitle}>Pickup Information</Text>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color={colors.primary} />
                  <Text style={styles.detailText}>{selectedJob.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={20} color={colors.secondary} />
                  <Text style={styles.detailText}>Available: {selectedJob.timeWindow}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="restaurant" size={20} color={colors.success} />
                  <Text style={styles.detailText}>Food: {selectedJob.title} ({selectedJob.quantity})</Text>
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.detailsTitle}>Delivery Information</Text>
                <View style={styles.detailRow}>
                  <Ionicons name="business" size={20} color={colors.primary} />
                  <Text style={styles.detailText}>Deliver to: {selectedJob.ngo || 'Community Center'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="speedometer" size={20} color={colors.secondary} />
                  <Text style={styles.detailText}>Estimated distance: {getDistance()}</Text>
                </View>
              </View>

              {selectedJob.notes && (
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsTitle}>Special Notes</Text>
                  <Text style={styles.notesText}>{selectedJob.notes}</Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.acceptJobButton}
                onPress={() => {
                  setShowJobDetails(false);
                  handleAccept(selectedJob);
                }}
              >
                <Ionicons name="car" size={24} color={colors.white} />
                <Text style={styles.acceptJobButtonText}>Accept This Job</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 16,
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
  jobCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  jobSubtitle: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 4,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
    flex: 1,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    paddingVertical: 12,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 4,
  },
  activeJobCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  activeContent: {
    marginBottom: 20,
  },
  activeJobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  activeJobQuantity: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  nextStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextStepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 8,
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
  detailsSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.dark,
    marginLeft: 12,
    flex: 1,
  },
  notesText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 8,
  },
  acceptJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    marginBottom: 40,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  acceptJobButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DriverScreen;

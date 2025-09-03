import { useAuth } from '@/context/AuthContext';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const stats = {
  donor: {
    donationsToday: 5,
    totalDonations: 127,
    mealsSaved: 420,
    impactScore: 85,
    recentDonations: [
      { id: 1, type: 'Pizza', quantity: '8 slices', time: '2 hours ago', status: 'picked_up' },
      { id: 2, type: 'Sandwiches', quantity: '12 pieces', time: '4 hours ago', status: 'delivered' },
      { id: 3, type: 'Salads', quantity: '6 boxes', time: '1 day ago', status: 'delivered' },
    ]
  },
  ngo: {
    pendingRequests: 8,
    activeDeliveries: 3,
    familiesServed: 156,
    requestsToday: 12,
    urgentRequests: [
      { id: 1, location: 'Downtown Shelter', families: 25, urgency: 'high', time: '30 min ago' },
      { id: 2, location: 'Community Center', families: 15, urgency: 'medium', time: '1 hour ago' },
      { id: 3, location: 'Senior Home', families: 8, urgency: 'low', time: '2 hours ago' },
    ]
  },
  driver: {
    deliveriesToday: 4,
    totalDeliveries: 89,
    distanceCovered: 45.2,
    rating: 4.9,
    activeDeliveries: [
      { id: 1, pickup: 'Mario\'s Pizza', dropoff: 'Hope Shelter', distance: '2.3 km', eta: '15 min' },
      { id: 2, pickup: 'Fresh Market', dropoff: 'Community Kitchen', distance: '1.8 km', eta: '25 min' },
    ]
  }
};

const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <View style={styles.progressBarBg}>
    <View style={[styles.progressBarFill, { width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }]} />
  </View>
);

const StatCard = ({ icon, title, value, subtitle, color, onPress }: any) => (
  <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);

const DonorDashboard = () => {
  const donorStats = stats.donor;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Donor Dashboard</Text>
        <Text style={styles.headerSubtitle}>Making a difference, one meal at a time</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="restaurant"
          title="Today's Donations"
          value={donorStats.donationsToday}
          color={colors.primary}
        />
        <StatCard
          icon="trophy"
          title="Total Donations"
          value={donorStats.totalDonations}
          color={colors.secondary}
        />
        <StatCard
          icon="heart"
          title="Meals Saved"
          value={donorStats.mealsSaved}
          color={colors.success}
        />
        <StatCard
          icon="star"
          title="Impact Score"
          value={`${donorStats.impactScore}%`}
          color={colors.accent}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Donations</Text>
        {donorStats.recentDonations.map((donation) => (
          <View key={donation.id} style={styles.listItem}>
            <View style={styles.listIcon}>
              <FontAwesome5 name="pizza-slice" size={20} color={colors.primary} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{donation.type}</Text>
              <Text style={styles.listSubtitle}>{donation.quantity} • {donation.time}</Text>
            </View>
            <View style={[styles.statusBadge, { 
              backgroundColor: donation.status === 'delivered' ? colors.success : colors.secondary 
            }]}>
              <Text style={styles.statusText}>
                {donation.status === 'delivered' ? 'Delivered' : 'Picked Up'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const NgoDashboard = () => {
  const ngoStats = stats.ngo;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NGO Dashboard</Text>
        <Text style={styles.headerSubtitle}>Coordinating aid distribution</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="time"
          title="Pending Requests"
          value={ngoStats.pendingRequests}
          color={colors.danger}
        />
        <StatCard
          icon="car"
          title="Active Deliveries"
          value={ngoStats.activeDeliveries}
          color={colors.secondary}
        />
        <StatCard
          icon="people"
          title="Families Served"
          value={ngoStats.familiesServed}
          color={colors.success}
        />
        <StatCard
          icon="today"
          title="Today's Requests"
          value={ngoStats.requestsToday}
          color={colors.primary}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Urgent Requests</Text>
        {ngoStats.urgentRequests.map((request) => (
          <View key={request.id} style={styles.listItem}>
            <View style={styles.listIcon}>
              <MaterialCommunityIcons name="charity" size={20} color={colors.primary} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{request.location}</Text>
              <Text style={styles.listSubtitle}>{request.families} families • {request.time}</Text>
            </View>
            <View style={[styles.statusBadge, { 
              backgroundColor: request.urgency === 'high' ? colors.danger : 
                              request.urgency === 'medium' ? colors.secondary : colors.success 
            }]}>
              <Text style={styles.statusText}>
                {request.urgency.toUpperCase()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const DriverDashboard = () => {
  const driverStats = stats.driver;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <Text style={styles.headerSubtitle}>Delivering hope on wheels</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="car-sport"
          title="Today's Deliveries"
          value={driverStats.deliveriesToday}
          color={colors.primary}
        />
        <StatCard
          icon="trophy"
          title="Total Deliveries"
          value={driverStats.totalDeliveries}
          color={colors.secondary}
        />
        <StatCard
          icon="speedometer"
          title="Distance Today"
          value={`${driverStats.distanceCovered} km`}
          color={colors.success}
        />
        <StatCard
          icon="star"
          title="Rating"
          value={`${driverStats.rating}/5`}
          color={colors.accent}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Active Deliveries</Text>
        {driverStats.activeDeliveries.map((delivery) => (
          <View key={delivery.id} style={styles.listItem}>
            <View style={styles.listIcon}>
              <Ionicons name="car-sport" size={20} color={colors.primary} />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{delivery.pickup} → {delivery.dropoff}</Text>
              <Text style={styles.listSubtitle}>{delivery.distance} • ETA: {delivery.eta}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.statusText}>EN ROUTE</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const DashboardScreen = () => {
  const { user, userRole, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userNameText}>{user.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {userRole === 'donor' && <DonorDashboard />}
      {userRole === 'ngo' && <NgoDashboard />}
      {userRole === 'driver' && <DriverDashboard />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  userNameText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.dark,
    opacity: 0.5,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.white,
    margin: 16,
    marginTop: 0,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: colors.dark,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.light,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default DashboardScreen;

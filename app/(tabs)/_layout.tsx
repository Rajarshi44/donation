import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userRole, isAuthenticated } = useAuth();

  // If not authenticated, don't show tabs
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          borderTopWidth: 5,
          borderTopColor: '#000',
          backgroundColor: '#FF6B35',
          paddingBottom: 10,
          paddingTop: 8,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 12,
        },
      }}>
      
      {/* Always show dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="bar-chart-2" size={focused ? 32 : 26} color={color} style={{ marginBottom: -2 }} />
            </View>
          ),
        }}
      />

      {/* Show donor tab only for donors */}
      {userRole === 'donor' && (
        <Tabs.Screen
          name="donor"
          options={{
            title: 'Donate Food',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome5 name="pizza-slice" size={focused ? 32 : 26} color={color} style={{ marginBottom: -2 }} />
              </View>
            ),
          }}
        />
      )}

      {/* Show NGO tab only for NGOs */}
      {userRole === 'ngo' && (
        <Tabs.Screen
          name="ngo"
          options={{
            title: 'Manage Requests',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="charity" size={focused ? 32 : 26} color={color} style={{ marginBottom: -2 }} />
              </View>
            ),
          }}
        />
      )}

      {/* Show driver tab only for drivers */}
      {userRole === 'driver' && (
        <Tabs.Screen
          name="driver"
          options={{
            title: 'Deliveries',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="car-sport" size={focused ? 32 : 26} color={color} style={{ marginBottom: -2 }} />
              </View>
            ),
          }}
        />
      )}

      {/* Hide non-relevant tabs for each role */}
      {userRole !== 'donor' && (
        <Tabs.Screen
          name="donor"
          options={{
            href: null, // This hides the tab
          }}
        />
      )}

      {userRole !== 'ngo' && (
        <Tabs.Screen
          name="ngo"
          options={{
            href: null, // This hides the tab
          }}
        />
      )}

      {userRole !== 'driver' && (
        <Tabs.Screen
          name="driver"
          options={{
            href: null, // This hides the tab
          }}
        />
      )}
    </Tabs>
  );
}

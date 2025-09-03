import { useAuth, UserRole } from '@/context/AuthContext';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const colors = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  accent: '#FFE66D',
  success: '#4ECDC4',
  danger: '#FF5E5B',
  dark: '#2C3E50',
  light: '#ECF0F1',
  white: '#FFFFFF',
  shadow: '#34495E',
};

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  role, title, description, icon, iconFamily, color, isSelected, onSelect 
}) => {
  const IconComponent = iconFamily === 'Ionicons' ? Ionicons : 
                       iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : 
                       FontAwesome5;

  return (
    <TouchableOpacity 
      style={[
        styles.roleCard, 
        { borderColor: color, backgroundColor: isSelected ? color + '20' : colors.white }
      ]} 
      onPress={onSelect}
    >
      <IconComponent name={icon as any} size={40} color={color} />
      <Text style={[styles.roleTitle, { color }]}>{title}</Text>
      <Text style={styles.roleDescription}>{description}</Text>
      {isSelected && (
        <View style={[styles.selectedIndicator, { backgroundColor: color }]}>
          <Ionicons name="checkmark" size={16} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const roles = [
    {
      role: 'donor' as UserRole,
      title: 'Food Donor',
      description: 'Restaurants, cafes, and individuals donating excess food',
      icon: 'restaurant',
      iconFamily: 'Ionicons' as const,
      color: colors.primary,
    },
    {
      role: 'ngo' as UserRole,
      title: 'NGO Partner',
      description: 'Organizations distributing food to those in need',
      icon: 'charity',
      iconFamily: 'MaterialCommunityIcons' as const,
      color: colors.success,
    },
    {
      role: 'driver' as UserRole,
      title: 'Delivery Driver',
      description: 'Volunteers picking up and delivering food donations',
      icon: 'truck-fast',
      iconFamily: 'FontAwesome5' as const,
      color: colors.secondary,
    }
  ];

  const handleEmailAuth = async () => {
    console.log('Auth screen: handleEmailAuth called', { isLogin, email, selectedRole, displayName });
    
    if (!selectedRole) {
      Alert.alert('Please select a role', 'Choose whether you\'re a donor, NGO, or driver to continue.');
      return;
    }

    if (!email || !password) {
      Alert.alert('Missing information', 'Please enter your email and password.');
      return;
    }

    if (!isLogin && !displayName) {
      Alert.alert('Missing information', 'Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Auth screen: Attempting email login...');
        const success = await login(email, password);
        if (success) {
          console.log('Auth screen: Email login successful');
          router.replace('/(tabs)/dashboard');
        } else {
          console.log('Auth screen: Email login failed');
          Alert.alert('Login failed', 'Invalid credentials. Please check your email and password.');
        }
      } else {
        console.log('Auth screen: Attempting email registration...');
        const success = await register(email, password, selectedRole, displayName);
        if (success) {
          console.log('Auth screen: Email registration successful');
          Alert.alert(
            'Account created successfully!', 
            'Please check your email for verification link. You can still use the app while unverified.',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/(tabs)/dashboard')
              }
            ]
          );
        } else {
          console.log('Auth screen: Email registration failed');
          Alert.alert('Registration failed', 'Please check your information and try again.');
        }
      }
    } catch (error: any) {
      console.error('Auth screen: Error during email authentication:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.logo}>🍽️</Text>
        <Text style={styles.appName}>ResQMeal</Text>
        <Text style={styles.tagline}>Rescuing Food, Feeding Hope</Text>
      </View>

      <View style={styles.authContainer}>
        <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Join ResQMeal!'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Sign in to continue making a difference' : 'Create your account to start helping'}
        </Text>

        <Text style={styles.sectionTitle}>Select Your Role</Text>
        <View style={styles.rolesContainer}>
          {roles.map((roleData) => (
            <RoleCard
              key={roleData.role}
              {...roleData}
              isSelected={selectedRole === roleData.role}
              onSelect={() => setSelectedRole(roleData.role)}
            />
          ))}
        </View>

        {/* Google Sign-In Button (Coming Soon) */}
        <TouchableOpacity 
          style={[
            styles.googleSignInButton, 
            { 
              backgroundColor: '#cccccc',
              opacity: 0.6
            }
          ]} 
          onPress={() => Alert.alert('Coming Soon', 'Google Sign-In will be available in a future update. Please use email/password authentication for now.')}
          disabled={false}
        >
          <Ionicons name="logo-google" size={24} color={colors.white} style={styles.googleIcon} />
          <Text style={styles.authButtonText}>
            Sign in with Google (Coming Soon)
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email/Password Form */}
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={colors.dark} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.shadow}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={colors.dark} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.shadow}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.dark} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.shadow}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={colors.dark} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Email/Password Auth Button */}
        <TouchableOpacity 
          style={[
            styles.authButton, 
            { 
              backgroundColor: selectedRole ? 
                roles.find(r => r.role === selectedRole)?.color : colors.dark,
              opacity: (selectedRole && !isLoading) ? 1 : 0.7
            }
          ]} 
          onPress={handleEmailAuth}
          disabled={!selectedRole || isLoading}
        >
          <Text style={styles.authButtonText}>
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In with Email' : 'Create Account')}
          </Text>
        </TouchableOpacity>

        {/* Switch between Login/Register */}
        <TouchableOpacity 
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text style={styles.switchTextBold}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Authentication Options</Text>
          <Text style={styles.infoText}>
            • Email/Password: Secure and reliable{'\n'}
            • All your data is encrypted and protected{'\n'}
            • Quick and easy account creation{'\n'}
            • Choose what works best for you
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: colors.dark,
    fontStyle: 'italic',
  },
  authContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.shadow,
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  roleCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 11,
    color: colors.shadow,
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.dark,
  },
  passwordToggle: {
    padding: 16,
  },
  authButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchText: {
    fontSize: 16,
    color: colors.shadow,
  },
  switchTextBold: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Divider styles
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  googleIcon: {
    marginRight: 12,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.shadow,
    lineHeight: 20,
  },
});

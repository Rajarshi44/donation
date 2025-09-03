import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function FirebaseTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');

  const testSignUp = async () => {
    try {
      console.log('Testing Firebase signup...');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', result.user.uid);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const testSignIn = async () => {
    try {
      console.log('Testing Firebase signin...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signin successful:', result.user.uid);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error: any) {
      console.error('Signin error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const testFirebaseConnection = () => {
    console.log('Firebase auth instance:', auth);
    console.log('Firebase app:', auth.app);
    Alert.alert('Firebase Info', `App Name: ${auth.app.name}\nAuth State: ${auth.currentUser ? 'User logged in' : 'No user'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Test</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={testFirebaseConnection}>
        <Text style={styles.buttonText}>Test Firebase Connection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testSignUp}>
        <Text style={styles.buttonText}>Test Sign Up</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testSignIn}>
        <Text style={styles.buttonText}>Test Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

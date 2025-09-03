import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole } from '../context/AuthContext';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Complete the web browser auth session
WebBrowser.maybeCompleteAuthSession();

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: Date;
  emailVerified: boolean;
  photoURL?: string;
  authProvider?: 'email' | 'google'; // Track how user signed up
}

class AuthService {
  // Google Sign-In configuration
  private googleConfig = {
    expoClientId: '805870053914-YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com', // You'll need to get this
    iosClientId: '805870053914-YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // Optional for iOS
    androidClientId: '805870053914-YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com', // Optional for Android
    webClientId: '805870053914-9d7472f3f57432ef19bfa3.apps.googleusercontent.com', // From Firebase config
  };

  // Google Sign In (to be implemented with proper OAuth)
  async signInWithGoogle(role: UserRole): Promise<FirebaseUser> {
    try {
      // This requires proper Google OAuth setup with:
      // 1. Google Sign-In configuration in Firebase Console
      // 2. SHA1 fingerprint registration for Android
      // 3. OAuth client ID configuration
      // 4. Installation of @react-native-google-signin/google-signin
      
      throw new Error('Google Sign-In requires additional setup. Please use email/password authentication for now.');
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      throw new Error(error.message || 'Google Sign-In is not available');
    }
  }

  // Sign up a new user 
  async signUp(email: string, password: string, role: UserRole, displayName: string): Promise<FirebaseUser> {
    try {
      console.log('🔥 Firebase SignUp: Starting signup process...', { email, role, displayName });
      
      // Validate inputs
      if (!email || !password || !role || !displayName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('🔥 Firebase SignUp: Creating user with email and password...');
      
      // Create user with email and password
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase SignUp: User created successfully:', user.uid);

      // Update the user's display name
      console.log('🔥 Firebase SignUp: Updating profile...');
      await updateProfile(user, {
        displayName: displayName
      });
      
      console.log('✅ Firebase SignUp: Profile updated successfully');

      // Create user data object
      const userData: FirebaseUser = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName,
        role: role,
        createdAt: new Date(),
        emailVerified: user.emailVerified,
        photoURL: user.photoURL || undefined,
        authProvider: 'email'
      };

      try {
        console.log('🔥 Firebase SignUp: Saving user to Firestore...');
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('✅ Firebase SignUp: User document created in Firestore');
      } catch (firestoreError) {
        console.warn('⚠️ Firebase SignUp: Firestore error (continuing anyway):', firestoreError);
      }

      try {
        console.log('🔥 Firebase SignUp: Sending email verification...');
        await sendEmailVerification(user);
        console.log('✅ Firebase SignUp: Email verification sent');
      } catch (emailError) {
        console.warn('⚠️ Firebase SignUp: Email verification error (continuing anyway):', emailError);
      }

      console.log('🎉 Firebase SignUp: Account creation complete!');
      return userData;
    } catch (error: any) {
      console.error('❌ Firebase SignUp error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please try signing in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are disabled. Please contact support.');
      } else {
        throw new Error(error.message || 'Account creation failed. Please try again.');
      }
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      console.log('🔥 Firebase SignIn: Starting signin process...', { email });
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('🔥 Firebase SignIn: Attempting to sign in...');
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Firebase SignIn: User signed in successfully:', user.uid);

      // Get user data from Firestore
      console.log('🔥 Firebase SignIn: Getting user data from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.warn('⚠️ Firebase SignIn: User data not found in Firestore, creating basic profile...');
        
        // Create a basic user profile if it doesn't exist
        const basicUserData: FirebaseUser = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'User',
          role: 'donor', // Default role
          createdAt: new Date(),
          emailVerified: user.emailVerified,
          photoURL: user.photoURL || undefined
        };
        
        try {
          await setDoc(doc(db, 'users', user.uid), basicUserData);
          console.log('✅ Firebase SignIn: Basic user profile created');
        } catch (firestoreError) {
          console.warn('⚠️ Firebase SignIn: Failed to create basic profile:', firestoreError);
        }
        
        return basicUserData;
      }

      const userData = userDoc.data() as FirebaseUser;
      
      // Update last login timestamp
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date(),
          emailVerified: user.emailVerified
        });
        console.log('✅ Firebase SignIn: Updated last login time');
      } catch (updateError) {
        console.warn('⚠️ Firebase SignIn: Failed to update last login:', updateError);
      }

      console.log('🎉 Firebase SignIn: Sign in complete!');
      return {
        ...userData,
        emailVerified: user.emailVerified
      };
    } catch (error: any) {
      console.error('❌ Firebase SignIn error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address. Please create an account first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Please contact support.');
      } else {
        throw new Error(error.message || 'Sign in failed. Please try again.');
      }
    }
  }

  // Sign out current user
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Send email verification
  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
      } else {
        throw new Error('No user is currently signed in.');
      }
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<FirebaseUser>): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in.');
      }

      // Update Firebase Auth profile if display name or photo URL changed
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }

      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user data
  async getCurrentUserData(): Promise<FirebaseUser | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      return {
        ...userDoc.data() as FirebaseUser,
        emailVerified: user.emailVerified
      };
    } catch (error: any) {
      console.error('Error getting current user data:', error);
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userData = await this.getCurrentUserData();
        callback(userData);
      } else {
        callback(null);
      }
    });
  }

  // Get current Firebase user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Helper method to convert Firebase error codes to user-friendly messages
  private getErrorMessage(errorCode: string): string {
    console.log('Firebase error code:', errorCode);
    
    switch (errorCode) {
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please enable Authentication in Firebase Console.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/requires-recent-login':
        return 'Please sign out and sign in again to perform this action.';
      case 'auth/app-not-authorized':
        return 'Firebase app not authorized. Check your Firebase configuration.';
      case 'auth/project-not-found':
        return 'Firebase project not found. Check your Firebase configuration.';
      default:
        return `Authentication error (${errorCode}): Please check Firebase console settings.`;
    }
  }
}

export const authService = new AuthService();
export default authService;

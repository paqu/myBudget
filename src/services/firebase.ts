// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  UserCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzMN0owH99YGderba8vMO8LTXiubzelyo",
  authDomain: "mybudget-92b87.firebaseapp.com",
  databaseURL: "https://mybudget-92b87.firebaseio.com",
  projectId: "mybudget-92b87",
  storageBucket: "mybudget-92b87.appspot.com",
  messagingSenderId: "1085285762716",
  appId: "1:1085285762716:web:977af43306ace4bb774f59",
  measurementId: "G-C1SS60K4CT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firebase service class
class FirebaseService {
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}

export default new FirebaseService();

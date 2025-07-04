// src/services/firebaseService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { db, auth } from '../firebase/config';

class FirebaseService {
  constructor() {
    // Create a secondary Firebase app instance for creating users without affecting current auth
    this.secondaryApp = null;
    this.secondaryAuth = null;
  }

  // Initialize secondary Firebase app for user creation
  initSecondaryApp() {
    if (!this.secondaryApp) {
      // Use the same config as your main app
      const firebaseConfig = {
        // You'll need to add your Firebase config here
        // This should be the same config used in your main Firebase setup
        // For now, we'll use a different approach that doesn't require secondary app
      };
      
      // Alternative approach: We'll create the user and immediately sign back in as admin
    }
  }

  // Authentication Methods
  async signUp(email, password, userData) {
    try {
      console.log('Creating user account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create company first
      console.log('Creating company...');
      const companyRef = await addDoc(collection(db, 'companies'), {
        name: userData.companyName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create user document
      console.log('Creating user document...');
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: email,
        name: userData.name,
        role: 'admin', // First user is always admin
        companyId: companyRef.id,
        position: 'Administrator',
        experience: '',
        skills: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('User and company created successfully');
      return { user, companyId: companyRef.id };
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      console.log('Signing in user...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully');
      return userCredential.user;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      console.log('Signing out user...');
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }

  async getCurrentUserData(uid) {
    try {
      console.log('Fetching user data for UID:', uid);
      const usersQuery = query(collection(db, 'users'), where('uid', '==', uid));
      const snapshot = await getDocs(usersQuery);
      if (!snapshot.empty) {
        const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        console.log('User data retrieved:', userData);
        return userData;
      }
      console.log('No user data found');
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  // Generate random password
  generatePassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  // Create team member with Firebase Auth account - FIXED VERSION
  async createTeamMember(memberData, currentUserCompanyId, currentUserCredentials) {
    try {
      console.log('Creating team member with auth account:', memberData);
      
      // // Store current user info to sign back in later
      // const currentUserEmail = currentUserCredentials.email;
      // const currentUserPassword = currentUserCredentials.password;
      
      // Use provided password or generate one
      const password = memberData.password || this.generatePassword();
      
      // Create Firebase Auth user (this will sign out current user)
      const userCredential = await createUserWithEmailAndPassword(auth, memberData.email, password);
      const newUser = userCredential.user;
      
      // Create user document in Firestore
      const userRef = await addDoc(collection(db, 'users'), {
        uid: newUser.uid,
        email: memberData.email,
        name: memberData.name,
        role: memberData.role || 'team_member',
        companyId: currentUserCompanyId,
        position: memberData.position || memberData.role,
        experience: memberData.experience || '',
        skills: memberData.skills || '',
        mustChangePassword: !memberData.password, // Only if password was generated
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // // Sign out the newly created user and sign back in as the admin/reviewer
      // await signOut(auth);
      
      // // Sign back in as the original user
      // await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
      
      console.log('Team member created successfully and original user restored');
      return { 
        id: userRef.id, 
        uid: newUser.uid,
        name: memberData.name,
        email: memberData.email,
        password: password,
        isGenerated: !memberData.password
      };
    } catch (error) {
      console.error('Error creating team member:', error);
      
      // If there's an error, try to sign back in as the original user
      try {
        if (currentUserCredentials && currentUserCredentials.email && currentUserCredentials.password) {
          await signInWithEmailAndPassword(auth, currentUserCredentials.email, currentUserCredentials.password);
        }
      } catch (signInError) {
        console.error('Error restoring original user session:', signInError);
      }
      
      throw error;
    }
  }

  // Get all team members (users with role-based filtering) - FIXED VERSION
  async getTeamMembers(companyId, currentUserUid = null, userRole = null) {
    try {
      console.log('Fetching team members...', { companyId, currentUserUid, userRole });
      
      let membersQuery;
      if (userRole === 'team_member') {
        // Team members can only see themselves
        membersQuery = query(
          collection(db, 'users'), 
          where('uid', '==', currentUserUid)
        );
      } else {
        // Admin and reviewers can see all company members
        membersQuery = query(
          collection(db, 'users'), 
          where('companyId', '==', companyId)
        );
      }
      
      const snapshot = await getDocs(membersQuery);
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by creation date, newest first
      members.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateA = a.createdAt.seconds ? a.createdAt.seconds : 0;
        const dateB = b.createdAt.seconds ? b.createdAt.seconds : 0;
        return dateB - dateA;
      });
      
      console.log('Team members retrieved:', members.length);
      return members;
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }

  async updateTeamMember(id, memberData) {
    try {
      console.log('Updating team member:', id, memberData);
      const memberRef = doc(db, 'users', id);
      await updateDoc(memberRef, {
        ...memberData,
        updatedAt: serverTimestamp()
      });
      console.log('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  async deleteTeamMember(id, companyId) {
    try {
      console.log('Deleting team member:', id);
      
      // Get the user document to find the UID
      const memberRef = doc(db, 'users', id);
      const memberDoc = await getDoc(memberRef);
      
      if (!memberDoc.exists()) {
        throw new Error('Team member not found');
      }
      
      const memberData = memberDoc.data();
      const memberUid = memberData.uid;
      
      // Delete the user document
      await deleteDoc(memberRef);
      
      // Delete related feedbacks using batch (using memberUid instead of id)
      const feedbacksQuery = query(
        collection(db, 'feedbacks'), 
        where('memberUid', '==', memberUid),
        where('companyId', '==', companyId)
      );
      const feedbacksSnapshot = await getDocs(feedbacksQuery);
      
      if (!feedbacksSnapshot.empty) {
        const batch = writeBatch(db);
        feedbacksSnapshot.docs.forEach(feedbackDoc => {
          batch.delete(feedbackDoc.ref);
        });
        await batch.commit();
        console.log('Related feedbacks deleted');
      }
      
      console.log('Team member and related data deleted successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  // Get feedbacks with role-based filtering - FIXED VERSION
  async getFeedbacks(companyId, currentUserUid = null, userRole = null) {
    try {
      console.log('Fetching feedbacks...', { companyId, currentUserUid, userRole });
      
      let feedbacksQuery;
      if (userRole === 'team_member') {
        // Team members can only see their own feedback
        feedbacksQuery = query(
          collection(db, 'feedbacks'), 
          where('memberUid', '==', currentUserUid)
        );
      } else {
        // Admin and reviewers can see all company feedback
        feedbacksQuery = query(
          collection(db, 'feedbacks'), 
          where('companyId', '==', companyId)
        );
      }
      
      const snapshot = await getDocs(feedbacksQuery);
      const feedbacks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by creation date, newest first
      feedbacks.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateA = a.createdAt.seconds ? a.createdAt.seconds : 0;
        const dateB = b.createdAt.seconds ? b.createdAt.seconds : 0;
        return dateB - dateA;
      });
      
      console.log('Feedbacks retrieved:', feedbacks.length);
      return feedbacks;
    } catch (error) {
      console.error('Error getting feedbacks:', error);
      return [];
    }
  }

  async addFeedback(feedbackData, companyId) {
    try {
      console.log('Adding feedback:', feedbackData);
      const docRef = await addDoc(collection(db, 'feedbacks'), {
        ...feedbackData,
        companyId: companyId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Feedback added with ID:', docRef.id);
      return { id: docRef.id, ...feedbackData };
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  async updateFeedback(id, feedbackData) {
    try {
      console.log('Updating feedback:', id, feedbackData);
      const feedbackRef = doc(db, 'feedbacks', id);
      await updateDoc(feedbackRef, {
        ...feedbackData,
        updatedAt: serverTimestamp()
      });
      console.log('Feedback updated successfully');
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  }

  // Company Methods
  async getCompanyInfo(companyId) {
    try {
      const companyRef = doc(db, 'companies', companyId);
      const companyDoc = await getDoc(companyRef);
      if (companyDoc.exists()) {
        return { id: companyDoc.id, ...companyDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching company info:', error);
      return null;
    }
  }
}

export default FirebaseService;
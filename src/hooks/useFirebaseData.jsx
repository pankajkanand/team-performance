// hooks/useFirebaseData.js
import { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../context/FirebaseContext';
import useNotification from './useNotification';

const useFirebaseData = () => {
  const firebase = useContext(FirebaseContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (!firebase.isInitialized()) {
        throw new Error('Firebase not available');
      }

      const [membersData, feedbacksData] = await Promise.all([
        firebase.getTeamMembers(),
        firebase.getFeedbacks()
      ]);

      setTeamMembers(membersData);
      setFeedbacks(feedbacksData);

      // Initialize with demo data if empty
      if (membersData.length === 0) {
        await firebase.initializeWithDemoData();
        await loadData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Failed to load data from Firebase', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    teamMembers,
    feedbacks,
    loading,
    loadData,
    showNotification
  };
};

export default useFirebaseData;
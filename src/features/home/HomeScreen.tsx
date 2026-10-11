import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { getStudentProfile, getStudentAssignment } from '../../api/endpoints';
import { StudentProfile, StudentAssignment } from '../../types';
import { Header, Card, Badge, TransportAssignmentCard } from '../../components/common';

export const HomeScreen: React.FC = () => {
  const { studentId, studentData } = useContext(AuthContext);

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assignment, setAssignment] = useState<StudentAssignment | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [profileError, setProfileError] = useState<boolean>(false);
  const [assignmentError, setAssignmentError] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!studentId) return;

    setProfileError(false);
    setAssignmentError(false);

    try {
      const [profileRes, assignmentRes] = await Promise.allSettled([
        getStudentProfile(studentId),
        getStudentAssignment(studentId),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
      } else {
        setProfileError(true);
      }

      if (assignmentRes.status === 'fulfilled') {
        setAssignment(assignmentRes.value);
      } else {
        setAssignmentError(true);
      }
    } catch (error) {
      // Handled gracefully
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="CUI Bus Service" subtitle="Student Transport System" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const studentName = profile?.name || studentData?.name || 'Student';
  const regNumber = profile?.registrationNumber || studentData?.registrationNumber || 'N/A';
  
  // Rule 1: Use backend feeValid boolean ONLY
  const isFeeValid = profile ? profile.feeValid : (studentData?.feeValid ?? false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
      >
        {/* Header Greeting & Registration Number */}
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Hello, {studentName} 👋</Text>
          <Text style={styles.regNumber}>{regNumber}</Text>
        </View>

        {/* Profile Fetch Error Card */}
        {profileError ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>Unable to load profile.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          /* Fee Status Card */
          <Card>
            <View style={styles.feeRow}>
              <Text style={styles.cardTitle}>Fee Status</Text>
              <Badge
                label={isFeeValid ? '🟢 PAID' : '🔴 UNPAID'}
                variant={isFeeValid ? 'success' : 'danger'}
              />
            </View>
            <Text style={styles.feeSubtext}>
              {isFeeValid
                ? 'Your transport fee is verified and valid.'
                : 'Fee payment pending. Please contact the transport office.'}
            </Text>
          </Card>
        )}

        {/* Transport Assignment Section (Rules 2 & 3 enforced) */}
        <TransportAssignmentCard
          feeValid={isFeeValid}
          assignment={assignment}
          isError={assignmentError}
          onRetry={fetchData}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  regNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 2,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  feeSubtext: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorCard: {
    backgroundColor: '#450A0A',
    borderColor: '#EF4444',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: '#EF444420',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});

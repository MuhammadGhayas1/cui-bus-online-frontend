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
import { Card, Button, Badge, TransportAssignmentCard } from '../../components/common';

export const ProfileScreen: React.FC = () => {
  const { studentId, studentData, logout } = useContext(AuthContext);

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
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const studentName = profile?.name || studentData?.name || 'Student';
  const regNumber = profile?.registrationNumber || studentData?.registrationNumber || 'N/A';
  const isFeeValid = profile ? profile.feeValid : (studentData?.feeValid ?? false);

  const studentInfoItems = [
    { label: 'Full Name', value: studentName },
    { label: 'Roll Number', value: profile?.rollNo || 'N/A' },
    { label: 'Batch', value: profile?.batch || 'N/A' },
    { label: 'Department', value: profile?.department || 'N/A' },
    { label: 'Section', value: profile?.section || 'N/A' },
    { label: 'Email', value: profile?.email || studentData?.email || 'N/A' },
    { label: 'Phone', value: profile?.phone || 'N/A' },
  ];

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
        {/* Header: Student Name and Registration Number */}
        <Card style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {studentName ? studentName.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.headerName}>{studentName}</Text>
              <Text style={styles.headerReg}>{regNumber}</Text>
            </View>
          </View>
        </Card>

        {/* Profile Fetch Error State */}
        {profileError ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>Unable to load profile.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            {/* STUDENT INFORMATION Card */}
            <Card>
              <Text style={styles.sectionHeader}>STUDENT INFORMATION</Text>
              {studentInfoItems.map((item, index) => (
                <View
                  key={item.label}
                  style={[
                    styles.infoRow,
                    index === studentInfoItems.length - 1 && styles.noBorder,
                  ]}
                >
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </Card>

            {/* TRANSPORT STATUS Card */}
            <Card>
              <Text style={styles.sectionHeader}>TRANSPORT STATUS</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fee Status</Text>
                <Badge
                  label={isFeeValid ? '🟢 PAID' : '🔴 UNPAID'}
                  variant={isFeeValid ? 'success' : 'danger'}
                />
              </View>

              {profile?.feeValidUntil ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fee Valid Until</Text>
                  <Text style={styles.infoValue}>{profile.feeValidUntil}</Text>
                </View>
              ) : null}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Assigned Stop</Text>
                <Text style={styles.infoValueHighlight}>
                  {profile?.stopName || assignment?.stopName || 'N/A'}
                </Text>
              </View>

              <View style={[styles.infoRow, styles.noBorder]}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>{profile?.cityName || 'N/A'}</Text>
              </View>
            </Card>
          </>
        )}

        {/* MY TRANSPORT Card (Reused TransportAssignmentCard) */}
        <TransportAssignmentCard
          feeValid={isFeeValid}
          assignment={assignment}
          isError={assignmentError}
          onRetry={fetchData}
        />

        {/* Logout Button */}
        <View style={styles.actionContainer}>
          <Button
            title="Log Out"
            onPress={logout}
            variant="danger"
            style={styles.logoutBtn}
          />
        </View>
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
  headerCard: {
    backgroundColor: '#0F172A',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerMeta: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerReg: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  infoValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#60A5FA',
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
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

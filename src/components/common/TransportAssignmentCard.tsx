import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { StudentAssignment } from '../../types';

interface TransportAssignmentCardProps {
  feeValid?: boolean;
  assignment: StudentAssignment | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const TransportAssignmentCard: React.FC<TransportAssignmentCardProps> = ({
  feeValid = true,
  assignment,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const handleCall = (phone?: string) => {
    if (!phone) {
      Alert.alert('Notice', 'Phone number not available.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Error', `Cannot dial ${phone}`);
    });
  };

  if (isError) {
    return (
      <Card style={styles.errorCard}>
        <Text style={styles.errorText}>Unable to load transport info.</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  }

  if (!feeValid) {
    return (
      <Card style={styles.warningCard}>
        <Text style={styles.warningTitle}>⚠️ TRANSPORT FEE NOT VALID</Text>
        <Text style={styles.warningText}>
          Your transport fee is not valid. Please pay the fee to see your bus assignment.
        </Text>
      </Card>
    );
  }

  if (assignment && assignment.hasAssignment) {
    return (
      <Card style={styles.card}>
        <Text style={styles.cardHeader}>MY TRANSPORT</Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>BUS</Text>
            <Text style={styles.value}>{assignment.busName || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>SHIFT</Text>
            <Text style={styles.value}>{assignment.shiftName || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>ROUTE</Text>
          <Text style={styles.valueHighlight}>{assignment.routeName || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>DESIGNATED STOP</Text>
          <Text style={styles.value}>{assignment.stopName || 'N/A'}</Text>
        </View>

        <View style={styles.divider} />

        {/* Staff details */}
        <View style={styles.staffContainer}>
          <View style={styles.staffItem}>
            <Text style={styles.label}>DRIVER</Text>
            <Text style={styles.staffName}>{assignment.driverName || 'N/A'}</Text>
            {assignment.driverPhone ? (
              <TouchableOpacity
                onPress={() => handleCall(assignment.driverPhone)}
                style={styles.phoneBadge}
              >
                <Text style={styles.phoneText}>📞 {assignment.driverPhone}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.staffItem}>
            <Text style={styles.label}>CONDUCTOR</Text>
            <Text style={styles.staffName}>{assignment.conductorName || 'N/A'}</Text>
            {assignment.conductorPhone ? (
              <TouchableOpacity
                onPress={() => handleCall(assignment.conductorPhone)}
                style={styles.phoneBadge}
              >
                <Text style={styles.phoneText}>📞 {assignment.conductorPhone}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>NO ACTIVE ASSIGNMENT</Text>
      <Text style={styles.emptyText}>
        No active bus assignment was found for your stop right now.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  valueHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#60A5FA',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 14,
  },
  staffContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  staffItem: {
    flex: 1,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 2,
  },
  phoneBadge: {
    marginTop: 6,
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#3B82F650',
  },
  phoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  warningCard: {
    backgroundColor: '#451A03',
    borderColor: '#D97706',
    padding: 18,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FDE68A',
    lineHeight: 20,
  },
  emptyCard: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    padding: 18,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
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

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { mapRouteStops } from './utils/stopMapper';
import { Card } from '../../components/common';

type RouteDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RouteDetails'>;

export const RouteDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteDetailsScreenRouteProp>();

  const routeData = route.params?.routeData;
  const mappedStops = mapRouteStops(routeData?.routeStops || []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header with Back Button */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {routeData?.name || 'Route Details'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Route Info Banner Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.routeName}>{routeData?.name}</Text>
          {routeData?.description ? (
            <Text style={styles.routeDesc}>{routeData.description}</Text>
          ) : null}
          <View style={styles.metaRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {routeData?.isActive ? '🟢 Active Route' : '🔴 Inactive'}
              </Text>
            </View>
            <Text style={styles.stopsCount}>
              {mappedStops.length} {mappedStops.length === 1 ? 'Stop' : 'Stops'} Total
            </Text>
          </View>
        </Card>

        {/* Timeline / Stops Section */}
        <View style={styles.timelineHeader}>
          <Text style={styles.sectionTitle}>ROUTE STOPS TIMELINE</Text>
        </View>

        {mappedStops.length === 0 ? (
          <Card style={styles.emptyStopsCard}>
            <Text style={styles.emptyStopsText}>No stops defined for this route yet.</Text>
          </Card>
        ) : (
          <View style={styles.timelineContainer}>
            {mappedStops.map((stop, index) => {
              const isFirst = index === 0;
              const isLast = index === mappedStops.length - 1;

              return (
                <View key={stop.id} style={styles.timelineItem}>
                  {/* Timeline Left Graphic */}
                  <View style={styles.graphicColumn}>
                    <View
                      style={[
                        styles.dot,
                        isFirst && styles.firstDot,
                        isLast && styles.lastDot,
                      ]}
                    >
                      <View style={styles.innerDot} />
                    </View>
                    {!isLast && <View style={styles.line} />}
                  </View>

                  {/* Stop Information Card */}
                  <View style={styles.stopCard}>
                    <Text style={styles.sequenceText}>{stop.formattedSequence}.</Text>
                    <View style={styles.stopDetails}>
                      <Text style={styles.stopName}>{stop.stopName}</Text>
                      {stop.pickupTime ? (
                        <Text style={styles.timeText}>Pickup: {stop.pickupTime}</Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  backText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  infoCard: {
    backgroundColor: '#0F172A',
    borderColor: '#3B82F650',
    padding: 20,
  },
  routeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  routeDesc: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  stopsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  timelineHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1,
  },
  emptyStopsCard: {
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyStopsText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  timelineContainer: {
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  graphicColumn: {
    alignItems: 'center',
    marginRight: 14,
    width: 24,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  firstDot: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  lastDot: {
    borderColor: '#F59E0B',
    backgroundColor: '#78350F',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  stopCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  sequenceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3B82F6',
    marginRight: 12,
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});

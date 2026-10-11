import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { getRoutes } from '../../api/endpoints';
import { StudentRoute } from '../../types';
import { Header, Card, Button } from '../../components/common';

// TODO: Replace with GET /cities or profile.cityId when backend provides it
const CITIES = [
  { id: 1, name: 'Islamabad' },
  { id: 2, name: 'Rawalpindi' },
];

type RoutesScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

export const RoutesScreen: React.FC = () => {
  const navigation = useNavigation<RoutesScreenNavProp>();

  // TODO: Replace with GET /cities or profile.cityId when backend provides it
  const [selectedCityId, setSelectedCityId] = useState<number>(1);
  const [routes, setRoutes] = useState<StudentRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchRoutesData = useCallback(async () => {
    setIsError(false);
    try {
      const fetchedRoutes = await getRoutes(selectedCityId);
      // Filtering: Only display routes where isActive === true
      const activeRoutes = (fetchedRoutes || []).filter((r) => r.isActive === true);
      setRoutes(activeRoutes);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCityId]);

  useEffect(() => {
    setLoading(true);
    fetchRoutesData();
  }, [selectedCityId, fetchRoutesData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoutesData();
  };

  const handleCitySelect = (cityId: number) => {
    if (cityId !== selectedCityId) {
      setSelectedCityId(cityId);
    }
  };

  const renderRouteCard = ({ item }: { item: StudentRoute }) => (
    <Card style={styles.routeCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.routeName}>{item.name}</Text>
      </View>

      {item.description ? (
        <Text style={styles.routeDesc}>{item.description}</Text>
      ) : null}

      <Button
        title="View Stops"
        onPress={() => navigation.navigate('RouteDetails', { routeData: item })}
        style={styles.viewStopsBtn}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="ROUTES" subtitle="Explore available campus transport routes" />

      {/* City Selector Segmented Pills */}
      <View style={styles.citySelectorContainer}>
        <Text style={styles.cityLabel}>Select City:</Text>
        <View style={styles.pillGroup}>
          {CITIES.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <TouchableOpacity
                key={city.id}
                style={[styles.cityPill, isSelected && styles.cityPillSelected]}
                onPress={() => handleCitySelect(city.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.cityPillText,
                    isSelected && styles.cityPillTextSelected,
                  ]}
                >
                  {city.name} (ID: {city.id})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Content Area */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Fetching active routes...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerContainer}>
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>Unable to load routes.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchRoutesData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </Card>
        </View>
      ) : routes.length === 0 ? (
        <View style={styles.centerContainer}>
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>NO ACTIVE ROUTES</Text>
            <Text style={styles.emptyText}>
              No active routes available for this city.
            </Text>
          </Card>
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderRouteCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
              colors={['#3B82F6']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  citySelectorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  cityLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pillGroup: {
    flexDirection: 'row',
  },
  cityPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cityPillSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#60A5FA',
  },
  cityPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  cityPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: 12,
  },
  routeCard: {
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  routeDesc: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 14,
    lineHeight: 20,
  },
  viewStopsBtn: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
    borderWidth: 1,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: '#450A0A',
    borderColor: '#EF4444',
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: '#EF444420',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
  },
});

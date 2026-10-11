import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StudentRoute } from '../types';

export type MainTabParamList = {
  Home: undefined;
  Routes: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTab: NavigatorScreenParams<MainTabParamList>;
  RouteDetails: { routeData: StudentRoute };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

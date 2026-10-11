import apiClient from './client';
import { StudentProfile, StudentAssignment, StudentRoute } from '../types';

export const ENDPOINTS = {
  LOGIN: '/login',
  PROFILE: (studentId: number | string) => `/${studentId}/profile`,
  ASSIGNMENT: (studentId: number | string) => `/${studentId}/my-assignment`,
  ROUTES: '/routes',
} as const;

export const getStudentProfile = async (
  studentId: number | string
): Promise<StudentProfile> => {
  const response = await apiClient.get<StudentProfile>(ENDPOINTS.PROFILE(studentId));
  return response.data;
};

export const getStudentAssignment = async (
  studentId: number | string
): Promise<StudentAssignment> => {
  const response = await apiClient.get<StudentAssignment>(ENDPOINTS.ASSIGNMENT(studentId));
  return response.data;
};

export const getRoutes = async (cityId: number): Promise<StudentRoute[]> => {
  const response = await apiClient.get<StudentRoute[]>(ENDPOINTS.ROUTES, {
    params: { cityId },
  });
  return response.data;
};

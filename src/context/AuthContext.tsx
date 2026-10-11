import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentLoginRequest, StudentLoginResponse } from '../types';
import apiClient, { setOnUnauthorized } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

const STORAGE_KEYS = {
  STUDENT_ID: '@student_id',
  STUDENT_DATA: '@student_data',
};

export interface AuthContextData {
  studentId: string | number | null;
  studentData: StudentLoginResponse | null;
  isLoading: boolean;
  login: (credentials: StudentLoginRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  studentId: null,
  studentData: null,
  isLoading: true,
  login: async () => ({ success: false, message: '' }),
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [studentId, setStudentId] = useState<string | number | null>(null);
  const [studentData, setStudentData] = useState<StudentLoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setStudentId(null);
      setStudentData(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
      await AsyncStorage.removeItem(STORAGE_KEYS.STUDENT_DATA);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
    setOnUnauthorized(logout);
  }, [logout]);

  const loadStoredAuth = async () => {
    try {
      const storedId = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_ID);
      const storedData = await AsyncStorage.getItem(STORAGE_KEYS.STUDENT_DATA);

      if (storedId) {
        setStudentId(storedId);
      }
      if (storedData) {
        setStudentData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to restore authentication state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    credentials: StudentLoginRequest
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.post<StudentLoginResponse>(
        ENDPOINTS.LOGIN,
        credentials
      );
      const data = response.data;

      if (data && data.studentId) {
        const sId = String(data.studentId);
        setStudentId(sId);
        setStudentData(data);

        await AsyncStorage.setItem(STORAGE_KEYS.STUDENT_ID, sId);
        await AsyncStorage.setItem(STORAGE_KEYS.STUDENT_DATA, JSON.stringify(data));
        return { success: true };
      } else {
        const errorMsg = data?.message || 'Invalid email or password';
        return { success: false, message: errorMsg };
      }
    } catch (error: any) {
      let errorMsg = 'Invalid email or password';

      if (error.friendlyMessage) {
        errorMsg = error.friendlyMessage;
      } else if (error.response?.data?.message) {
        const serverMsg: string = error.response.data.message;
        if (serverMsg.toLowerCase().includes('inactive')) {
          errorMsg = 'Your account is inactive. Contact admin.';
        } else {
          errorMsg = serverMsg;
        }
      } else if (error.response?.status === 403) {
        errorMsg = 'Your account is inactive. Contact admin.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Invalid email or password';
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        errorMsg = 'Unable to connect to the server. Please check your internet connection.';
      }
      return { success: false, message: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        studentId,
        studentData,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

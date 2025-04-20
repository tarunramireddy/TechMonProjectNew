import { Platform } from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'web'
    ? process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050/api'
    : 'http://192.168.86.89:5050/api';

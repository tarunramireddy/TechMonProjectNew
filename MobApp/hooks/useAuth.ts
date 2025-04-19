import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token'); // adjust key if needed
      setAuthenticated(!!token);
    };

    checkAuth();
  }, []);

  return authenticated;
};

export default useAuth;
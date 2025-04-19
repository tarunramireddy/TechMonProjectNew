import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Platform.OS !== 'web'
        ? Alert.alert('Cleared', 'AsyncStorage has been cleared.')
        : alert('AsyncStorage has been cleared.');
  
      router.replace('/(auth)/sign-in');
    } catch (err) {
      console.error('Failed to clear AsyncStorage:', err);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
  
      if (Platform.OS !== 'web') {
        Alert.alert('Signed Out', 'You have been signed out successfully.');
      }
  
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  

  const handleLanguagePress = () => {
    const msg = 'Language setting is not editable in this version.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Language', msg);
  };

  const handleThemePress = () => {
    const msg = 'Toggle dark mode below.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Theme', msg);
  };

  const handleProfilePress = () => {
    const msg = 'Profile editing is under development.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Profile', msg);
  };

  const handleSecurityPress = () => {
    const msg = 'Please contact the system administrator for a temporary password.';
    Platform.OS === 'web' ? alert(msg) : Alert.alert('Forgot Password', msg);
  };

  const themeStyles = isDarkMode ? darkStyles : styles;

  return (
    <SafeAreaView  style={themeStyles.container}>
      <View style={themeStyles.header}>
        <Text style={themeStyles.title}>Settings</Text>
      </View>

      <ScrollView style={themeStyles.content}>
        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>Notifications</Text>
          <View style={themeStyles.settingItem}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Push Notifications</Text>
              <Text style={themeStyles.settingDescription}>Receive alerts about assets</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={themeStyles.settingItem}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Email Notifications</Text>
              <Text style={themeStyles.settingDescription}>Receive email reports and alerts</Text>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
        </View>

        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>App Settings</Text>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleLanguagePress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Language</Text>
              <Text style={themeStyles.settingDescription}>English</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleThemePress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Theme</Text>
              <Text style={themeStyles.settingDescription}>{isDarkMode ? 'Dark' : 'Light'}</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </TouchableOpacity>
        </View>

        <View style={themeStyles.section}>
          <Text style={themeStyles.sectionTitle}>Account</Text>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleProfilePress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Profile</Text>
              <Text style={themeStyles.settingDescription}>Manage your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={themeStyles.settingItem} onPress={handleSecurityPress}>
            <View style={themeStyles.settingInfo}>
              <Text style={themeStyles.settingTitle}>Security</Text>
              <Text style={themeStyles.settingDescription}>Password and authentication</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={themeStyles.signOutButton} onPress={handleSignOut}>
          <Text style={themeStyles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        {__DEV__ && (
  <TouchableOpacity
    onPress={clearStorage}
    style={[themeStyles.signOutButton, { backgroundColor: '#DC2626' }]}
  >
    <Text style={themeStyles.signOutText}>Reset Storage (Dev Only)</Text>
  </TouchableOpacity>
)}

      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // ⬅️ Matches the tabBar dark background
  },
  header: {
    padding: 20,
    backgroundColor: '#1F2937', // ⬅️ Unified with container
    borderBottomWidth: 1,
    borderBottomColor: '#374151', // slightly lighter border for separation
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // bright text for dark mode
  },
  content: {
    padding: 15,
  },
  section: {
    backgroundColor: '#111827', // deeper dark for cards
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


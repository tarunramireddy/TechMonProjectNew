import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '@/config/apiConfig';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Reports() {
  const { isDarkMode } = useTheme();
const themeStyles = isDarkMode ? darkStyles : styles;

  const handleExport = async () => {
    try {
      // 🔄 Replace this with dynamic fetch if needed
      const response = await fetch(`${API_BASE_URL}/assets`);
      const assets = await response.json();

      const worksheet = XLSX.utils.json_to_sheet(assets);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');

      if (Platform.OS === 'web') {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Asset_Inventory.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const uri = FileSystem.documentDirectory + 'Asset_Inventory.xlsx';
        await FileSystem.writeAsStringAsync(uri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(uri);
      }
    } catch (error: any) {
      const message = error?.message || 'Something went wrong';
      if (Platform.OS === 'web') {
        alert(`Export failed: ${message}`);
      } else {
        Alert.alert('Export Failed', message);
      }
    }
  };

  return (
    <SafeAreaView  style={themeStyles.container}>
      <Text style={themeStyles.header}>Reports</Text>
      <ScrollView style={themeStyles.content}>
        <TouchableOpacity style={themeStyles.reportCard} onPress={handleExport}>
          <View style={themeStyles.reportIcon}>
            <Ionicons name="document-text-outline" size={24} color="#007AFF" />
          </View>
          <View style={themeStyles.reportInfo}>
            <Text style={themeStyles.reportTitle}>Asset Inventory</Text>
            <Text style={themeStyles.reportDescription}>Download current asset list as Excel</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { fontSize: 28, fontWeight: 'bold', padding: 20, color: '#1F2937' },
  content: { paddingHorizontal: 16 },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});


const darkStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' }, // Dark background
  header: { fontSize: 28, fontWeight: 'bold', padding: 20, color: '#F8FAFC' }, // Light header text
  content: { paddingHorizontal: 16 },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Darker card background
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155', // Soft dark tone
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9', // Light title text
  },
  reportDescription: {
    fontSize: 14,
    color: '#94A3B8', // Soft gray description
    marginTop: 2,
  },
});

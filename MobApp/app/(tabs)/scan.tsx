import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { API_BASE_URL } from '@/config/apiConfig';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Scan() {
  const { isDarkMode } = useTheme();
const themeStyles = isDarkMode ? darkStyles : styles;

  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    if (Platform.OS !== 'web') {
      getCameraPermissions();
    }
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const response = await fetch(`${API_BASE_URL}/assets/serial/${data}`);
      const asset = await response.json();

      if (!response.ok) throw new Error(asset.message || 'Asset not found');

      Alert.alert('Asset Found', `Name: ${asset.name}\nType: ${asset.type}\nStatus: ${asset.status}`);
    } catch (error: any) {
      Alert.alert('Asset not found', error.message);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={themeStyles.container}>
        <View style={themeStyles.webMessage}>
        <MaterialCommunityIcons name="camera-off-outline" size={24} color="black" />
          <Text style={themeStyles.webMessageText}>Camera scanning is only available on mobile devices.</Text>
          <TouchableOpacity style={themeStyles.webButton} onPress={() => router.back()}>
            <Text style={themeStyles.webButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={themeStyles.container}>
        <Text style={themeStyles.messageText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={themeStyles.container}>
        <Text style={themeStyles.messageText}>No access to camera</Text>
        <TouchableOpacity
          style={themeStyles.retryButton}
          onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={themeStyles.retryButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView  style={themeStyles.container}>
      <CameraView
        style={themeStyles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={themeStyles.overlay}>
          <View style={themeStyles.scanArea}>
            <View style={themeStyles.cornerTL} />
            <View style={themeStyles.cornerTR} />
            <View style={themeStyles.cornerBL} />
            <View style={themeStyles.cornerBR} />
          </View>
          <Text style={themeStyles.instructions}>
            Position the QR code within the frame to scan
          </Text>
          {scanned && (
            <TouchableOpacity
              style={themeStyles.rescanButton}
              onPress={() => setScanned(false)}>
              <EvilIcons name="refresh" size={24} color="black" />
              <Text style={themeStyles.rescanText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366F1',
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366F1',
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366F1',
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366F1',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  webMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMessageText: {
    color: '#94A3B8',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  webButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  webButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    color: '#94A3B8',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // dark background
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366F1',
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366F1',
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366F1',
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366F1',
  },
  instructions: {
    color: '#F1F5F9', // light text
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  webMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMessageText: {
    color: '#CBD5E1', // soft gray
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  webButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  webButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    color: '#CBD5E1',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { signin } from '../../services/authService';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleSignIn = async () => {

  if (!email.trim() || !password.trim()) {
    const msg = "Email and password are required.";

    if (Platform.OS === 'web') {
      alert(msg); // works on web
    } else {
      Alert.alert("Error", msg); // works on mobile
    }

    return;
  }

  try {
    const response = await signin({ email, password });

    if (!response.success) {

      if (Platform.OS === 'web') {
        alert(response.message || "Something went wrong");
      } else {
        Alert.alert("Error", response.message || "Something went wrong");
      }
      return;
    }
    await AsyncStorage.setItem('token', 'true');
    if (Platform.OS === 'web') {
      alert(response.message);
    } else {
      Alert.alert("Success", response.message);
    }
    router.replace('/(tabs)');
  } catch (error: any) {

    const errorMessage =
      error?.response?.data?.message || error?.message || "Sign In failed";

    if (Platform.OS === 'web') {
      alert(errorMessage);
    } else {
      Alert.alert("Error", errorMessage);
    }
  }
};

const handleForgotPassword = () => {
  const msg = "Please contact the system administrator for a temporary password.";

  if (Platform.OS === 'web') {
    alert(msg);
  } else {
    Alert.alert("Forgot Password", msg);
  }
};

  

  

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>IT Asset Tracker</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
  <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>
<TouchableOpacity onPress={handleForgotPassword}>
  <Text style={styles.forgot}>Forgot Password?</Text>
</TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  forgot: {
    color: '#FF3B30', // red tone for visibility
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});
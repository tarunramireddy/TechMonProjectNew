import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { signup } from '../../services/authService';
import { router } from 'expo-router';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    console.log("📝 handleSignUp triggered");

    if (!name.trim() || !email.trim() || !password.trim()) {
      const msg = "All fields are required.";
      console.log("❗ Empty fields - showing alert");

      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
      return;
    }

    try {
      const response = await signup({ name, email, password });
      console.log("✅ Signup response:", response);

      if (!response.success) {
        if (Platform.OS === 'web') {
          alert(response.message || "Signup failed");
        } else {
          Alert.alert("Error", response.message || "Signup failed");
        }
        return;
      }

      if (Platform.OS === 'web') {
        alert("Signup successful! Redirecting to sign in.");
      } else {
        Alert.alert("Success", "Signup successful! Redirecting to sign in.");
      }

      router.replace('/(auth)/sign-in');
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Signup failed";

      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  // ... (rest of your UI code remains unchanged)


  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
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
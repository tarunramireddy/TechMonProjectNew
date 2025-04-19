import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';


export default function NotFoundScreen() {
  const { isDarkMode } = useTheme();
const themeStyles = isDarkMode ? darkStyles : styles;

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={themeStyles.container}>
        <Text style={themeStyles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={themeStyles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Light background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // Dark text
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e', // Dark background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff', // Light text for dark background
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});


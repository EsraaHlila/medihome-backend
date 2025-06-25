import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <View style={styles.circle}>
      <Image
        source={require('../assets/welcome.png')}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.title}>Welcome to Sahtek!</Text>
    <Text style={styles.subtitle}>
      Ready to take control of your health?{'\n'}Let's get started with your first booking.
    </Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.replace('Login')} 
    >
      <Text style={styles.buttonText}>Start Using Sahtek</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#27c46c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#27c46c',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;

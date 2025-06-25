import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation, onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
      else navigation.replace('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/splash.png')} style={styles.logo} />
      <Text style={styles.title}>Sahtek</Text>
      <Text style={styles.subtitle}>Your health, delivered.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9fff4', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#222' },
  subtitle: { fontSize: 16, color: '#555', marginTop: 8 },
});

export default SplashScreen;

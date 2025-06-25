import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const pages = [
  {
    image: require('../assets/labtest.png'),
    title: 'Get Lab Tests at Home',
    subtitle: 'Book blood or vitamin tests from your phone\nand we come to you.',
  },
  {
    image: require('../assets/nurse.png'),
    title: 'Need a Nurse?',
    subtitle: 'Request a certified nurse for home visits,\nanytime.',
  },
  {
    image: require('../assets/reports.png'),
    title: 'See Your Reports Online',
    subtitle: 'Receive your lab results as PDF directly on your app.',
  },
];

export default function OnboardingScreen({ navigation, onDone }) {
  const [page, setPage] = useState(0);

  const handleNext = () => setPage((prev) => prev + 1);
  const handleSkip = () => {
    if (onDone) {
      onDone();
    } else {
      navigation.replace('Welcome');
    }
  };
   const handleDone = () => {
    if (onDone) onDone();
    else navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.centeredContent}>
        <View style={styles.circle}>
          <Image source={pages[page].image} style={styles.icon} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{pages[page].title}</Text>
        <Text style={styles.subtitle}>{pages[page].subtitle}</Text>
      </View>

      {}
      <View style={styles.dotsRow}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dotBase,
              page === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        {page < 2 ? (
          <TouchableOpacity style={styles.greenButton} onPress={handleNext}>
            <Text style={styles.greenButtonText}>Next</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.greenButton} onPress={handleDone}>
            <Text style={styles.greenButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'flex-end', 
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: height * 0.08, 
    marginBottom: height * 0.10, 
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#27c46c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 150,
    height: 150,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24, 
  },
  dotBase: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#27c46c',
  },
  inactiveDot: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cfd8dc',
  },
  bottomBar: {
    width: width - 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },
  skipText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  greenButton: {
    backgroundColor: '#27c46c',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
    justifyContent: 'center',
  },
  greenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrow: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 6,
  },
});

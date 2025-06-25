import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const paymentMethods = [
  { key: 'edinar', label: 'E-Dinar', description: 'Digital payment via E-Dinar Smart', icon: require('../assets/sps.png') },
  { key: 'card', label: 'Carte Bancaire', description: 'Credit/Debit card payment', icon: require('../assets/carte.png') },
  { key: 'cash', label: 'Pay on Visit', description: 'Pay cash when service is provided', icon: require('../assets/cash.png') },
];

export default function BookTestScreen({ route, navigation }) {
  const { test } = route.params;
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [time, setTime] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');

  const handleDateChange = (event, selectedDate) => {
    setShowDate(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleConfirm = () => {
    alert('Booking confirmed!');

  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafb' }}>
      {}
      <View style={styles.header}>
        <Text style={styles.appName}>Sahtek</Text>
        <TouchableOpacity style={styles.supportBtn}>
          <View style={styles.supportDot} />
          <Text style={styles.supportText}>Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'< '}Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Book Appointment</Text>

        <Text style={styles.sectionTitle}>Service Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.testName}>{test.name}</Text>
          <Text style={styles.provider}>Provider: {test.provider}</Text>
          <Text style={styles.price}>Price: <Text style={{ color: '#27c46c' }}>{test.price}</Text></Text>
        </View>

        <Text style={styles.sectionTitle}>Your Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Text style={styles.sectionTitle}>Preferred Date</Text>
        <TouchableOpacity onPress={() => setShowDate(true)} style={styles.input}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.sectionTitle}>Preferred Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Select time"
          value={time}
          onChangeText={setTime}
        />

        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.paymentOption,
              selectedMethod === method.key && styles.selectedPayment,
            ]}
            onPress={() => setSelectedMethod(method.key)}
          >
            {method.icon && (
              <Image source={method.icon} style={styles.paymentIcon} />
            )}
            <View>
              <Text style={styles.paymentTitle}>{method.label}</Text>
              <Text style={styles.paymentDesc}>{method.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>

      {}
      <View style={styles.bottomNav}>
        <NavButton label="Home" icon="🏠" onPress={() => navigation.replace('Home')} />
        <NavButton label="Reports" icon="📄" onPress={() => navigation.replace('Reports')} />
        <NavButton label="Bookings" icon="📅" onPress={() => navigation.replace('Bookings')} />
        <NavButton label="Profile" icon="🧑" onPress={() => navigation.replace('Profile')} />
      </View>
    </View>
  );
}

function NavButton({ label, icon, onPress, active }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.navBtn}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={[styles.navLabel, active && { color: '#27c46c', fontWeight: 'bold' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#27c46c',
    paddingTop: 44,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  appName: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  supportBtn: {
    backgroundColor: '#ffffff33',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#b6f5c5',
    marginRight: 7,
  },
  supportText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  container: { padding: 20, backgroundColor: '#fff', paddingBottom: 40 },
  backLink: { marginLeft: 0, marginTop: 10, marginBottom: 8 },
  backText: { color: '#27c46c', fontSize: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 14 },
  sectionTitle: { fontWeight: 'bold', marginTop: 18, marginBottom: 6, color: '#222' },
  summaryBox: { backgroundColor: '#f6fafd', borderRadius: 8, padding: 14, marginBottom: 10 },
  testName: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  provider: { color: '#555', marginBottom: 2 },
  price: { fontWeight: 'bold', marginTop: 2 },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedPayment: {
    borderColor: '#27c46c',
    backgroundColor: '#e9fff4',
  },
  paymentIcon: { width: 32, height: 32, marginRight: 12 },
  paymentTitle: { fontWeight: 'bold', fontSize: 16 },
  paymentDesc: { color: '#555', marginTop: 2 },
  confirmBtn: {
    backgroundColor: '#27c46c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBtn: { alignItems: 'center', flex: 1 },
  navLabel: { fontSize: 13, color: '#888', marginTop: 2 },
});

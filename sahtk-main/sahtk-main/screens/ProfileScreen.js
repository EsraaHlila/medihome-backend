import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileScreen({ navigation }) {

  const [fullName, setFullName] = useState('Mohamed Ben Ali');
  const [phone, setPhone] = useState('+216 55 123 456');
  const [email, setEmail] = useState('mohamed.benali@email.com');
  const [address, setAddress] = useState('123 Avenue Habib Bourguiba, Tunis 1000');
  const [emergency, setEmergency] = useState('Leila Toumi  - +216 55 789 012');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [languageItems, setLanguageItems] = useState([
    { label: 'English', value: 'English' },
    { label: 'French', value: 'French' },
    { label: 'Arabic', value: 'Arabic' },
  ]);
  
  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState('Tunis');
  const [cityItems, setCityItems] = useState([
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Sousse', value: 'Sousse' },
    { label: 'Monastir', value: 'Monastir' },
    { label: 'Sfax', value: 'Sfax' },
  ]);
  const [search, setSearch] = useState('');

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
      {}
      <View style={styles.searchCityRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tests, packages..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={cityOpen}
            value={cityValue}
            items={cityItems}
            setOpen={setCityOpen}
            setValue={setCityValue}
            setItems={setCityItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            textStyle={{ color: '#000', fontSize: 16 }}
            zIndex={1000}
            zIndexInverse={3000}
            listMode="SCROLLVIEW"
            placeholder="Tunis"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <Text style={styles.profileTitle}>{"\u{1F464}"} My Profile</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Default Address</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Default Address"
            multiline
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={styles.input}
            value={emergency}
            onChangeText={setEmergency}
            placeholder="Emergency Contact"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Language</Text>
          <DropDownPicker
            open={languageOpen}
            value={language}
            items={languageItems}
            setOpen={setLanguageOpen}
            setValue={setLanguage}
            setItems={setLanguageItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            textStyle={{ color: '#000', fontSize: 16 }}
            zIndex={900}
            zIndexInverse={3000}
            placeholder="English"
          />
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {}
      <View style={styles.bottomNav}>
        <NavButton label="Home" icon="🏠" onPress={() => navigation.replace('Home')} />
        <NavButton label="Reports" icon="📄" onPress={() => navigation.replace('Reports')} />
        <NavButton label="Bookings" icon="📅" onPress={() => navigation.replace('Bookings')} />
        <NavButton label="Profile" icon="🧑" onPress={() => navigation.replace('Profile')} active />
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
  searchCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 18,
    zIndex: 1000,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    elevation: 1,
    borderColor: '#eee',
    borderWidth: 1,
  },
  dropdownContainer: {
    width: 110,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#eee',
    minHeight: 40,
    height: 40,
  },
  dropDownContainerStyle: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#eee',
  },
  profileTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginLeft: 18,
    marginTop: 12,
    marginBottom: 18,
  },
  formGroup: {
    marginHorizontal: 18,
    marginBottom: 16,
  },
  label: {
    color: '#444',
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#27c46c',
    borderRadius: 10,
    marginHorizontal: 18,
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
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

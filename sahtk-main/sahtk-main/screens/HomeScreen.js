import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const { width } = Dimensions.get('window');

const topPackages = [
  {
    title: 'Vitamin Profile Complete',
    price: '45 TND',
    desc: 'Comprehensive vitamin analysis including D, B12, B9, and more',
    tag: 'Most Popular',
    tagColor: '#e3fbe7',
    tagTextColor: '#27c46c',
  },
  {
    title: 'Heart Health',
    price: '60 TND',
    desc: 'Complete cholesterol and lipid profile',
    tag: 'Recommended',
    tagColor: '#e3fbe7',
    tagTextColor: '#27c46c',
  },
  {
    title: 'Diabetes Check',
    price: '35 TND',
    desc: 'Blood sugar, HbA1c and more for diabetes monitoring',
    tag: 'Best Value',
    tagColor: '#e3fbe7',
    tagTextColor: '#27c46c',
  },
];

const doctorCheckups = [
  {
    title: 'Complete Health Checkup',
    price: '120 TND',
    desc: 'Comprehensive health screening recommended by our medical team',
    tag: 'Doctor Recommended',
    tagColor: '#e3fbe7',
    tagTextColor: '#27c46c',
  },
  {
    title: 'Women’s Wellness',
    price: '90 TND',
    desc: 'Screening for women’s health including thyroid, iron, vitamin D',
    tag: 'Women',
    tagColor: '#f3e1f7',
    tagTextColor: '#a24bcf',
  },
  {
    title: 'Senior Care Package',
    price: '100 TND',
    desc: 'Essential tests for seniors: heart, kidney, liver, diabetes',
    tag: 'Senior',
    tagColor: '#e1f0fb',
    tagTextColor: '#3b82f6',
  },
];

const whyBook = [
  { icon: '✅', label: 'Verified labs & nurses' },
  { icon: '🛡️', label: 'Safe and clean care' },
  { icon: '⚡', label: 'Fast results' },
  { icon: '💰', label: 'Transparent pricing' },
];

export default function HomeScreen({ navigation }) {
  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState('Tunis');
  const [cityItems, setCityItems] = useState([
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Sousse', value: 'Sousse' },
    { label: 'Monastir', value: 'Monastir' },
    { label: 'Sfax', value: 'Sfax' },
  ]);

  const [search, setSearch] = useState('');

 
  const filteredPackages = topPackages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.desc.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCheckups = doctorCheckups.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.desc.toLowerCase().includes(search.toLowerCase())
  );

 
  const onCityOpen = useCallback(() => {
  
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8fafb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={cityOpen}
            value={cityValue}
            items={cityItems}
            setOpen={setCityOpen}
            setValue={setCityValue}
            setItems={setCityItems}
            onOpen={onCityOpen}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            textStyle={{ color: '#000', fontSize: 16 }}
            zIndex={1000}
            zIndexInverse={3000}
            listMode="SCROLLVIEW"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {}
        <View style={styles.rowCards}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookLab')}
          >
            <Image
              source={require('../assets/labtest.png')}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Book a Lab Test</Text>
            <Text style={styles.cardDesc}>
              Professional tests from verified labs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RequestNurse')}
          >
            <Image
              source={require('../assets/nurse.png')}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Request a Nurse</Text>
            <Text style={styles.cardDesc}>Licensed nurses at your home</Text>
          </TouchableOpacity>
        </View>

        {}
        <Text style={styles.sectionTitle}>🔝 Top Booked Health Packages</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12, paddingLeft: 18 }}
        >
          {filteredPackages.map((pkg, i) => (
            <TouchableOpacity
              key={i}
              style={styles.pkgCard}
              onPress={() => navigation.navigate('PackageDetails', { pkg })}
            >
              <Text style={styles.pkgTitle}>{pkg.title}</Text>
              <Text style={styles.pkgPrice}>{pkg.price}</Text>
              <Text style={styles.pkgDesc}>{pkg.desc}</Text>
              <View
                style={[styles.pkgTag, { backgroundColor: pkg.tagColor }]}
              >
                <Text
                  style={{
                    color: pkg.tagTextColor,
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {pkg.tag}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {}
        <View style={styles.whyBox}>
          <Text style={styles.whyTitle}>Why Book with Us?</Text>
          <View style={styles.whyRow}>
            {whyBook.map((item, i) => (
              <View key={i} style={styles.whyItem}>
                <Text style={styles.whyIcon}>{item.icon}</Text>
                <Text style={styles.whyLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {}
        <Text style={styles.sectionTitle}>🧑‍⚕️ Doctor Curated Health Checkups</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24, paddingLeft: 18 }}
        >
          {filteredCheckups.map((pkg, i) => (
            <TouchableOpacity
              key={i}
              style={styles.pkgCard}
              onPress={() => navigation.navigate('PackageDetails', { pkg })}
            >
              <Text style={styles.pkgTitle}>{pkg.title}</Text>
              <Text style={styles.pkgPrice}>{pkg.price}</Text>
              <Text style={styles.pkgDesc}>{pkg.desc}</Text>
              <View
                style={[styles.pkgTag, { backgroundColor: pkg.tagColor }]}
              >
                <Text
                  style={{
                    color: pkg.tagTextColor,
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {pkg.tag}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {}
      <View style={styles.bottomNav}>
        <NavButton
          label="Home"
          icon="🏠"
          onPress={() => navigation.replace('Home')}
          active
        />
        <NavButton
          label="Reports"
          icon="📄"
          onPress={() => navigation.replace('Reports')}
        />
        <NavButton
          label="Bookings"
          icon="📅"
          onPress={() => navigation.replace('Bookings')}
        />
        <NavButton
          label="Profile"
          icon="🧑"
          onPress={() => navigation.replace('Profile')}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function NavButton({ label, icon, onPress, active }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.navBtn}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text
        style={[styles.navLabel, active && { color: '#27c46c', fontWeight: 'bold' }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#27c46c',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 120,
    zIndex: 1000, 
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#eee',
  },
  dropDownContainerStyle: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#eee',
  },
  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: (width - 56) / 2,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginHorizontal: 2,
  },
  cardIcon: { width: 48, height: 48, marginBottom: 10 },
  cardTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 4, color: '#222' },
  cardDesc: { color: '#888', fontSize: 13, textAlign: 'center' },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginLeft: 18,
    marginBottom: 10,
  },
  pkgCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 220,
    marginRight: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  pkgTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 2, color: '#222' },
  pkgPrice: { color: '#27c46c', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  pkgDesc: { color: '#888', fontSize: 13, marginBottom: 8 },
  pkgTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  whyBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginVertical: 14,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  whyTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 13, color: '#222' },
  whyRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  whyItem: { alignItems: 'center', width: '48%', marginBottom: 13, flexDirection: 'row' },
  whyIcon: { fontSize: 22, marginRight: 8 },
  whyLabel: { color: '#444', fontSize: 15 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  navBtn: { alignItems: 'center', flex: 1 },
  navLabel: { fontSize: 13, color: '#888', marginTop: 2 },
});

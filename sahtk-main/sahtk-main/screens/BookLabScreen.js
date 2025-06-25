import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const labData = [
  {
    id: 1,
    name: 'Laboratoire El Amen',
    address: 'Avenue Habib Bourguiba, Tunis',
    distance: '2.5 km',
    icon: require('../assets/lab1.png'), 
    rating: 4.8,
    reviews: 124,
    results: '12h',
  },
  {
    id: 2,
    name: 'Institut Pasteur',
    address: 'Rue Pasteur, Tunis',
    distance: '3.1 km',
    icon: require('../assets/test.png'), 
    rating: 4.9,
    reviews: 89,
    results: '15h',
  },
  {
    id: 3,
    name: 'Laboratoire Central',
    address: 'Centre Ville, Tunis',
    distance: '1.8 km',
    icon: require('../assets/logolab.png'), 
    rating: 4.3,
    reviews: 55,
    results: '10h',
  },
];

const cityItems = [
  { label: 'Tunis', value: 'Tunis' },
  { label: 'Sousse', value: 'Sousse' },
  { label: 'Monastir', value: 'Monastir' },
  { label: 'Sfax', value: 'Sfax' },
];

export default function BookLabScreen({ navigation }) {
  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState('Tunis');
  const [search, setSearch] = useState('');

  const filteredLabs = labData.filter(
    (lab) =>
      lab.name.toLowerCase().includes(search.toLowerCase()) &&
      (cityValue === 'Tunis' || lab.address.includes(cityValue))
  );

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
            setItems={() => {}}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
        {}
        <TouchableOpacity style={{ marginLeft: 18, marginTop: 10, marginBottom: 8 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#27c46c', fontSize: 16 }}>{'< '}Back to Home</Text>
        </TouchableOpacity>

        {}
        <Text style={styles.sectionTitle}>Partner Laboratories</Text>
        {filteredLabs.map((lab) => (
  <TouchableOpacity
    key={lab.id}
    style={styles.labCard}
    onPress={() => navigation.navigate('LabCategories', { labId: lab.id, labName: lab.name })}
  >
            <View style={styles.labIconBox}>
              <Image source={lab.icon} style={styles.labIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.labName}>{lab.name}</Text>
              <Text style={styles.labAddress}>{lab.address} • {lab.distance}</Text>
              <View style={styles.labInfoRow}>
                <Text style={styles.labStars}>★★★★★</Text>
                <Text style={styles.labRating}>
                  {lab.rating} ({lab.reviews} reviews)
                </Text>
                <Text style={styles.labResultTime}>Results in {lab.results}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginLeft: 18,
    marginBottom: 10,
  },
  labCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  labIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#e3fbe7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  labIcon: { width: 32, height: 32 },
  labName: { fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 },
  labAddress: { color: '#888', fontSize: 13, marginBottom: 6 },
  labInfoRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  labStars: { color: '#ffb300', fontSize: 14, marginRight: 4 },
  labRating: { color: '#444', fontSize: 13, marginRight: 10 },
  labResultTime: { color: '#27c46c', fontWeight: 'bold', fontSize: 13, marginLeft: 'auto' },
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

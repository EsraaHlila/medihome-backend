import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { categoryTests } from './categories';

export default function CategoryTestsScreen({ route, navigation }) {
  const { categoryKey, categoryName } = route.params;
  const tests = categoryTests[categoryKey] || [];


  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState('Tunis');
  const [cityItems, setCityItems] = useState([
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Sousse', value: 'Sousse' },
    { label: 'Monastir', value: 'Monastir' },
    { label: 'Sfax', value: 'Sfax' },
  ]);
  const [search, setSearch] = useState('');

 
  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(search.toLowerCase()) ||
      test.desc.toLowerCase().includes(search.toLowerCase())
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

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
  {}
  <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
    <Text style={styles.backText}>{'< '}Back to Categories</Text>
  </TouchableOpacity>

  {}
  <Text style={styles.sectionTitle}>{categoryName} Tests</Text>

  {}
  {filteredTests.map((test, idx) => (
    <TouchableOpacity
      key={idx}
      style={styles.testCard}
      onPress={() =>
        navigation.navigate('BookTest', {
          test: {
            name: test.name,
            desc: test.desc,
            price: test.price,
            provider: "Laboratoire El Amen", 
          }
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.testName}>{test.name}</Text>
        <Text style={styles.testDesc}>{test.desc}</Text>
      </View>
      <Text style={styles.testPrice}>{test.price}</Text>
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
  backLink: { marginLeft: 18, marginTop: 10, marginBottom: 8 },
  backText: { color: '#27c46c', fontSize: 16 },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginLeft: 18,
    marginBottom: 10,
  },
  testCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  testName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  testDesc: { color: '#888', fontSize: 13, marginTop: 2 },
  testPrice: { color: '#27c46c', fontWeight: 'bold', fontSize: 17, marginLeft: 10 },
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

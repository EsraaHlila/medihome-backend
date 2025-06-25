import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { testCategories } from './categories';

export default function LabCategoriesScreen({ navigation }) {
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

      {}
      <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{'< '}Back to Labs</Text>
      </TouchableOpacity>

      {}
      <Text style={styles.sectionTitle}>Test Categories</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {testCategories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={styles.catCard}
            onPress={() => navigation.navigate('CategoryTests', { categoryKey: cat.key, categoryName: cat.name })}
          >
            <Image source={cat.icon} style={styles.catIcon} />
            <Text style={styles.catName}>{cat.name}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  catCard: {
    width: 110, 
    height: 110, 
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  catIcon: { width: 54, height: 54, marginBottom: 10, resizeMode: 'contain' },
  catName: { fontWeight: 'bold', color: '#222', fontSize: 15, textAlign: 'center' },
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

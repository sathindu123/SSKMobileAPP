import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  LayoutDashboard, UserPlus, Search, Home, 
  Save, Edit3, Trash2, ChevronRight, Phone, 
  MapPin, Hash, User
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Dashboard එකේ වර්ණ පද්ධතිය (Same Palette)
const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Premium Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  leaf: '#74C69D'
};

const CustomerPortal = () => {
  const router = useRouter();
  
  // States
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    address: '',
    tel: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Functions
  const handleSave = () => {
    if (!formData.customerId || !formData.customerName) {
      Alert.alert("අවධානය", "කරුණාකර අනිවාර්ය විස්තර ඇතුළත් කරන්න.");
      return;
    }
    Alert.alert("සාර්ථකයි", "පාරිභෝගික විස්තර පද්ධතියට ඇතුළත් කරන ලදී.");
  };

  const handleBack = () => {
    router.replace('/dashbord'); // හෝ router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Custom Navbar --- */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.iconBg}>
            <UserPlus color={COLORS.white} size={20} />
          </View>
          <Text style={styles.navTitle}>CRM <Text style={{color: COLORS.accent}}>Pro</Text></Text>
        </View>
        <TouchableOpacity style={styles.homeBtn} onPress={handleBack}>
          <Home color={COLORS.primary} size={20} />
          <Text style={styles.homeBtnText}>Home</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          
          {/* --- Header & Stats --- */}
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.mainTitle}>Customer Management</Text>
              <Text style={styles.subTitle}>Manage business relationships efficiently.</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>TOTAL</Text>
                <Text style={styles.statValue}>1,284</Text>
              </View>
              <View style={[styles.statBox, { borderColor: COLORS.leaf }]}>
                <Text style={styles.statLabel}>ACTIVE</Text>
                <Text style={[styles.statValue, { color: COLORS.leaf }]}>42</Text>
              </View>
            </View>
          </View>

          {/* --- Data Entry Form (Bento Style) --- */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Customer Details</Text>
            
            <View style={styles.inputGroup}>
              <InputField label="CUSTOMER ID" placeholder="#C-1001" icon={<Hash size={18} color={COLORS.primary} opacity={0.5} />} onChange={(val) => setFormData({...formData, customerId: val})} />
              <InputField label="FULL NAME" placeholder="John Doe" icon={<User size={18} color={COLORS.primary} opacity={0.5} />} onChange={(val) => setFormData({...formData, customerName: val})} />
              <InputField label="ADDRESS" placeholder="No 23, Colombo Rd" icon={<MapPin size={18} color={COLORS.primary} opacity={0.5} />} onChange={(val) => setFormData({...formData, address: val})} />
              <InputField label="TELEPHONE" placeholder="+94 77 123 4567" icon={<Phone size={18} color={COLORS.primary} opacity={0.5} />} keyboardType="phone-pad" onChange={(val) => setFormData({...formData, tel: val})} />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Save color={COLORS.white} size={20} />
                <Text style={styles.saveBtnText}>SAVE CUSTOMER</Text>
              </TouchableOpacity>
              
              <View style={styles.secondaryActions}>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#F59E0B' }]}>
                  <Edit3 color={COLORS.white} size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: COLORS.danger }]}>
                  <Trash2 color={COLORS.white} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* --- Customer List / Directory --- */}
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.cardHeader}>Customer Directory</Text>
              <View style={styles.searchBox}>
                <Search color="#999" size={16} />
                <TextInput 
                  placeholder="Search..." 
                  style={styles.searchInput} 
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Sample Customer Card */}
            <CustomerItem 
               name="John Doe" 
               id="#C-00124" 
               address="No 12, Kandy Road" 
               tel="+94 77 123 4567" 
               status="Active" 
            />
            <CustomerItem 
               name="Mahesh Priyankara" 
               id="#C-00125" 
               address="Neluwa, Galle" 
               tel="+94 71 456 7890" 
               status="Active" 
            />

            <TouchableOpacity style={styles.viewMoreBtn}>
               <Text style={styles.viewMoreText}>Load More Records</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Reusable Components
const InputField = ({ label, placeholder, icon, keyboardType = "default", onChange }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputBox}>
      {icon}
      <TextInput 
        placeholder={placeholder} 
        style={styles.input} 
        keyboardType={keyboardType}
        placeholderTextColor="#999"
        onChangeText={onChange}
      />
    </View>
  </View>
);

const CustomerItem = ({ name, id, address, tel, status }) => (
  <View style={styles.customerCard}>
    <View style={styles.customerInfo}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.split(' ').map(n => n[0]).join('')}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.customerName}>{name}</Text>
        <Text style={styles.customerIdText}>ID: {id}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <View style={styles.contactDetails}>
       <View style={styles.detailRow}>
          <MapPin size={12} color="#888" />
          <Text style={styles.detailText}>{address}</Text>
       </View>
       <View style={styles.detailRow}>
          <Phone size={12} color="#888" />
          <Text style={styles.detailText}>{tel}</Text>
       </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navbar: {
    height: 70,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBg: { backgroundColor: COLORS.primary, padding: 8, borderRadius: 12 },
  navTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  homeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.bg, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  homeBtnText: { fontWeight: 'bold', color: COLORS.primary, fontSize: 14 },

  scrollBody: { padding: 20 },
  headerSection: { marginBottom: 25 },
  mainTitle: { fontSize: 26, fontWeight: '900', color: COLORS.primary },
  subTitle: { fontSize: 13, color: '#888', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  statBox: { backgroundColor: COLORS.white, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 18, borderWidth: 1, borderColor: COLORS.primary, minWidth: 100 },
  statLabel: { fontSize: 9, fontWeight: 'bold', color: '#999' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

  formCard: { backgroundColor: COLORS.white, borderRadius: 30, padding: 25, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15 },
  cardHeader: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
  inputGroup: { gap: 15 },
  inputWrapper: { gap: 5 },
  inputLabel: { fontSize: 10, fontWeight: 'bold', color: '#999', marginLeft: 5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: 15, paddingHorizontal: 15, height: 52 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  
  actionRow: { marginTop: 25, gap: 10 },
  saveBtn: { backgroundColor: COLORS.primary, height: 55, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 3 },
  saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
  secondaryActions: { flexDirection: 'row', gap: 10 },
  smallBtn: { flex: 1, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },

  listSection: { marginTop: 30, paddingBottom: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 12, height: 38, width: 140, borderWidth: 1, borderColor: '#eee' },
  searchInput: { flex: 1, marginLeft: 5, fontSize: 12 },

  // Customer Card List
  customerCard: { backgroundColor: COLORS.white, borderRadius: 22, padding: 15, marginBottom: 12, elevation: 2 },
  customerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#e8f0ed', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  customerName: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  customerIdText: { fontSize: 11, color: '#999' },
  statusBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#1E8E3E', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  contactDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5f5f5', gap: 5 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 12, color: '#666' },

  viewMoreBtn: { alignItems: 'center', marginTop: 10, padding: 10 },
  viewMoreText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13, opacity: 0.5 }
});

export default CustomerPortal;
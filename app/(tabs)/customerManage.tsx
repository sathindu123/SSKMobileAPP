import { saveCustomer, getCustomers } from '@/src/service/customerService';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  Hash,
  Home,
  MapPin,
  Phone,
  Save,
  Search,
  User,
  UserPlus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert, KeyboardAvoidingView,
  KeyboardTypeOptions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  primary: '#113023',    
  secondary: '#2D6A4F',  
  accent: '#D4AF37',     
  bg: '#F4F7F5',         
  white: '#ffffff',
  danger: '#E63946',
  leaf: '#74C69D',
  teaGreen: '#84a98c',
};

// Interfaces for TypeScript Errors
interface InputFieldProps {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  onChange: (text: string) => void;
  value?: string;
}

interface CustomerItemProps {
  name: string;
  id: string;
  address: string;
  tel: string;
  status: string;
}

const CustomerPortal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    address: '',
    tel: ''
  });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, [currentPage]); // පිටුව වෙනස් වන සෑම විටම දත්ත ලබා ගනී

  const [searchQuery, setSearchQuery] = useState('');

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      // Service එකට වර්තමාන පිටුව සහ ප්‍රමාණය යවයි
      const data = await getCustomers(currentPage, itemsPerPage);
      setCustomers(data);
    } catch (error) {
      Alert.alert("Error", "දත්ත ලබාගැනීමට නොහැකි විය.");
    }
    setIsLoading(false);
  };
 
  // Handle Save Method
  const handleSave = async () => {
    if (!formData.customerId || !formData.customerName || !formData.tel) {
      Alert.alert("අවධානය", "කරුණාකර අත්‍යවශ්‍ය තොරතුරු (ID, නම සහ දුරකථන අංකය) ඇතුළත් කරන්න.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await saveCustomer(formData);
      setIsLoading(false);
      if (response === "Success") {
        setShowSuccessModal(true);
        setFormData({ customerId: '', customerName: '', address: '', tel: '' });
        setCurrentPage(1); 
        loadCustomers();
      } else {
        Alert.alert("Error", response || "දත්ත සුරැකීමට නොහැකි විය.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "සර්වර් පද්ධතිය සමඟ සම්බන්ධ වීමට නොහැක.");
    }
  };

  const handleBack = () => {
    router.replace('/dashbord'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Navbar */}
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
          
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.mainTitle}>Customer Management</Text>
              <Text style={styles.subTitle}>Manage business relationships efficiently.</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>PAGE</Text>
                <Text style={styles.statValue}>{currentPage}</Text>
              </View>
              <View style={[styles.statBox, { borderColor: COLORS.leaf }]}>
                <Text style={styles.statLabel}>LOADED</Text>
                <Text style={[styles.statValue, { color: COLORS.leaf }]}>{customers.length}</Text>
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Customer Details</Text>
            
            <View style={styles.inputGroup}>
              <InputField 
                label="CUSTOMER ID" 
                placeholder="#C-1001" 
                value={formData.customerId}
                icon={<Hash size={18} color={COLORS.primary} opacity={0.5} />} 
                onChange={(val) => setFormData({...formData, customerId: val})} 
              />
              <InputField 
                label="FULL NAME" 
                placeholder="John Doe" 
                value={formData.customerName}
                icon={<User size={18} color={COLORS.primary} opacity={0.5} />} 
                onChange={(val) => setFormData({...formData, customerName: val})} 
              />
              <InputField 
                label="ADDRESS" 
                placeholder="No 23, Colombo Rd" 
                value={formData.address}
                icon={<MapPin size={18} color={COLORS.primary} opacity={0.5} />} 
                onChange={(val) => setFormData({...formData, address: val})} 
              />
              <InputField 
                label="TELEPHONE" 
                placeholder="+94 77 123 4567" 
                value={formData.tel}
                icon={<Phone size={18} color={COLORS.primary} opacity={0.5} />} 
                keyboardType="phone-pad" 
                onChange={(val) => setFormData({...formData, tel: val})} 
              />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Save color={COLORS.white} size={20} />
                    <Text style={styles.saveBtnText}>SAVE CUSTOMER</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* List Section */}
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

            {isLoading ? (
              <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
            ) : (
              customers.map((c:any,index:number)=>(
                <CustomerItem
                  key={index}
                  name={c.customerName}
                  id={c.customerId}
                  address={c.address}
                  tel={c.tel}
                  status="Active"
                />
              ))
            )}

            {/* Pagination UI */}
            <View style={styles.paginationContainer}>
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 1 && { opacity: 0.4 }]}
                    onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft color={COLORS.white} size={20} />
                    <Text style={styles.pageButtonText}>Prev</Text>
                </TouchableOpacity>

                <View style={styles.pageIndicator}>
                    <Text style={styles.pageIndicatorText}>{currentPage}</Text>
                </View>

                <TouchableOpacity 
                    style={[styles.pageButton, customers.length < itemsPerPage && { opacity: 0.4 }]}
                    onPress={() => setCurrentPage(prev => prev + 1)}
                    disabled={customers.length < itemsPerPage || isLoading}
                >
                    <Text style={styles.pageButtonText}>Next</Text>
                    <ChevronRight color={COLORS.white} size={20} />
                </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.iconCircle}>
              <CheckCircle2 color={COLORS.white} size={50} />
            </View>
            <Text style={styles.successTitle}>සාර්ථකයි!</Text>
            <Text style={styles.successMsg}>පාරිභෝගික තොරතුරු පද්ධතියට සාර්ථකව ඇතුළත් කරන ලදී.</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>හරි (OK)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

// Reusable Components
const InputField: React.FC<InputFieldProps> = ({ label, placeholder, icon, keyboardType = "default", onChange, value }) => (
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
        value={value}
      />
    </View>
  </View>
);

const CustomerItem: React.FC<CustomerItemProps> = ({ name, id, address, tel, status }) => (
  <View style={styles.customerCard}>
    <View style={styles.customerInfo}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name ? name.charAt(0) : 'C'}</Text>
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

  formCard: { backgroundColor: COLORS.white, borderRadius: 30, padding: 25, elevation: 4 },
  cardHeader: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 },
  inputGroup: { gap: 15 },
  inputWrapper: { gap: 5 },
  inputLabel: { fontSize: 10, fontWeight: 'bold', color: '#999', marginLeft: 5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: 15, paddingHorizontal: 15, height: 52 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  
  actionRow: { marginTop: 25, gap: 10 },
  saveBtn: { backgroundColor: COLORS.primary, height: 55, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },

  listSection: { marginTop: 30, paddingBottom: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 12, height: 38, width: 140, borderWidth: 1, borderColor: '#eee' },
  searchInput: { flex: 1, marginLeft: 5, fontSize: 12 },

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

  // Pagination Styles
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 10 },
  pageButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, gap: 5 },
  pageButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  pageIndicator: { backgroundColor: COLORS.white, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  pageIndicatorText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  successCard: { backgroundColor: COLORS.white, width: '100%', borderRadius: 30, padding: 30, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, backgroundColor: COLORS.teaGreen, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  successMsg: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
  modalButton: { backgroundColor: COLORS.primary, paddingVertical: 15, width: '100%', borderRadius: 20, alignItems: 'center' },
  modalButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});

export default CustomerPortal;
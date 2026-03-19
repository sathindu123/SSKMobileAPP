import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  Banknote, User, Calendar, Info, 
  Save, Trash2, RotateCcw, ClipboardList,
  Hash, ArrowRight
} from 'lucide-react-native';

// පද්ධතියේ පොදු වර්ණ පද්ධතිය
const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Premium Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  warning: '#B79D5C'     // Delete සඳහා
};

export default function AdvancePage() {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    installments: ''
  });

  const handleSave = () => {
    if (!formData.customerId || !formData.amount) {
      Alert.alert("අවධානය", "කරුණාකර අනිවාර්ය විස්තර ඇතුළත් කරන්න.");
      return;
    }
    Alert.alert("සාර්ථකයි", "අත්තිකාරම් දත්ත පද්ධතියට එක් කරන ලදී.");
  };

  const handleReset = () => {
    setFormData({ customerId: '', amount: '', date: '', installments: '' });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* --- Header Section --- */}
        <View style={styles.headerBanner}>
           <Banknote color={COLORS.accent} size={28} />
           <Text style={styles.headerTitle}>අත්තිකාරම් ගැනීම්</Text>
        </View>

        {/* --- Entry Form Card --- */}
        <View style={styles.formCard}>
           <View style={styles.inputGrid}>
              
              <InputGroup label="Customer ID" icon={<Hash size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="C004" value={formData.customerId} onChange={(v: string) => setFormData({...formData, customerId: v})} />
              
              <InputGroup label="Amount (මුදල)" icon={<Banknote size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="0.00" keyboardType="numeric" value={formData.amount} onChange={(v: string) => setFormData({...formData, amount: v})} />

              <InputGroup label="Date" icon={<Calendar size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="2025-10-17" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />

              <InputGroup label="Amount of Installments" icon={<Info size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="වාරික ගණන" keyboardType="numeric" value={formData.installments} onChange={(v: string) => setFormData({...formData, installments: v})} />

           </View>

           {/* Action Buttons */}
           <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.secondary}]} onPress={handleSave}>
                 <Save color="#fff" size={18} /><Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.warning}]}>
                 <Trash2 color="#fff" size={18} /><Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.danger}]} onPress={handleReset}>
                 <RotateCcw color="#fff" size={18} /><Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* --- Records List Section --- */}
        <View style={styles.listHeaderRow}>
            <ClipboardList color={COLORS.primary} size={20} />
            <Text style={styles.sectionTitle}>මෑතකාලීන අත්තිකාරම් ලබා ගැනීම්</Text>
        </View>
        
        {/* පින්තූරයේ ඇති දත්ත වලට අනුව සාදන ලද Cards */}
        <AdvanceRecordCard id="C001" name="Pushpa Ranjani" date="2025-10-16" amount="7000.0" />
        <AdvanceRecordCard id="C003" name="Kavindu Bimalka" date="2025-09-21" amount="500.0" />
        <AdvanceRecordCard id="C004" name="Sathindu Sathsara" date="2025-10-17" amount="12000.0" />
        <AdvanceRecordCard id="C005" name="Nimal Perera" date="2025-09-21" amount="50.0" />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Reusable Input Component
const InputGroup = ({ label, placeholder, icon, keyboardType = 'default', value, onChange }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputBox}>
      {icon}
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
      />
    </View>
  </View>
);

// Reusable Record Card Component
const AdvanceRecordCard = ({ id, name, date, amount }: any) => (
  <View style={styles.recordCard}>
     <View style={styles.recordLeft}>
        <View style={styles.idBadge}>
           <Text style={styles.idBadgeText}>{id}</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
           <Text style={styles.recordName}>{name}</Text>
           <Text style={styles.recordDate}>{date}</Text>
        </View>
     </View>
     <View style={styles.recordRight}>
        <Text style={styles.currencyText}>Rs.</Text>
        <Text style={styles.amountText}>{amount}</Text>
     </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollBody: { padding: 20, paddingBottom: 40 },
  
  headerBanner: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 20, 
    gap: 15,
    marginBottom: 20,
    elevation: 5
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },

  formCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: 30, 
    padding: 25, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 15 
  },
  inputGrid: { gap: 15 },
  inputWrapper: { gap: 5 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#999', marginLeft: 5, textTransform: 'uppercase' },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.bg, 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.primary, fontWeight: '500' },

  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 25 },
  actionBtn: { 
    flex: 1, 
    height: 50, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8,
    elevation: 3
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  listHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 30, marginBottom: 15, paddingLeft: 5 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  
  // Record Card
  recordCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: 22, 
    padding: 18, 
    marginBottom: 12, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    borderRightWidth: 5,
    borderRightColor: COLORS.accent
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center' },
  idBadge: { backgroundColor: COLORS.bg, width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  idBadgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  recordName: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  recordDate: { fontSize: 11, color: '#999', marginTop: 2 },
  recordRight: { alignItems: 'flex-end' },
  currencyText: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  amountText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary }
});
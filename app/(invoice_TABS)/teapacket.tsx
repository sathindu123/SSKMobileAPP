import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  Leaf, User, Calendar, Package, 
  Tag, Banknote, Save, Trash2, RotateCcw,
  ShoppingBag, ClipboardList
} from 'lucide-react-native';

// පද්ධතියේ ප්‍රධාන වර්ණ
const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Premium Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  warning: '#F59E0B'     // Update/Delete සඳහා
};

export default function TeaPacketPage() {
  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    productId: '',
    count: '',
    totalPrice: ''
  });

  const handleSave = () => {
    Alert.alert("සුරැකීම", "තේ පැකට් විකුණුම් දත්ත සුරැකීමට අවශ්‍යද?", [
      { text: "නැත", style: "cancel" },
      { text: "ඔව්", onPress: () => Alert.alert("සාර්ථකයි", "දත්ත සාර්ථකව සුරැකිණි!") }
    ]);
  };

  const handleReset = () => {
    setFormData({ customerId: '', date: '', productId: '', count: '', totalPrice: '' });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* --- Header Section --- */}
        <View style={styles.headerBanner}>
           <Leaf color={COLORS.accent} size={28} />
           <Text style={styles.headerTitle}>තේ පැකට් මිලදී ගැනීම්</Text>
        </View>

        {/* --- Entry Form Card --- */}
        <View style={styles.formCard}>
           <View style={styles.inputGrid}>
              
              <InputGroup label="Customer ID" icon={<User size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="C001" value={formData.customerId} onChange={(v: string) => setFormData({...formData, customerId: v})} />
              
              <InputGroup label="Date" icon={<Calendar size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="2025-10-17" value={formData.date} onChange={(v: string) => setFormData({...formData, date: v})} />

              <InputGroup label="Product ID" icon={<ShoppingBag size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="TEAPACKET (500g)" value={formData.productId} onChange={(v: string) => setFormData({...formData, productId: v})} />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <InputGroup label="Count" icon={<Tag size={18} color={COLORS.primary} opacity={0.5}/>} 
                    placeholder="1" keyboardType="numeric" value={formData.count} onChange={(v: string) => setFormData({...formData, count: v})} />
                </View>
                <View style={{ flex: 1.5 }}>
                  <InputGroup label="Total Price" icon={<Banknote size={18} color={COLORS.primary} opacity={0.5}/>} 
                    placeholder="750.0" keyboardType="numeric" value={formData.totalPrice} onChange={(v: string) => setFormData({...formData, totalPrice: v})} />
                </View>
              </View>

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

        {/* --- Records List --- */}
        <View style={styles.listHeaderRow}>
            <ClipboardList color={COLORS.primary} size={20} />
            <Text style={styles.sectionTitle}>මෑතකාලීන වාර්තා</Text>
        </View>
        
        <RecordCard name="Pushpa Ranjani" date="2025-10-16" product="TEAPACKET" count="1" price="750.0" />
        <RecordCard name="Sathindu Sathsara" date="2025-10-17" product="TEAPACKET" count="1" price="750.0" />
        <RecordCard name="Neluwa Mahesh" date="2025-10-18" product="TEAPACKET" count="2" price="1500.0" />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Reusable Components
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

const RecordCard = ({ name, date, product, count, price }: any) => (
  <View style={styles.recordCard}>
     <View style={styles.recordTop}>
        <View>
           <Text style={styles.recordName}>{name}</Text>
           <Text style={styles.recordDate}>{date}</Text>
        </View>
        <View style={styles.priceBadge}>
           <Text style={styles.priceText}>Rs. {price}</Text>
        </View>
     </View>
     <View style={styles.recordBottom}>
        <View style={styles.infoTag}>
           <Package size={12} color={COLORS.primary} />
           <Text style={styles.tagText}>{product}</Text>
        </View>
        <View style={styles.infoTag}>
           <Tag size={12} color={COLORS.primary} />
           <Text style={styles.tagText}>Qty: {count}</Text>
        </View>
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
  rowInputs: { flexDirection: 'row', gap: 15 },

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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  
  // Record Card
  recordCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: 22, 
    padding: 18, 
    marginBottom: 12, 
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent
  },
  recordTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recordName: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  recordDate: { fontSize: 11, color: '#999', marginTop: 2 },
  priceBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  priceText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },
  recordBottom: { flexDirection: 'row', gap: 15, marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  infoTag: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tagText: { fontSize: 12, color: '#666', fontWeight: '500' }
});
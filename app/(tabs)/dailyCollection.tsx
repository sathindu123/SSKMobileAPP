import React, { useState, useEffect } from 'react';
import {saveTeaLeaf} from '@/src/service/dailyTeaLeafService';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  Alert, KeyboardAvoidingView, Platform, 
  ActivityIndicator,
  Modal,
  TextInputSubmitEditingEvent
} from 'react-native';
import { 
  LayoutGrid, Calendar, Clock, LogOut, 
  Save, Trash2, Plus, Leaf, Hash, User,
  TrendingUp, ArrowLeft,
  CheckCircle2
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Premium Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  leaf: '#74C69D',
  teaGreen: '#84a98c'
};

const DailyUpdate = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [totalWeight, setTotalWeight] = useState(0.00);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [farmerId, setFarmerId] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [date, setFarmerDate] = useState('');
  const [goldLeaves, setGoldLeaves] = useState('');
  const [goodLeaves, setGoodLeaves] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveRecord = async () => {
    setIsLoading(true);
    if (!farmerId || !goldLeaves || !goodLeaves || !date) {
      Alert.alert("අවධානය", "කරුණාකර අනිවාර්ය දත්ත ඇතුළත් කරන්න.");
      return;
      setIsLoading(false);
    }
    
    const formData = {
      farmerId,
      farmerName,
      date,
      goldLeaves,
      goodLeaves
    }

    const res = await saveTeaLeaf(formData);
    setIsLoading(false);
    setShowSuccessModal(true);
    clearInputFeild();
  };

  const clearInputFeild = () => {
    setFarmerId('');
    setFarmerName('');
    setFarmerDate('');
    setGoldLeaves('');
    setGoodLeaves('');
  }

  function handleSaveStock(e: TextInputSubmitEditingEvent): void {
    Alert.alert('Function not implemented.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Top Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/dashbord')} style={styles.backBtn}>
          <ArrowLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Daily Update</Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTag}>
              <Calendar color={COLORS.primary} size={12} />
              <Text style={styles.dateText}>{new Date().toISOString().split('T')[0]}</Text>
            </View>
            <View style={styles.timeTag}>
              <Clock color={COLORS.accent} size={12} />
              <Text style={styles.timeText}>{currentTime}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* --- Total Weight Hero Card --- */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>මුළු එකතුව (TOTAL KG)</Text>
          <View style={styles.valueRow}>
            <Text style={styles.totalValue}>{totalWeight.toFixed(2)}</Text>
            <Text style={styles.unitText}>Kg</Text>
          </View>
          <View style={styles.cardFooter}>
            <TrendingUp color={COLORS.leaf} size={14} />
            <Text style={styles.footerText}>දෛනික තේ දළු එකතු කිරීමේ දත්ත</Text>
          </View>
        </View>

        {/* --- Data Entry Form --- */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <LayoutGrid color={COLORS.primary} size={18} />
            <Text style={styles.cardTitle}>දත්ත ඇතුළත් කරන්න</Text>
          </View>

          <View style={styles.inputGrid}>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>ID</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="#C-001" 
                  value={farmerId}
                  onChangeText={setFarmerId}
                   onSubmitEditing={handleSaveStock}
                />
             </View>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>නම</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="නම" 
                  value={farmerName}
                  onChangeText={setFarmerName}
                />
             </View>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>දිනය</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="දිනය" 
                  value={date}
                  onChangeText={setFarmerDate}
                />
             </View>
          </View>

          <View style={styles.inputGrid}>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>රන් දළු (Kg)</Text>
                <TextInput 
                  style={[styles.input, styles.accentBorder]} 
                  placeholder="0.00" 
                  keyboardType="numeric"
                  value={goldLeaves}
                  onChangeText={setGoldLeaves}
                />
             </View>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>හොඳ දළු (Kg)</Text>
                <TextInput 
                  style={[styles.input, styles.primaryBorder]} 
                  placeholder="0.00" 
                  keyboardType="numeric"
                  value={goodLeaves}
                  onChangeText={setGoodLeaves}
                />
             </View>
          </View>

          <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={handleSaveRecord} 
              disabled={isLoading}
          >
                            {isLoading ? (
                               <ActivityIndicator color={COLORS.white} />
                            ) : (
                               <>
                                  <Save color={COLORS.white} size={20} />
                                  <Text style={styles.saveBtnText}>ADD TO TABLE</Text>
                               </>
                            )}
          </TouchableOpacity>
        </View>

        {/* --- Table / List View --- */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
             <Text style={styles.tableTitle}>වගුව (Current Table)</Text>
             <Text style={styles.recordCount}>0 Records</Text>
          </View>
          
          <View style={styles.emptyState}>
             <Leaf color={COLORS.primary} opacity={0.1} size={40} />
             <Text style={styles.emptyText}>දත්ත ඇතුළත් කිරීමට ඉහත පෝරමය භාවිතා කරන්න</Text>
          </View>

          <View style={styles.footerActions}>
             <TouchableOpacity style={styles.deleteBtn}>
                <Trash2 color={COLORS.danger} size={18} />
                <Text style={styles.deleteText}>DELETE</Text>
             </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
      <Modal visible={showSuccessModal} transparent animationType="fade">
               <View style={styles.modalBackdrop}>
                  <View style={styles.successCard}>
                     <View style={styles.iconCircle}>
                     <CheckCircle2 color={COLORS.white} size={50} />
                     </View>
                     <Text style={styles.successTitle}>සාර්ථකයි!</Text>
                     <Text style={styles.successMsg}>‌තොරතුරු පද්ධතියට සාර්ථකව ඇතුළත් කරන ලදී.</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  backBtn: { padding: 8, backgroundColor: COLORS.bg, borderRadius: 12, marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  dateTimeRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  dateTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF9E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 10, color: COLORS.primary, fontWeight: 'bold' },
  timeText: { fontSize: 10, color: COLORS.accent, fontWeight: 'bold' },

  scrollBody: { padding: 20 },

  // Hero Total Card
  totalCard: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 15
  },
  totalLabel: { color: COLORS.white, opacity: 0.6, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginVertical: 10 },
  totalValue: { fontSize: 50, fontWeight: '900', color: COLORS.white },
  unitText: { fontSize: 20, color: COLORS.accent, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  footerText: { color: COLORS.white, opacity: 0.4, fontSize: 10, fontWeight: 'bold' },

  // Form Card
  formCard: { backgroundColor: COLORS.white, borderRadius: 30, padding: 25, elevation: 4, marginBottom: 20 },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  inputGrid: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  inputHalf: { flex: 1, gap: 5 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#888', marginLeft: 5 },
  input: { backgroundColor: COLORS.bg, height: 50, borderRadius: 15, paddingHorizontal: 15, fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  accentBorder: { borderLeftWidth: 4, borderLeftColor: COLORS.accent },
  primaryBorder: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  addBtn: { backgroundColor: COLORS.primary, height: 55, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  addBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },

  // Table Card
  tableCard: { backgroundColor: COLORS.white, borderRadius: 30, padding: 25, elevation: 4, minHeight: 250 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tableTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  recordCount: { fontSize: 11, color: COLORS.accent, fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { textAlign: 'center', fontSize: 12, color: '#BBB', width: '80%', lineHeight: 18 },
  footerActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  deleteBtn: { flex: 1, height: 50, backgroundColor: '#FFF5F5', borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  deleteText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 12 },
  saveBtn: { flex: 2, height: 50, backgroundColor: COLORS.secondary, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  saveText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
  alertText: { fontSize: 11, color: COLORS.danger, fontWeight: '600' },
   modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
   successCard: { backgroundColor: COLORS.white, width: '100%', borderRadius: 30, padding: 30, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, backgroundColor: COLORS.teaGreen, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  successMsg: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
  modalButton: { backgroundColor: COLORS.primary, paddingVertical: 15, width: '100%', borderRadius: 20, alignItems: 'center' },
  modalButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});

export default DailyUpdate;
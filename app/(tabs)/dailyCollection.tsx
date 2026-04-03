import React, { useState, useEffect } from 'react';
import { saveTeaLeaf, getTeaLeaves, getNameDailyLeaf } from '@/src/service/dailyTeaLeafService'; 
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  Alert, Platform, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { 
  LayoutGrid, Calendar, Clock, 
  Save, Trash2, Leaf, ArrowLeft,
  CheckCircle2
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#113023',
  secondary: '#2D6A4F',
  accent: '#D4AF37',
  bg: '#F4F7F5',
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
  

  const [records, setRecords] = useState<any[]>([]); 

  const [farmerId, setFarmerId] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [date, setFarmerDate] = useState(new Date().toISOString().split('T')[0]);
  const [goldLeaves, setGoldLeaves] = useState('');
  const [goodLeaves, setGoodLeaves] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    loadTable(); 
    return () => clearInterval(timer);
  }, []);

  const loadTable = async () => {
    setIsLoading(true);
    try {
      const data = await getTeaLeaves();
      if (data && Array.isArray(data)) {
        setRecords(data);
        const total = data.reduce((sum: number, item: any) => 
          sum + (parseFloat(item.goldLeaves) || 0) + (parseFloat(item.goodLeaves) || 0), 0);
        setTotalWeight(total);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error loading table:", error);
    }finally {
    setIsLoading(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!farmerId || !goldLeaves || !goodLeaves) {
      Alert.alert("අවධානය", "කරුණාකර විස්තර ඇතුළත් කරන්න.");
      return;
    }
    
    setIsLoading(true);
    const formData = { farmerId, farmerName, date, goldLeaves, goodLeaves };

    try {
      await saveTeaLeaf(formData);
      setShowSuccessModal(true);
      clearInputFeild();
      loadTable(); 
    } catch (error) {
      Alert.alert("Error", "දත්ත සුරැකීමට නොහැකි විය.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearInputFeild = () => {
    setFarmerId('');
    setFarmerName('');
    setGoldLeaves('');
    setGoodLeaves('');
  };

  async function searchFarmer(): Promise<void> {
    try{
       const res = await getNameDailyLeaf(farmerId);
    }catch(err){

    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/dashbord')} style={styles.backBtn}>
          <ArrowLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Daily Update</Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTag}>
              <Calendar color={COLORS.primary} size={12} />
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.timeTag}>
              <Clock color={COLORS.accent} size={12} />
              <Text style={styles.timeText}>{currentTime}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>මුළු එකතුව (TOTAL KG)</Text>
          <View style={styles.valueRow}>
            <Text style={styles.totalValue}>{totalWeight.toFixed(2)}</Text>
            <Text style={styles.unitText}>Kg</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <LayoutGrid color={COLORS.primary} size={18} />
            <Text style={styles.cardTitle}>දත්ත ඇතුළත් කරන්න</Text>
          </View>

          <View style={styles.inputGrid}>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>Farmer ID</Text>
                <TextInput style={styles.input} placeholder="#C-001" value={farmerId} onChangeText={setFarmerId} onSubmitEditing={() => searchFarmer()}/>
             </View>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>නම</Text>
                <TextInput style={styles.input} placeholder="නම" value={farmerName} onChangeText={setFarmerName} />
             </View>
          </View>

          <View style={styles.inputGrid}>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>රන් දළු (Kg)</Text>
                <TextInput style={[styles.input, styles.accentBorder]} placeholder="0.00" keyboardType="numeric" value={goldLeaves} onChangeText={setGoldLeaves} />
             </View>
             <View style={styles.inputHalf}>
                <Text style={styles.label}>හොඳ දළු (Kg)</Text>
                <TextInput style={[styles.input, styles.primaryBorder]} placeholder="0.00" keyboardType="numeric" value={goodLeaves} onChangeText={setGoodLeaves} />
             </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRecord} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color={COLORS.white} /> : (
                 <><Save color={COLORS.white} size={20} /><Text style={styles.saveBtnText}>ADD TO TABLE</Text></>
              )}
          </TouchableOpacity>
        </View>

        {/* --- Custom Table Section --- */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
             <Text style={styles.tableTitle}>දෛනික ලේඛනය</Text>
             <Text style={styles.recordCount}>{records.length} Records</Text>
          </View>
          
          <View style={styles.tableHeadRow}>
             <Text style={[styles.headCell, { flex: 2 }]}>නම</Text>
             <Text style={[styles.headCell, { flex: 1.5 }]}>දිනය</Text>
             <Text style={[styles.headCell, { flex: 1, textAlign: 'right' }]}>රන්</Text>
             <Text style={[styles.headCell, { flex: 1, textAlign: 'right' }]}>හොඳ</Text>
          </View>

          <View style={styles.tableBodyContainer}>
             <ScrollView nestedScrollEnabled={true}>
                {records.length > 0 ? (
                  records.map((item: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                       <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>
                         {item.farmerName || 'N/A'}
                       </Text>
                       <Text style={[styles.cell, { flex: 1.5 }]}>{item.date}</Text>
                       <Text style={[styles.cell, { flex: 1, textAlign: 'right', color: COLORS.accent }]}>
                         {item.goldLeaves}
                       </Text>
                       <Text style={[styles.cell, { flex: 1, textAlign: 'right', color: COLORS.secondary }]}>
                         {item.goodLeaves}
                       </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                     <Leaf color={COLORS.primary} opacity={0.1} size={30} />
                     <Text style={styles.emptyText}>දත්ත නොමැත</Text>
                  </View>
                )}
             </ScrollView>
          </View>
        </View>

      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.iconCircle}><CheckCircle2 color={COLORS.white} size={50} /></View>
            <Text style={styles.successTitle}>සාර්ථකයි!</Text>
            <Text style={styles.successMsg}>දත්ත සාර්ථකව ඇතුළත් කරන ලදී.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.modalButtonText}>හරි</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles (ඉහත කේතයේ මෙන්ම පවතී)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: COLORS.white, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  backBtn: { padding: 8, backgroundColor: COLORS.bg, borderRadius: 12, marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  dateTimeRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  dateTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF9E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 10, color: COLORS.primary, fontWeight: 'bold' },
  timeText: { fontSize: 10, color: COLORS.accent, fontWeight: 'bold' },
  scrollBody: { padding: 20 },
  totalCard: { backgroundColor: COLORS.primary, borderRadius: 30, padding: 20, alignItems: 'center', marginBottom: 20 },
  totalLabel: { color: COLORS.white, opacity: 0.6, fontSize: 10, fontWeight: 'bold' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  totalValue: { fontSize: 40, fontWeight: '900', color: COLORS.white },
  unitText: { fontSize: 18, color: COLORS.accent, fontWeight: 'bold' },
  formCard: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, elevation: 3, marginBottom: 20 },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  inputGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputHalf: { flex: 1, gap: 4 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#888', marginLeft: 5 },
  input: { backgroundColor: COLORS.bg, height: 45, borderRadius: 12, paddingHorizontal: 12, fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  accentBorder: { borderLeftWidth: 4, borderLeftColor: COLORS.accent },
  primaryBorder: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  saveBtn: { backgroundColor: COLORS.secondary, height: 50, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  tableCard: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, elevation: 3, height: 350 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  tableTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  recordCount: { fontSize: 11, color: COLORS.accent, fontWeight: 'bold' },
  tableHeadRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, marginBottom: 5 },
  headCell: { fontSize: 11, fontWeight: 'bold', color: '#999', textTransform: 'uppercase' },
  tableBodyContainer: { flex: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9F9F9', alignItems: 'center' },
  cell: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 12, color: '#ccc', marginTop: 10 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  successCard: { backgroundColor: COLORS.white, width: '80%', borderRadius: 30, padding: 30, alignItems: 'center' },
  iconCircle: { width: 70, height: 70, backgroundColor: COLORS.teaGreen, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  successMsg: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 15 },
  modalButton: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15 },
  modalButtonText: { color: COLORS.white, fontWeight: 'bold' }
});

export default DailyUpdate;
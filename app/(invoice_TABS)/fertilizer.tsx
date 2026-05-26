import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { 
  ShoppingBag, User, Calendar, Package, 
  Tag, Banknote, Save, Trash2, RotateCcw,
  ChevronRight, Info,
  CheckCircle2
} from 'lucide-react-native';

import {
  getPohoraData,
  savePohora
} from '@/src/service/invoiceService';

// පද්ධතියේ ප්‍රධාන වර්ණ
const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Premium Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  warning: '#B79D5C',
  teaGreen: '#84a98c'
};

export default function FertilizerPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
    const [tableLoading, setTableLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
  
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [advanceList, setAdvanceList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    productId: '',
    count: '',
    totalPrice: '',
    installments: ''
  });

    useEffect(() => {
      loadTable(1);
    }, []);

  const handleSave = async () => {

        if (
          !formData.customerId ||
          !formData.totalPrice ||
          !formData.count ||
          !formData.productId ||
          !formData.date ||
          !formData.installments
        ) {
          Alert.alert("අවධානය", "කරුණාකර සියලුම විස්තර ඇතුළත් කරන්න.");
          return;
        }

     try {
    
          setSaveLoading(true);
    
          await savePohora(formData);
    
          setShowSuccessModal(true);
    
          setFormData({
            customerId: '',
            date: new Date().toISOString().split('T')[0],
            productId: '',
            count: '',
            totalPrice: '',
            installments: '1'
          });
    
          loadTable(1);
    
        } catch (err) {
          console.log(err);
          Alert.alert("Error", "Save failed");
        } finally {
          setSaveLoading(false);
        }
  };

   const loadTable = async (pageNumber: number) => {
  
      try {
        setTableLoading(true);
  
        const response = await getPohoraData(pageNumber, 5);
  
        setAdvanceList(response.data);
        setPage(pageNumber);
        setHasMore(response.hasMore);
  
      } catch (error) {
        console.log("Load Error:", error);
      } finally {
        setTableLoading(false);
      }
    };

    const handleNext = () => {
    if (hasMore) {
      loadTable(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      loadTable(page - 1);
    }
  };


  const handleReset = () => {
    setFormData({ customerId: '', date: '', productId: '', count: '', totalPrice: '', installments: '' });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* --- Header Section --- */}
        <View style={styles.headerBanner}>
           <ShoppingBag color={COLORS.accent} size={28} />
           <Text style={styles.headerTitle}>පොහොර මිලදී ගැනීම්</Text>
        </View>

        {/* --- Entry Form Card --- */}
        <View style={styles.formCard}>
           <View style={styles.inputGrid}>
              
              <InputGroup label="Customer ID" icon={<User size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="C004" value={formData.customerId} onChange={(v: any) => setFormData({...formData, customerId: v})} />
              
              <InputGroup label="Date" icon={<Calendar size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="2025-10-17" value={formData.date} onChange={(v: any) => setFormData({...formData, date: v})} />

              <InputGroup label="Product ID" icon={<Package size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="T-200 (50Kg)" value={formData.productId} onChange={(v: any) => setFormData({...formData, productId: v})} />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <InputGroup label="Count" icon={<Tag size={18} color={COLORS.primary} opacity={0.5}/>} 
                    placeholder="2" keyboardType="numeric" value={formData.count} onChange={(v: any) => setFormData({...formData, count: v})} />
                </View>
                <View style={{ flex: 1.5 }}>
                  <InputGroup label="Total Price" icon={<Banknote size={18} color={COLORS.primary} opacity={0.5}/>} 
                    placeholder="18000.0" keyboardType="numeric" value={formData.totalPrice} onChange={(v: any) => setFormData({...formData, totalPrice: v})} />
                </View>
              </View>

              <InputGroup label="Amount of Installments" icon={<Info size={18} color={COLORS.primary} opacity={0.5}/>} 
                placeholder="වාරික මුදල" keyboardType="numeric" value={formData.installments} onChange={(v: any) => setFormData({...formData, installments: v})} />

           </View>

           {/* Action Buttons (Aligned with Image) */}
           <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.secondary}]} onPress={handleSave} disabled={saveLoading}>
                
                 {saveLoading ? (
                                   <ActivityIndicator color="#fff" />
                                 ) : (
                                   <>
                                     <Save color="#fff" size={18} />
                                     <Text style={styles.btnText}>Save</Text>
                                   </>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.warning}]}>
                 <Trash2 color="#fff" size={18} /><Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.danger}]} onPress={handleReset}>
                 <RotateCcw color="#fff" size={18} /><Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* --- Records List (Mobile Table Style) --- */}
        <Text style={styles.sectionTitle}>පසුගිය වාර්තා (Recent Purchases)</Text>
        
        {tableLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          advanceList && advanceList.map((item, index) => {
         
            return (
              <PurchaseCard
                key={index}
                customerName={item.customerName}
                date={item.date}
                product={item.productI} 
                count={item.count}
                price={item.monthlyPrice}
              />
            );
          })
        )}

          {/* PAGINATION */}
                  <View style={styles.paginationRow}>
        
                    <TouchableOpacity
                      style={[styles.pageBtn, page === 1 && { opacity: 0.5 }]}
                      onPress={handlePrev}
                      disabled={page === 1}
                    >
                      <Text style={styles.pageBtnText}>Previous</Text>
                    </TouchableOpacity>
        
                    <Text style={styles.pageText}>Page {page}</Text>
        
                    <TouchableOpacity
                      style={[styles.pageBtn, !hasMore && { opacity: 0.5 }]}
                      onPress={handleNext}
                      disabled={!hasMore}
                    >
                      <Text style={styles.pageBtnText}>Next</Text>
                    </TouchableOpacity>
        
                  </View>
        
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

const PurchaseCard = ({ customerName, date, product, count, price }: any) => (
  <View style={styles.recordCard}>
     <View style={styles.recordTop}>
        {/* flex: 1 එක් කිරීමෙන් නම සඳහා අවශ්‍ය ඉඩ වෙන් කර ගනී */}
        <View style={{ flex: 1, marginRight: 10 }}> 
           <Text style={styles.recordName} numberOfLines={1}>
             {customerName ? customerName : "Unknown Customer"}
           </Text>
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
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },

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

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginTop: 30, marginBottom: 15 },
  
 
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },

  pageBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10
  },

  pageBtnText: { color: '#fff' },

  pageText: { fontWeight: 'bold' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  successCard: { backgroundColor: COLORS.white, width: '80%', borderRadius: 30, padding: 30, alignItems: 'center' },
  iconCircle: { width: 70, height: 70, backgroundColor: COLORS.teaGreen, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  successMsg: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 15 },
  modalButton: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15 },
  modalButtonText: { color: COLORS.white, fontWeight: 'bold' },
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
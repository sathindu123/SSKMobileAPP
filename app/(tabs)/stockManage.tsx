import { getStock, saveStock } from '@/src/service/stockService';
import { useRouter } from 'expo-router';
import {
   AlertCircle,
   ArrowLeft,
   Box,
   CheckCircle2,
   ChevronLeft,
   ChevronRight,
   Hash,
   Package,
   Save,
   ShoppingBag,
   Tag
} from 'lucide-react-native';
import React, { useState, useEffect} from 'react';
import {
   ActivityIndicator,
   Alert, KeyboardAvoidingView, Modal, Platform,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View
} from 'react-native';

// ප්‍රධාන වර්ණ පද්ධතිය
const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  leaf: '#74C69D',
  teaGreen: '#84a98c',
};

const StockManagement = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [stocks, setStocks] = useState([]); // තොග දත්ත ගබඩා කිරීමට
   const router = useRouter();
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   
   // Pagination States
   const [currentPage, setCurrentPage] = useState(1);
   const [hasMore, setHasMore] = useState(true); // ඊළඟ පිටුවක් තිබේදැයි බැලීමට
   const itemsPerPage = 5;

   useEffect(() =>{
      loadStock();
   }, [currentPage]);

  const [formData, setFormData] = useState({
    id: '',
    productName: '',
    count: '',
    price: ''
  });

const loadStock = async () => {
  setIsLoading(true);

  try {
    const response = await getStock(currentPage, itemsPerPage);
      setStocks(response);
      setHasMore(currentPage < response.totalPages);
    

  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Stock data load කරන්න බැරි වුණා");
  } finally {
    setIsLoading(false);
  }
};

  const handleSaveStock = async () => {
    if (!formData.productName || !formData.count || !formData.price) {
      Alert.alert("අවධානය", "කරුණාකර සියලු විස්තර ඇතුළත් කරන්න.");
      return;
    }
    
    setIsLoading(true);
    const res = await saveStock(formData);
    setIsLoading(false);
    setShowSuccessModal(true);
    clearFormData();
    loadStock(); // අලුත් දත්ත පෙන්වීමට රීලෝඩ් කරන්න
  };

  const clearFormData = () =>{
   setFormData({ id: '', productName: '', count: '', price: '' });
  }



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.replace('/dashbord')} style={styles.backBtn}>
          <ArrowLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.navTitle}>Stock Manage</Text>
          <Text style={styles.navSub}>Inventory & Supplies</Text>
        </View>
        <View style={styles.iconCircle2}>
          <Box color={COLORS.accent} size={20} />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
             <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>මුළු තොග වටිනාකම</Text>
                <Text style={styles.summaryValue}>Rs. 84,500</Text>
             </View>
             <View style={[styles.summaryCard, { backgroundColor: COLORS.primary }]}>
                <Text style={[styles.summaryLabel, { color: COLORS.white, opacity: 0.6 }]}>අඩු තොග (Low Stock)</Text>
                <Text style={[styles.summaryValue, { color: COLORS.white }]}>03 Items</Text>
             </View>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
               <Package color={COLORS.primary} size={20} />
               <Text style={styles.cardTitle}>නව තොග ඇතුළත් කිරීම</Text>
            </View>

            <View style={styles.inputGrid}>
               <View style={styles.inputWrapper}>
                  <Text style={styles.label}>PRODUCT ID</Text>
                  <View style={styles.inputBox}>
                     <Hash color={COLORS.primary} opacity={0.4} size={16} />
                     <TextInput 
                        style={styles.input}
                        value={formData.id}  
                        placeholder="#P-501" 
                        onChangeText={(val) => setFormData({...formData, id: val})}
                     />
                  </View>
               </View>

               <View style={styles.inputWrapper}>
                  <Text style={styles.label}>PRODUCT NAME</Text>
                  <View style={styles.inputBox}>
                     <ShoppingBag color={COLORS.primary} opacity={0.4} size={16} />
                     <TextInput 
                        style={styles.input}
                        value={formData.productName}  
                        placeholder="පොහොර මල්ල (50kg)" 
                        onChangeText={(val) => setFormData({...formData, productName: val})}
                     />
                  </View>
               </View>

               <View style={styles.rowInputs}>
                  <View style={[styles.inputWrapper, { flex: 1 }]}>
                     <Text style={styles.label}>COUNT</Text>
                     <View style={styles.inputBox}>
                        <Tag color={COLORS.primary} opacity={0.4} size={16} />
                        <TextInput 
                           style={styles.input} 
                           value={formData.count} 
                           placeholder="00" 
                           keyboardType="numeric"
                           onChangeText={(val) => setFormData({...formData, count: val})}
                        />
                     </View>
                  </View>
                  <View style={[styles.inputWrapper, { flex: 1.5 }]}>
                     <Text style={styles.label}>PRICE</Text>
                     <View style={styles.inputBox}>
                        <Text style={styles.currency}>Rs.</Text>
                        <TextInput 
                           style={styles.input} 
                           value={formData.price} 
                           placeholder="0.00" 
                           keyboardType="numeric"
                           onChangeText={(val) => setFormData({...formData, price: val})}
                        />
                     </View>
                  </View>
               </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveStock} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color={COLORS.white} /> : (
                     <><Save color={COLORS.white} size={20} /><Text style={styles.saveBtnText}>SAVE TO INVENTORY</Text></>
                  )}
               </TouchableOpacity>
            </View>
          </View>

          {/* Current Inventory List with Pagination */}
          <View style={styles.listSection}>
             <View style={styles.listHeader}>
                <Text style={styles.cardTitle}>පවතින තොග ({stocks.length})</Text>
                <View style={styles.pageIndicatorBox}>
                   <Text style={styles.pageText}>Page {currentPage}</Text>
                </View>
             </View>

             {stocks.length > 0 ? (
                stocks.map((item: any, index: number) => (
                   <StockItem 
                      key={index}
                      name={item.productName} 
                      id={item.id || `#P-${index}`} 
                      count={item.count} 
                      price={item.price} 
                      isLow={parseInt(item.count) < 5} 
                   />
                ))
             ) : (
                <View style={styles.emptyState}>
                   <Text style={styles.emptyText}>තොග දත්ත නොමැත.</Text>
                </View>
             )}

             {/* Pagination Buttons */}
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
                       style={[styles.pageButton, stocks.length < itemsPerPage && { opacity: 0.4 }]}
                       onPress={() => setCurrentPage(prev => prev + 1)}
                       disabled={stocks.length < itemsPerPage || isLoading}
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
               <Text style={styles.successMsg}>තොරතුරු පද්ධතියට සාර්ථකව ඇතුළත් කරන ලදී.</Text>
               <TouchableOpacity style={styles.modalButton} onPress={() => setShowSuccessModal(false)}>
                  <Text style={styles.modalButtonText}>හරි (OK)</Text>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>
    </SafeAreaView>
  );
};

const StockItem = ({ name, id, count, price, isLow }: any) => (
  <View style={styles.stockCard}>
     <View style={styles.stockMain}>
        <View style={[styles.productIcon, { backgroundColor: isLow ? '#FFF5F5' : '#F0F9F4' }]}>
           <Box color={isLow ? COLORS.danger : COLORS.primary} size={22} />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
           <Text style={styles.stockName}>{name}</Text>
           <Text style={styles.stockId}>ID: {id}</Text>
        </View>
        <View style={styles.stockPriceInfo}>
           <Text style={styles.stockPrice}>Rs. {price}</Text>
           <View style={[styles.countBadge, { backgroundColor: isLow ? COLORS.danger : COLORS.secondary }]}>
              <Text style={styles.countText}>{count} In Stock</Text>
           </View>
        </View>
     </View>
     {isLow && (
        <View style={styles.alertBar}>
           <AlertCircle color={COLORS.danger} size={12} />
           <Text style={styles.alertText}>මෙම අයිතමය තොග අවසන් වෙමින් පවතී!</Text>
        </View>
     )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navbar: { 
    height: 80, backgroundColor: COLORS.white, flexDirection: 'row', 
    alignItems: 'center', paddingHorizontal: 20, justifyContent: 'space-between',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1
  },
  backBtn: { padding: 8, backgroundColor: COLORS.bg, borderRadius: 12 },
  navTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  navSub: { fontSize: 10, color: COLORS.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  iconCircle2: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },

  scrollBody: { padding: 20 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: COLORS.white, padding: 18, borderRadius: 25, elevation: 2 },
  summaryLabel: { fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 5 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 10 },
  pageButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, gap: 5 },
  pageButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  pageIndicator: { backgroundColor: COLORS.white, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  pageIndicatorText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },


  card: { backgroundColor: COLORS.white, borderRadius: 30, padding: 25, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 25 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  inputGrid: { gap: 18 },
  inputWrapper: { gap: 6 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#999', marginLeft: 5 },
  inputBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, 
    borderRadius: 15, paddingHorizontal: 15, height: 52, borderWidth: 1, borderColor: 'rgba(0,0,0,0.02)' 
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  rowInputs: { flexDirection: 'row', gap: 15 },
  currency: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, opacity: 0.4 },
  saveBtn: { 
    backgroundColor: COLORS.primary, height: 55, borderRadius: 18, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 
  },
  saveBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },

  // Pagination Styles
  listSection: { marginTop: 30, paddingBottom: 40 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pageIndicatorBox: { backgroundColor: COLORS.teaGreen, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  pageText: { fontSize: 12, color: COLORS.white, fontWeight: 'bold' },
  
  paginationRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 15 },
  pageBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: COLORS.white, paddingVertical: 12, borderRadius: 15, elevation: 2 
  },
  pageBtnText: { color: COLORS.primary, fontWeight: 'bold', marginHorizontal: 5 },
  disabledBtn: { opacity: 0.5, backgroundColor: '#eee' },
  
  emptyState: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#999', fontStyle: 'italic' },

  stockCard: { backgroundColor: COLORS.white, borderRadius: 22, padding: 15, marginBottom: 12, elevation: 2 },
  stockMain: { flexDirection: 'row', alignItems: 'center' },
  productIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  stockName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  stockId: { fontSize: 11, color: '#999', marginTop: 2 },
  stockPriceInfo: { alignItems: 'flex-end' },
  stockPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  countText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  alertBar: { 
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12, 
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5f5f5' 
  },
  alertText: { fontSize: 11, color: COLORS.danger, fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  successCard: { backgroundColor: COLORS.white, width: '100%', borderRadius: 30, padding: 30, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, backgroundColor: COLORS.teaGreen, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  successMsg: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
  modalButton: { backgroundColor: COLORS.primary, paddingVertical: 15, width: '100%', borderRadius: 20, alignItems: 'center' },
  modalButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});

export default StockManagement;
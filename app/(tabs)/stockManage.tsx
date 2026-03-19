import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, SafeAreaView, StatusBar, 
  Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  Box, Package, Hash, ShoppingBag, 
  Tag, Plus, Save, Trash2, ArrowLeft,
  ChevronRight, AlertCircle, Info
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// ප්‍රධාන වර්ණ පද්ධතිය
const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2D6A4F',  // Mid Green
  accent: '#D4AF37',     // Gold
  bg: '#F4F7F5',         // Soft Grey
  white: '#ffffff',
  danger: '#E63946',
  leaf: '#74C69D'
};

const StockManagement = () => {
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    id: '',
    productName: '',
    count: '',
    price: ''
  });

  const handleSaveStock = () => {
    if (!formData.productName || !formData.count || !formData.price) {
      Alert.alert("අවධානය", "කරුණාකර සියලු විස්තර ඇතුළත් කරන්න.");
      return;
    }
    Alert.alert("සාර්ථකයි", "තොග විස්තර පද්ධතියට එක් කරන ලදී.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- Top Navbar --- */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.replace('/dashbord')} style={styles.backBtn}>
          <ArrowLeft color={COLORS.primary} size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.navTitle}>Stock Manage</Text>
          <Text style={styles.navSub}>Inventory & Supplies</Text>
        </View>
        <View style={styles.iconCircle}>
          <Box color={COLORS.accent} size={20} />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          
          {/* --- Summary Cards --- */}
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

          {/* --- Add New Stock Form --- */}
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
                        placeholder="පොහොර මල්ල (50kg)" 
                        onChangeText={(val) => setFormData({...formData, productName: val})}
                     />
                  </View>
               </View>

               <View style={styles.rowInputs}>
                  <View style={[styles.inputWrapper, { flex: 1 }]}>
                     <Text style={styles.label}>COUNT (ප්‍රමාණය)</Text>
                     <View style={styles.inputBox}>
                        <Tag color={COLORS.primary} opacity={0.4} size={16} />
                        <TextInput 
                           style={styles.input} 
                           placeholder="00" 
                           keyboardType="numeric"
                           onChangeText={(val) => setFormData({...formData, count: val})}
                        />
                     </View>
                  </View>
                  <View style={[styles.inputWrapper, { flex: 1.5 }]}>
                     <Text style={styles.label}>PRICE (ඒකක මිල)</Text>
                     <View style={styles.inputBox}>
                        <Text style={styles.currency}>Rs.</Text>
                        <TextInput 
                           style={styles.input} 
                           placeholder="0.00" 
                           keyboardType="numeric"
                           onChangeText={(val) => setFormData({...formData, price: val})}
                        />
                     </View>
                  </View>
               </View>

               <TouchableOpacity style={styles.saveBtn} onPress={handleSaveStock}>
                  <Save color={COLORS.white} size={20} />
                  <Text style={styles.saveBtnText}>SAVE TO INVENTORY</Text>
               </TouchableOpacity>
            </View>
          </View>

          {/* --- Current Inventory List --- */}
          <View style={styles.listSection}>
             <View style={styles.listHeader}>
                <Text style={styles.cardTitle}>පවතින තොග (Current Stock)</Text>
                <TouchableOpacity>
                   <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
             </View>

             {/* Sample Stock Item */}
             <StockItem name="T-65 Fertilizer" id="#P-001" count={12} price="4,500.00" />
             <StockItem name="Tea Bags (Small)" id="#P-042" count={3} price="850.00" isLow />
             <StockItem name="Sprayer Machine" id="#P-015" count={5} price="12,000.00" />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Reusable Stock Item Component
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
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },

  scrollBody: { padding: 20 },
  
  // Summary
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryCard: { flex: 1, backgroundColor: COLORS.white, padding: 18, borderRadius: 25, elevation: 2 },
  summaryLabel: { fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 5 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

  // Form Card
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

  // List Section
  listSection: { marginTop: 30, paddingBottom: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  viewAll: { fontSize: 12, color: COLORS.accent, fontWeight: 'bold' },
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
  alertText: { fontSize: 11, color: COLORS.danger, fontWeight: '600' }
});

export default StockManagement;
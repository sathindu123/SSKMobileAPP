import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Trash2, Printer, CheckCircle2, Search, Info, Banknote, TrendingUp } from 'lucide-react-native';

const COLORS = { 
  primary: '#113023', 
  accent: '#D4AF37', 
  danger: '#E63946', 
  success: '#2D6A4F',
  blue: '#3498db',
  bg: '#F0F4F7'
};

export default function CustomerPage() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
      
      {/* 1. Customer Search Row */}
      <View style={styles.customerSearchRow}>
        <TextInput placeholder="Customer ID" style={styles.idInput} placeholderTextColor="#999" />
        <TouchableOpacity style={styles.okBtn}><Text style={styles.okText}>OK</Text></TouchableOpacity>
        <View style={styles.idBadge}><Text style={styles.idBadgeText}>P035</Text></View>
      </View>

      {/* 2. Rate & Info Banner (Price Per KG) */}
      <View style={styles.rateBanner}>
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>හොඳ දළු මිල</Text>
          <Text style={styles.rateValue}>Rs. 205.0</Text>
        </View>
        <View style={styles.rateDivider} />
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>රන් දළු මිල</Text>
          <Text style={styles.rateValue}>Rs. 220.0</Text>
        </View>
        <View style={styles.rateDivider} />
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>ලියාපදිංචි අංකය</Text>
          <Text style={styles.rateValue}>M.T. 2265</Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
         <Text style={styles.bannerName}>සැපයුම්කරු: මහේෂ් ප්‍රියංකර</Text>
         <Text style={styles.bannerMonth}>මාසය - OCTOBER 2025</Text>
      </View>

      {/* 3. Daily KG Table (Days 1-31) */}
      <Text style={styles.sectionTitle}>දෛනික තේ දළු එකතුව (Daily KG)</Text>
      <View style={styles.kgTableContainer}>
         <View style={styles.kgTableHeader}>
            <Text style={styles.kgHeaderText}>දින | කිලෝ</Text>
            <Text style={styles.kgHeaderText}>දින | කිලෝ</Text>
            <Text style={styles.kgHeaderText}>දින | කිලෝ</Text>
         </View>
         <View style={styles.kgGrid}>
            {days.map((day) => (
              <View key={day} style={styles.kgCell}>
                <View style={styles.dayBadge}><Text style={styles.dayText}>{day}</Text></View>
                <TextInput style={styles.kgInput} placeholder="0.0" keyboardType="numeric" />
              </View>
            ))}
         </View>
      </View>

      {/* 4. Calculation Table (Full Breakdown from Image) */}
      <Text style={styles.sectionTitle}>බිල්පතේ විස්තර (Bill Breakdown)</Text>
      <View style={styles.calcTable}>
         <CalcRow label="තේ දළු වටිනාකම" value="0.00" />
         <CalcRow label="වෙනත් එකතු කිරීම්" value="0.00" />
         <View style={styles.innerDivider} />
         <CalcRow label="ගිය මස ණය" value="0.00" isRed />
         <CalcRow label="අත්තිකාරම් (Advance)" value="0.00" isRed />
         <CalcRow label="පොහොර / කෘෂි රසායන" value="0.00" isRed />
         <CalcRow label="තේ පැකට්" value="0.00" isRed />
         <CalcRow label="ලොරි කුලිය" value="25.0" isRed />
         <CalcRow label="වෙනත් අඩු කිරීම්" value="0.00" isRed />
         <CalcRow label="ඉතිරුම් (Savings)" value="0.00" isRed />
         
         <View style={styles.netRow}>
            <Text style={styles.netLabel}>ශුද්ධ වටිනාකම (Net Value)</Text>
            <Text style={styles.netValue}>Rs. 0.00</Text>
         </View>
      </View>

      {/* 5. Incoming & Outcoming Cash Summary */}
      <View style={styles.cashSummaryCard}>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel}>INCOMING CASH</Text>
          <Text style={[styles.cashValue, {color: COLORS.success}]}>1675.0</Text>
        </View>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel}>OUTCOMING CASH</Text>
          <Text style={[styles.cashValue, {color: COLORS.danger}]}>11700.0</Text>
        </View>
      </View>

      {/* 6. Footer Actions */}
      <View style={styles.actions}>
         <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.danger}]}>
            <Trash2 color="#fff" size={16} />
            <Text style={styles.btnText}>Delete Bill</Text>
         </TouchableOpacity>
         
         <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.accent}]}>
            <Printer color="#fff" size={16} />
            <Text style={styles.btnText}>Print Bill</Text>
         </TouchableOpacity>
         
         <TouchableOpacity style={[styles.actionBtn, {backgroundColor: COLORS.success}]}>
            <CheckCircle2 color="#fff" size={16} />
            <Text style={styles.btnText}>Pay Up</Text>
         </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

// Sub-component for Rows
const CalcRow = ({ label, value, isRed }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, isRed && {color: COLORS.danger}]}>
      {isRed ? `- ${value}` : value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mainScroll: { padding: 15, backgroundColor: COLORS.bg },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10, marginTop: 10 },
  
  // Search Row
  customerSearchRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 15 },
  idInput: { flex: 2, backgroundColor: '#fff', height: 45, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 14 },
  okBtn: { backgroundColor: COLORS.blue, paddingHorizontal: 20, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  okText: { color: '#fff', fontWeight: 'bold' },
  idBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, height: 45, borderRadius: 12, justifyContent: 'center' },
  idBadgeText: { color: COLORS.accent, fontWeight: 'bold' },

  // Rate Banner
  rateBanner: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2, justifyContent: 'space-between' },
  rateItem: { alignItems: 'center', flex: 1 },
  rateLabel: { fontSize: 10, color: '#666', marginBottom: 4 },
  rateValue: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary },
  rateDivider: { width: 1, height: '100%', backgroundColor: '#eee' },

  infoBanner: { backgroundColor: '#B3E5FC', padding: 15, borderRadius: 15, marginBottom: 15 },
  bannerName: { fontSize: 15, fontWeight: 'bold', color: '#01579B' },
  bannerMonth: { fontSize: 12, color: '#0277BD', marginTop: 4 },

  // KG Table
  kgTableContainer: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', elevation: 2 },
  kgTableHeader: { flexDirection: 'row', backgroundColor: '#7D2E7D', paddingVertical: 12 },
  kgHeaderText: { flex: 1, color: '#fff', fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  kgGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  kgCell: { width: '33.33%', flexDirection: 'row', alignItems: 'center', borderRightWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#eee', padding: 10 },
  dayBadge: { backgroundColor: '#f0f0f0', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 11, fontWeight: 'bold', color: '#555' },
  kgInput: { flex: 1, marginLeft: 8, fontSize: 14, textAlign: 'center', color: COLORS.primary, fontWeight: '600' },

  // Calc Table
  calcTable: { backgroundColor: '#fff', borderRadius: 15, padding: 20, borderWidth: 1, borderColor: '#ddd', elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rowLabel: { fontSize: 13, color: '#444' },
  rowValue: { fontSize: 14, fontWeight: 'bold' },
  innerDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 5 },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#eee' },
  netLabel: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  netValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.success },

  // Cash Summary
  cashSummaryCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginTop: 15, borderWidth: 1, borderColor: '#ddd' },
  cashRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  cashLabel: { fontSize: 11, fontWeight: 'bold', color: '#999' },
  cashValue: { fontSize: 16, fontWeight: 'bold' },

  // Actions
  actions: { flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 50 },
  actionBtn: { flex: 1, height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});
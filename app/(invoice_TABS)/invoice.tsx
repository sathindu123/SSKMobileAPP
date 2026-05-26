import { loadInvoiceData } from '@/src/service/invoiceService';
import { Picker } from '@react-native-picker/picker';
import { CheckCircle2, Printer } from 'lucide-react-native';
import React, { useState } from 'react';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  primary: '#113023',
  accent:  '#D4AF37',
  danger:  '#E63946',
  success: '#2D6A4F',
  blue:    '#3498db',
  bg:      '#F0F4F7'
};

const MONTH_LABELS: Record<string, string> = {
  "1": "January", "2": "February", "3": "March", "4": "April",
  "5": "May", "6": "June", "7": "July", "8": "August",
  "9": "September", "10": "October", "11": "November", "12": "December"
};

export default function CustomerPage() {
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [selectedYear,  setSelectedYear]  = useState("2026");
  const [loading,       setLoading]       = useState(false);

  const [customerId, setCustomerId] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const [customerName, setCustomerName] = useState("");
  const [rate,  setRate]  = useState({ goodLeaf: 0, goldenLeaf: 0 });
  const [dailyLeaf, setDailyLeaf] = useState<Record<number, number>>({});

  const [billData, setBillData] = useState({
    advanceTotal:    0,
    higaAdvanceTotal: 0,
    pohoraTotal:     0,
    higaPohoraTotal: 0,
    higaTotal:       0,
    teapacketTotal:  0
  });

  const getAllData = async () => {
    try {
      setLoading(true);

      const billID = customerId;
      if (!billID) return;

      const data = await loadInvoiceData(billID, selectedMonth, selectedYear);
      if (!data) return;

      setCustomerName(data.customerName || "");

      setRate({
        goodLeaf:   Number(data.rate?.value1) || 0,
        goldenLeaf: Number(data.rate?.value2) || 0
      });

      const dailyRecord: Record<number, number> = {};
      Object.entries(data.daily || {}).forEach(([k, v]) => {
        dailyRecord[Number(k)] = Number(v) || 0;
      });
      setDailyLeaf(dailyRecord);

      setBillData({
        advanceTotal:    Number(data.advanceTotal)    || 0,
        higaAdvanceTotal: Number(data.higaAdvanceTotal) || 0,
        pohoraTotal:     Number(data.pohoraTotal)     || 0,
        higaPohoraTotal: Number(data.higaPohoraTotal) || 0,
        higaTotal:       Number(data.higaTotal)       || 0,
        teapacketTotal:  Number(data.teapacketTotal)  || 0
      });

    } catch (err) {
      console.error("UI Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalLeaf: number = Object.values(dailyLeaf).reduce((sum, v) => sum + v, 0);
  const leafValue: number = totalLeaf * rate.goodLeaf;

  const beraValue: number =
    billData.higaTotal +
    billData.advanceTotal +
    billData.pohoraTotal +
    billData.teapacketTotal +
    25;

  const ntValue:  number = leafValue > beraValue ? leafValue - beraValue : 0;
  const higValue: number = beraValue > leafValue ? beraValue - leafValue : 0;

  const monthLabel = `${MONTH_LABELS[selectedMonth]} ${selectedYear}`;
const generateBill = async () => {
  try {
    // දින 31 සඳහා තීරු 3කින් යුත් වගුව සකසා ගැනීම
    let tableRows = "";
    for (let i = 0; i < 11; i++) {
      const d1 = i + 1;
      const d2 = i + 12;
      const d3 = i + 23;

      tableRows += `
        <tr>
          <td style="background-color: #f2f2f2; width: 30px;">${d1}</td>
          <td style="width: 50px;">${dailyLeaf[d1] || ""}</td>
          <td style="background-color: #f2f2f2; width: 30px;">${d2 <= 22 ? d2 : ""}</td>
          <td style="width: 50px;">${d2 <= 22 ? (dailyLeaf[d2] || "") : ""}</td>
          <td style="background-color: #f2f2f2; width: 30px;">${d3 <= 31 ? d3 : ""}</td>
          <td style="width: 50px;">${d3 <= 31 ? (dailyLeaf[d3] || "") : ""}</td>
        </tr>
      `;
    }

    const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: sans-serif; padding: 5px; color: #000; font-size: 11px; }
          .container { border: 1.5px solid #000; padding: 10px; width: 100%; box-sizing: border-box; }
          
          /* Header */
          .header { display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 5px; }
          .company-name { font-size: 24px; font-weight: bold; }
          .header-right { text-align: right; line-height: 1.4; }

          /* Metadata Row */
          .info-row { display: flex; justify-content: space-between; margin: 8px 0; font-weight: bold; }
          
          /* Main Layout */
          .main-content { display: flex; border-top: 1px solid #000; }
          .left-side { width: 45%; border-right: 1px solid #000; }
          .right-side { width: 55%; }

          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 3px; text-align: center; }
          .text-left { text-align: left; padding-left: 5px; }
          .text-right { text-align: right; padding-right: 5px; }

          /* Summary Box */
          .summary-table td { height: 18px; border-left: none; border-right: 1px solid #000; }
          .total-row { background-color: #f2f2f2; font-weight: bold; }
          .balance-box { border: 1.5px solid #000; margin: 5px; padding: 5px; display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; }

          /* Footer */
          .footer-section { display: flex; margin-top: 10px; border-top: 1px solid #000; padding-top: 5px; }
          .higa-table { width: 50%; }
          .signature-section { width: 50%; text-align: center; }
          .sig-line { border-top: 1px dotted #000; width: 120px; margin: 20px auto 0 auto; font-size: 10px; }
          .final-note { text-align: center; font-size: 10px; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Top Header -->
          <div class="header">
            <div>
              <div class="company-name">S S K GROUP</div>
              <div style="font-weight: bold; font-size: 14px;">අමු තේ දළු ව්‍යාපාරික</div>
              <div>10 කණුව, යට්ටපාත</div>
            </div>
            <div class="header-right">
              <div>ලියාපදිංචි අංකය - M.T.2265 දළු සැපයුම්කරුගේ ගිණුම</div>
              <div>දු.අංකය - 0714285771 / 0774636144</div>
              <div style="text-decoration: underline; font-weight: bold;">සැපයුම්කරුගේ පිටපත</div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="info-row">
            <div>සැපයුම්කරුගේ නම - ${customerName}</div>
            <div style="text-align: right;">
                හොඳ දළු මිල: ${rate.goodLeaf.toFixed(1)} &nbsp;&nbsp; රන් දළු මිල: ${rate.goldenLeaf.toFixed(1)}<br/>
                
            </div>
          </div>
          <div class="info-row" style="margin-top: -5px;">
            <div>මාසය - ${monthLabel}</div>
            <div>මාර්ගය - යට්ටපාත</div>
          </div>

          <div class="main-content">
            <!-- Left: Daily KG -->
            <div class="left-side">
              <table>
                <tr style="background-color: #f2f2f2; font-weight: bold;">
                  <td>දින</td><td>කිලෝ</td><td>දින</td><td>කිලෝ</td><td>දින</td><td>කිලෝ</td>
                </tr>
                ${tableRows}
                <tr class="total-row">
                  <td colspan="5" class="text-right">මුළු දළු ප්‍රමාණය</td>
                  <td>${totalLeaf.toFixed(1)}</td>
                </tr>
              </table>
            </div>

            <!-- Right: Calculation Summary -->
            <div class="right-side">
              <table class="summary-table">
                <tr>
                    <td class="text-left">තේ දළු වටිනාකම</td>
                    <td class="text-right">${leafValue.toFixed(1)}</td>
                    <td class="text-right" style="border-right: none;"></td>
                </tr>
                <tr><td class="text-left">වෙනත් එකතු කිරීම්</td><td class="text-right"></td><td class="text-right" style="border-right: none;"></td></tr>
                <tr><td class="text-left">ගිය මස ණය</td><td class="text-right"></td><td class="text-right" style="border-right: none;">${billData.higaTotal.toFixed(1)}</td></tr>
                <tr><td class="text-left">අත්තිකාරම්</td><td class="text-right"></td><td class="text-right" style="border-right: none;">${billData.advanceTotal.toFixed(1)}</td></tr>
                <tr><td class="text-left">පොහොර කෘෂි රසායන</td><td class="text-right"></td><td class="text-right" style="border-right: none;">${billData.pohoraTotal.toFixed(1)}</td></tr>
                <tr><td class="text-left">තේ පැකට්</td><td class="text-right"></td><td class="text-right" style="border-right: none;">${billData.teapacketTotal.toFixed(1)}</td></tr>
                <tr><td class="text-left">ලිපි ද්‍රව්‍ය</td><td class="text-right"></td><td class="text-right" style="border-right: none;">25.0</td></tr>
                <tr><td class="text-left">වෙනත් අඩුකිරීම්</td><td class="text-right"></td><td class="text-right" style="border-right: none;">0.0</td></tr>
                <tr><td class="text-left" style="padding-left: 20px;">ඉතුරුම්</td><td class="text-right"></td><td class="text-right" style="border-right: none;"></td></tr>
                <tr class="total-row">
                  <td class="text-left">මුළු වටිනාකම</td>
                  <td class="text-right">${leafValue.toFixed(1)}</td>
                  <td class="text-right" style="border-right: none;">${beraValue.toFixed(1)}</td>
                </tr>
              </table>

              <div class="balance-box">
                <span>ඉතිරි මුදල</span>
                <span>${ntValue.toFixed(1)}</span>
              </div>
              
              <div style="padding: 5px; display: flex; justify-content: space-between;">
                 <span>ඉදිරියට ඇති දළු හිඟ මුදල්</span>
                 <span style="border: 1px solid #000; padding: 2px 15px;">${higValue.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="footer-section">
            <div class="higa-table">
               <div style="margin-bottom: 5px;">ඉදිරියට ඇති පොහොර හිඟ මුදල්: &nbsp; <b>${billData.higaPohoraTotal.toFixed(1)}</b></div>
               <div>ඉදිරියට ඇති ණය මුදල්: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>${billData.higaAdvanceTotal.toFixed(1)}</b></div>
            </div>
            <div class="signature-section">
               <div style="font-size: 14px; font-weight: bold; font-style: italic;">හොඳ දල්ලට ඉහල මිලක්</div>
               <div style="display: flex; justify-content: space-around;">
                  <div><div class="sig-line"></div>දිනය</div>
                  <div><div class="sig-line"></div>දළු සැපයුම්කරුගේ අත්සන</div>
               </div>
            </div>
          </div>

          <div class="final-note">
            මෙම බිල්පතෙහි ඇති සටහන් පිළිබඳව ගැටළුවක් ඇතොත් සතියක් ඇතුලත දැනුම් දෙන්න
          </div>
        </div>
      </body>
    </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
      width: 595, // A4 width
      height: 842 / 1.8 // Jasper report එකේ දිගට සමාන වන පරිදි (හරි අඩකට වඩා ටිකක් වැඩි)
    });

    await Sharing.shareAsync(uri);

  } catch (err) {
    console.log("Error generating bill:", err);
  }
};
  return (
    <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>

      {/* Loading Modal */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.inputBox}>
        <TextInput
          placeholder="Enter Customer ID"
          placeholderTextColor="#999"
          value={customerId}
          onChangeText={setCustomerId}
          style={styles.input}
        />
      </View>

      {/* 1. Month/Year Row */}
      <View style={styles.customerSearchRow}>
        <View style={styles.monthBox}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(v) => setSelectedMonth(v)}
            style={styles.picker}
          >
            {Object.entries(MONTH_LABELS).map(([val, label]) => (
              <Picker.Item key={val} label={label} value={val} />
            ))}
          </Picker>
        </View>

        <View style={styles.yearBox}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(v) => setSelectedYear(v)}
            style={styles.picker}
          >
            {Array.from({ length: 15 }, (_, i) => {
              const y = 2026 + i;
              return <Picker.Item key={y} label={String(y)} value={String(y)} />;
            })}
          </Picker>
        </View>

        <TouchableOpacity style={styles.okBtn} onPress={getAllData}>
          <Text style={styles.okText}>OK</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Rate Banner */}
      <View style={styles.rateBanner}>
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>හොඳ දළු මිල</Text>
          <Text style={styles.rateValue}>Rs. {rate.goodLeaf}</Text>
        </View>
        <View style={styles.rateDivider} />
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>රන් දළු මිල</Text>
          <Text style={styles.rateValue}>Rs. {rate.goldenLeaf}</Text>
        </View>
        <View style={styles.rateDivider} />
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>ලියාපදිංචි අංකය</Text>
          <Text style={styles.rateValue}>M.T. 2265</Text>
        </View>
      </View>

      {/* 3. Info Banner — dynamic name + month */}
      <View style={styles.infoBanner}>
        <Text style={styles.bannerName}>
          සැපයුම්කරු: {customerName || "—"}
        </Text>
        <Text style={styles.bannerMonth}>
          මාසය - {monthLabel}
        </Text>
      </View>

      {/* 4. Daily KG Table */}
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
              <View style={styles.dayBadge}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
              <TextInput
                style={styles.kgInput}
                value={dailyLeaf[day] ? String(dailyLeaf[day]) : ""}
                placeholder=""
                keyboardType="numeric"
                editable={false}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>දළු එකතුව</Text>
        <Text style={styles.totalValue}>{totalLeaf.toFixed(2)}</Text>
      </View>

      {/* 5. Bill Breakdown */}
      <Text style={styles.sectionTitle}>බිල්පතේ විස්තර (Bill Breakdown)</Text>
      <View style={styles.calcTable}>
        <CalcRow label="තේ දළු වටිනාකම"      value={leafValue.toFixed(2)} />
        <CalcRow label="වෙනත් එකතු කිරීම්"    value="0.00" />
        <View style={styles.innerDivider} />
        <CalcRow label="ගිය මස ණය"            value={billData.higaTotal.toFixed(2)}      isRed />
        <CalcRow label="අත්තිකාරම් (Advance)"  value={billData.advanceTotal.toFixed(2)}   isRed />
        <CalcRow label="පොහොර / කෘෂි රසායන"   value={billData.pohoraTotal.toFixed(2)}    isRed />
        <CalcRow label="තේ පැකට්"             value={billData.teapacketTotal.toFixed(2)} isRed />
        <CalcRow label="ලිපි දව්‍ය"           value="25.00"                              isRed />
        <CalcRow label="වෙනත් අඩු කිරීම්"     value="0.00"                               isRed />
        <CalcRow label="ඉතිරුම් (Savings)"    value="0.00"                               isRed />

        <View style={styles.netRow}>
          <Text style={styles.netLabel}>හර වටිනාකම</Text>
          <Text style={styles.netValue}>Rs. {leafValue.toFixed(2)}</Text>
        </View>
        <View style={styles.netRow2}>
          <Text style={styles.netLabel}>බැර වටිනාකම</Text>
          <Text style={styles.netValue2}>Rs. {beraValue.toFixed(2)}</Text>
        </View>
      </View>

      {/* 6. Cash Summary */}
      <View style={styles.cashSummaryCard}>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel}>ශුද්ධ වටිනාකම</Text>
          <Text style={[styles.cashValue, { color: COLORS.success }]}>
            {ntValue.toFixed(2)}
          </Text>
        </View>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel}>ඉදිරියට ඇති හිඟ මුදල</Text>
          <Text style={[styles.cashValue, { color: COLORS.danger }]}>
            {higValue.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.sectionDivider} />

      {/* 7. Higa Totals */}
      <View style={styles.cashSummaryCard2}>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel1}>ඉදිරියට ඇති පොහොර හිඟ මුදල</Text>
          <Text style={[styles.cashValue2, { color: COLORS.danger }]}>
            {billData.higaPohoraTotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel1}>ඉදිරියට ඇති අත්තිකාරම් හිඟ මුදල</Text>
          <Text style={[styles.cashValue2, { color: COLORS.danger }]}>
            {billData.higaAdvanceTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 8. Actions */}
      <View style={styles.actions}>
        {/* <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.accent }]}>
          <Printer color="#fff" size={16} />
          <Text style={styles.btnText}>Download Bill</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
          onPress={generateBill}
        >
          <CheckCircle2 color="#fff" size={16} />
          <Text style={styles.btnText}>Get Your Bill</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const CalcRow = ({ label, value, isRed }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, isRed && { color: '#999' }]}>
      {isRed ? `- ${value}` : value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mainScroll: { padding: 15, backgroundColor: COLORS.bg },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10, marginTop: 10 },

  // Loading
  loadingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  loadingBox: { backgroundColor: '#fff', borderRadius: 16, padding: 30, alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: COLORS.primary, fontWeight: 'bold' },

  // Search Row
  customerSearchRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 15 },
  okBtn: { backgroundColor: COLORS.blue, paddingHorizontal: 20, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  okText: { color: '#fff', fontWeight: 'bold' },

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
  netRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#eee' },
  netRow2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  netLabel:  { fontSize: 13, fontWeight: 'bold', color: '#999' },
  netValue:  { fontSize: 16, fontWeight: 'bold', color: COLORS.success },
  netValue2: { fontSize: 16, fontWeight: 'bold', color: COLORS.danger },

  // Cash Summary
  cashSummaryCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginTop: 15, borderWidth: 2, borderColor: COLORS.accent, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 5 },
  cashSummaryCard2: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginTop: 15, borderWidth: 1, borderColor: '#ddd' },
  cashRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  cashLabel:  { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  cashLabel1: { fontSize: 12, fontWeight: 'bold', color: '#999' },
  cashValue:  { fontSize: 20, fontWeight: 'bold' },
  cashValue2: { fontSize: 16, fontWeight: 'bold' },

  // Actions
  actions: { flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 50 },
  actionBtn: { flex: 1, height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  picker: { height: 50, width: '100%', color: COLORS.primary },
  monthBox: { flex: 1.7, backgroundColor: '#fff', height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', paddingHorizontal: 10 },
  yearBox:  { flex: 1.28, backgroundColor: '#fff', height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', paddingHorizontal: 10 },

  sectionDivider: { height: 1, backgroundColor: '#ddd', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.success },

  idInput: { flex: 2, backgroundColor: '#fff', height: 45, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 14 },
  idBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 12, height: 45, borderRadius: 12, justifyContent: 'center' },
  idBadgeText: { color: COLORS.accent, fontWeight: 'bold' },
  selectBox: { flex: 1, backgroundColor: '#fff', height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', paddingHorizontal: 10 },
  selectInput: { fontSize: 14, color: COLORS.primary },
  
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  }
});
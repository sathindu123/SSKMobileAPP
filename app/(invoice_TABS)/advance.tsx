import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Banknote,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Hash,
  Info,
  Package,
  RotateCcw,
  Save,
  Tag
} from 'lucide-react-native';

import {
  getAdvanceData,
  saveAdvace
} from '@/src/service/invoiceService';

// =========================
// COLORS
// =========================
const COLORS = {
  primary: '#113023',
  secondary: '#2D6A4F',
  accent: '#D4AF37',
  bg: '#F4F7F5',
  white: '#ffffff',
  danger: '#E63946',
  warning: '#B79D5C',
  teaGreen: '#84a98c'
};

export default function AdvancePage() {

  // =========================
  // STATES
  // =========================
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [tableLoading, setTableLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [advanceList, setAdvanceList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    installments: '1'
  });

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadTable(1);
  }, []);

  // =========================
  // LOAD TABLE
  // =========================
  const loadTable = async (pageNumber: number) => {

    try {
      setTableLoading(true);

      const response = await getAdvanceData(pageNumber, 5);

      setAdvanceList(response.data);
      setPage(pageNumber);
      setHasMore(response.hasMore);

    } catch (error) {
      console.log("Load Error:", error);
    } finally {
      setTableLoading(false);
    }
  };

  // =========================
  // NEXT
  // =========================
  const handleNext = () => {
    if (hasMore) {
      loadTable(page + 1);
    }
  };

  // =========================
  // PREVIOUS
  // =========================
  const handlePrev = () => {
    if (page > 1) {
      loadTable(page - 1);
    }
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {

    if (
      !formData.customerId ||
      !formData.amount ||
      !formData.date ||
      !formData.installments
    ) {
      Alert.alert("අවධානය", "කරුණාකර සියලුම විස්තර ඇතුළත් කරන්න.");
      return;
    }

    try {

      setSaveLoading(true);

      await saveAdvace(formData);

      setShowSuccessModal(true);

      setFormData({
        customerId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
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

  // =========================
  // RESET
  // =========================
  const handleReset = () => {
    setFormData({
      customerId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      installments: '1'
    });
  };

  // =========================
  // UI
  // =========================
  return (

    <View style={{ flex: 1 }}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >

        <ScrollView contentContainerStyle={styles.scrollBody}>

          {/* HEADER */}
          <View style={styles.headerBanner}>
            <Banknote color={COLORS.accent} size={28} />
            <Text style={styles.headerTitle}>අත්තිකාරම් ගැනීම්</Text>
          </View>

          {/* FORM */}
          <View style={styles.formCard}>

            <InputGroup
              label="Customer ID"
              icon={<Hash size={18} color={COLORS.primary} />}
              value={formData.customerId}
              onChange={(v: string) =>
                setFormData({ ...formData, customerId: v })
              }
            />

            <InputGroup
              label="Amount"
              icon={<Banknote size={18} color={COLORS.primary} />}
              value={formData.amount}
              keyboardType="numeric"
              onChange={(v: string) =>
                setFormData({ ...formData, amount: v })
              }
            />

            <InputGroup
              label="Date"
              icon={<Calendar size={18} color={COLORS.primary} />}
              value={formData.date}
              onChange={(v: string) =>
                setFormData({ ...formData, date: v })
              }
            />

            <InputGroup
              label="Installments"
              icon={<Info size={18} color={COLORS.primary} />}
              value={formData.installments}
              keyboardType="numeric"
              onChange={(v: string) =>
                setFormData({ ...formData, installments: v })
              }
            />

            {/* BUTTONS */}
            <View style={styles.buttonRow}>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.secondary }]}
                onPress={handleSave}
                disabled={saveLoading}
              >
                {
                  saveLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Save color="#fff" size={18} />
                      <Text style={styles.btnText}>Save</Text>
                    </>
                  )
                }
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.danger }]}
                onPress={handleReset}
              >
                <RotateCcw color="#fff" size={18} />
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>

            </View>

          </View>

          {/* LIST HEADER */}
          <View style={styles.listHeaderRow}>
            <ClipboardList color={COLORS.primary} size={20} />
            <Text style={styles.sectionTitle}>අත්තිකාරම් ලැයිස්තුව</Text>
          </View>

          {/* LOADING */}
          {tableLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            advanceList.map((item, index) => (
              <AdvanceRecordCard
                key={index}
                id={item.customerName}
                date={item.date}
                month={item.month}
                price={item.amount}
              />
            ))
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

        </ScrollView>

      </KeyboardAvoidingView>

      {/* SUCCESS MODAL */}
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

    </View>
  );
}

// =========================
// INPUT
// =========================
const InputGroup = ({ label, icon, value, onChange, keyboardType = 'default' }: any) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputBox}>
      {icon}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

// =========================
// RESTORED CARD UI (OLD STYLE FIX)
// =========================
const AdvanceRecordCard = ({ id, date, month, price }: any) => (
  <View style={styles.recordCard}>
     <View style={styles.recordTop}>
        <View>
           <Text style={styles.recordName}>{id}</Text>
           <Text style={styles.recordDate}>{date}</Text>
           <Text style={styles.recordDate}>{month}</Text>
        </View>
        <View style={styles.priceBadge}>
           <Text style={styles.priceText}>Rs. {price}</Text>
        </View>
     </View>
     {/* <View style={styles.recordBottom}>
        <View style={styles.infoTag}>
           <Package size={12} color={COLORS.primary} />
           <Text style={styles.tagText}>{product}</Text>
        </View>
        <View style={styles.infoTag}>
           <Tag size={12} color={COLORS.primary} />
           <Text style={styles.tagText}>Qty: {count}</Text>
        </View>
     </View> */}
  </View>
);

// =========================
// STYLES (RESTORED LOOK)
// =========================
const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollBody: { padding: 20 },

  headerBanner: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 10
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },

  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginTop: 20
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10
  },

  input: { flex: 1, marginLeft: 10 },

  label: { fontSize: 12, marginBottom: 5 },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },

  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
  },

  btnText: { color: '#fff' },

  listHeaderRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },


  recordLeft: { flexDirection: 'row', alignItems: 'center' },

  idBadge: {
    backgroundColor: COLORS.bg,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  idBadgeText: { fontWeight: 'bold', color: COLORS.primary },


  recordRight: { alignItems: 'flex-end' },

  currencyText: { fontSize: 10, color: '#999' },

  amountText: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },

  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center'
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
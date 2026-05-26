import { loadDashbordData } from '@/src/service/dashbord';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  Banknote,
  Bell,
  Box,
  ChevronRight,
  Clock,
  FileText,
  Leaf,
  LogOut,
  RefreshCw,
  TrendingUp,
  Users,
  X
} from 'lucide-react-native';

import React, { useEffect, useState } from 'react';

import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#113023',
  secondary: '#2D6A4F',
  leaf: '#74C69D',
  accent: '#D4AF37',
  bg: '#F4F7F5',
  white: '#ffffff',
  danger: '#E63946',
  glass: 'rgba(255, 255, 255, 0.15)',
  border: '#E5E7EB'
};

const LoadingDots = ({ color = COLORS.white, size = 10 }) => {
  const dot1 = useState(new Animated.Value(0.3))[0];
  const dot2 = useState(new Animated.Value(0.3))[0];
  const dot3 = useState(new Animated.Value(0.3))[0];

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            easing: Easing.linear,
            useNativeDriver: true
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true
          })
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: color, width: size, height: size, opacity: dot1 }]} />
      <Animated.View style={[styles.dot, { backgroundColor: color, width: size, height: size, opacity: dot2 }]} />
      <Animated.View style={[styles.dot, { backgroundColor: color, width: size, height: size, opacity: dot3 }]} />
    </View>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [advanceModalVisible, setAdvanceModalVisible] = useState(false);
  const [pohoraModalVisible, setPohoraModalVisible] = useState(false);
  const [otherModalVisible, setOtherModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const [dashboardData, setDashboardData] = useState({
    teaLeafTotal: 0,
    advanceTotal: 0,
    pohoraTotal: 0,
    teaPacketTotal: 0,
    customerName: "",
    // අත්තිකාරම් ලැයිස්තුව මෙතනට එකතු වේ
    advanceHistory: [],
    pohoraHistory: [],
    teaPacketHistory: []
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    loadAllDat();
    return () => clearInterval(timer);
  }, []);

  const loadAllDat = async () => {
    try {
      setLoading(true);
      // const billID = await AsyncStorage.getItem("billID");
      const data = await loadDashbordData();

      setDashboardData({
        teaLeafTotal: data.teaLeafTotal || 0,
        advanceTotal: data.advanceTotal || 0,
        pohoraTotal: data.pohoraTotal || 0,
        teaPacketTotal: data.teaPacketTotal || 0,
        customerName: data.customerName || "",

         

        advanceHistory: data.advanceList || [],
        pohoraHistory: data.pohoraList || [],
        teaPacketHistory: data.teaPacketList || []
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

  };

  const handleLogout = () => {
    Alert.alert("Log Out", "පද්ධතියෙන් ඉවත් වීමට ඔබට අවශ්‍යද?", [
      { text: "නැත", style: "cancel" },
      { text: "ඔව්", onPress: () => router.replace('/') }
    ]);
  };

  const targetKg = 10000;
  const progressPercent = Math.round(Math.min((dashboardData.teaLeafTotal / targetKg) * 100, 100));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Advance Modal - Popup Table */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={advanceModalVisible}
        onRequestClose={() => setAdvanceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>අත්තිකාරම් විස්තර</Text>
              <TouchableOpacity onPress={() => setAdvanceModalVisible(false)} style={styles.closeBtn}>
                <X color={COLORS.primary} size={24} />
              </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 0.5 }]}>ID</Text>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Price (Rs.)</Text>
            </View>

            {/* Table Body */}
            <FlatList
                data={dashboardData.advanceHistory}
                keyExtractor={(item: any, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>

                    <Text style={[styles.rowCell, { flex: 0.7 }]}>
                      {item.billId}
                    </Text>

                    <Text style={styles.rowCell}>
                      {item.date}
                    </Text>

                    <Text style={[styles.rowCell, { fontWeight: 'bold' }]}>
                      Rs. {Number(item.amount).toFixed(2)}
                    </Text>

                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    දත්ත කිසිවක් නැත.
                  </Text>
                }
              />
          </View>
        </View>
      </Modal>



      <Modal
        animationType="slide"
        transparent={true}
        visible={pohoraModalVisible}
        onRequestClose={() => setPohoraModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                පොහොර ගෙවීම් විස්තර
              </Text>

              <TouchableOpacity
                onPress={() => setPohoraModalVisible(false)}
                style={styles.closeBtn}
              >
                <X color={COLORS.primary} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 0.7 }]}>ID</Text>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Amount</Text>
            </View>

            <FlatList
              data={dashboardData.pohoraHistory}
              keyExtractor={(item: any, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>

                  <Text style={[styles.rowCell, { flex: 0.7 }]}>
                    {item.billId}
                  </Text>

                  <Text style={styles.rowCell}>
                    {item.date}
                  </Text>

                  <Text style={[styles.rowCell, { fontWeight: 'bold' }]}>
                    Rs. {Number(item.amount).toFixed(2)}
                  </Text>

                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  දත්ත කිසිවක් නැත.
                </Text>
              }
            />

          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={otherModalVisible}
        onRequestClose={() => setOtherModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                වෙනත් ගෙවීම් විස්තර
              </Text>

              <TouchableOpacity
                onPress={() => setOtherModalVisible(false)}
                style={styles.closeBtn}
              >
                <X color={COLORS.primary} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 0.7 }]}>ID</Text>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>Amount</Text>
            </View>

            <FlatList
              data={dashboardData.teaPacketHistory}
              keyExtractor={(item: any, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>

                  <Text style={[styles.rowCell, { flex: 0.7 }]}>
                    {item.billId}
                  </Text>

                  <Text style={styles.rowCell}>
                    {item.date}
                  </Text>


                  <Text style={[styles.rowCell, { fontWeight: 'bold' }]}>
                    Rs. {Number(item.amount).toFixed(2)}
                  </Text>

                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  දත්ත කිසිවක් නැත.
                </Text>
              }
            />

          </View>
        </View>
      </Modal>

      <View style={styles.headerWrapper}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=1000' }}
          style={styles.headerBackground}
          imageStyle={{ opacity: 0.2, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          <SafeAreaView>
            <View style={styles.topNav}>
              <View style={styles.userSection}>
                <View style={styles.avatarBorder}>
                  <Image source={{ uri: 'https://ui-avatars.com/api/?name=Sathindu+Kumara&background=D4AF37&color=fff' }} style={styles.avatar} />
                </View>
                <View>
                  <Text style={styles.greetText}>ආයුබෝවන්,</Text>
                  {loading ? <LoadingDots color={COLORS.white} /> : <Text style={styles.userName}>{dashboardData.customerName}</Text>}
                </View>
              </View>
              <TouchableOpacity style={styles.iconBtn}>
                <Bell color={COLORS.white} size={22} />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>

            <View style={styles.highlightCard}>
              <View style={styles.glassEffect}>
                <View style={styles.highlightHeader}>
                  <View style={styles.iconCircle}><Leaf color={COLORS.leaf} size={20} /></View>
                  <Text style={styles.highlightLabel}>මාසික තේ දළු එකතුව</Text>
                  <View style={styles.liveTag}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View>
                </View>
                <View style={styles.valueContainer}>
                  {loading ? <LoadingDots color={COLORS.accent} size={14} /> : (
                    <>
                      <Text style={styles.mainValue}>{dashboardData.teaLeafTotal}</Text>
                      <Text style={styles.mainUnit}>Kg</Text>
                    </>
                  )}
                </View>
                <View style={styles.progressSection}>
                  <View style={styles.barBg}><View style={[styles.barFill, { width: `${progressPercent}%` }]} /></View>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressText}>Target: {targetKg}kg</Text>
                    <Text style={styles.progressPercent}>{progressPercent}% Done</Text>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.sectionHeader}>Business Overview</Text>

        <View style={styles.bentoGrid}>
          {/* අත්තිකාරම් කාඩ් එක ක්ලික් කළ විට Modal එක open වේ */}
          <TouchableOpacity 
            style={[styles.card, styles.largeCard]}
            onPress={() => setAdvanceModalVisible(true)}
          >
            <View style={styles.cardTop}>
              <Banknote color={COLORS.secondary} size={22} />
              <TrendingUp color="#4CAF50" size={16} />
            </View>
            <Text style={styles.cardLabel}>අත්තිකාරම්</Text>
            {loading ? <LoadingDots color={COLORS.secondary} /> : (
              <Text style={styles.cardValueLarge}>Rs. {dashboardData.advanceTotal.toFixed(2)}</Text>
            )}
          
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.card, styles.smallCard]}
              onPress={() => setPohoraModalVisible(true)}
            >
            <Box color={COLORS.accent} size={22} />
            <Text style={styles.cardLabel}>පොහොර ගෙවීම්</Text>
            {loading ? <LoadingDots color={COLORS.accent} /> : <Text style={styles.cardValue}>Rs. {dashboardData.pohoraTotal.toFixed(2)}</Text>}
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.card, styles.smallCard]}
              onPress={() => setOtherModalVisible(true)}
            >
            <RefreshCw color={COLORS.secondary} size={22} />
            <Text style={styles.cardLabel}>වෙනත් ගෙවීම්</Text>
            {loading ? <LoadingDots color={COLORS.secondary} /> : <Text style={styles.cardValue}>Rs. {dashboardData.teaPacketTotal.toFixed(2)}</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Management Tools</Text>
        <View style={styles.actionList}>
          <OperationBtn onPress={() => router.push('/dailyCollection')} title="Daily Tea Collection" desc="බිල්පත් සහ වාර්තා ලබා ගන්න" icon={<FileText color={COLORS.secondary} />} />
          <OperationBtn onPress={() => router.push('/customerManage')} title="Customer Manage" desc="ගනුදෙනුකරුවන්ගේ විස්තර පරීක්ෂා කරන්න" icon={<Users color={COLORS.secondary} />} />
          <OperationBtn onPress={() => router.push('/invoice')} title="Invoicing & Reports" desc="බිල්පත් සහ වාර්තා ලබා ගන්න" icon={<FileText color={COLORS.secondary} />} />
        </View>

        <TouchableOpacity style={styles.logoutWrapper} onPress={() => router.replace('/login')}>
          <View style={styles.logoutBtn}>
            <LogOut color={COLORS.danger} size={20} />
            <Text style={styles.logoutText}>Log Out From System</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.footerRow}><Clock size={12} color="#999" /><Text style={styles.footerTime}>{currentTime}</Text></View>
          <Text style={styles.footerVersion}>V 2.5.0 • MP TRANSPORT HERITAGE</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const OperationBtn = ({ title, desc, icon, onPress }: any) => (
  <TouchableOpacity style={styles.opBtn} onPress={onPress}>
    <View style={styles.opIconContainer}>{icon}</View>
    <View style={styles.opTextContainer}>
      <Text style={styles.opTitle}>{title}</Text>
      <Text style={styles.opDesc}>{desc}</Text>
    </View>
    <ChevronRight color="#D1D5DB" size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 20,
    elevation: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  closeBtn: {
    padding: 5
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 5
  },
  headerCell: {
    flex: 1,
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  rowCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.primary
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999'
  },

  // Dashboard Styles (Existing)
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  dot: { borderRadius: 50 },
  headerWrapper: { backgroundColor: COLORS.primary, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 15 },
  headerBackground: { paddingBottom: 25 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 10 },
  userSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBorder: { padding: 2, borderRadius: 15, borderWidth: 1.5, borderColor: COLORS.accent },
  avatar: { width: 45, height: 45, borderRadius: 12 },
  greetText: { color: COLORS.white, opacity: 0.6, fontSize: 12 },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  iconBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, borderWidth: 1.5, borderColor: COLORS.primary },
  highlightCard: { paddingHorizontal: 20, marginTop: 25 },
  glassEffect: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 30, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  highlightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 35, height: 35, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  highlightLabel: { color: COLORS.white, fontSize: 14, fontWeight: '500', flex: 1 },
  liveTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(230, 57, 70, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.danger },
  liveText: { color: COLORS.danger, fontSize: 10, fontWeight: 'bold' },
  valueContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 15, minHeight: 55 },
  mainValue: { fontSize: 45, fontWeight: '800', color: COLORS.white, letterSpacing: -1 },
  mainUnit: { fontSize: 20, color: COLORS.leaf, fontWeight: 'bold' },
  progressSection: { marginTop: 5 },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { color: COLORS.white, fontSize: 11, opacity: 0.6 },
  progressPercent: { color: COLORS.accent, fontSize: 11, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginTop: 25, marginBottom: 15 },
  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, elevation: 4, marginBottom: 15 },
  largeCard: { width: '100%' },
  smallCard: { width: '48%' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
  cardValueLarge: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginTop: 5 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginTop: 10 },
  actionList: { gap: 12 },
  opBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: 22, elevation: 2 },
  opIconContainer: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#F0F4F2', justifyContent: 'center', alignItems: 'center' },
  opTextContainer: { flex: 1, marginLeft: 15 },
  opTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  opDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  logoutWrapper: { marginTop: 20, marginBottom: 10 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 15 },
  logoutText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 15 },
  footer: { alignItems: 'center', paddingVertical: 20, gap: 5 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerTime: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  footerVersion: { fontSize: 10, color: '#BBB' }
});

export default Dashboard;
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
    Users
} from 'lucide-react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image, ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#113023',    // Ultra Dark Forest Green
  secondary: '#2D6A4F',  // Mid Green
  leaf: '#74C69D',       // Bright Tea Leaf
  accent: '#D4AF37',     // Premium Gold
  bg: '#F4F7F5',         // Soft Minty Grey
  white: '#ffffff',
  danger: '#E63946',
  glass: 'rgba(255, 255, 255, 0.15)'
};
type OperationBtnProps = {
  title: string;
  desc: string;
  icon: ReactNode;
  onPress?: () => void; 
};



const Dashboard = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "පද්ධතියෙන් ඉවත් වීමට ඔබට අවශ්‍යද?", [
      { text: "නැත", style: "cancel" },
      { text: "ඔව්", onPress: () => router.replace('/') }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- Premium Header Section --- */}
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
                    <Image 
                      source={{ uri: 'https://ui-avatars.com/api/?name=Sathindu+Kumara&background=D4AF37&color=fff' }} 
                      style={styles.avatar}
                    />
                  </View>
                  <View>
                    <Text style={styles.greetText}>ආයුබෝවන්,</Text>
                    <Text style={styles.userName}>සතිදු සත්සර</Text>
                  </View>
               </View>
               <TouchableOpacity style={styles.iconBtn}>
                  <Bell color={COLORS.white} size={22} />
                  <View style={styles.badge} />
               </TouchableOpacity>
            </View>

            {/* --- Featured Highlight (Tea Collection) --- */}
            <View style={styles.highlightCard}>
               <View style={styles.glassEffect}>
                  <View style={styles.highlightHeader}>
                     <View style={styles.iconCircle}>
                        <Leaf color={COLORS.leaf} size={20} />
                     </View>
                     <Text style={styles.highlightLabel}>මාසික තේ දළු එකතුව</Text>
                     <View style={styles.liveTag}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                     </View>
                  </View>
                  <View style={styles.valueContainer}>
                     <Text style={styles.mainValue}>491.5</Text>
                     <Text style={styles.mainUnit}>Kg</Text>
                  </View>
                  <View style={styles.progressSection}>
                     <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: '68%' }]} />
                     </View>
                     <View style={styles.progressLabels}>
                        <Text style={styles.progressText}>Target: 1000kg</Text>
                        <Text style={styles.progressPercent}>68% Done</Text>
                     </View>
                  </View>
               </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        
        {/* --- Quick Stats Grid --- */}
        <Text style={styles.sectionHeader}>Business Overview</Text>
        <View style={styles.bentoGrid}>
          
          {/* Fertilizer Card - Large */}
          <TouchableOpacity style={[styles.card, styles.largeCard]}>
            <View style={styles.cardTop}>
              <Box color={COLORS.accent} size={22} />
              <TrendingUp color="#4CAF50" size={16} />
            </View>
            <Text style={styles.cardLabel}>පොහොර ගෙවීම්</Text>
            <Text style={styles.cardValueLarge}>Rs. 14,950.00</Text>
            <View style={styles.tag}>
               <Text style={styles.tagText}>30 Orders</Text>
            </View>
          </TouchableOpacity>

          {/* Advances - Small */}
          <TouchableOpacity style={[styles.card, styles.smallCard]}>
             <Banknote color={COLORS.secondary} size={22} />
             <Text style={styles.cardLabel}>අත්තිකාරම්</Text>
             <Text style={styles.cardValue}>Rs. 19,550</Text>
          </TouchableOpacity>

          {/* Other - Small */}
          <TouchableOpacity style={[styles.card, styles.smallCard]}>
             <RefreshCw color={COLORS.secondary} size={22} />
             <Text style={styles.cardLabel}>වෙනත් ගෙවීම්</Text>
             <Text style={styles.cardValue}>Rs. 3,000</Text>
          </TouchableOpacity>

        </View>

        {/* --- Navigation Actions --- */}
        <Text style={styles.sectionHeader}>Management Tools</Text>
        <View style={styles.actionList}>
            <OperationBtn 
              onPress={() => router.push('/dailyCollection')} // push පාවිච්චි කරලා බලන්න
              title="Daily Tea Collection" 
              desc="බිල්පත් සහ වාර්තා ලබා ගන්න" 
              icon={<FileText color={COLORS.secondary} />} 
           />
           <OperationBtn 
                onPress={() => router.push('/customerManage')} // push පාවිච්චි කරලා බලන්න
                title="Customer Portal" 
                desc="ගනුදෙනුකරුවන්ගේ විස්තර පරීක්ෂා කරන්න" 
                icon={<Users color={COLORS.secondary} />} 
            />
           <OperationBtn 
            onPress={() => router.push('/stockManage')}
              title="Stock Portal" 
              desc="ගනුදෙනුකරුවන්ගේ විස්තර පරීක්ෂා කරන්න" 
              icon={<Users color={COLORS.secondary} />} 
           />
           <OperationBtn 
              onPress={() => router.push('/invoice')} // push පාවිච්චි කරලා බලන්න
              title="Invoicing & Reports" 
              desc="බිල්පත් සහ වාර්තා ලබා ගන්න" 
              icon={<FileText color={COLORS.secondary} />} 
           />
        </View>

        {/* --- Logout Section --- */}
        <TouchableOpacity style={styles.logoutWrapper} onPress={() => router.replace('/login')}>
           <View style={styles.logoutBtn}>
              <LogOut color={COLORS.danger} size={20} />
              <Text style={styles.logoutText}>Log Out From System</Text>
           </View>
        </TouchableOpacity>

        {/* --- Bottom Details --- */}
        <View style={styles.footer}>
           <View style={styles.footerRow}>
              <Clock size={12} color="#999" />
              <Text style={styles.footerTime}>{currentTime}</Text>
           </View>
           <Text style={styles.footerVersion}>V 2.5.0 • MP TRANSPORT HERITAGE</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const OperationBtn = ({ title, desc, icon, onPress }: OperationBtnProps) => (
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
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  // Header
  headerWrapper: { backgroundColor: COLORS.primary, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 15, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20 },
  headerBackground: { paddingBottom: 25 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 10 },
  userSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBorder: { padding: 2, borderRadius: 15, borderWidth: 1.5, borderColor: COLORS.accent },
  avatar: { width: 45, height: 45, borderRadius: 12 },
  greetText: { color: COLORS.white, opacity: 0.6, fontSize: 12 },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  iconBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, borderWidth: 1.5, borderColor: COLORS.primary },

  // Highlight Card
  highlightCard: { paddingHorizontal: 20, marginTop: 25 },
  glassEffect: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 30, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  highlightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 35, height: 35, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  highlightLabel: { color: COLORS.white, fontSize: 14, fontWeight: '500', flex: 1 },
  liveTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(230, 57, 70, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.danger },
  liveText: { color: COLORS.danger, fontSize: 10, fontWeight: 'bold' },
  valueContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginVertical: 15 },
  mainValue: { fontSize: 45, fontWeight: '800', color: COLORS.white, letterSpacing: -1 },
  mainUnit: { fontSize: 20, color: COLORS.leaf, fontWeight: 'bold' },
  progressSection: { marginTop: 5 },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressText: { color: COLORS.white, fontSize: 11, opacity: 0.6 },
  progressPercent: { color: COLORS.accent, fontSize: 11, fontWeight: 'bold' },

  // Content
  content: { flex: 1, paddingHorizontal: 20 },
  sectionHeader: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginTop: 25, marginBottom: 15 },
  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 15 },
  largeCard: { width: '100%' },
  smallCard: { width: '48%' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardValueLarge: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginTop: 5 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginTop: 10 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#F0F9F4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 12 },
  tagText: { color: '#2D6A4F', fontSize: 10, fontWeight: 'bold' },

  // Operations List
  actionList: { gap: 12 },
  opBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: 22, elevation: 2 },
  opIconContainer: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#F0F4F2', justifyContent: 'center', alignItems: 'center' },
  opTextContainer: { flex: 1, marginLeft: 15 },
  opTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  opDesc: { fontSize: 12, color: '#888', marginTop: 2 },

  // Footer
  logoutWrapper: { marginTop: 20, marginBottom: 10 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 15 },
  logoutText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 15 },
  footer: { alignItems: 'center', paddingVertical: 20, gap: 5 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerTime: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  footerVersion: { fontSize: 10, color: '#BBB' }
});

export default Dashboard;
import { Slot, usePathname, useRouter } from 'expo-router';
import { Box, Leaf, LogOut, Menu, UserCog, Users, ArrowLeft } from 'lucide-react-native'; // ArrowLeft එකතු කළා
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#113023',    // Forest Green
  secondary: '#2C3E50',  // Dark Blue/Grey
  accent: '#D4AF37',     // Gold
  white: '#ffffff',
  lightBg: '#E8F0ED',    // ලා කොළ පැහැති පසුබිමක් (Buttons සඳහා)
};

export default function InvoiceLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { name: 'TeaPacket', path: '/teapacket' },
    { name: 'Fertilizer', path: '/fertilizer' },
    { name: 'Advance', path: '/advance' },
    { name: 'Customer', path: '/invoice' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- Sidebar (Drawer) --- */}
      {isSidebarOpen && (
        <TouchableOpacity activeOpacity={1} onPress={() => setSidebarOpen(false)} style={styles.overlay} />
      )}
      <View style={[styles.sidebar, { left: isSidebarOpen ? 0 : -(width * 0.7), width: width * 0.7 }]}>
        <View style={styles.sidebarHeader}>
           <Leaf color={COLORS.accent} size={30} />
           <Text style={styles.sidebarTitle}>MP TRANSPORT</Text>
        </View>
        <ScrollView>
          <TouchableOpacity style={styles.sidebarItem}><Users color="#fff" size={20} /><Text style={styles.sidebarLabel}>View Customers</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem}><UserCog color="#fff" size={20} /><Text style={styles.sidebarLabel}>View Employees</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem}><Box color="#fff" size={20} /><Text style={styles.sidebarLabel}>View Stock</Text></TouchableOpacity>
        </ScrollView>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/dashbord')}>
          <LogOut color="#fff" size={20} />
          <Text style={styles.logoutText}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* --- ස්ථාවර Header එක (Back Button සමඟ) --- */}
      <View style={styles.headerFixed}>
        <View style={styles.topNav}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.push('/dashbord')} style={styles.iconButton}>
            <ArrowLeft color={COLORS.primary} size={24} />
          </TouchableOpacity>

          <Text style={styles.navTitle}>Invoice Manage</Text>

          {/* Menu Button */}
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.iconButton}>
            <Menu color={COLORS.primary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Horizontal Tabs */}
        <View style={styles.tabsWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                <TouchableOpacity 
                    key={tab.name} 
                    onPress={() => router.push(tab.path as any)}
                    style={[styles.tab, isActive && styles.activeTab]}
                >
                    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.name}</Text>
                </TouchableOpacity>
                );
            })}
            </ScrollView>
        </View>
      </View>

      {/* මාරු වන පිටු පෙන්වන ස්ථානය */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFB' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 99 },
  
  // Sidebar Styles
  sidebar: { position: 'absolute', top: 0, bottom: 0, backgroundColor: COLORS.secondary, zIndex: 100, padding: 25 },
  sidebarHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 20 },
  sidebarTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 18 },
  sidebarLabel: { color: COLORS.white, fontSize: 15, opacity: 0.9 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E63946', padding: 15, borderRadius: 12, marginTop: 20 },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  // Header Styles
  headerFixed: { 
    backgroundColor: COLORS.white, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingTop: 10,
  },
  topNav: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingVertical: 10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: COLORS.lightBg,
  },
  navTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Tabs Styles
  tabsWrapper: {
    marginTop: 5,
    paddingBottom: 15,
  },
  tabsScroll: { 
    paddingHorizontal: 15,
  },
  tab: { 
    paddingHorizontal: 22, 
    paddingVertical: 10, 
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: { 
    backgroundColor: COLORS.primary,
  },
  tabText: { 
    fontSize: 13, 
    color: '#94A3B8', 
    fontWeight: '700' 
  },
  activeTabText: { 
    color: COLORS.white,
  },
});
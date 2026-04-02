import { useRouter } from 'expo-router';
import { ArrowRight, Leaf, Lock, User, CheckCircle2 } from 'lucide-react-native'; // CheckCircle2 එක් කළා
import React, { useState } from 'react';
import { loginUser } from '@/src/service/AuthService';
import {
  ActivityIndicator, Alert,
  ImageBackground, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View,
  Modal // Modal එක් කළා
} from 'react-native';


const COLORS = {
  teaGreen: '#84a98c',
  teaCream: '#f1f1e6',
  teaDark: '#2f3e46',
  white: '#ffffff',
};

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success Modal එක සඳහා state එක

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "කරුණාකර පරිශීලක නාමය සහ මුරපදය ඇතුළත් කරන්න.");
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await loginUser({
        email: username,
        password: password
      });
      
      setIsLoading(false);

      if(response && response.status === "success"){
        setShowSuccessModal(true); // සාර්ථක නම් Modal එක පෙන්වන්න
      } else {
        Alert.alert("Error", "ඇතුළත් කළ තොරතුරු වැරදියි. නැවත උත්සාහ කරන්න.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "සම්බන්ධතාවය බිඳ වැටී ඇත. පසුව උත්සාහ කරන්න.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerImageContainer}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1000' }}
            style={styles.headerImage}
          >
            <View style={styles.overlay}>
              <View style={styles.logoBadge}>
                <Leaf color={COLORS.teaGreen} size={30} />
              </View>
              <Text style={styles.headerSubtitle}>THE HERITAGE OF PURE TEA</Text>
              <Text style={styles.headerTitle}>SSK GROUP Tea Portal</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.glassCard}>
            <Text style={styles.viewTitle}>Sign In</Text>
            <Text style={styles.viewSubtitle}>Welcome back to your dashboard.</Text>

            <View style={styles.inputWrapper}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputBox}>
                  <User color={COLORS.teaDark} opacity={0.3} size={20} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Enter username"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <Lock color={COLORS.teaDark} opacity={0.3} size={20} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    placeholder="••••••••"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.mainButton} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <ArrowRight color={COLORS.white} size={20} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- Custom Success Notification Modal --- */}
        <Modal 
          visible={showSuccessModal} 
          transparent 
          animationType="fade"
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.successCard}>
              <View style={styles.iconCircle}>
                <CheckCircle2 color={COLORS.white} size={50} />
              </View>
              
              <Text style={styles.successTitle}>සාදරයෙන් පිළිගනිමු!</Text>
              <Text style={styles.successMsg}>
                ඔබ සාර්ථකව SSK GROUP Tea Portal පද්ධතියට ඇතුළු විය. ඔබගේ දිනපතා කටයුතු දැන් ආරම්භ කරන්න.
              </Text>

              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace('/dashbord'); 
                }}
              >
                <Text style={styles.modalButtonText}>Dashboard වෙත යන්න</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.teaCream },
  headerImageContainer: { height: 300 },
  headerImage: { flex: 1, justifyContent: 'flex-end' },
  overlay: { padding: 30, backgroundColor: 'rgba(47, 62, 70, 0.6)', flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBadge: { backgroundColor: COLORS.teaCream, padding: 10, borderRadius: 50, marginBottom: 10 },
  headerSubtitle: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  headerTitle: { color: COLORS.white, fontSize: 32, fontWeight: 'bold', fontStyle: 'italic' },
  formContainer: { marginTop: -50, paddingHorizontal: 20, paddingBottom: 40 },
  glassCard: { backgroundColor: COLORS.white, borderRadius: 40, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8 },
  viewTitle: { fontSize: 32, color: COLORS.teaDark, fontWeight: '600' },
  viewSubtitle: { fontSize: 14, color: COLORS.teaDark, opacity: 0.5, fontStyle: 'italic', marginBottom: 25 },
  inputWrapper: { gap: 15 },
  inputGroup: { gap: 5 },
  label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold', color: COLORS.teaDark, opacity: 0.4, marginLeft: 5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(47, 62, 70, 0.1)', borderRadius: 18, paddingHorizontal: 15, height: 55 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: COLORS.teaDark },
  mainButton: { backgroundColor: COLORS.teaGreen, height: 60, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20, shadowColor: COLORS.teaGreen, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  footer: { 
    marginTop: 30, 
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(47, 62, 70, 0.05)', 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  footerText: { color: COLORS.teaDark, opacity: 0.6, fontSize: 14 },
  registerLink: { color: COLORS.teaGreen, fontWeight: 'bold', fontSize: 14 },

  // --- Success Modal Styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  successCard: {
    backgroundColor: COLORS.white,
    width: '100%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.teaGreen,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.teaGreen,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.teaDark,
    marginBottom: 10
  },
  successMsg: {
    fontSize: 16,
    color: COLORS.teaDark,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
    marginBottom: 25
  },
  modalButton: {
    backgroundColor: COLORS.teaDark,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center'
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default LoginScreen;
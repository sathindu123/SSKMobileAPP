import { registerUser } from '@/src/service/AuthService';
import { useRouter } from 'expo-router'; // Router එක ඇතුළත් කළා
import { ArrowRight, CheckCircle2, Leaf, Lock, Mail, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert,
  ImageBackground, KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  teaGreen: '#84a98c',
  teaCream: '#f1f1e6',
  teaDark: '#2f3e46',
  white: '#ffffff',
  success: '#27ae60'
};

const RegisterScreen = () => {
  const router = useRouter(); // Router එක initialize කළා
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Supervisor'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  const handleRegister = async () => { 
    
    if (!formData.fullName || !formData.email || !formData.password) {
      Alert.alert("අසම්පූර්ණයි", "කරුණාකර සියලු විස්තර ඇතුළත් කරන්න.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await registerUser(formData); 
      setIsLoading(false);
      setShowSuccessModal(true); 
    } catch (error) {
      setIsLoading(false);
      Alert.alert("දෝෂයක්", "ගිණුම සෑදීමේදී ගැටලුවක් ඇති විය. නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=1000' }}
          style={styles.topSection}
        >
          <View style={styles.overlay}>
            <Leaf color={COLORS.white} size={40} />
            <Text style={styles.heroTitle}>Join Our Heritage.</Text>
            <Text style={styles.heroSubtitle}>Become a part of the world's finest tea management network.</Text>
          </View>
        </ImageBackground>

        <View style={styles.formSection}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Enter details to join the factory portal</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputBox}>
                  <User color={COLORS.teaDark} opacity={0.3} size={18} />
                  <TextInput 
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#999"
                    onChangeText={(text) => setFormData({...formData, fullName: text})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Work Email</Text>
                <View style={styles.inputBox}>
                  <Mail color={COLORS.teaDark} opacity={0.3} size={18} />
                  <TextInput 
                    style={styles.input}
                    placeholder="john@factory.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                    onChangeText={(text) => setFormData({...formData, email: text})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <Lock color={COLORS.teaDark} opacity={0.3} size={18} />
                  <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    secureTextEntry
                    placeholderTextColor="#999"
                    onChangeText={(text) => setFormData({...formData, password: text})}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <ArrowRight color={COLORS.white} size={20} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.signInLink}>Sign In</Text>
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
              
              <Text style={styles.successTitle}>සාර්ථකයි!</Text>
              <Text style={styles.successMsg}>
                ඔබේ ගිණුම සාර්ථකව ලියාපදිංචි කරන ලදී. දැන් ඔබට පද්ධතියට ඇතුළු විය හැක.
              </Text>

              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace('/'); 
                }}
              >
                <Text style={styles.modalButtonText}>ලොග් වන්න (Login)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.teaCream },
  topSection: { height: 280, justifyContent: 'center' },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(47, 62, 70, 0.6)', 
    padding: 30, 
    justifyContent: 'center' 
  },
  heroTitle: { color: COLORS.white, fontSize: 38, fontWeight: 'bold', marginTop: 15 },
  heroSubtitle: { color: COLORS.white, fontSize: 16, opacity: 0.9, marginTop: 10, fontWeight: '300' },
  formSection: { marginTop: -40, paddingHorizontal: 20, paddingBottom: 40 },
  card: { 
    backgroundColor: COLORS.white, 
    borderRadius: 32, 
    padding: 30, 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20
  },
  cardHeader: { marginBottom: 25, alignItems: 'center' },
  title: { fontSize: 28, color: COLORS.teaDark, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: COLORS.teaDark, opacity: 0.4, fontStyle: 'italic', marginTop: 5 },
  inputContainer: { gap: 15 },
  inputGroup: { gap: 5 },
  label: { fontSize: 10, fontWeight: 'bold', color: COLORS.teaDark, opacity: 0.5, letterSpacing: 1, marginLeft: 5 },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.teaCream, 
    borderRadius: 16, 
    paddingHorizontal: 15, 
    height: 55,
    borderWidth: 1,
    borderColor: 'rgba(47, 62, 70, 0.05)'
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.teaDark },
  registerButton: { 
    backgroundColor: COLORS.teaGreen, 
    height: 60, 
    borderRadius: 30, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    marginTop: 20
  },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: COLORS.teaDark, opacity: 0.4, fontSize: 14 },
  signInLink: { color: COLORS.teaGreen, fontWeight: 'bold', fontSize: 14 },
  
  // Custom Alert Modal Styles
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

export default RegisterScreen;
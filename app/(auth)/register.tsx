import { registerUser } from '@/src/service/AuthService';
import { ArrowRight, Briefcase, Leaf, Lock, Mail, User } from 'lucide-react-native';
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

// Colors (Web එකේ තිබූ වර්ණ)
const COLORS = {
  teaGreen: '#84a98c',
  teaCream: '#f1f1e6',
  teaDark: '#2f3e46',
  white: '#ffffff',
};

const ROLES = ['Supervisor', 'Manager', 'Admin', 'Inventory Officer'];

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Supervisor'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);


const handleRegister = async () => { 
  console.log("Registering user with data:", formData); // Debugging log
  if (!formData.fullName || !formData.email || !formData.password) {
    Alert.alert("Error", "කරුණාකර සියලු විස්තර ඇතුළත් කරන්න.");
    return;
  }
  
  setIsLoading(true);
  
  try {
    // registerUser එක වැඩ අවසන් කරන තුරු ඇප් එක රැඳී සිටිය යුතුයි
    await registerUser(formData); 
    
    setIsLoading(false);
    Alert.alert("Success", "ගිණුම සාර්ථකව නිපදවන ලදී!");
  } catch (error) {
    setIsLoading(false);
    Alert.alert("Error", "දත්ත යැවීමේදී දෝෂයක් ඇති විය.");
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* Top Section - Image & Branding */}
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

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Enter details to join the factory portal</Text>
            </View>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputBox}>
                  <User color={COLORS.teaDark} opacity={0.3} size={18} />
                  <TextInput 
                    style={styles.input}
                    placeholder="John Doe"
                    onChangeText={(text) => setFormData({...formData, fullName: text})}
                  />
                </View>
              </View>

              {/* Work Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Work Email</Text>
                <View style={styles.inputBox}>
                  <Mail color={COLORS.teaDark} opacity={0.3} size={18} />
                  <TextInput 
                    style={styles.input}
                    placeholder="john@factory.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => setFormData({...formData, email: text})}
                  />
                </View>
              </View>

              {/* Position (Role Select) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Position</Text>
                <TouchableOpacity 
                  style={styles.inputBox} 
                  onPress={() => setShowRoleModal(true)}
                >
                  <Briefcase color={COLORS.teaDark} opacity={0.3} size={18} />
                  <Text style={[styles.input, { color: COLORS.teaDark }]}>{formData.role}</Text>
                  <ArrowRight color={COLORS.teaDark} opacity={0.2} size={16} />
                </TouchableOpacity>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <Lock color={COLORS.teaDark} opacity={0.3} size={18} />
                  <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    secureTextEntry
                    onChangeText={(text) => setFormData({...formData, password: text})}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account f</Text>
                    <ArrowRight color={COLORS.white} size={20} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Role Selection Modal */}
        <Modal visible={showRoleModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Your Position</Text>
              {ROLES.map((role) => (
                <TouchableOpacity 
                  key={role} 
                  style={styles.roleItem}
                  onPress={() => {
                    setFormData({...formData, role: role});
                    setShowRoleModal(false);
                  }}
                >
                  <Text style={styles.roleItemText}>{role}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.closeModal} 
                onPress={() => setShowRoleModal(false)}
              >
                <Text style={styles.closeModalText}>Cancel</Text>
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
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 5 
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
    opacity: 0.8,
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
    marginTop: 20,
    shadowColor: COLORS.teaGreen,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: COLORS.teaDark, opacity: 0.4, fontSize: 14 },
  signInLink: { color: COLORS.teaGreen, fontWeight: 'bold', fontSize: 14 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', padding: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: COLORS.teaDark },
  roleItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  roleItemText: { fontSize: 16, color: COLORS.teaDark },
  closeModal: { marginTop: 20, alignItems: 'center' },
  closeModalText: { color: 'red', fontWeight: 'bold' }
});

export default RegisterScreen;
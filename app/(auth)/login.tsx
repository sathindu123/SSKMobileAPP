import { registerUser } from '@/src/service/AuthService';
import { useRouter } from 'expo-router';
import { ArrowRight, Leaf, Lock, User, UserCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert,
  ImageBackground, KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';

// Colors (ඔබේ Web Project එකේ තිබූ වර්ණ)
const COLORS = {
  teaGreen: '#84a98c',
  teaCream: '#f1f1e6',
  teaDark: '#2f3e46',
  white: '#ffffff',
};

const LoginScreen = () => {
    const router = useRouter();
    const [isLoginView, setIsLoginView] = useState(true);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  const handleAuth = () => {
    setIsLoading(true);
    
    // මෙතනට ඔබේ API එක හෝ Backend logic එක එකතු කරන්න
    setTimeout(() => {
      setIsLoading(false);
      if (isLoginView) {
        Alert.alert("Success", "සාදරයෙන් පිළිගන්නවා Ceylon Tea Portal එකට!");
      } else {
        Alert.alert("Success", "ගිණුම සාර්ථකව නිපදවන ලදී!");
        setIsLoginView(true);
      }
    }, 2000);
  };

  const handleRegister = async () => {

  console.log("fjhd")

  if (!fullName || !username || !password) {
    console.log("jhd")
    Alert.alert("Error", "කරුණාකර සියලු විස්තර ඇතුළත් කරන්න.");
    return;
  }

  const formData = {
    fullName: fullName,
    username: username,
    password: password
  };

  console.log(fullName);
  console.log(username)

  console.log("Registering user:", formData);

  setIsLoading(true);

  try {

    await registerUser(formData);

    setIsLoading(false);

    Alert.alert("Success", "ගිණුම සාර්ථකව නිපදවන ලදී!");

    // register success -> login view
    setIsLoginView(true);

    // inputs clear
    setFullName('');
    setUsername('');
    setPassword('');

  } catch (error) {

    setIsLoading(false);

    Alert.alert("Error", "දත්ත යැවීමේදී දෝෂයක් ඇති විය.");

  }
};
  

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* Top Header Section with Image */}
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
              <Text style={styles.headerTitle}>Ceylon Tea Portal</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.glassCard}>
            <Text style={styles.viewTitle}>{isLoginView ? 'Sign In' : 'Register'}</Text>
            <Text style={styles.viewSubtitle}>
              {isLoginView ? 'Welcome back to your dashboard.' : 'Enter your details to join the portal.'}
            </Text>

            <View style={styles.inputWrapper}>
              {!isLoginView && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputBox}>
                    <UserCircle color={COLORS.teaDark} opacity={0.3} size={20} style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input} 
                      placeholder="Enter full name"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                </View>
              )}

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
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Text style={styles.buttonText}>{isLoginView ? 'Sign In' : 'Create Account'}</Text>
                    <ArrowRight color={COLORS.white} size={20} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLoginView ? "Don't have an account?" : "Already a member?"}
              </Text>
              <TouchableOpacity onPress={() => setIsLoginView(!isLoginView)}>
                <Text style={styles.toggleText}>
                  {isLoginView ? "Create an account now" : "Back to Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.teaCream,
  },
  headerImageContainer: {
    height: 250,
  },
  headerImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 30,
    backgroundColor: 'rgba(47, 62, 70, 0.6)', // tea-dark with transparency
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: COLORS.teaCream,
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerSubtitle: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  formContainer: {
    marginTop: -40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassCard: {
    backgroundColor: COLORS.white,
    borderRadius: 40,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  viewTitle: {
    fontSize: 32,
    color: COLORS.teaDark,
    fontWeight: '600',
  },
  viewSubtitle: {
    fontSize: 14,
    color: COLORS.teaDark,
    opacity: 0.5,
    fontStyle: 'italic',
    marginBottom: 25,
  },
  inputWrapper: {
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
    color: COLORS.teaDark,
    opacity: 0.4,
    marginLeft: 5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(47, 62, 70, 0.1)',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.teaDark,
  },
  mainButton: {
    backgroundColor: COLORS.teaGreen,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    shadowColor: COLORS.teaGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(47, 62, 70, 0.05)',
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.teaDark,
    opacity: 0.4,
    fontSize: 12,
  },
  toggleText: {
    color: COLORS.teaGreen,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});

export default LoginScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, layout } from '../styles';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { loginUser } from '../services/auth';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { onAuthStateChange } = route.params || {};

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await loginUser(email, password);
      // Call the auth state change function to trigger navigation
      if (onAuthStateChange) {
        onAuthStateChange(true);
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.padding.large,
    paddingVertical: layout.padding.extraLarge,
  },
  header: {
    alignItems: 'center',
    marginBottom: layout.spacing.extraLarge,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: layout.spacing.large,
  },
  backButtonText: {
    ...typography.body2,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: layout.spacing.small,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    gap: layout.spacing.large,
  },
  loginButton: {
    marginTop: layout.spacing.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: layout.spacing.large,
  },
  footerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  linkText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
});
